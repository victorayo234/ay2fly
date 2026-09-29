"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Check, ShoppingBag } from "lucide-react";
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
      color: "Charcoal Heather",
      size: "One Size",
      price: 65,
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      stock: 20,
      category: "Accessories",
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
      title: "COMPLETE LOOK ADDED",
      description: "All 4 coordinated outfit pieces added to your shopping bag.",
      variant: "vibrant",
    });

    openCart();
  };

  return (
    <section className="py-20 sm:py-24 bg-[#f8fafc] border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-sm flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Left Column: Styled Editorial Visual */}
          <div className="w-full lg:w-1/2 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85"
              alt="Complete Streetwear Look"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                Model: 6&apos;1&quot; (186cm) · Wearing Size L / 32
              </div>
              <div className="font-display text-xl font-black uppercase text-white mt-1">
                The Signature ay2fly Street Fit
              </div>
            </div>
          </div>

          {/* Right Column: Breakdown & Quick Bundle Action */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-2">
              <Badge variant="vibrant">STYLE CURATION</Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
                Complete The Fit
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Coordinated pieces styled to drape seamlessly together. Pair our boxy hoodie with utility cargos and chiseled leather boots.
              </p>
            </div>

            {/* Pieces Breakdown List */}
            <div className="space-y-2.5 border-y border-slate-100 py-4">
              {outfitItems.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
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
                        className="text-xs font-display uppercase font-bold text-slate-900 hover:text-[#ff5500] transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.color} · Size {item.size}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary & Bundle Button */}
            <div className="space-y-4 pt-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-display uppercase tracking-wider font-bold text-slate-500">
                  Full Bundle Price (4 Pieces)
                </span>
                <span className="font-mono text-xl font-black text-slate-900">
                  {formatPrice(totalOutfitPrice)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 rounded-2xl"
                  onClick={handleAddFullFit}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add Complete Look to Bag
                </Button>
                <Link href="/shop" className="sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full rounded-2xl">
                    Explore Pieces <ArrowRight className="h-4 w-4 ml-1" />
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
