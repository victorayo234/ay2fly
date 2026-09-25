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

    const explanation = `Calculated for ${height}cm / ${weight}kg (${build} build) with a preferred ${preferredFit} streetwear drape.`;

    setRecommendation({
      size: computedSize,
      explanation,
    });
  };

  return (
    <div className="border border-[#22222a] bg-[#111116] rounded-xs overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#16161d] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#cbd5e1]" />
          <span className="font-display uppercase tracking-wider text-xs font-semibold text-white">
            Find Your Exact Size (Atelier Calculator)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-[#71717a]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#71717a]" />
        )}
      </button>

      {/* Expandable Form */}
      {isOpen && (
        <div className="p-5 border-t border-[#202028] space-y-5 bg-[#0d0d11]">
          <form onSubmit={calculateSize} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8e8e99] mb-1">
                  Height: {height} cm
                </label>
                <input
                  type="range"
                  min={155}
                  max={205}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8e8e99] mb-1">
                  Weight: {weight} kg
                </label>
                <input
                  type="range"
                  min={50}
                  max={120}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8e8e99] mb-1">
                  Body Build
                </label>
                <select
                  value={build}
                  onChange={(e) => setBuild(e.target.value as any)}
                  className="w-full h-9 bg-[#15151c] border border-[#272732] rounded-xs px-2 text-xs text-white"
                >
                  <option value="slim">Slim / Lean</option>
                  <option value="average">Standard Average</option>
                  <option value="athletic">Athletic / Tapered</option>
                  <option value="broad">Broad / Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8e8e99] mb-1">
                  Desired Fit
                </label>
                <select
                  value={preferredFit}
                  onChange={(e) => setPreferredFit(e.target.value as any)}
                  className="w-full h-9 bg-[#15151c] border border-[#272732] rounded-xs px-2 text-xs text-white"
                >
                  <option value="fitted">Closer Fitted</option>
                  <option value="regular">True to Size / Regular</option>
                  <option value="oversized">Signature Oversized</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Calculate Recommended Size
            </Button>
          </form>

          {/* Results card */}
          {recommendation && (
            <div className="p-4 bg-white/5 border border-white/20 rounded-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                  Recommendation
                </span>
                <span className="font-display uppercase text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded-xs">
                  Size {recommendation.size}
                </span>
              </div>
              <p className="text-xs text-[#d1d5db] leading-relaxed">
                {recommendation.explanation}
              </p>

              <button
                type="button"
                onClick={() => onSelectRecommendedSize(recommendation.size)}
                className="w-full mt-2 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-display uppercase tracking-wider font-bold rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
