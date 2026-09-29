"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/wishlist-store";
import { Product } from "@/types/database";

export default function WishlistPage() {
  const { productIds, clearWishlist } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const all: Product[] = await res.json();
          const saved = all.filter((p) => productIds.includes(p.id));
          setProducts(saved);
        }
      } catch (e) {
        console.error("Failed to load wishlist:", e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [productIds]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <Badge variant="accent">SAVED ITEMS</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 mt-2">
              My Wishlist ({productIds.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your saved streetwear garments. Instant stock status and quick add-to-bag.
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-medium text-slate-500 hover:text-red-500 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono uppercase text-slate-400">
            Loading your saved pieces...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm max-w-lg mx-auto">
            <div className="h-18 w-18 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff5500]">
              <Heart className="h-8 w-8 stroke-2" />
            </div>
            <div>
              <h3 className="font-display uppercase text-lg font-bold text-slate-900">
                Your wishlist is empty
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Save pieces while browsing the catalog to keep track of limited drops and build your fit.
              </p>
            </div>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="accent" size="md" className="shadow-lg shadow-orange-500/20 active:scale-95">
                Browse The Shop <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
