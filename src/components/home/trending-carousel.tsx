"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";

interface TrendingCarouselProps {
  products: Product[];
}

export function TrendingCarousel({ products }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#202026]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8e8e99] block mb-1">
            Curated Rotation
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Trending Streetwear
          </h2>
        </div>

        {/* Carousel Nav Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="h-9 w-9 rounded-xs border border-[#272730] bg-[#111115] hover:bg-[#1c1c22] hover:border-white/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-9 w-9 rounded-xs border border-[#272730] bg-[#111115] hover:bg-[#1c1c22] hover:border-white/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-display uppercase tracking-widest text-[#cbd5e1] hover:text-white transition-colors ml-4"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[270px] sm:min-w-[310px] max-w-[310px] snap-start shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
