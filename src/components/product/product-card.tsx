"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
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
    new Set(product.variants?.map((v) => v.color_hex || "#111111") || [])
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    toast({
      title: added ? "SAVED TO WISHLIST" : "REMOVED FROM WISHLIST",
      description: `${product.name} ${added ? "added to" : "removed from"} your saved collection.`,
      variant: added ? "metallic" : "default",
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the first in-stock variant
    const inStockVariant = product.variants?.find((v) => v.stock > 0);
    if (!inStockVariant) {
      toast({
        title: "OUT OF STOCK",
        description: "This item is currently sold out across all sizes.",
        variant: "error",
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
      description: `${product.name} (${inStockVariant.color} / ${inStockVariant.size}) added.`,
      variant: "success",
    });

    openCart();
  };

  return (
    <div
      className="group relative flex flex-col bg-[#101014] border border-[#202026] hover:border-[#383842] rounded-xs transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#15151b] block"
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

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <Badge variant="outOfStock">Sold Out</Badge>
          ) : isLowStock ? (
            <Badge variant="lowStock">Only {totalStock} Left</Badge>
          ) : product.sale_price ? (
            <Badge variant="sale">Sale</Badge>
          ) : (
            <Badge variant="metallic">Drop 01</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.8 }}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorited
              ? "bg-white text-black shadow-lg"
              : "bg-black/60 text-white hover:bg-black/90 backdrop-blur-xs"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? "fill-black stroke-black" : "stroke-white"
            }`}
          />
        </motion.button>

        {/* Quick-Add Overlay Bar on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="w-full h-10 bg-white/95 text-black hover:bg-white text-[11px] font-display uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md rounded-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isOutOfStock ? "Sold Out" : "Quick Add to Bag"}
          </button>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8a96] uppercase tracking-wider">
            <span>{product.fit} fit</span>
            {uniqueColors.length > 0 && (
              <div className="flex items-center gap-1">
                {uniqueColors.map((hex, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full border border-white/20 inline-block"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block mt-1.5">
            <h3 className="font-display uppercase text-xs sm:text-sm font-semibold text-white tracking-wide group-hover:text-neutral-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-[#1e1e24]">
          {product.sale_price ? (
            <>
              <span className="font-mono text-sm font-bold text-white">
                {formatPrice(product.sale_price)}
              </span>
              <span className="font-mono text-xs text-[#71717a] line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-mono text-sm font-bold text-white">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
