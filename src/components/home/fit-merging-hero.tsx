"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Pause, Sparkles, CheckCircle2, ChevronRight, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/database";

interface FitData {
  id: "fitted" | "regular" | "relaxed" | "oversized";
  label: string;
  tagline: string;
  shoulderDrape: string;
  chestRoom: string;
  lengthDrape: string;
  description: string;
  stylingTip: string;
  modelImage: string;
  accentColor: string;
}

const FITS: FitData[] = [
  {
    id: "fitted",
    label: "Fitted",
    tagline: "Athletic Contour",
    shoulderDrape: "True to shoulder (set-in seam)",
    chestRoom: "Close to chest & arms",
    lengthDrape: "Hits cleanly at the waistline",
    description: "Tailored to follow your natural silhouette. Ideal for base layers, athletic styling, or wearing under heavier jackets.",
    stylingTip: "Pair with relaxed parachute pants or wide pleated chinos for proportional contrast.",
    modelImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#2563eb",
  },
  {
    id: "regular",
    label: "Regular",
    tagline: "Everyday Street Balance",
    shoulderDrape: "Natural shoulder with subtle slouch",
    chestRoom: "Comfortable room through the body",
    lengthDrape: "Standard streetwear drape below belt",
    description: "The daily go-to cut. Sits clean without clinging, giving you easy movement and all-day comfort.",
    stylingTip: "Looks effortless with straight-leg selvedge denim and classic derbies or sneakers.",
    modelImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#0f172a",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    tagline: "Drop-Shoulder Slouch",
    shoulderDrape: "Lowered drop-shoulder seam",
    chestRoom: "Generous chest and sleeve room",
    lengthDrape: "Fluid drape that stacks over waist",
    description: "Intentional ease and casual street drape. Wider sleeves and dropped shoulders designed for effortless streetwear layering.",
    stylingTip: "Layer a waffle long-sleeve tee underneath and pair with loose cargo pants.",
    modelImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#f59e0b",
  },
  {
    id: "oversized",
    label: "Oversized",
    tagline: "Signature Boxy Silhouette",
    shoulderDrape: "Exaggerated drop shoulder",
    chestRoom: "Full boxy drape with deep armholes",
    lengthDrape: "Boxy, slightly cropped modern hem",
    description: "Our signature ay2fly silhouette. Built from heavyweight cotton that holds its structure and volume naturally without collapsing.",
    stylingTip: "Style with wide raw denim or heavy sweatpants stacked over chunky boots.",
    modelImage: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#ff5500",
  },
];

interface FitMergingHeroProps {
  userName?: string;
  userRole?: UserRole;
}

export function FitMergingHero({ userName = "Friend", userRole }: FitMergingHeroProps) {
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
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, prefersReducedMotion]);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 bg-[#fafaf9] overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Top Member Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-full bg-[#ff5500] text-white flex items-center justify-center text-sm font-bold font-display uppercase shadow-sm">
              {userName?.charAt(0) || "U"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-black uppercase text-slate-900">
                  Welcome back, {userName}
                </span>
                <Badge variant="vibrant" className="text-[10px] py-0 px-2">
                  MEMBER
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Explore how each silhouette cut drapes and fits before shopping.
              </p>
            </div>
          </div>

          {/* Autoplay Controls */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-display font-bold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-[#ff5500]" />
                <span>Auto-Cycle: Active</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-slate-400" />
                <span>Auto-Cycle: Paused</span>
              </>
            )}
          </button>
        </div>

        {/* Main Grid: Interactive Fit Controller + Full Color Photo Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Fit Controller & Plain Human Sizing Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-[#ff5500] tracking-wider block">
                Interactive Fit & Silhouette Guide
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
                FIND YOUR <br />
                <span className="brand-gradient-text">PERFECT DRAPE</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                Whether you prefer clean athletic lines or our signature boxy slouch, explore our four distinct cuts to see how they look and feel on real bodies.
              </p>
            </div>

            {/* Fit Tabs Selector */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 flex justify-between">
                <span>Select Cut</span>
                <span>Cut 0{activeIdx + 1} / 04</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FITS.map((fit, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={fit.id}
                      onClick={() => {
                        setActiveIdx(idx);
                        setIsPlaying(false);
                      }}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white border-[#ff5500] shadow-[0_8px_20px_-4px_rgba(255,85,0,0.25)] text-slate-900"
                          : "bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-xs"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeFitPill"
                          className="absolute inset-0 border-2 border-[#ff5500] rounded-2xl pointer-events-none"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <div className="text-xs font-display font-bold uppercase tracking-wider">
                        {fit.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {fit.tagline}
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
              transition={{ duration: 0.3 }}
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-display text-lg font-black uppercase text-slate-900">
                    {currentFit.label} Fit
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#ff5500]">
                    {currentFit.tagline}
                  </span>
                </div>

                <Link href={`/shop?fit=${currentFit.id}`}>
                  <Button variant="secondary" size="sm" className="rounded-xl text-xs">
                    Shop {currentFit.label} Cut <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentFit.description}
              </p>

              {/* Sizing Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="font-mono text-[10px] uppercase font-bold text-slate-400">
                    Shoulders
                  </div>
                  <div className="font-bold text-slate-800 text-[11px] mt-0.5">
                    {currentFit.shoulderDrape}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="font-mono text-[10px] uppercase font-bold text-slate-400">
                    Chest & Torso
                  </div>
                  <div className="font-bold text-slate-800 text-[11px] mt-0.5">
                    {currentFit.chestRoom}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="font-mono text-[10px] uppercase font-bold text-slate-400">
                    Length Drape
                  </div>
                  <div className="font-bold text-slate-800 text-[11px] mt-0.5">
                    {currentFit.lengthDrape}
                  </div>
                </div>
              </div>

              {/* Styling Tip */}
              <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-100 text-xs text-orange-950 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#ff5500] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-display uppercase tracking-wider text-[11px] text-[#ff5500]">
                    Styling Tip:
                  </strong>{" "}
                  {currentFit.stylingTip}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Full Color High-Resolution Model Photography (NO grayscale!) */}
          <div className="lg:col-span-6 relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] border border-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFit.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentFit.modelImage}
                  alt={`${currentFit.label} fit demonstration on model`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top"
                />

                {/* Gradient overlays for bottom contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating Bottom Fit Info Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#ff5500] tracking-wider font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500] animate-pulse" />
                      SILHOUETTE: {currentFit.label.toUpperCase()}
                    </div>
                    <div className="text-xs font-display font-bold uppercase text-slate-900 mt-0.5">
                      Model is 6&apos;1&quot; (185 cm) wearing Size L
                    </div>
                  </div>

                  <Link href={`/shop?fit=${currentFit.id}`}>
                    <Button variant="primary" size="sm" className="rounded-xl shadow-xs">
                      Shop Fit
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
