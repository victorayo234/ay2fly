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
      addItem({
        variantId: activeVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        color: activeVariant.color,
        size: activeVariant.size,
        price: currentPrice,
        image:
          product.images?.[0]?.image_url ||
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        stock: activeVariant.stock,
      });

      setIsAdding(false);
      setIsSuccess(true);

      toast({
        title: "ADDED TO BAG",
        description: `${product.name} (${activeVariant.size}) added to your shopping bag.`,
        variant: "vibrant",
      });

      openCart();

      setTimeout(() => setIsSuccess(false), 2000);
    }, 250);
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-slate-900 transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate">{product.name}</span>
      </div>

      {/* Main Product Layout: Gallery + Information Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />
        </div>

        {/* Right Column: Garment Specs, Purchase Actions, Fit Advisor */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Pricing */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="vibrant">
                  {product.category?.name || "Streetwear"}
                </Badge>
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  {product.fit} fit
                </span>
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => {
                  const added = toggleWishlist(product.id);
                  toast({
                    title: added ? "SAVED TO WISHLIST" : "REMOVED FROM WISHLIST",
                    description: `${product.name} ${
                      added ? "saved to" : "removed from"
                    } your wishlist.`,
                    variant: added ? "vibrant" : "default",
                  });
                }}
                className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isFavorited
                    ? "bg-[#ff5500] text-white border-[#ff5500]"
                    : "border-slate-200 bg-white text-slate-600 hover:text-[#ff5500] hover:border-slate-300"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${isFavorited ? "fill-white" : ""}`}
                />
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="flex items-baseline gap-3 pt-1">
              {product.sale_price ? (
                <>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#ff5500]">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="font-mono text-base text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="sale">Special Sale</Badge>
                </>
              ) : (
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900">
                  {formatPrice(currentPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {availableColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display uppercase tracking-wider font-bold text-slate-900">
                  Color: <span className="text-slate-500 font-medium">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {availableColors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                      const newVariants = product.variants?.filter(
                        (v) => v.color.toLowerCase() === col.name.toLowerCase()
                      );
                      const inStock = newVariants?.find((v) => v.stock > 0);
                      if (inStock) setSelectedSize(inStock.size);
                    }}
                    className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === col.name
                        ? "border-[#ff5500] ring-2 ring-orange-200 scale-110"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                    title={col.name}
                    aria-label={`Select color ${col.name}`}
                  >
                    <span
                      className="h-6 w-6 rounded-full shadow-inner inline-block"
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
              <span className="font-display uppercase tracking-wider font-bold text-slate-900">
                Select Size: <span className="text-slate-500 font-medium">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff5500] hover:underline cursor-pointer"
              >
                <Ruler className="h-3.5 w-3.5" />
                Size Guide
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
                    className={`relative h-12 rounded-2xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : out
                        ? "bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed opacity-50"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 shadow-2xs"
                    }`}
                  >
                    <span>{variant.size}</span>
                    {low && !out && (
                      <span className="text-[9px] text-[#ff5500] font-sans font-bold">
                        {variant.stock} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Real Stock Status Alert */}
            <div className="text-xs font-mono font-medium pt-1">
              {isOutOfStock ? (
                <span className="text-red-500 font-bold">
                  ✕ Out of stock in this size. Restocking soon.
                </span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-bold">
                  ⚠ Only {variantStock} pieces remaining in this size.
                </span>
              ) : (
                <span className="text-emerald-600 font-bold">
                  ✓ In stock and ready to ship worldwide.
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
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white px-2 h-14 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(variantStock, q + 1))
                  }
                  className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
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
                className="flex-1 h-14 text-sm rounded-2xl shadow-md"
              >
                {isSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Bag
                  </>
                ) : isOutOfStock ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add to Bag · {formatPrice(currentPrice * quantity)}
                  </>
                )}
              </Button>
            </div>

            {/* Streetwear Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 font-sans">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#ff5500] shrink-0" />
                <span>Free Express over $150</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#ff5500] shrink-0" />
                <span>14-day easy exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#ff5500] shrink-0" />
                <span>100% Authentic Garment</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#ff5500] shrink-0" />
                <span>Custom ay2fly Packaging</span>
              </div>
            </div>
          </div>

          {/* Garment Specifications & Care */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h4 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
              Garment Specifications
            </h4>
            <div className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Composition</span>
                <span className="text-slate-900 font-bold">{product.material}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Silhouette Fit</span>
                <span className="text-slate-900 font-bold uppercase">{product.fit} cut</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">SKU</span>
                <span className="text-slate-700 font-mono">{activeVariant?.sku || "AY-SKU"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Care Instructions</span>
                <span className="text-slate-800">Machine wash cold inside out, hang or flat dry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Silhouette Visualization Tool */}
      <div className="border-t border-slate-200 pt-16">
        <FitVisualizer product={product} />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        sizeGuides={sizeGuides}
        categoryName={product.category?.name || "Garment"}
      />
    </div>
  );
}
