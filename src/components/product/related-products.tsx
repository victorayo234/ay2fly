import React from "react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="pt-20 border-t border-[#202028]">
      <div className="mb-8 pb-4 border-b border-[#1c1c24] flex items-end justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#71717a] block mb-1">
            Styling Suggestions
          </span>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Complete The Fit
          </h2>
        </div>
        <span className="text-xs font-mono uppercase text-[#71717a] hidden sm:inline-block">
          Coordinated Layering Essentials
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
