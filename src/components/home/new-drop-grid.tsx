import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

interface NewDropGridProps {
  products: Product[];
}

export function NewDropGrid({ products }: NewDropGridProps) {
  return (
    <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#ff5500] flex items-center gap-1.5 mb-1.5">
            <Flame className="h-3.5 w-3.5" />
            FRESH DROP 01
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
            Latest Streetwear Drops
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
            Heavyweight boxy hoodies, raw baggy denim, and everyday essentials crafted for real movement.
          </p>
        </div>
        <Link href="/shop?collection=drop-01">
          <Button variant="secondary" size="md" className="group rounded-2xl shadow-xs">
            View All Pieces <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={idx < 4}
          />
        ))}
      </div>
    </section>
  );
}
