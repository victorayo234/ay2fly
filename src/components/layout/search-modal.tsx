"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Loader2, Sparkles } from "lucide-react";
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
          setResults(data.slice(0, 6));
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search ay2fly"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-6 py-4.5 border-b border-slate-100">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search hoodies, baggy denim, cargos, kicks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {loading && <Loader2 className="h-5 w-5 text-[#ff5500] animate-spin shrink-0 mr-2" />}
          <button
            onClick={closeSearch}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-[#ff5500]" />
                Trending Streetwear Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Heavyweight Boxy Hoodie",
                  "Raw Wide-Leg Denim",
                  "Tactical Cargo Pant",
                  "Chelsea Boot",
                  "Combed Cotton Tee",
                  "Varsity Jacket",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-orange-50 text-xs font-display font-bold text-slate-700 hover:text-[#ff5500] rounded-xl border border-slate-200/80 hover:border-orange-200 transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Products Found ({results.length})
              </div>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="relative h-14 w-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={
                          product.images?.[0]?.image_url ||
                          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display uppercase text-xs font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {product.material} · {product.fit} fit
                      </p>
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-900 shrink-0">
                      {formatPrice(product.sale_price ?? product.price)}
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#ff5500] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="pt-2 text-center">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  className="text-xs font-display font-bold uppercase tracking-wider text-[#ff5500] hover:text-[#e04b00] inline-flex items-center gap-1.5"
                >
                  View all results for &ldquo;{query}&rdquo; <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="text-xs font-medium text-slate-600">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px]">Try searching by hoodie, denim, cargo, or kicks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
