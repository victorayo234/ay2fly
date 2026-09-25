"use client";

import React, { useState, useMemo } from "react";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from "lucide-react";
import { Product, Category, Collection } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
    categories,
    collections,
    category,
    collection,
    fit,
    size,
    color,
    sort,
    search,
    inStockOnly,
  ]);

  const hasActiveFilters = Boolean(
    category || collection || fit || size || color || search || inStockOnly
  );

  const resetAllFilters = () => {
    setCategory("");
    setCollection("");
    setFit("");
    setSize("");
    setColor("");
    setSearch("");
    setInStockOnly(false);
  };

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;
  const activeCollectionName = collections.find((c) => c.slug === collection)?.name;

  return (
    <div className="space-y-8">
      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#0e0e12] border border-[#202028] rounded-xs">
        {/* Search input in shop */}
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search silhouettes, materials, drops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-10 text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white"
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
            className="lg:hidden flex items-center gap-2 h-10 px-4 bg-[#16161d] border border-[#272730] hover:border-white/50 text-white rounded-xs text-xs font-display uppercase tracking-wider cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#71717a] hidden sm:inline-block">
              Sort:
            </span>
            <div className="w-40 sm:w-44">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 text-xs font-display uppercase tracking-wider"
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
          <span className="text-xs font-mono uppercase text-[#71717a] mr-1">
            Active:
          </span>
          {activeCategoryName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              Dept: {activeCategoryName}
              <button
                onClick={() => setCategory("")}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {activeCollectionName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              Capsule: {activeCollectionName}
              <button
                onClick={() => setCollection("")}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {fit && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              Fit: {fit}
              <button
                onClick={() => setFit("")}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {size && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              Size: {size}
              <button
                onClick={() => setSize("")}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {color && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              Color: {color}
              <button
                onClick={() => setColor("")}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              In Stock Only
              <button
                onClick={() => setInStockOnly(false)}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#16161e] border border-[#272732] text-xs text-white">
              Query: &ldquo;{search}&rdquo;
              <button
                onClick={() => setSearch("")}
                className="text-[#71717a] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-[#a1a1aa] hover:text-white underline ml-2 cursor-pointer font-mono"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="flex items-start">
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
          <div className="flex items-center justify-between text-xs text-[#8e8e99] font-mono uppercase tracking-wider mb-6 pb-2 border-b border-[#1c1c22]">
            <span>
              Showing {filteredProducts.length} of {initialProducts.length}{" "}
              Garments
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24 px-4 bg-[#0e0e12] border border-[#202026] rounded-xs space-y-6">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#16161c] border border-[#272730] flex items-center justify-center text-[#71717a]">
                <Filter className="h-7 w-7 stroke-1" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-display uppercase text-lg font-bold text-white tracking-wide">
                  No matching garments found
                </h3>
                <p className="text-xs text-[#8e8e99] leading-relaxed">
                  We couldn&apos;t find any pieces matching your current active
                  filter configuration. Try clearing your filters or exploring our
                  primary departments.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={resetAllFilters}
                  className="gap-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset All Filters
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    resetAllFilters();
                    setCategory("tops");
                  }}
                >
                  Explore Tops
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    resetAllFilters();
                    setCategory("denim");
                  }}
                >
                  Explore Denim
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
