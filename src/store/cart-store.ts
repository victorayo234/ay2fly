"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase/client";

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  currentUserId: string | null;
  syncWithUser: (userId: string | null) => Promise<void>;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalCount: () => number;
}

// Helper to write item change to Supabase database
async function syncItemToDatabase(userId: string | null, variantId: string, quantity: number) {
  if (!userId) return;
  try {
    // 1. Get or create cart for user
    let { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: cartErr } = await supabase
        .from("carts")
        .insert({ user_id: userId })
        .select("id")
        .single();
      if (cartErr) throw cartErr;
      cart = newCart;
    }

    if (!cart) return;

    if (quantity <= 0) {
      // Delete item
      await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id)
        .eq("product_variant_id", variantId);
    } else {
      // Upsert item
      await supabase.from("cart_items").upsert(
        {
          cart_id: cart.id,
          product_variant_id: variantId,
          quantity: quantity,
        },
        { onConflict: "cart_id,product_variant_id" }
      );
    }
  } catch (err) {
    console.error("Failed to sync cart item to Supabase:", err);
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currentUserId: null,

      syncWithUser: async (userId: string | null) => {
        set({ currentUserId: userId });
        if (!userId) return;

        try {
          // 1. Get or create user's cart in DB
          let { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

          if (!cart) {
            const { data: newCart } = await supabase
              .from("carts")
              .insert({ user_id: userId })
              .select("id")
              .single();
            cart = newCart;
          }

          if (!cart) return;

          // 2. Fetch real cart items from Supabase
          const { data: dbItems, error } = await supabase
            .from("cart_items")
            .select(
              `
              quantity,
              product_variant_id,
              variant:product_variants(
                id,
                size,
                color,
                stock,
                price_override,
                product:products(
                  id,
                  name,
                  slug,
                  price,
                  sale_price,
                  images:product_images(image_url, position)
                )
              )
            `
            )
            .eq("cart_id", cart.id);

          if (error) throw error;

          if (dbItems && dbItems.length > 0) {
            const parsedItems: CartItem[] = dbItems
              .map((row: any) => {
                const v = row.variant;
                const p = v?.product;
                if (!v || !p) return null;

                const sortedImages = (p.images || []).sort(
                  (a: any, b: any) => a.position - b.position
                );
                const price =
                  v.price_override ?? p.sale_price ?? p.price ?? 0;

                return {
                  variantId: v.id,
                  productId: p.id,
                  productName: p.name,
                  productSlug: p.slug,
                  color: v.color,
                  size: v.size,
                  price: Number(price),
                  image:
                    sortedImages[0]?.image_url ||
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
                  quantity: row.quantity,
                  stock: v.stock,
                };
              })
              .filter(Boolean) as CartItem[];

            set({ items: parsedItems });
          }
        } catch (err) {
          console.error("Cart sync with Supabase failed:", err);
        }
      },

      addItem: (newItem, quantity = 1) => {
        const { currentUserId, items } = get();
        const existingIndex = items.findIndex((i) => i.variantId === newItem.variantId);
        let targetQty = quantity;

        if (existingIndex > -1) {
          const currentItem = items[existingIndex];
          targetQty = Math.min(currentItem.quantity + quantity, currentItem.stock);
          const updated = [...items];
          updated[existingIndex] = { ...currentItem, quantity: targetQty };
          set({ items: updated });
        } else {
          targetQty = Math.min(quantity, newItem.stock);
          set({ items: [...items, { ...newItem, quantity: targetQty }] });
        }

        // Async write to Supabase
        syncItemToDatabase(currentUserId, newItem.variantId, targetQty);
      },

      updateQuantity: (variantId, quantity) => {
        const { currentUserId, items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((i) => i.variantId !== variantId) });
          syncItemToDatabase(currentUserId, variantId, 0);
          return;
        }

        set({
          items: items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        });

        syncItemToDatabase(currentUserId, variantId, quantity);
      },

      removeItem: (variantId) => {
        const { currentUserId, items } = get();
        set({ items: items.filter((i) => i.variantId !== variantId) });
        syncItemToDatabase(currentUserId, variantId, 0);
      },

      clearCart: () => {
        const { currentUserId } = get();
        set({ items: [] });
        if (currentUserId) {
          supabase
            .from("carts")
            .select("id")
            .eq("user_id", currentUserId)
            .maybeSingle()
            .then(({ data }) => {
              if (data?.id) {
                supabase.from("cart_items").delete().eq("cart_id", data.id);
              }
            });
        }
      },

      subtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      totalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "ay2fly-cart-storage",
    }
  )
);
