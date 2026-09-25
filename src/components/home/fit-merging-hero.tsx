"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Pause, Sparkles, Sliders, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/database";

interface FitData {
  id: "fitted" | "regular" | "relaxed" | "oversized";
  label: string;
  sublabel: string;
  scale: number;
  widthPercent: number;
  shoulderDrop: string;
  chestCircumference: string;
  hemSweep: string;
  gsm: number;
  description: string;
  modelImage: string;
  accentColor: string;
  svgPath: string;
}

const FITS: FitData[] = [
  {
    id: "fitted",
    label: "Fitted",
    sublabel: "Precision Form Contour",
    scale: 0.94,
    widthPercent: 78,
    shoulderDrop: "0 cm (Set-In)",
    chestCircumference: "104 cm",
    hemSweep: "98 cm",
    gsm: 380,
    description: "Close-to-body tailored ergonomics. High cut armholes with tapered sleeves designed for athletic precision and base-layer warmth.",
    modelImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#94a3b8",
    svgPath: "M 100 40 L 150 75 L 142 280 L 58 280 L 50 75 Z",
  },
  {
    id: "regular",
    label: "Regular",
    sublabel: "Balanced Street Drape",
    scale: 1.0,
    widthPercent: 86,
    shoulderDrop: "2.5 cm (Subtle Slouch)",
    chestCircumference: "114 cm",
    hemSweep: "108 cm",
    gsm: 450,
    description: "The daily metropolitan standard. Generous chest allowance with natural shoulder drape, built to sit cleanly without clinging.",
    modelImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#cbd5e1",
    svgPath: "M 96 36 L 160 80 L 148 290 L 52 290 L 40 80 Z",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    sublabel: "Drop-Shoulder Utility",
    scale: 1.07,
    widthPercent: 94,
    shoulderDrop: "5.5 cm (Dropped)",
    chestCircumference: "124 cm",
    hemSweep: "118 cm",
    gsm: 480,
    description: "Intentional slouch with lowered shoulder line and fluid arm volume. Designed for effortless streetwear stacking.",
    modelImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#e2e8f0",
    svgPath: "M 90 32 L 172 88 L 156 300 L 44 300 L 28 88 Z",
  },
  {
    id: "oversized",
    label: "Oversized",
    sublabel: "Architectural Monolith (Signature)",
    scale: 1.15,
    widthPercent: 100,
    shoulderDrop: "8.5 cm (Exaggerated)",
    chestCircumference: "136 cm",
    hemSweep: "128 cm",
    gsm: 520,
    description: "Our signature boxy silhouette. Custom heavyweight 520 GSM loopback cotton holding architectural volume without collapsing.",
    modelImage: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#ffffff",
    svgPath: "M 85 28 L 185 96 L 164 315 L 36 315 L 15 96 Z",
  },
];

interface FitMergingHeroProps {
  userName?: string;
  userRole?: UserRole;
}

export function FitMergingHero({ userName = "Atelier Member", userRole }: FitMergingHeroProps) {
  const [activeIdx, setActiveIdx] = useState(3); // Start on signature "oversized"
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentFit = FITS[activeIdx];

  // Auto-cycle through fits when playing
  useEffect(() => {
    if (prefersReducedMotion || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FITS.length);
    }, 4200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, prefersReducedMotion]);

  return (
    <section className="relative min-h-[94vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 bg-[#09090b]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.15, 0.28, 0.15],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.22, 0.1],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-zinc-400/10 rounded-full blur-[140px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#09090b_85%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top welcome status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#202028]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="text-xs font-mono uppercase tracking-widest text-[#d1d5db]">
              MEMBER SESSION: <span className="text-white font-bold">{userName}</span>
              {userRole === "admin" && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-white text-black font-bold rounded-xs">
                  ADMIN
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="metallic" className="py-1 px-3">
              <Sparkles className="h-3 w-3" />
              PROPORTION LAB ACTIVE
            </Badge>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#141418] hover:bg-[#1f1f26] border border-[#272732] text-xs font-mono uppercase text-[#a1a1aa] hover:text-white rounded-xs transition-colors cursor-pointer"
              title={isPlaying ? "Pause auto-transform" : "Play auto-transform"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3 text-emerald-400" />
                  <span>CYCLE: ON</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-[#71717a]" />
                  <span>CYCLE: PAUSED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 sm:pt-12">
          {/* Left Column: Editorial context & Fit Controller */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8e8e99] block">
                ATELIER PROPORTION ENGINE
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-[0.92]">
                FIT <br />
                <span className="metallic-text">TRANSFORMATION</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed max-w-lg">
                Our silhouettes are sculpted to transform between tailored precision and architectural volume. Toggle or scrub through each cut to witness how drape, armhole depth, and fabric weight dynamically evolve.
              </p>
            </div>

            {/* Fit Selector Tabs with active glowing state */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#71717a] flex items-center justify-between">
                <span>SELECT SILHOUETTE CUT</span>
                <span>STEP 0{activeIdx + 1} / 04</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FITS.map((fit, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={fit.id}
                      onClick={() => {
                        setActiveIdx(idx);
                        setIsPlaying(false);
                      }}
                      className={`relative p-3 rounded-xs border text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white/10 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                          : "bg-[#101014] border-[#222228] text-[#8e8e99] hover:border-[#383844] hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeFitGlow"
                          className="absolute inset-0 border-2 border-white rounded-xs pointer-events-none"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <div className="text-xs font-display font-bold uppercase tracking-wider">
                        {fit.label}
                      </div>
                      <div className="text-[10px] font-mono text-[#a1a1aa] mt-0.5">
                        {fit.gsm} GSM
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Fit Details Card */}
            <motion.div
              key={currentFit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="p-5 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold uppercase text-white">
                    {currentFit.label} Cut — {currentFit.sublabel}
                  </h3>
                  <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                    {currentFit.description}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1d1d24]">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#71717a]">FABRIC DENSITY</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{currentFit.gsm} GSM</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#71717a]">CHEST MEASURE</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{currentFit.chestCircumference}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#71717a]">SHOULDER DROP</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{currentFit.shoulderDrop}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#71717a]">HEM SWEEP</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{currentFit.hemSweep}</div>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={`/shop?fit=${currentFit.id}`}>
                <Button variant="primary" size="lg" className="group">
                  Shop {currentFit.label} Pieces
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="secondary" size="lg">
                  Browse Full Collection
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Physical Merging & Transformation Stage */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] bg-black rounded-xs overflow-hidden border border-[#272732] shadow-2xl flex items-center justify-center">
              {/* Silhouette Visual Stages with smooth Motion crossfade and scale morphing */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentFit.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    scale: prefersReducedMotion ? 1 : currentFit.scale,
                    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.04,
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={currentFit.modelImage}
                    alt={`${currentFit.label} fit demonstration on male model`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top filter grayscale contrast-110"
                  />
                  {/* Cinematic gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
                </motion.div>
              </AnimatePresence>

              {/* Architectural Holographic Measuring Grid (Laser overlay) */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
                {/* Top Telemetry */}
                <div className="flex items-center justify-between">
                  <div className="px-2.5 py-1 bg-black/75 border border-white/20 backdrop-blur-md rounded-xs">
                    <span className="text-[10px] font-mono uppercase text-[#e2e8f0] tracking-widest flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SILHOUETTE: {currentFit.id.toUpperCase()}
                    </span>
                  </div>

                  <div className="px-2.5 py-1 bg-black/75 border border-white/20 backdrop-blur-md rounded-xs">
                    <span className="text-[10px] font-mono uppercase text-[#9ca3af] tracking-widest">
                      DENSITY: {currentFit.gsm} GSM
                    </span>
                  </div>
                </div>

                {/* Center Dynamic Architectural Blueprint Vectors */}
                <div className="relative w-full h-48 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 320"
                    className="w-40 h-64 stroke-white/40 fill-white/5 transition-all duration-700 ease-out"
                    style={{
                      transform: `scale(${currentFit.scale})`,
                    }}
                  >
                    <polygon
                      points={
                        currentFit.id === "fitted"
                          ? "100,40 148,75 142,280 58,280 52,75"
                          : currentFit.id === "regular"
                          ? "100,36 160,80 150,290 50,290 40,80"
                          : currentFit.id === "relaxed"
                          ? "100,32 174,88 158,300 42,300 26,88"
                          : "100,28 186,96 166,315 34,315 14,96"
                      }
                      className="stroke-[1.5] transition-all duration-700 ease-out"
                    />
                    {/* Measurement crosshairs */}
                    <line x1="20" y1="90" x2="180" y2="90" strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth="0.8" />
                    <line x1="40" y1="180" x2="160" y2="180" strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth="0.8" />
                    <line x1="30" y1="300" x2="170" y2="300" strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth="0.8" />
                  </svg>

                  {/* Dynamic Dimension Badges */}
                  <motion.div
                    key={`badge-chest-${currentFit.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-12 -left-2 bg-black/85 border border-white/30 px-2 py-0.5 rounded-xs text-[9px] font-mono text-white tracking-widest"
                  >
                    SHOULDER: {currentFit.shoulderDrop}
                  </motion.div>

                  <motion.div
                    key={`badge-hem-${currentFit.id}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute bottom-10 -right-2 bg-black/85 border border-white/30 px-2 py-0.5 rounded-xs text-[9px] font-mono text-white tracking-widest"
                  >
                    CHEST: {currentFit.chestCircumference}
                  </motion.div>
                </div>

                {/* Bottom Model Spec Callout */}
                <div className="bg-black/80 border border-white/10 backdrop-blur-md p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#a1a1aa]">
                    <span>ON-MODEL SPEC: 186CM / 74KG</span>
                    <span className="text-white font-bold">{currentFit.label.toUpperCase()} FIT</span>
                  </div>
                  <div className="text-[11px] text-[#cbd5e1]">
                    Fabric weight: <span className="text-white font-mono">{currentFit.gsm} GSM</span> · Curated for layered street proportions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
