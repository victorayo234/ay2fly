"use client";

import React, { useState } from "react";
import { Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SizeRecommenderProps {
  onSelectRecommendedSize: (size: string) => void;
  availableSizes: string[];
}

export function SizeRecommender({
  onSelectRecommendedSize,
  availableSizes,
}: SizeRecommenderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number>(180);
  const [weight, setWeight] = useState<number>(75);
  const [build, setBuild] = useState<"slim" | "average" | "athletic" | "broad">("athletic");
  const [preferredFit, setPreferredFit] = useState<"fitted" | "regular" | "oversized">("oversized");
  const [recommendation, setRecommendation] = useState<{
    size: string;
    explanation: string;
  } | null>(null);

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();

    let baseSizeIndex = 1; // 0=S, 1=M, 2=L, 3=XL, 4=XXL

    // Height score
    if (height < 172) baseSizeIndex = 0;
    else if (height < 180) baseSizeIndex = 1;
    else if (height < 188) baseSizeIndex = 2;
    else if (height < 195) baseSizeIndex = 3;
    else baseSizeIndex = 4;

    // Weight & Build adjustment
    if (weight > 85 || build === "broad") baseSizeIndex += 1;
    if (weight < 65 && build === "slim") baseSizeIndex -= 1;

    // Preferred fit adjustment
    if (preferredFit === "oversized") baseSizeIndex += 1;
    if (preferredFit === "fitted") baseSizeIndex -= 1;

    // Clamp
    baseSizeIndex = Math.max(0, Math.min(4, baseSizeIndex));

    const standardSizes = ["S", "M", "L", "XL", "XXL"];
    const numericSizes = ["30", "32", "34", "36", "38"];

    // Check if available sizes are numeric (like denim) or alpha
    const isNumeric = availableSizes.some((s) => !isNaN(Number(s)));
    const targetSizes = isNumeric ? numericSizes : standardSizes;
    const computedSize = targetSizes[baseSizeIndex] || targetSizes[1];

    const explanation = `Recommended for ${height}cm / ${weight}kg (${build} build) with a ${preferredFit} streetwear drape.`;

    setRecommendation({
      size: computedSize,
      explanation,
    });
  };

  return (
    <div className="border border-slate-200 bg-slate-50/80 rounded-2xl overflow-hidden shadow-2xs">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#ff5500]" />
          <span className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
            Find Your Recommended Size (Smart Size Calculator)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {/* Expandable Form */}
      {isOpen && (
        <div className="p-5 border-t border-slate-200 space-y-5 bg-white">
          <form onSubmit={calculateSize} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Height: {height} cm
                </label>
                <input
                  type="range"
                  min={155}
                  max={205}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-[#ff5500] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Weight: {weight} kg
                </label>
                <input
                  type="range"
                  min={50}
                  max={120}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#ff5500] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Body Build
                </label>
                <select
                  value={build}
                  onChange={(e) => setBuild(e.target.value as any)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-2.5 text-xs text-slate-800 font-medium"
                >
                  <option value="slim">Slim / Lean</option>
                  <option value="average">Standard Average</option>
                  <option value="athletic">Athletic / Tapered</option>
                  <option value="broad">Broad / Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Desired Fit
                </label>
                <select
                  value={preferredFit}
                  onChange={(e) => setPreferredFit(e.target.value as any)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-2.5 text-xs text-slate-800 font-medium"
                >
                  <option value="fitted">Closer Fitted</option>
                  <option value="regular">True to Size / Regular</option>
                  <option value="oversized">Signature Oversized</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="secondary" size="md" className="w-full rounded-xl">
              Calculate Recommended Size
            </Button>
          </form>

          {/* Results card */}
          {recommendation && (
            <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-orange-950">
                  Recommended For You
                </span>
                <span className="font-display uppercase text-sm font-black text-white bg-[#ff5500] px-3 py-1 rounded-full shadow-xs">
                  Size {recommendation.size}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {recommendation.explanation}
              </p>

              <button
                type="button"
                onClick={() => onSelectRecommendedSize(recommendation.size)}
                className="w-full mt-2 py-2.5 bg-[#ff5500] text-white hover:bg-[#e04b00] text-xs font-display uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Check className="h-3.5 w-3.5" />
                Select Size {recommendation.size}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
