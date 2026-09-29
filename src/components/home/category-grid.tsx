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
    <section className="py-20 sm:py-24 bg-[#f8fafc] border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#ff5500] block">
            Streetwear Taxonomy
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
            Shop By Department
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Constructed with heavyweight cotton knits and durable streetwear materials made for everyday wear.
          </p>
        </div>

        {/* Responsive Grid for all 7 authorized departments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`group relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6 ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {/* Full Color Background Image (NO grayscale!) */}
                <Image
                  src={
                    cat.image_url ||
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Smooth Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Content Box */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide group-hover:text-amber-200 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="h-9 w-9 rounded-full bg-white/20 group-hover:bg-[#ff5500] text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
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
