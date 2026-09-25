"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles, ZoomIn, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FabricDetail {
  id: string;
  name: string;
  category: string;
  weight: string;
  origin: string;
  image: string;
  specs: { label: string; value: string }[];
  description: string;
}

const FABRICS: FabricDetail[] = [
  {
    id: "french-terry",
    name: "520 GSM HEAVYWEIGHT LOOPBACK",
    category: "Hoodies & Crewnecks",
    weight: "520 Grams / Sq. Meter",
    origin: "Wakayama, Japan",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85",
    specs: [
      { label: "Yarn Construction", value: "3-End Combed Organic Cotton" },
      { label: "Internal Face", value: "Unbrushed Dense French Loopback" },
      { label: "Shrinkage Tolerance", value: "< 1.5% Pre-Shrunk & Enzyme Washed" },
      { label: "Architectural Drape", value: "Extreme Rigidity (Preserves Box Volume)" },
    ],
    description: "Woven on low-speed vintage sinker machines to achieve maximum loop density without synthetic elastane. Dense enough to hold a sharp boxy hood structure without collapsing around the neck.",
  },
  {
    id: "selvedge-denim",
    name: "15 OZ RAW KURABO SELVEDGE",
    category: "Denim & Trucker Jackets",
    weight: "15 Ounces / Sq. Yard",
    origin: "Okayama, Japan",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=85",
    specs: [
      { label: "Shuttle Loom", value: "Toyoda G9 Shuttle Weave" },
      { label: "Dye Process", value: "Pure Natural Indigo Rope-Dyed" },
      { label: "Selvedge ID", value: "Silver Lurex Metallic Edge Line" },
      { label: "Fade Characteristic", value: "High-Contrast Crease Whiskering" },
    ],
    description: "Unwashed, un-sanforized rigid Japanese cotton denim featuring genuine silver metallic selvedge ID tickers along the outseam. Yields customized personalized honeycombs and stacks with each wear.",
  },
  {
    id: "box-calfskin",
    name: "1.2MM MATTE BOX CALFSKIN",
    category: "Footwear & Leather Jackets",
    weight: "1.2 Millimeters Full Thickness",
    origin: "Tuscany, Italy",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
    specs: [
      { label: "Tannage", value: "Vegetable Extract Double Tanned" },
      { label: "Surface Finish", value: "Silky Matte Box Aniline" },
      { label: "Hardware Compatibility", value: "316L Solid Silver Plating" },
      { label: "Water Resistance", value: "Hydrophobic Natural Wax Infusion" },
    ],
    description: "Selected from the tightest grain bovine hides with zero synthetic polymer coatings. Features a deep matte luster that patinas with exposure to metropolitan wear and rain.",
  },
];

export function FabricReveal() {
  const [selectedFabric, setSelectedFabric] = useState(FABRICS[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section className="py-24 bg-[#09090b] relative overflow-hidden border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="metallic">MACRO MATERIAL INSPECTION</Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            OBSESSIVE <span className="metallic-text">FABRICATIONS</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
            Zero synthetic polyester fillers. We engineer custom loop density and unwashed rigid selvedge to maintain brutalist architectural silhouettes.
          </p>
        </div>

        {/* 3 Material Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {FABRICS.map((fabric) => {
            const isSelected = selectedFabric.id === fabric.id;
            return (
              <button
                key={fabric.id}
                onClick={() => setSelectedFabric(fabric)}
                className={`p-5 rounded-xs border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#14141a] border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                    : "bg-[#0e0e12] border-[#222228] text-[#8e8e99] hover:border-[#383844] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">
                    {fabric.category}
                  </span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white shadow-glow" />}
                </div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  {fabric.name}
                </h3>
                <div className="text-xs font-mono text-[#a1a1aa] mt-1">
                  {fabric.weight} · {fabric.origin}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Material Showcase Panel */}
        <div className="bg-[#0e0e12] border border-[#222228] rounded-xs p-6 sm:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lustre-card">
          {/* Zoomable Fabric Macro Stage */}
          <div
            className="w-full lg:w-1/2 relative aspect-[4/3] rounded-xs overflow-hidden border border-[#272732] bg-black cursor-zoom-in group"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFabric.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src={selectedFabric.image}
                  alt={selectedFabric.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover object-center transition-transform duration-700 ease-out ${
                    isZoomed ? "scale-150" : "scale-100 group-hover:scale-105"
                  }`}
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-2.5 py-1 bg-black/80 border border-white/20 backdrop-blur-md rounded-xs text-[10px] font-mono text-white tracking-widest flex items-center gap-1.5">
                <ZoomIn className="h-3 w-3 text-white" />
                {isZoomed ? "ZOOM 2.0X ACTIVE" : "CLICK TO ZOOM WEAVE"}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] font-mono uppercase text-[#cbd5e1]">
              <span>ORIGIN: {selectedFabric.origin}</span>
              <span className="text-white font-bold">{selectedFabric.weight}</span>
            </div>
          </div>

          {/* Technical Specs Breakdown */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8e8e99] block mb-1">
                MATERIAL DOSSIER
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                {selectedFabric.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed mt-2 font-sans">
                {selectedFabric.description}
              </p>
            </div>

            {/* Specs Table */}
            <div className="space-y-3 pt-2 border-t border-[#1f1f26]">
              {selectedFabric.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#18181e]"
                >
                  <span className="font-mono text-[#71717a] uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="font-mono font-medium text-white text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
