"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { Product, ProductVariant, SizeGuide } from "@/types/database";
import { ProductGallery } from "@/components/product/product-gallery";
import { SizeGuideModal } from "@/components/product/size-guide-modal";
import { FitVisualizer } from "@/components/product/fit-visualizer";
import { SizeRecommender } from "@/components/product/size-recommender";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { toast } from "@/components/ui/toast";

interface ProductDetailViewProps {
  product: Product;
  sizeGuides: SizeGuide[];
}

export function ProductDetailView({
  product,
  sizeGuides,
}: ProductDetailViewProps) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);

  // Group unique colors from variants
  const availableColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    product.variants?.forEach((v) => {
      if (!map.has(v.color)) {
        map.set(v.color, {
          name: v.color,
          hex: v.color_hex || "#18181b",
        });
      }
    });
    return Array.from(map.values());
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0]?.name || ""
  );

  // Variants filtered by selected color
  const variantsForColor = useMemo(() => {
    return (
      product.variants?.filter(
        (v) => v.color.toLowerCase() === selectedColor.toLowerCase()
      ) || []
    );
  }, [product.variants, selectedColor]);

  // First available in-stock size or first size
  const defaultSize =
    variantsForColor.find((v) => v.stock > 0)?.size ||
    variantsForColor[0]?.size ||
    "";
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);

  // Current selected variant
  const activeVariant: ProductVariant | undefined = useMemo(() => {
    return (
      variantsForColor.find((v) => v.size === selectedSize) ||
      variantsForColor[0]
    );
  }, [variantsForColor, selectedSize]);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Stock calculations
  const variantStock = activeVariant?.stock ?? 0;
  const isOutOfStock = variantStock === 0;
  const isLowStock = variantStock > 0 && variantStock <= 4;

  const currentPrice =
    activeVariant?.price_override ?? product.sale_price ?? product.price;

  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;

    setIsAdding(true);

    setTimeout(() => {
      addItem(
        {
          variantId: activeVariant.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          color: activeVariant.color,
          size: activeVariant.size,
          price: currentPrice,
          image:
            product.images?.[0]?.image_url ||
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
          stock: activeVariant.stock,
        },
        quantity
      );

      setIsAdding(false);
      setIsSuccess(true);

      toast({
        title: "ADDED TO BAG",
        description: `${product.name} (${activeVariant.color} / ${activeVariant.size}) × ${quantity}`,
        variant: "success",
      });

      // Open cart drawer after visual acknowledgment
      setTimeout(() => {
        setIsSuccess(false);
        openCart();
      }, 500);
    }, 450);
  };

  return (
    <div className="space-y-16">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a]">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-white transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-white truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery on Left, Details & Selectors on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (Images) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />
        </div>

        {/* Right Column (Controls & Product Meta) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Title & Pricing */}
          <div className="space-y-3 border-b border-[#202028] pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.collection && (
                  <Badge variant="metallic">
                    {product.collection.name}
                  </Badge>
                )}
                <span className="text-[11px] font-mono uppercase text-[#71717a]">
                  {product.fit} SILHOUETTE
                </span>
              </div>
              <button
                onClick={() => {
                  const added = toggleWishlist(product.id);
                  toast({
                    title: added ? "SAVED" : "REMOVED",
                    description: `${product.name} ${added ? "added to" : "removed from"} wishlist.`,
                    variant: added ? "metallic" : "default",
                  });
                }}
                className={`p-2 rounded-full border transition-colors ${
                  isFavorited
                    ? "bg-white text-black border-white"
                    : "border-[#272730] text-[#71717a] hover:text-white"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${isFavorited ? "fill-black" : ""}`}
                />
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="flex items-baseline gap-3 pt-1">
              {product.sale_price ? (
                <>
                  <span className="font-mono text-2xl font-bold text-white">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="font-mono text-base text-[#71717a] line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="sale">Save 15%</Badge>
                </>
              ) : (
                <span className="font-mono text-2xl font-bold text-white">
                  {formatPrice(currentPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {availableColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display uppercase tracking-wider font-semibold text-white">
                  Color: <strong className="text-neutral-300 font-normal">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {availableColors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                      // Auto-select first in-stock size for new color
                      const newVariants = product.variants?.filter(
                        (v) => v.color.toLowerCase() === col.name.toLowerCase()
                      );
                      const inStock = newVariants?.find((v) => v.stock > 0);
                      if (inStock) setSelectedSize(inStock.size);
                    }}
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === col.name
                        ? "border-white ring-2 ring-white/30 scale-110"
                        : "border-[#3f3f4c] hover:border-white/60"
                    }`}
                    title={col.name}
                    aria-label={`Select color ${col.name}`}
                  >
                    <span
                      className="h-7 w-7 rounded-full shadow-inner inline-block"
                      style={{ backgroundColor: col.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display uppercase tracking-wider font-semibold text-white">
                Select Size: <strong className="text-neutral-300 font-normal">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#a1a1aa] hover:text-white transition-colors underline cursor-pointer"
              >
                <Ruler className="h-3.5 w-3.5" />
                Live Size Guide
              </button>
            </div>

            {/* Size pills */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {variantsForColor.map((variant) => {
                const out = variant.stock === 0;
                const low = variant.stock > 0 && variant.stock <= 4;
                const selected = selectedSize === variant.size;

                return (
                  <button
                    key={variant.id}
                    disabled={out}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`relative h-12 rounded-xs border text-xs font-mono font-medium flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selected
                        ? "bg-white text-black border-white font-bold shadow-lg"
                        : out
                        ? "bg-[#111115] text-[#52525b] border-[#1e1e24] line-through cursor-not-allowed opacity-40"
                        : "bg-[#141419] text-[#d1d5db] border-[#272732] hover:border-white/50 hover:text-white"
                    }`}
                  >
                    <span>{variant.size}</span>
                    {low && !out && (
                      <span className="text-[9px] text-amber-400 font-sans tracking-tight">
                        {variant.stock} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Real Stock Status Alert */}
            <div className="text-[11px] font-mono pt-1">
              {isOutOfStock ? (
                <span className="text-red-400">
                  ✕ Out of stock in this size. Next drop restocking in 14 days.
                </span>
              ) : isLowStock ? (
                <span className="text-amber-400">
                  ⚠ Only {variantStock} pieces remaining in current production allocation.
                </span>
              ) : (
                <span className="text-emerald-400">
                  ✓ In stock at London Atelier. Ready for immediate dispatch.
                </span>
              )}
            </div>
          </div>

          {/* Size Recommender Accordion */}
          <SizeRecommender
            onSelectRecommendedSize={(size) => setSelectedSize(size)}
            availableSizes={variantsForColor.map((v) => v.size)}
          />

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-4 border-t border-[#202028]">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#272732] rounded-xs bg-[#121216] px-2 h-14">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#71717a] hover:text-white disabled:opacity-30 cursor-pointer"
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(variantStock, q + 1))
                  }
                  className="p-2 text-[#71717a] hover:text-white disabled:opacity-30 cursor-pointer"
                  disabled={quantity >= variantStock || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA Button */}
              <Button
                variant={isOutOfStock ? "secondary" : "primary"}
                size="lg"
                disabled={isOutOfStock || isAdding}
                isLoading={isAdding}
                onClick={handleAddToCart}
                className="flex-1 h-14 text-sm"
              >
                {isSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-black" />
                    Added to Bag
                  </>
                ) : isOutOfStock ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag · {formatPrice(currentPrice * quantity)}
                  </>
                )}
              </Button>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#8e8e99] font-sans">
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-neutral-400" />
                <span>Complimentary courier over $150</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-neutral-400" />
                <span>14-day archival exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
                <span>Cryptographic NFC Authenticated</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
                <span>Custom hardware packaging</span>
              </div>
            </div>
          </div>

          {/* Garment Specifications & Care */}
          <div className="border-t border-[#202028] pt-6 space-y-4">
            <h4 className="font-display uppercase tracking-wider text-xs font-semibold text-white">
              Garment Specifications
            </h4>
            <div className="space-y-2 text-xs text-[#a1a1aa] divide-y divide-[#1c1c24]">
              <div className="flex justify-between py-1.5">
                <span className="text-[#71717a]">Composition</span>
                <span className="text-white font-mono">{product.material}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#71717a]">Proportion Profile</span>
                <span className="text-white font-mono uppercase">{product.fit} cut</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#71717a]">SKU ID</span>
                <span className="text-[#cbd5e1] font-mono">{activeVariant?.sku || "AY-SKU"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#71717a]">Care</span>
                <span className="text-neutral-300">Cold wash inside out, lay flat to dry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Fit-Visualizer Component */}
      <div className="pt-12 border-t border-[#202028]">
        <FitVisualizer
          currentFit={product.fit as any}
          productName={product.name}
        />
      </div>

      {/* Live Size Guide Drawer Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        sizeGuides={sizeGuides}
        categoryName={product.category?.name || "Garment"}
      />
    </div>
  );
}
