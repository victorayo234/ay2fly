"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Info, UserCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FitLevel = "fitted" | "regular" | "relaxed" | "oversized";

interface FitVisualizerProps {
  currentFit?: FitLevel;
  product?: {
    name: string;
    fit?: string;
  };
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
      "Tapered torso, clean armholes, and standard length. Contours naturally without excess volume.",
    modelDrape: "Body-skimming · Minimal shoulder drop · Higher waistline hem",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    badge: "TAILORED CUT",
  },
  regular: {
    label: "Standard Regular",
    description:
      "Balanced everyday proportion. Comfortable room in the chest and arms with natural drape.",
    modelDrape: "Natural shoulder drop · Classic sleeve stack · Hip-level hem",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    badge: "DAILY PROPORTION",
  },
  relaxed: {
    label: "Relaxed Utility",
    description:
      "Extended chest width and widened sleeves. Perfect for mid-layering over tees or thermal tops.",
    modelDrape: "Lowered drop shoulder · Generous sleeve room · Fluid torso drape",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
    badge: "EASY DRAPE",
  },
  oversized: {
    label: "Signature Oversized",
    description:
      "ay2fly signature boxy fit. Dramatic dropped shoulders, wide ribbing, and substantial structural volume.",
    modelDrape: "Exaggerated shoulder drop · Wide sleeves · Heavyweight structured drape",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    badge: "SIGNATURE AY2FLY",
  },
};

export function FitVisualizer({ currentFit = "oversized", product }: FitVisualizerProps) {
  const initial = (product?.fit as FitLevel) || currentFit;
  const [activeFit, setActiveFit] = useState<FitLevel>(initial);
  const data = FIT_DATA[activeFit] || FIT_DATA.oversized;

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-[#ff5500]">
              Visual Silhouette Advisor
            </span>
            <Badge variant="vibrant">{data.badge}</Badge>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-slate-900 mt-1">
            How This Garment Fits on the Body
          </h3>
        </div>

        {/* Fit Toggle Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl">
          {(["fitted", "regular", "relaxed", "oversized"] as FitLevel[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFit(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeFit === f
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas Display */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
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
              alt={`Garment fitted in ${activeFit} cut`}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Specs */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-10 text-white">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" />
              Model: 6&apos;1&quot; (185cm) / 74kg · Wearing Size L
            </div>
            <div className="font-display uppercase text-base sm:text-lg font-black text-white mt-0.5">
              {data.label}
            </div>
            <div className="text-xs text-slate-200 hidden sm:block max-w-sm mt-0.5 font-medium">
              {data.modelDrape}
            </div>
          </div>

          <div className="text-[10px] font-mono font-bold text-slate-900 bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-md shadow-xs shrink-0 uppercase">
            Fit Drape: {activeFit.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Friendly Guidance Box */}
      <div className="flex items-start gap-2.5 p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-xs text-slate-700 leading-relaxed">
        <Info className="h-4 w-4 text-[#ff5500] shrink-0 mt-0.5" />
        <span>
          <strong className="font-bold text-slate-900">Fit Guidance:</strong> This silhouette guide is based on standard proportion models. All ay2fly pieces are pre-shrunk so your selected size remains consistent over time.
        </span>
      </div>
    </div>
  );
}
