"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f13] border border-[#272730] rounded-xs shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search ay2fly"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-[#222228]">
          <Search className="h-5 w-5 text-[#71717a] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, fits, materials (e.g. hoodie, raw denim, tactical)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-4 text-sm sm:text-base text-white placeholder:text-[#52525b] focus:outline-none"
          />
          {loading && <Loader2 className="h-4 w-4 text-white animate-spin shrink-0 mr-2" />}
          <button
            onClick={closeSearch}
            className="p-1 text-[#71717a] hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase text-[#71717a] tracking-wider">
                Trending Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {["Heavyweight Hoodie", "Wide-Leg Denim", "Tactical Cargo", "Chelsea Boot", "Mohair Knit"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#17171c] hover:bg-[#202026] text-xs text-[#d1d5db] hover:text-white rounded-xs border border-[#272730] transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase text-[#71717a] tracking-wider">
                Products Found ({results.length})
              </div>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 p-2.5 rounded-xs hover:bg-[#18181f] border border-transparent hover:border-[#272730] transition-colors group"
                  >
                    <div className="relative h-14 w-12 bg-[#1c1c22] rounded-xs overflow-hidden shrink-0">
                      <Image
                        src={
                          product.images?.[0]?.image_url ||
                          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display uppercase text-xs font-semibold text-white group-hover:text-neutral-300 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#71717a] font-mono mt-0.5">
                        {product.material} · {product.fit} fit
                      </p>
                    </div>
                    <div className="font-mono text-xs font-semibold text-white shrink-0">
                      {formatPrice(product.sale_price ?? product.price)}
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#71717a] group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
              <div className="pt-2 text-center">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  className="text-xs font-display uppercase tracking-widest text-[#cbd5e1] hover:text-white inline-flex items-center gap-1.5"
                >
                  View all results for &ldquo;{query}&rdquo; <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#71717a] space-y-2">
              <p className="text-xs">We couldn&apos;t find anything matching &ldquo;{query}&rdquo;</p>
              <p className="text-[11px]">Try searching by category, silhouette, or fabric.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
