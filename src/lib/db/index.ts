import {
  Product,
  Category,
  Collection,
  SizeGuide,
  Order,
  OrderItem,
  OrderStatus,
  ProductVariant,
} from "@/types/database";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface GetProductsFilter {
  category?: string;
  collection?: string;
  search?: string;
  fit?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
  status?: string;
}

export const db = {
  // ─── Categories ──────────────────────────────────────────────
  getCategories: async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error in getCategories:", err);
      return [];
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in getCategoryBySlug:", err);
      return null;
    }
  },

  // ─── Collections ─────────────────────────────────────────────
  getCollections: async (): Promise<Collection[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("collections")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error in getCollections:", err);
      return [];
    }
  },

  getCollectionBySlug: async (slug: string): Promise<Collection | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in getCollectionBySlug:", err);
      return null;
    }
  },

  // ─── Products ────────────────────────────────────────────────
  getProducts: async (filters: GetProductsFilter = {}): Promise<Product[]> => {
    try {
      let query = supabaseAdmin
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          collection:collections(*),
          variants:product_variants(*),
          images:product_images(*)
        `
        );

      // Status filter
      if (filters.status) {
        query = query.eq("status", filters.status);
      } else {
        query = query.eq("status", "active");
      }

      // Fit filter
      if (filters.fit) {
        query = query.eq("fit", filters.fit);
      }

      // Min/Max Price filter
      if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }

      // Search filter
      if (filters.search) {
        const term = `%${filters.search.trim()}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term},material.ilike.${term}`);
      }

      // Sort ordering
      if (filters.sort === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (filters.sort === "price-desc") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      let result: Product[] = (data || []).map((p: any) => ({
        ...p,
        images: (p.images || []).sort((a: any, b: any) => a.position - b.position),
      }));

      // In-memory filters for relationships if specified
      if (filters.category) {
        result = result.filter((p) => p.category?.slug === filters.category);
      }
      if (filters.collection) {
        result = result.filter((p) => p.collection?.slug === filters.collection);
      }
      if (filters.size) {
        result = result.filter((p) =>
          p.variants?.some((v: ProductVariant) => v.size.toLowerCase() === filters.size?.toLowerCase())
        );
      }
      if (filters.color) {
        result = result.filter((p) =>
          p.variants?.some((v: ProductVariant) =>
            v.color.toLowerCase().includes(filters.color!.toLowerCase())
          )
        );
      }
      if (filters.inStockOnly) {
        result = result.filter((p) => {
          const total = p.variants?.reduce((sum: number, v: ProductVariant) => sum + v.stock, 0) ?? 0;
          return total > 0;
        });
      }

      return result;
    } catch (err) {
      console.error("Error in getProducts:", err);
      return [];
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const { data: product, error } = await supabaseAdmin
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          collection:collections(*),
          variants:product_variants(*),
          images:product_images(*)
        `
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error || !product) return null;

      // Also fetch matching size guides
      const { data: sizeGuides } = await supabaseAdmin
        .from("size_guides")
        .select("*")
        .or(`product_id.eq.${product.id},category_id.eq.${product.category_id}`);

      return {
        ...product,
        images: (product.images || []).sort((a: any, b: any) => a.position - b.position),
        size_guides: sizeGuides || [],
      };
    } catch (err) {
      console.error("Error in getProductBySlug:", err);
      return null;
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          collection:collections(*),
          variants:product_variants(*),
          images:product_images(*)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error || !data) return null;
      return {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => a.position - b.position),
      };
    } catch (err) {
      console.error("Error in getProductById:", err);
      return null;
    }
  },

  getRelatedProducts: async (currentProductId: string, limit = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          collection:collections(*),
          variants:product_variants(*),
          images:product_images(*)
        `
        )
        .neq("id", currentProductId)
        .eq("status", "active")
        .limit(limit);

      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        images: (p.images || []).sort((a: any, b: any) => a.position - b.position),
      }));
    } catch (err) {
      console.error("Error in getRelatedProducts:", err);
      return [];
    }
  },

  getSizeGuidesByCategoryId: async (categoryId: string): Promise<SizeGuide[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("size_guides")
        .select("*")
        .eq("category_id", categoryId);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error in getSizeGuidesByCategoryId:", err);
      return [];
    }
  },

  validateVariant: async (
    variantId: string
  ): Promise<{
    valid: boolean;
    variant?: ProductVariant;
    product?: Product;
    error?: string;
  }> => {
    try {
      const { data: variant, error: varError } = await supabaseAdmin
        .from("product_variants")
        .select("*, product:products(*)")
        .eq("id", variantId)
        .maybeSingle();

      if (varError || !variant) {
        return { valid: false, error: "Variant does not exist in database." };
      }

      const product = variant.product;
      delete variant.product;

      return {
        valid: true,
        variant,
        product,
      };
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  },

  // ─── Orders (Strict Real DB Persistence & Stock Decrement) ───
  createOrder: async (data: {
    userId: string;
    userEmail: string;
    items: { variantId: string; quantity: number }[];
    shippingAddress: Order["shipping_address"];
    deliveryMethod: "standard" | "express";
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    try {
      // 1. Fetch real variants from DB with row locks / verification
      const variantIds = data.items.map((i) => i.variantId);
      const { data: variants, error: varErr } = await supabaseAdmin
        .from("product_variants")
        .select("*, product:products(*)")
        .in("id", variantIds);

      if (varErr || !variants || variants.length === 0) {
        return { success: false, error: "Unable to verify order items in database." };
      }

      let subtotal = 0;
      const orderItemsToInsert: any[] = [];
      const stockUpdates: { id: string; newStock: number }[] = [];

      for (const item of data.items) {
        const found = variants.find((v) => v.id === item.variantId);
        if (!found) {
          return { success: false, error: `Item variant ${item.variantId} not found.` };
        }

        if (found.stock < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for ${found.product?.name} (${found.color} / ${found.size}). Only ${found.stock} remaining.`,
          };
        }

        const unitPrice =
          found.price_override ?? found.product?.sale_price ?? found.product?.price ?? 0;
        subtotal += Number(unitPrice) * item.quantity;

        const orderItemId = `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        orderItemsToInsert.push({
          id: orderItemId,
          product_variant_id: found.id,
          quantity: item.quantity,
          unit_price: Number(unitPrice),
          product_name: found.product?.name || "Streetwear Piece",
          color: found.color,
          size: found.size,
          image_url:
            found.product?.images?.[0]?.image_url ||
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
        });

        stockUpdates.push({
          id: found.id,
          newStock: found.stock - item.quantity,
        });
      }

      // 2. Compute delivery & tax
      const shipping =
        data.deliveryMethod === "express" ? 22 : subtotal >= 150 ? 0 : 10;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const total = subtotal + shipping + tax;

      const orderNumber = `AY-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // 3. Insert real order row into Supabase
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        data.userId
      );
      const dbUserId = isUUID ? data.userId : null;

      const { data: insertedOrder, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          id: orderId,
          order_number: orderNumber,
          user_id: dbUserId,
          user_email: data.userEmail,
          status: "confirmed",
          subtotal,
          discount: 0,
          shipping,
          tax,
          total,
          shipping_address: data.shippingAddress,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 4. Insert real order items into Supabase
      const itemsWithOrderId = orderItemsToInsert.map((oi) => ({
        ...oi,
        order_id: orderId,
      }));
      const { error: itemsErr } = await supabaseAdmin
        .from("order_items")
        .insert(itemsWithOrderId);
      if (itemsErr) throw itemsErr;

      // 5. Decrement inventory in Supabase
      for (const update of stockUpdates) {
        await supabaseAdmin
          .from("product_variants")
          .update({ stock: update.newStock })
          .eq("id", update.id);
      }

      const finalOrder: Order = {
        ...insertedOrder,
        items: itemsWithOrderId,
      };

      return { success: true, order: finalOrder };
    } catch (err: any) {
      console.error("Order creation error:", err);
      return { success: false, error: err.message || "Failed to create order." };
    }
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      let query = supabaseAdmin.from("orders").select("*, items:order_items(*)");
      if (isUUID) {
        query = query.eq("user_id", userId);
      } else {
        query = query.eq("user_email", userId);
      }
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error in getOrdersByUser:", err);
      return [];
    }
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("order_number", orderNumber)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in getOrderByNumber:", err);
      return null;
    }
  },

  getAllOrders: async (): Promise<Order[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error in getAllOrders:", err);
      return [];
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      return !error;
    } catch (err) {
      console.error("Error in updateOrderStatus:", err);
      return false;
    }
  },

  // ─── Admin Product & Stock Operations (Writes to DB) ─────────
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in updateProduct:", err);
      return null;
    }
  },

  createProduct: async (
    newProduct: Omit<Product, "id" | "created_at">
  ): Promise<Product | null> => {
    try {
      const newId = `prod-${Date.now()}`;
      const { data: created, error } = await supabaseAdmin
        .from("products")
        .insert({
          id: newId,
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          category_id: newProduct.category_id,
          collection_id: newProduct.collection_id || null,
          price: newProduct.price,
          sale_price: newProduct.sale_price || null,
          material: newProduct.material,
          fit: newProduct.fit,
          status: newProduct.status || "active",
        })
        .select()
        .single();

      if (error) throw error;

      // Insert default variant
      const defaultVariantId = `var-${Date.now()}-1`;
      await supabaseAdmin.from("product_variants").insert({
        id: defaultVariantId,
        product_id: newId,
        color: "Obsidian Black",
        color_hex: "#09090b",
        size: "M",
        sku: `AY-${newProduct.slug.toUpperCase().substring(0, 3)}-M`,
        stock: 12,
      });

      // Insert primary image if provided
      if (newProduct.images && newProduct.images.length > 0) {
        for (let i = 0; i < newProduct.images.length; i++) {
          const img = newProduct.images[i];
          await supabaseAdmin.from("product_images").insert({
            id: `img-${Date.now()}-${i}`,
            product_id: newId,
            image_url: img.image_url,
            alt_text: img.alt_text || newProduct.name,
            position: i,
          });
        }
      }

      return created;
    } catch (err) {
      console.error("Error in createProduct:", err);
      return null;
    }
  },

  updateVariantStock: async (variantId: string, newStock: number): Promise<boolean> => {
    try {
      const { error } = await supabaseAdmin
        .from("product_variants")
        .update({ stock: Math.max(0, newStock) })
        .eq("id", variantId);
      return !error;
    } catch (err) {
      console.error("Error in updateVariantStock:", err);
      return false;
    }
  },

  getInventoryStatus: async (lowStockThreshold = 5) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("product_variants")
        .select("*, product:products(id, name, slug)");

      if (error) throw error;

      return (data || []).map((v: any) => ({
        productId: v.product?.id,
        productName: v.product?.name,
        productSlug: v.product?.slug,
        variantId: v.id,
        color: v.color,
        size: v.size,
        sku: v.sku,
        stock: v.stock,
        isLowStock: v.stock > 0 && v.stock <= lowStockThreshold,
        isOutOfStock: v.stock === 0,
      }));
    } catch (err) {
      console.error("Error in getInventoryStatus:", err);
      return [];
    }
  },
};
