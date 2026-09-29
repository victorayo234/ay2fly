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
  { name: "Black", hex: "#0f172a" },
  { name: "Carbon", hex: "#334155" },
  { name: "Grey", hex: "#64748b" },
  { name: "White", hex: "#ffffff" },
  { name: "Indigo", hex: "#1e3a8a" },
  { name: "Olive", hex: "#3f4632" },
  { name: "Sand", hex: "#d6d3d1" },
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
    <div className="space-y-6">
      {/* Active filters header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <span className="font-display uppercase tracking-wider text-xs font-black text-slate-900">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-mono text-[#ff5500] hover:underline font-bold cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* In-Stock Only Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <label
          htmlFor="in-stock-toggle"
          className="text-xs font-display uppercase tracking-wider font-bold text-slate-800 cursor-pointer select-none"
        >
          In Stock Only
        </label>
        <button
          id="in-stock-toggle"
          type="button"
          onClick={() => onToggleInStock(!inStockOnly)}
          className={`h-6 w-11 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
            inStockOnly ? "bg-[#ff5500] justify-end" : "bg-slate-300 justify-start"
          }`}
          aria-pressed={inStockOnly}
        >
          <div className="h-5 w-5 rounded-full bg-white shadow-xs" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
          Department
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory("")}
            className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              selectedCategory === ""
                ? "bg-slate-900 text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>All Departments</span>
            {selectedCategory === "" && <Check className="h-3.5 w-3.5 text-white" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onSelectCategory(selectedCategory === cat.slug ? "" : cat.slug)
              }
              className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-[#ff5500] text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.slug && (
                <Check className="h-3.5 w-3.5 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Silhouette Cut Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
          Silhouette Cut
        </h4>
        <div className="space-y-1">
          {FITS.map((fit) => (
            <button
              key={fit.id}
              onClick={() => onSelectFit(selectedFit === fit.id ? "" : fit.id)}
              className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                selectedFit === fit.id
                  ? "bg-[#ff5500] text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span>{fit.label}</span>
              {selectedFit === fit.id && (
                <Check className="h-3.5 w-3.5 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
          Size
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => onSelectSize(selectedSize === sz ? "" : sz)}
              className={`h-9 rounded-xl border text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                selectedSize === sz
                  ? "bg-[#ff5500] text-white border-[#ff5500] shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
          Color
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((clr) => {
            const isSelected = selectedColor.toLowerCase() === clr.name.toLowerCase();
            return (
              <button
                key={clr.name}
                onClick={() =>
                  onSelectColor(isSelected ? "" : clr.name)
                }
                title={clr.name}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#ff5500] bg-orange-50 text-[#ff5500] font-bold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-slate-300 shrink-0"
                  style={{ backgroundColor: clr.hex }}
                />
                <span>{clr.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Capsule Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
          Collection Capsule
        </h4>
        <div className="space-y-1">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() =>
                onSelectCollection(selectedCollection === col.slug ? "" : col.slug)
              }
              className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                selectedCollection === col.slug
                  ? "bg-[#ff5500] text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="truncate">{col.name}</span>
              {selectedCollection === col.slug && (
                <Check className="h-3.5 w-3.5 text-white shrink-0 ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  if (!isMobileOpen) {
    return (
      <aside className="hidden lg:block w-64 shrink-0 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        {content}
      </aside>
    );
  }

  // Mobile drawer
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-xs bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-display text-base font-bold uppercase text-slate-900">
              Filter Catalog
            </h3>
            <button
              onClick={onCloseMobile}
              className="p-2 text-slate-400 hover:text-slate-700"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {content}
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 sticky bottom-0 bg-white">
          <button
            onClick={onCloseMobile}
            className="w-full h-12 bg-[#ff5500] text-white rounded-2xl font-display font-bold uppercase tracking-wider text-xs shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
