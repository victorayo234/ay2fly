import React, { Suspense } from "react";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShopContainer } from "@/components/shop/shop-container";
import { Badge } from "@/components/ui/badge";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Shop All Streetwear & Essentials | ay2fly",
  description:
    "Browse the full ay2fly catalog. Heavyweight boxy hoodies, baggy selvedge denim, utility jackets, and street footwear.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories, collections] = await Promise.all([
    db.getProducts(),
    db.getCategories(),
    db.getCollections(),
  ]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Editorial Page Header */}
        <div className="border-b border-slate-200 pb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="vibrant">FULL CATALOG</Badge>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              {products.length} STREETWEAR PIECES
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
            All Streetwear
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Constructed with heavyweight cotton knits, authentic Japanese selvedge denim, and relaxed fits. Filter by department, silhouette cut, or collection capsule.
          </p>
        </div>

        {/* Interactive Shop Layout with Skeleton Loading */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ShopContainer
            initialProducts={products}
            categories={categories}
            collections={collections}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
