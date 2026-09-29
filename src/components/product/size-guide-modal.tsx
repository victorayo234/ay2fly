"use client";

import React, { useState } from "react";
import { X, Ruler, Sparkles, Check } from "lucide-react";
import { SizeGuide } from "@/types/database";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeGuides: SizeGuide[];
  categoryName: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  sizeGuides,
  categoryName,
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (!isOpen) return null;

  const toInches = (val?: number | null) => {
    if (!val) return "-";
    return (val / 2.54).toFixed(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Size Guide"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Ruler className="h-4 w-4 text-[#ff5500]" />
              <h3 className="font-display text-lg font-black uppercase tracking-tight">
                {categoryName} Size Guide
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Exact garment dimensions. Measured flat across the garment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400 uppercase font-bold">
            Measurement Standard
          </span>
          <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                unit === "cm"
                  ? "bg-[#ff5500] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              onClick={() => setUnit("in")}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                unit === "in"
                  ? "bg-[#ff5500] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] uppercase font-bold text-slate-500">
              <tr>
                <th className="p-3 pl-4">Size</th>
                <th className="p-3">Target Height</th>
                {sizeGuides.some((s) => s.chest) && (
                  <th className="p-3">Chest Width</th>
                )}
                {sizeGuides.some((s) => s.waist) && (
                  <th className="p-3">Waist</th>
                )}
                {sizeGuides.some((s) => s.hip) && <th className="p-3">Hip</th>}
                {sizeGuides.some((s) => s.garment_length) && (
                  <th className="p-3 pr-4">Garment Length</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {sizeGuides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Standard unisex sizing applies. Choose your regular size.
                  </td>
                </tr>
              ) : (
                sizeGuides.map((sg) => (
                  <tr
                    key={sg.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="p-3 pl-4 font-bold text-slate-900 font-display">
                      {sg.size}
                    </td>
                    <td className="p-3 text-slate-600">
                      {sg.min_height && sg.max_height
                        ? `${sg.min_height}–${sg.max_height} cm`
                        : "All heights"}
                    </td>
                    {sizeGuides.some((s) => s.chest) && (
                      <td className="p-3">
                        {unit === "cm"
                          ? `${sg.chest} cm`
                          : `${toInches(sg.chest)} in`}
                      </td>
                    )}
                    {sizeGuides.some((s) => s.waist) && (
                      <td className="p-3">
                        {unit === "cm"
                          ? `${sg.waist} cm`
                          : `${toInches(sg.waist)} in`}
                      </td>
                    )}
                    {sizeGuides.some((s) => s.hip) && (
                      <td className="p-3">
                        {unit === "cm"
                          ? `${sg.hip} cm`
                          : `${toInches(sg.hip)} in`}
                      </td>
                    )}
                    {sizeGuides.some((s) => s.garment_length) && (
                      <td className="p-3 pr-4">
                        {unit === "cm"
                          ? `${sg.garment_length} cm`
                          : `${toInches(sg.garment_length)} in`}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs text-slate-600 leading-relaxed">
          <div className="font-bold text-slate-900">How to measure:</div>
          <p>
            For boxy and oversized hoodies, we recommend ordering your true size to achieve the intended relaxed drape. For a closer tailored fit, size down one size.
          </p>
        </div>
      </div>
    </div>
  );
}
