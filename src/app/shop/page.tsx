import React, { Suspense } from "react";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShopContainer } from "@/components/shop/shop-container";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Shop All Streetwear & Essentials | ay2fly",
  description:
    "Browse the full ay2fly catalog. Heavyweight boxy hoodies, Japanese selvedge denim, modular tactical vests, and brutalist footwear.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories, collections] = await Promise.all([
    db.getProducts(),
    db.getCategories(),
    db.getCollections(),
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Editorial Page Header */}
        <div className="border-b border-[#202028] pb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="metallic">COLLECTION CATALOGUE</Badge>
            <span className="text-xs font-mono text-[#71717a] uppercase">
              {products.length} ARCHITECTURAL PIECES
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            ALL STREETWEAR
          </h1>
          <p className="text-xs sm:text-sm text-[#9ca3af] max-w-xl leading-relaxed">
            Constructed with heavyweight combed knits, unwashed kurabo selvedge, and custom metallic hardware. Filter by department, fit silhouette, or capsule.
          </p>
        </div>

        {/* Interactive Shop Layout */}
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center text-xs font-mono text-[#71717a] uppercase tracking-widest">
              LOADING AY2FLY ARCHIVES...
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
