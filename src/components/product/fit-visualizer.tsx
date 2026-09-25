"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Info, UserCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FitLevel = "fitted" | "regular" | "relaxed" | "oversized";

interface FitVisualizerProps {
  currentFit: FitLevel;
  productName: string;
}

const FIT_DATA: Record<
  FitLevel,
  {
    label: string;
    description: string;
    modelDrape: string;
    image: string;
    badge: string;
  }
> = {
  fitted: {
    label: "Fitted Silhouette",
    description:
      "Tapered torso, snug armholes, and standard length. Contours naturally without excess volume.",
    modelDrape: "Body-skimming · Minimal shoulder drop · Higher hemline",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    badge: "TAILORED CUT",
  },
  regular: {
    label: "Standard Regular",
    description:
      "Balanced everyday proportion. Comfortable room in the chest and arms with gentle drape.",
    modelDrape: "2.5 cm shoulder drop · Classic sleeve stack · Hip-level hem",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    badge: "DAILY PROPORTION",
  },
  relaxed: {
    label: "Relaxed Utility",
    description:
      "Extended chest width and widened sleeves. Perfect for mid-layering over hoodies or thermal tops.",
    modelDrape: "5 cm shoulder drop · Generous bicep clearance · Fluid torso drape",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
    badge: "EASY DRAPE",
  },
  oversized: {
    label: "Signature Oversized",
    description:
      "ay2fly architectural flagship fit. Dramatic dropped shoulders, wide ribbing, and substantial structural volume.",
    modelDrape: "8+ cm exaggerated shoulder drop · Wide sleeves · Heavyweight drop drape",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    badge: "SIGNATURE AY2FLY",
  },
};

export function FitVisualizer({ currentFit = "oversized", productName }: FitVisualizerProps) {
  const [activeFit, setActiveFit] = useState<FitLevel>(currentFit);
  const data = FIT_DATA[activeFit];

  return (
    <div className="p-5 sm:p-6 bg-[#0e0e13] border border-[#22222a] rounded-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c1c24] pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white" />
          <h4 className="font-display uppercase tracking-wider text-xs font-bold text-white">
            Fit Silhouette Visualizer
          </h4>
        </div>
        <Badge variant="metallic">{data.badge}</Badge>
      </div>

      {/* Fit Profile Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(FIT_DATA) as FitLevel[]).map((fitKey) => (
          <button
            key={fitKey}
            type="button"
            onClick={() => setActiveFit(fitKey)}
            className={`py-2 px-2.5 text-[11px] font-display uppercase tracking-wider rounded-xs border transition-all text-center cursor-pointer ${
              activeFit === fitKey
                ? "bg-white text-black border-white font-bold shadow-md"
                : "bg-[#141419] text-[#8e8e99] border-[#22222a] hover:border-white/30 hover:text-white"
            }`}
          >
            {fitKey}
          </button>
        ))}
      </div>

      {/* Visual Model Crossfade Display */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-xs overflow-hidden border border-[#202028] bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFit}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={data.image}
              alt={`${productName} fitted in ${activeFit} cut`}
              fill
              className="object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden sm:block" />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Specs */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-10">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#cbd5e1] flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Atelier Model: 185cm / 74kg
            </div>
            <div className="font-display uppercase text-sm sm:text-base font-bold text-white mt-0.5">
              {data.label}
            </div>
            <div className="text-xs text-[#9ca3af] hidden sm:block max-w-sm mt-0.5">
              {data.modelDrape}
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#8a8a96] bg-black/60 px-2.5 py-1 rounded-xs backdrop-blur-xs border border-white/10 shrink-0">
            Drape Index: {activeFit === "fitted" ? "1.0x" : activeFit === "regular" ? "1.2x" : activeFit === "relaxed" ? "1.5x" : "1.8x Volumetric"}
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 bg-[#131318] border border-[#1e1e24] rounded-xs text-[11px] text-[#71717a] leading-relaxed">
        <Info className="h-3.5 w-3.5 text-[#a1a1aa] shrink-0 mt-0.5" />
        <span>
          <strong>Atelier Guidance:</strong> This is an approximate visual silhouette guide based on standard proportion models. Specific drape may vary slightly based on individual body contours and garment fabric weight.
        </span>
      </div>
    </div>
  );
}
