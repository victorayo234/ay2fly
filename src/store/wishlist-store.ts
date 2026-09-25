"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase/client";

interface WishlistStore {
  productIds: string[];
  currentUserId: string | null;
  syncWithUser: (userId: string | null) => Promise<void>;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      currentUserId: null,

      syncWithUser: async (userId: string | null) => {
        set({ currentUserId: userId });
        if (!userId) return;

        try {
          const { data, error } = await supabase
            .from("wishlists")
            .select("product_id")
            .eq("user_id", userId);

          if (error) throw error;
          if (data) {
            set({ productIds: data.map((d: any) => d.product_id) });
          }
        } catch (err) {
          console.error("Wishlist sync with Supabase failed:", err);
        }
      },

      toggleWishlist: (productId: string) => {
        const { productIds, currentUserId } = get();
        const exists = productIds.includes(productId);

        if (exists) {
          set({ productIds: productIds.filter((id) => id !== productId) });
          if (currentUserId) {
            supabase
              .from("wishlists")
              .delete()
              .eq("user_id", currentUserId)
              .eq("product_id", productId)
              .then();
          }
          return false;
        } else {
          set({ productIds: [...productIds, productId] });
          if (currentUserId) {
            supabase
              .from("wishlists")
              .insert({ user_id: currentUserId, product_id: productId })
              .then();
          }
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => {
        const { currentUserId } = get();
        set({ productIds: [] });
        if (currentUserId) {
          supabase.from("wishlists").delete().eq("user_id", currentUserId).then();
        }
      },
    }),
    {
      name: "ay2fly-wishlist-storage",
    }
  )
);
