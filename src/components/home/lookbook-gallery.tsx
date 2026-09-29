"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LookbookItem {
  id: string;
  lookNumber: string;
  title: string;
  subtitle: string;
  image: string;
  garments: string[];
  link: string;
}

const LOOKS: LookbookItem[] = [
  {
    id: "look-01",
    lookNumber: "LOOK 01",
    title: "SIGNATURE HOODIE & DENIM",
    subtitle: "Heavyweight Boxy Hoodie + Baggy Selvedge Denim",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
    garments: ["Heavyweight Boxy Hoodie", "Raw Distressed Wide-Leg Denim", "Brutalist Chelsea Boot"],
    link: "/shop?collection=drop-01",
  },
  {
    id: "look-02",
    lookNumber: "LOOK 02",
    title: "TACTICAL STREET UTILITY",
    subtitle: "Reverse-Seam Zip Hoodie + Loose Multi-Pocket Cargos",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85",
    garments: ["Deconstructed Zip Hoodie", "Tactical Cargo Pant", "Vibram Trail Runner"],
    link: "/shop?collection=tactical-atelier",
  },
  {
    id: "look-03",
    lookNumber: "LOOK 03",
    title: "RAW DENIM TRUCKER",
    subtitle: "Japanese Selvedge Jacket + Baggy Street Chinos",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=85",
    garments: ["Raw Selvedge Denim Trucker", "Rectangular Chrome Sunglasses", "Baggy Flared Denim"],
    link: "/shop?collection=drop-01",
  },
  {
    id: "look-04",
    lookNumber: "LOOK 04",
    title: "WEATHERPROOF STREETWEAR",
    subtitle: "Technical Windbreaker + Wide Pleated Chinos",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    garments: ["Tactical Weatherproof Windbreaker", "Double-Pleated Wide Chino", "Square-Toe Derby"],
    link: "/shop?collection=tactical-atelier",
  },
  {
    id: "look-05",
    lookNumber: "LOOK 05",
    title: "MINIMAL CREW ESSENTIALS",
    subtitle: "Dense Ribbed Crewneck + Cashmere Beanie",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    garments: ["Heavy Ribbed Knit Crewneck", "Distressed Ribbed Cashmere Beanie", "Contoured Suede Slides"],
    link: "/shop?collection=midnight-core",
  },
];

export function LookbookGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="vibrant">EDITORIAL LOOKBOOK</Badge>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                SPRING / SUMMER 2026
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
              Streetwear Lookbook
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed">
              Curated proportions, layered styling, and everyday street fits styled by our creative team.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#ff5500] hover:text-white text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll lookbook left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#ff5500] hover:text-white text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll lookbook right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
        >
          {LOOKS.map((look) => (
            <div
              key={look.id}
              className="group relative shrink-0 w-[300px] sm:w-[380px] h-[500px] sm:h-[560px] bg-slate-100 rounded-3xl overflow-hidden snap-start transition-all duration-500 flex flex-col justify-between p-6 shadow-sm hover:shadow-xl border border-slate-200/80"
            >
              {/* Full Color Model Photography */}
              <Image
                src={look.image}
                alt={look.title}
                fill
                sizes="(max-width: 640px) 300px, 380px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/10" />

              {/* Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-mono font-bold uppercase text-slate-900 shadow-xs">
                  {look.lookNumber}
                </span>
                <div className="relative h-4 w-4">
                  <Image
                    src="/images/logo.png"
                    alt="ay2fly"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Bottom Garments Info */}
              <div className="relative z-10 space-y-3">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide leading-tight">
                    {look.title}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium mt-1">
                    {look.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {look.garments.map((g, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px] rounded-full font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <Link
                  href={look.link}
                  className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-display font-bold uppercase tracking-wider text-white hover:text-amber-200 transition-colors"
                >
                  <span>Shop This Look</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
