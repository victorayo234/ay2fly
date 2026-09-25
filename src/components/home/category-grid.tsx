import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/types/database";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-20 bg-[#070709] border-y border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8e8e99] block">
            Architectural Silhouettes
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Explore By Department
          </h2>
          <p className="text-xs text-[#8e8e99] leading-relaxed">
            Constructed with heavy-gauge fabrications and functional hardware designed to endure daily metropolitan wear.
          </p>
        </div>

        {/* Responsive Grid for all 7 Authoritative Departments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const isLarge = idx === 0 || idx === 1;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`group relative h-[360px] sm:h-[420px] rounded-xs overflow-hidden border border-[#202028] hover:border-[#40404e] transition-all duration-500 flex flex-col justify-end p-6 lustre-card ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {/* Background Image */}
                <Image
                  src={
                    cat.image_url ||
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center filter grayscale contrast-110 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors duration-300" />

                {/* Content Box */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-black uppercase text-white tracking-wide group-hover:text-neutral-200 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="h-8 w-8 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center backdrop-blur-xs transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-xs text-[#d1d5db] line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
