"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FabricDetail {
  id: string;
  name: string;
  category: string;
  weight: string;
  origin: string;
  image: string;
  highlights: string[];
  description: string;
}

const FABRICS: FabricDetail[] = [
  {
    id: "french-terry",
    name: "Heavyweight Loopback Cotton",
    category: "Hoodies & Sweatpants",
    weight: "520 GSM Heavy Knit",
    origin: "100% Organic Combed Cotton",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85",
    highlights: [
      "Custom dense knit that preserves its boxy silhouette",
      "Unbrushed interior loops for all-day breathability",
      "Pre-shrunk to maintain its shape after repeated washing",
      "Double-layered hood construction without flimsy drawstrings",
    ],
    description: "Our signature hoodie fabric. Crafted with custom-spun organic cotton yarns that create substantial weight and natural drape without feeling stiff.",
  },
  {
    id: "selvedge-denim",
    name: "Raw Selvedge Denim",
    category: "Jeans & Trucker Jackets",
    weight: "15 oz Authentic Selvedge",
    origin: "Japanese Shuttle Loomed",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=85",
    highlights: [
      "Traditional shuttle loom weave with authentic selvedge ID",
      "Pure indigo dye that fades with personal wear",
      "Reinforced copper rivets and heavy-duty pocket bags",
      "Clean straight outseam for smooth stacking over sneakers",
    ],
    description: "Unwashed rigid denim woven on vintage shuttle looms. Designed to mold to your body over time, developing unique fades and honeycombs with every wear.",
  },
  {
    id: "box-calfskin",
    name: "Matte Full-Grain Leather",
    category: "Footwear & Outerwear",
    weight: "Full Thickness Calfskin",
    origin: "Supple Vegetable Tanned",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
    highlights: [
      "Natural grain texture that breaks in comfortably",
      "Water-resistant surface treatment for daily city use",
      "Vibram lugged rubber soles on all Chelsea boots",
      "Breathable leather lining preventing moisture buildup",
    ],
    description: "Hand-selected leather with a silky matte finish. Durable enough to handle wet streets while maintaining an effortlessly elevated look.",
  },
];

export function FabricReveal() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeFabric = FABRICS[selectedIdx];

  return (
    <section className="py-20 sm:py-24 bg-[#fafaf9] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <Badge variant="vibrant">MATERIAL & CRAFTSMANSHIP</Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
            Crafted with Purpose
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Materials that feel substantial, drape naturally, and get better with every wear.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {FABRICS.map((fabric, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={fabric.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 sm:px-6 py-3 rounded-2xl text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#ff5500] text-white shadow-[0_8px_20px_-4px_rgba(255,85,0,0.35)]"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-xs"
                }`}
              >
                {fabric.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic Card Display */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Macro Texture Photo */}
          <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFabric.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeFabric.image}
                  alt={activeFabric.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono font-bold text-slate-900 uppercase shadow-xs">
                  {activeFabric.weight} · {activeFabric.origin}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Plain Human Info */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-[#ff5500]">
                {activeFabric.category}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-slate-900 mt-1">
                {activeFabric.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeFabric.description}
            </p>

            {/* Highlights List */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              {activeFabric.highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#ff5500] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
