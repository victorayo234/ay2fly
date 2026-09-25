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
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#202028] pb-6 gap-4">
          <div>
            <Badge variant="metallic">PERSONAL ARCHIVE</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-2">
              Saved Garments ({productIds.length})
            </h1>
            <p className="text-xs text-[#9ca3af] mt-1 font-mono">
              Persisted across browsing sessions. In-stock availability monitored continuously.
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-mono text-[#8e8e99] hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Entire Archive
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono uppercase text-[#71717a]">
            Loading personal archive...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#16161c] border border-[#272730] flex items-center justify-center text-[#71717a]">
              <Heart className="h-7 w-7 stroke-1" />
            </div>
            <div>
              <h3 className="font-display uppercase text-lg font-bold text-white tracking-wide">
                Your archive is empty
              </h3>
              <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto leading-relaxed">
                Save garments while browsing the shop to track stock levels and build your seasonal rotation.
              </p>
            </div>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Browse Collection <ArrowRight className="h-4 w-4" />
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
