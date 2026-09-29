"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { toast } from "@/components/ui/toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const isFavorited = isInWishlist(product.id);

  // Images
  const primaryImg =
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80";
  const secondaryImg =
    product.images?.[1]?.image_url || primaryImg;

  // Stock calculation
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  // Colors
  const uniqueColors = Array.from(
    new Set(product.variants?.map((v) => v.color_hex || "#18181b") || [])
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    toast({
      title: added ? "SAVED TO WISHLIST" : "REMOVED FROM WISHLIST",
      description: `${product.name} ${added ? "added to" : "removed from"} your saved collection.`,
      variant: added ? "vibrant" : "default",
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find first in-stock variant
    const inStockVariant = product.variants?.find((v) => v.stock > 0);
    if (!inStockVariant) {
      toast({
        title: "OUT OF STOCK",
        description: "This piece is sold out across all sizes.",
        variant: "danger",
      });
      return;
    }

    addItem({
      variantId: inStockVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      color: inStockVariant.color,
      size: inStockVariant.size,
      price: inStockVariant.price_override ?? product.sale_price ?? product.price,
      image: primaryImg,
      stock: inStockVariant.stock,
    });

    toast({
      title: "ADDED TO BAG",
      description: `${product.name} (${inStockVariant.size}) added to your shopping bag.`,
      variant: "vibrant",
    });

    openCart();
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl overflow-hidden transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(15,23,42,0.1)] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Image Container with Recurring ay2fly Logo */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 block"
      >
        <Image
          src={primaryImg}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={`object-cover object-center transition-all duration-700 ease-out ${
            isHovered && secondaryImg !== primaryImg
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100"
          }`}
        />

        {secondaryImg && secondaryImg !== primaryImg && (
          <Image
            src={secondaryImg}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Brand Logo Watermark on Every Product Image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-xs border border-slate-200/60 z-10">
          <div className="relative h-3.5 w-3.5">
            <Image
              src="/images/logo.png"
              alt="ay2fly"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display text-[9px] font-black uppercase text-slate-900 tracking-wider">
            ay2fly
          </span>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-12 left-3 flex flex-col gap-1 z-10">
          {isOutOfStock ? (
            <Badge variant="outOfStock">Sold Out</Badge>
          ) : isLowStock ? (
            <Badge variant="lowStock">Only {totalStock} Left</Badge>
          ) : product.sale_price ? (
            <Badge variant="sale">Sale</Badge>
          ) : (
            <Badge variant="vibrant">Drop 01</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.85 }}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all z-10 shadow-xs cursor-pointer ${
            isFavorited
              ? "bg-[#ff5500] text-white"
              : "bg-white/90 backdrop-blur-md text-slate-700 hover:text-[#ff5500] hover:bg-white"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? "fill-white stroke-white" : "stroke-current"
            }`}
          />
        </motion.button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="w-full h-11 bg-white/95 text-slate-900 hover:bg-[#ff5500] hover:text-white text-xs font-display uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-xl backdrop-blur-md rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 border border-slate-200"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isOutOfStock ? "Sold Out" : "Quick Add to Bag"}
          </button>
        </div>
      </Link>

      {/* Product Details Container */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 bg-white">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            <span className="font-semibold">{product.fit} fit</span>
            {uniqueColors.length > 0 && (
              <div className="flex items-center gap-1">
                {uniqueColors.map((hex, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full border border-slate-300 inline-block shadow-2xs"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block mt-1">
            <h3 className="font-display uppercase text-xs sm:text-sm font-bold text-slate-900 tracking-tight group-hover:text-[#ff5500] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
          {product.sale_price ? (
            <>
              <span className="font-mono text-sm sm:text-base font-black text-[#ff5500]">
                {formatPrice(product.sale_price)}
              </span>
              <span className="font-mono text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-mono text-sm sm:text-base font-black text-slate-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
