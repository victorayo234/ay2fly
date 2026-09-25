"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { toast } from "@/components/ui/toast";

export function FitPreview() {
  const [selectedFit, setSelectedFit] = useState<"oversized" | "relaxed" | "boxy">("oversized");
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const outfitItems = [
    {
      variantId: "var-01-2",
      productId: "prod-01",
      productName: "Heavyweight Boxy Hoodie",
      productSlug: "heavyweight-boxy-hoodie",
      color: "Vintage Black",
      size: "M",
      price: 145,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      stock: 15,
      category: "Layer 01",
    },
    {
      variantId: "var-17-2",
      productId: "prod-17",
      productName: "Tactical Multi-Pocket Cargo Pant",
      productSlug: "tactical-multi-pocket-cargo-pant",
      color: "Anthracite",
      size: "32",
      price: 155,
      image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
      stock: 14,
      category: "Bottoms",
    },
    {
      variantId: "var-31-2",
      productId: "prod-31",
      productName: "Brutalist Lug-Sole Chelsea Boot",
      productSlug: "brutalist-lug-sole-chelsea-boot",
      color: "Matte Black",
      size: "EU 42",
      price: 290,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      stock: 8,
      category: "Footwear",
    },
    {
      variantId: "var-22-1",
      productId: "prod-22",
      productName: "Distressed Ribbed Cashmere Beanie",
      productSlug: "distressed-ribbed-cashmere-beanie",
      color: "Pitch Black",
      size: "One Size",
      price: 65,
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      stock: 35,
      category: "Headwear",
    },
  ];

  const totalOutfitPrice = outfitItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleAddFullFit = () => {
    outfitItems.forEach((item) => {
      addItem({
        variantId: item.variantId,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        color: item.color,
        size: item.size,
        price: item.price,
        image: item.image,
        stock: item.stock,
      });
    });

    toast({
      title: "FULL OUTFIT ADDED",
      description: "All 4 coordinated pieces have been added to your bag.",
      variant: "metallic",
    });

    openCart();
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0e0e12] border border-[#202028] rounded-xs p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Column: Full Editorial Fit Showcase */}
          <div className="w-full lg:w-1/2 relative aspect-[3/4] sm:aspect-[4/5] rounded-xs overflow-hidden border border-[#272732] shadow-2xl bg-black">
            <Image
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85"
              alt="Complete the Fit editorial styling"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute top-4 left-4">
              <Badge variant="metallic">
                <Sparkles className="h-3 w-3" />
                LOOK 04 · MONOCHROME PROTOCOL
              </Badge>
            </div>

            <div className="absolute bottom-6 inset-x-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#9ca3af]">
                MODEL SPECS: 186CM / 74KG · WEARING SIZE L / 32
              </div>
              <div className="font-display text-xl font-bold uppercase text-white mt-1">
                The Complete Silhouette
              </div>
            </div>
          </div>

          {/* Right Column: Breakdown & Quick Bundle Action */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8e8e99] block">
                Signature Styling
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                Complete The Fit
              </h2>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Coordinated proportions tailored to stack seamlessly. Pair our heavyweight boxy hood with articulated ripstop cargos and brutalist lug boots.
              </p>
            </div>

            {/* Fit Selector Tabs */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717a]">
                Proportion Profile
              </span>
              <div className="flex gap-2">
                {[
                  { key: "oversized", label: "Oversized Drape" },
                  { key: "relaxed", label: "Relaxed Utility" },
                  { key: "boxy", label: "Boxy Cropped" },
                ].map((fit) => (
                  <button
                    key={fit.key}
                    onClick={() => setSelectedFit(fit.key as any)}
                    className={`px-3.5 py-1.5 text-xs font-display uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                      selectedFit === fit.key
                        ? "bg-white text-black border-white font-bold"
                        : "bg-[#141418] text-[#9ca3af] border-[#272730] hover:border-white/40"
                    }`}
                  >
                    {fit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pieces Breakdown */}
            <div className="space-y-3 border-y border-[#202028] py-4">
              {outfitItems.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-9 bg-[#17171c] rounded-xs overflow-hidden border border-[#272730] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-xs font-display uppercase font-semibold text-white hover:text-neutral-300 transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-[11px] text-[#71717a] font-mono">
                        {item.color} · Size {item.size}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-semibold text-white">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary & Bundle Button */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-display uppercase tracking-wider text-[#9ca3af]">
                  Bundle Total (4 items)
                </span>
                <span className="font-mono text-xl font-bold text-white">
                  {formatPrice(totalOutfitPrice)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddFullFit}
                >
                  <Check className="h-4 w-4" />
                  Add Complete Look to Bag
                </Button>
                <Link href="/shop" className="sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Explore Looks <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
