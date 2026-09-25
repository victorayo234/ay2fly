"use client";

import React, { useState } from "react";
import { X, Ruler, Check } from "lucide-react";
import { SizeGuide } from "@/types/database";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeGuides: SizeGuide[];
  categoryName?: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  sizeGuides,
  categoryName = "Garment",
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (!isOpen) return null;

  const convert = (val?: number) => {
    if (val === undefined) return "—";
    if (unit === "cm") return `${val} cm`;
    return `${(val / 2.54).toFixed(1)} in`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0e0e12] border border-[#272732] rounded-xs shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Size Guide"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#202028] pb-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <Ruler className="h-4 w-4" />
              <h3 className="font-display text-lg font-bold uppercase tracking-wider">
                {categoryName} Size Guide
              </h3>
            </div>
            <p className="text-xs text-[#8e8e99] mt-1 font-mono">
              Live atelier garment measurements · Data-driven from product specs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717a] hover:text-white transition-colors"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#a1a1aa] font-sans">
            Measurement standard:
          </span>
          <div className="flex border border-[#272732] rounded-xs bg-[#141418] p-0.5">
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-xs transition-colors ${
                unit === "cm"
                  ? "bg-white text-black font-bold"
                  : "text-[#8e8e99] hover:text-white"
              }`}
            >
              Centimeters (CM)
            </button>
            <button
              onClick={() => setUnit("in")}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-xs transition-colors ${
                unit === "in"
                  ? "bg-white text-black font-bold"
                  : "text-[#8e8e99] hover:text-white"
              }`}
            >
              Inches (IN)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-[#202028] rounded-xs">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#141418] border-b border-[#202028] text-white font-display uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Size</th>
                {sizeGuides.some((g) => g.chest) && (
                  <th className="py-3 px-4">Chest</th>
                )}
                {sizeGuides.some((g) => g.waist) && (
                  <th className="py-3 px-4">Waist</th>
                )}
                {sizeGuides.some((g) => g.hip) && (
                  <th className="py-3 px-4">Hip</th>
                )}
                {sizeGuides.some((g) => g.garment_length) && (
                  <th className="py-3 px-4">Length</th>
                )}
                {sizeGuides.some((g) => g.min_height) && (
                  <th className="py-3 px-4">Recommended Height</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202028] font-mono">
              {sizeGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-display">
                    {guide.size}
                  </td>
                  {guide.chest !== undefined && (
                    <td className="py-3 px-4 text-[#cbd5e1]">
                      {convert(guide.chest)}
                    </td>
                  )}
                  {guide.waist !== undefined && (
                    <td className="py-3 px-4 text-[#cbd5e1]">
                      {convert(guide.waist)}
                    </td>
                  )}
                  {guide.hip !== undefined && (
                    <td className="py-3 px-4 text-[#cbd5e1]">
                      {convert(guide.hip)}
                    </td>
                  )}
                  {guide.garment_length !== undefined && (
                    <td className="py-3 px-4 text-[#cbd5e1]">
                      {convert(guide.garment_length)}
                    </td>
                  )}
                  {guide.min_height !== undefined && (
                    <td className="py-3 px-4 text-[#a1a1aa]">
                      {convert(guide.min_height)} – {convert(guide.max_height)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Guide Instructions */}
        <div className="p-4 bg-[#141419] border border-[#22222a] rounded-xs space-y-2 text-xs text-[#a1a1aa]">
          <h4 className="font-display uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            How We Measure Our Garments
          </h4>
          <p className="leading-relaxed">
            All garments are laid flat on a smooth surface. Chest is measured pit-to-pit and multiplied by two. Length is measured from highest shoulder point straight to bottom hem.
          </p>
        </div>
      </div>
    </div>
  );
}
