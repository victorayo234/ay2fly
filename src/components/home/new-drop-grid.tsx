import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

interface NewDropGridProps {
  products: Product[];
}

export function NewDropGrid({ products }: NewDropGridProps) {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#202026] gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8e8e99] block mb-1">
            Global Release 01
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            The Monolith Collection
          </h2>
        </div>
        <Link href="/shop?collection=drop-01">
          <Button variant="outline" size="sm" className="group">
            View Full Drop <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Grid */}
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
