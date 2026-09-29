"use client";

import React, { useState, useMemo } from "react";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from "lucide-react";
import { Product, Category, Collection } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ShopContainerProps {
  initialProducts: Product[];
  categories: Category[];
  collections: Collection[];
}

export function ShopContainer({
  initialProducts,
  categories,
  collections,
}: ShopContainerProps) {
  // nuqs URL State
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault(""));
  const [collection, setCollection] = useQueryState("collection", parseAsString.withDefault(""));
  const [fit, setFit] = useQueryState("fit", parseAsString.withDefault(""));
  const [size, setSize] = useQueryState("size", parseAsString.withDefault(""));
  const [color, setColor] = useQueryState("color", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("featured"));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [inStockOnly, setInStockOnly] = useQueryState("inStockOnly", parseAsBoolean.withDefault(false));

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (category) {
      const catObj = categories.find((c) => c.slug === category);
      if (catObj) {
        result = result.filter((p) => p.category_id === catObj.id);
      }
    }

    if (collection) {
      const colObj = collections.find((c) => c.slug === collection);
      if (colObj) {
        result = result.filter((p) => p.collection_id === colObj.id);
      }
    }

    if (fit) {
      result = result.filter((p) => p.fit === fit);
    }

    if (size) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.size.toLowerCase() === size.toLowerCase())
      );
    }

    if (color) {
      result = result.filter((p) =>
        p.variants?.some((v) =>
          v.color.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => {
        const total = p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
        return total > 0;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "price-asc") {
      result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (sort === "price-desc") {
      result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [
    initialProducts,
    category,
    collection,
    fit,
    size,
    color,
    inStockOnly,
    search,
    sort,
    categories,
    collections,
  ]);

  const hasActiveFilters = Boolean(
    category || collection || fit || size || color || inStockOnly || search
  );

  const resetAllFilters = () => {
    setCategory("");
    setCollection("");
    setFit("");
    setSize("");
    setColor("");
    setInStockOnly(false);
    setSearch("");
  };

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;
  const activeCollectionName = collections.find((c) => c.slug === collection)?.name;

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        {/* Search input in catalog */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search within streetwear catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-9 bg-white border border-slate-200 rounded-2xl text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ff5500] shadow-xs transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 h-11 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-2xl text-xs font-display font-bold uppercase tracking-wider cursor-pointer shadow-xs active:scale-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-[#ff5500]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 hidden sm:inline-block">
              Sort:
            </span>
            <div className="w-44">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 rounded-2xl text-xs font-display font-bold uppercase tracking-wider bg-white border-slate-200"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-3">
          <span className="text-xs font-mono uppercase font-bold text-slate-400 mr-1">
            Active:
          </span>
          {activeCategoryName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              Dept: {activeCategoryName}
              <button
                onClick={() => setCategory("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {activeCollectionName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              Capsule: {activeCollectionName}
              <button
                onClick={() => setCollection("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {fit && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              Fit: {fit}
              <button
                onClick={() => setFit("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {size && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              Size: {size}
              <button
                onClick={() => setSize("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {color && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              Color: {color}
              <button
                onClick={() => setColor("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              In Stock Only
              <button
                onClick={() => setInStockOnly(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
              Query: &ldquo;{search}&rdquo;
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-[#ff5500] hover:underline ml-2 cursor-pointer font-bold"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="flex items-start gap-8">
        {/* Filters Sidebar */}
        <ShopFilters
          categories={categories}
          collections={collections}
          selectedCategory={category}
          onSelectCategory={setCategory}
          selectedCollection={collection}
          onSelectCollection={setCollection}
          selectedFit={fit}
          onSelectFit={setFit}
          selectedSize={size}
          onSelectSize={setSize}
          selectedColor={color}
          onSelectColor={setColor}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          onResetFilters={resetAllFilters}
          hasActiveFilters={hasActiveFilters}
          isMobileOpen={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Count bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase font-bold tracking-wider mb-6 pb-2 border-b border-slate-200">
            <span>
              Showing {filteredProducts.length} of {initialProducts.length}{" "}
              Streetwear Pieces
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20 px-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-xs">
              <div className="h-16 w-16 mx-auto rounded-full bg-orange-50 text-[#ff5500] flex items-center justify-center">
                <Filter className="h-7 w-7 stroke-2" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-display uppercase text-lg font-black text-slate-900 tracking-tight">
                  No matching streetwear pieces found
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We couldn&apos;t find any garments matching your active filters. Try clearing some filters or browse our main departments.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={resetAllFilters}
                  className="gap-2 rounded-2xl"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset All Filters
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="rounded-2xl"
                  onClick={() => {
                    resetAllFilters();
                    setCategory("tops");
                  }}
                >
                  Explore Tops
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="rounded-2xl"
                  onClick={() => {
                    resetAllFilters();
                    setCategory("bottoms");
                  }}
                >
                  Explore Bottoms
                </Button>
              </div>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
