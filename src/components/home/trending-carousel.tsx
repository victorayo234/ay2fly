"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Flame } from "lucide-react";
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
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#ff5500] flex items-center gap-1.5 mb-1">
            <Flame className="h-3.5 w-3.5" />
            POPULAR PIECES
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
            Trending Right Now
          </h2>
        </div>

        {/* Carousel Nav Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="h-10 w-10 rounded-full border border-slate-200 bg-white hover:bg-[#ff5500] hover:text-white text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-full border border-slate-200 bg-white hover:bg-[#ff5500] hover:text-white text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-wider text-slate-600 hover:text-[#ff5500] transition-colors ml-3"
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
            className="min-w-[270px] sm:min-w-[300px] max-w-[300px] snap-start shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
