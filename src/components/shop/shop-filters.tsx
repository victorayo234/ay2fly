"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Category, Collection } from "@/types/database";

interface ShopFiltersProps {
  categories: Category[];
  collections: Collection[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
  selectedFit: string;
  onSelectFit: (fit: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const FITS = [
  { id: "oversized", label: "Signature Oversized" },
  { id: "relaxed", label: "Relaxed Utility" },
  { id: "boxy", label: "Boxy Cropped" },
  { id: "regular", label: "Classic Regular" },
  { id: "fitted", label: "Form Fitted" },
];

const SIZES = ["S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "EU 42", "EU 43"];

const COLORS = [
  { name: "Black", hex: "#09090b" },
  { name: "Carbon", hex: "#1f1f23" },
  { name: "Grey", hex: "#6b7280" },
  { name: "White", hex: "#f4f4f5" },
  { name: "Indigo", hex: "#1e3a8a" },
  { name: "Olive", hex: "#3f4632" },
  { name: "Silver", hex: "#cbd5e1" },
];

export function ShopFilters({
  categories,
  collections,
  selectedCategory,
  onSelectCategory,
  selectedCollection,
  onSelectCollection,
  selectedFit,
  onSelectFit,
  selectedSize,
  onSelectSize,
  selectedColor,
  onSelectColor,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  hasActiveFilters,
  isMobileOpen = false,
  onCloseMobile,
}: ShopFiltersProps) {
  const content = (
    <div className="space-y-8 text-sm">
      {/* Active filters header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#202026]">
        <span className="font-display uppercase tracking-widest text-xs font-bold text-white">
          Filter By
        </span>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-mono text-[#a1a1aa] hover:text-white underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* In-Stock Only Toggle */}
      <div className="flex items-center justify-between p-3 bg-[#111116] border border-[#22222a] rounded-xs">
        <label
          htmlFor="in-stock-toggle"
          className="text-xs font-display uppercase tracking-wider text-white cursor-pointer select-none"
        >
          In Stock Only
        </label>
        <button
          id="in-stock-toggle"
          type="button"
          onClick={() => onToggleInStock(!inStockOnly)}
          className={`h-5 w-9 rounded-full transition-colors p-0.5 flex items-center ${
            inStockOnly ? "bg-white justify-end" : "bg-[#272730] justify-start"
          }`}
          aria-pressed={inStockOnly}
        >
          <div
            className={`h-4 w-4 rounded-full ${
              inStockOnly ? "bg-black" : "bg-[#71717a]"
            }`}
          />
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-display uppercase tracking-wider text-xs font-semibold text-[#cbd5e1]">
          Department
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory("")}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
              selectedCategory === ""
                ? "bg-white/10 text-white font-semibold"
                : "text-[#8e8e99] hover:text-white hover:bg-white/5"
            }`}
          >
            <span>All Departments</span>
            {selectedCategory === "" && <Check className="h-3 w-3 text-white" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onSelectCategory(selectedCategory === cat.slug ? "" : cat.slug)
              }
              className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#8e8e99] hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.slug && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Capsule / Collection Filter */}
      <div className="space-y-3">
        <h4 className="font-display uppercase tracking-wider text-xs font-semibold text-[#cbd5e1]">
          Capsule Release
        </h4>
        <div className="space-y-1.5">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() =>
                onSelectCollection(
                  selectedCollection === col.slug ? "" : col.slug
                )
              }
              className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                selectedCollection === col.slug
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#8e8e99] hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="truncate">{col.name}</span>
              {selectedCollection === col.slug && (
                <Check className="h-3 w-3 text-white shrink-0 ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fit Filter */}
      <div className="space-y-3">
        <h4 className="font-display uppercase tracking-wider text-xs font-semibold text-[#cbd5e1]">
          Silhouette / Fit
        </h4>
        <div className="space-y-1.5">
          {FITS.map((fit) => (
            <button
              key={fit.id}
              onClick={() =>
                onSelectFit(selectedFit === fit.id ? "" : fit.id)
              }
              className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                selectedFit === fit.id
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#8e8e99] hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{fit.label}</span>
              {selectedFit === fit.id && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <h4 className="font-display uppercase tracking-wider text-xs font-semibold text-[#cbd5e1]">
          Size
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() =>
                onSelectSize(selectedSize === size ? "" : size)
              }
              className={`h-8 text-xs font-mono rounded-xs border transition-colors flex items-center justify-center cursor-pointer ${
                selectedSize === size
                  ? "bg-white text-black border-white font-bold"
                  : "bg-[#111116] text-[#8e8e99] border-[#22222a] hover:border-white/40 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <h4 className="font-display uppercase tracking-wider text-xs font-semibold text-[#cbd5e1]">
          Color
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                onSelectColor(
                  selectedColor.toLowerCase() === color.name.toLowerCase()
                    ? ""
                    : color.name
                )
              }
              className={`h-7 px-2.5 rounded-xs border text-[11px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedColor.toLowerCase() === color.name.toLowerCase()
                  ? "border-white bg-white/15 text-white"
                  : "border-[#272730] bg-[#111115] text-[#8e8e99] hover:border-white/40 hover:text-white"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span>{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 sticky top-28 self-start">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          {/* Panel */}
          <div className="relative ml-auto h-full w-full max-w-xs bg-[#0b0b0e] border-l border-[#202028] p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#202028]">
                <span className="font-display uppercase text-sm font-bold text-white">
                  Filters
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 text-[#71717a] hover:text-white"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-[#202028] mt-8 sticky bottom-0 bg-[#0b0b0e]">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-white text-black font-display uppercase tracking-widest text-xs font-bold rounded-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
