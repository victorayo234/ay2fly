export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  image_url?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_image?: string;
  is_featured?: boolean;
}

export type FitType = "fitted" | "regular" | "relaxed" | "oversized" | "boxy";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  collection_id?: string | null;
  price: number;
  sale_price?: number | null;
  material: string;
  fit: FitType;
  status: "draft" | "active" | "archived";
  created_at: string;
  category?: Category;
  collection?: Collection;
  variants?: ProductVariant[];
  images?: ProductImage[];
  size_guides?: SizeGuide[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  color_hex?: string;
  size: string;
  sku: string;
  price_override?: number | null;
  stock: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string | null;
  image_url: string;
  alt_text: string;
  position: number;
}

export interface SizeGuide {
  id: string;
  product_id?: string | null;
  category_id?: string | null;
  size: string;
  min_height?: number; // cm
  max_height?: number; // cm
  chest?: number; // cm
  waist?: number; // cm
  hip?: number; // cm
  garment_length?: number; // cm
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items?: CartItemDB[];
}

export interface CartItemDB {
  id: string;
  cart_id: string;
  product_variant_id: string;
  quantity: number;
  created_at: string;
  variant?: ProductVariant & { product: Product };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  id?: string;
  user_id?: string;
  label?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number; // Historical price captured at checkout time
  product_name: string;
  color: string;
  size: string;
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user_email: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
  items?: OrderItem[];
}
