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
    title: "MONOLITH DRAPE",
    subtitle: "520 GSM Boxy Hoodie + Japanese Raw Wide Denim",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
    garments: ["Heavyweight Boxy Hoodie", "Raw Distressed Wide-Leg Denim", "Brutalist Chelsea Boot"],
    link: "/shop?collection=drop-01",
  },
  {
    id: "look-02",
    lookNumber: "LOOK 02",
    title: "TACTICAL NOCTURNE",
    subtitle: "Reverse-Seam Zip Hoodie + Overdyed Multi-Pocket Cargos",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85",
    garments: ["Deconstructed Zip Hoodie", "Tactical Cargo Pant", "Vibram Trail Runner"],
    link: "/shop?collection=tactical-atelier",
  },
  {
    id: "look-03",
    lookNumber: "LOOK 03",
    title: "CHROME WORKWEAR",
    subtitle: "Raw Denim Trucker + Rectangular Chrome Shades",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=85",
    garments: ["Raw Selvedge Denim Trucker", "Rectangular Chrome Sunglasses", "Baggy Flared Denim"],
    link: "/shop?collection=drop-01",
  },
  {
    id: "look-04",
    lookNumber: "LOOK 04",
    title: "WEATHERPROOF MAC",
    subtitle: "3L Technical Shell + Wide Pleated Chinos",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    garments: ["Tactical Weatherproof Windbreaker", "Double-Pleated Wide Chino", "Square-Toe Derby"],
    link: "/shop?collection=tactical-atelier",
  },
  {
    id: "look-05",
    lookNumber: "LOOK 05",
    title: "MINIMALIST CORE",
    subtitle: "Combed Ribbed Crewneck + Distressed Cashmere Beanie",
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
    <section className="py-24 bg-[#09090b] relative overflow-hidden border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="metallic">EDITORIAL ARCHIVE</Badge>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a]">
                SPRING / SUMMER 2026
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              STREETWEAR <span className="metallic-text">LOOKBOOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] max-w-lg leading-relaxed">
              Curated proportions and tonal layering straight from the London & Tokyo runway presentations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="h-10 w-10 rounded-xs bg-[#121216] border border-[#272732] hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll lookbook left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-xs bg-[#121216] border border-[#272732] hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
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
              className="group relative shrink-0 w-[300px] sm:w-[380px] h-[520px] sm:h-[580px] bg-[#101014] border border-[#222228] hover:border-[#40404e] rounded-xs overflow-hidden snap-start transition-all duration-500 flex flex-col justify-between p-6 lustre-card"
            >
              {/* Model Photography with smooth scale effect */}
              <Image
                src={look.image}
                alt={look.title}
                fill
                sizes="(max-width: 640px) 300px, 380px"
                className="object-cover object-top filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrims */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/30" />

              {/* Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-black/75 border border-white/20 backdrop-blur-md rounded-xs text-[10px] font-mono uppercase tracking-widest text-white">
                  {look.lookNumber}
                </span>
                <Link
                  href={look.link}
                  className="h-9 w-9 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center backdrop-blur-md transition-all duration-300"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Bottom Garment Breakdown */}
              <div className="relative z-10 space-y-3">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                    {look.title}
                  </h3>
                  <p className="text-xs text-[#d1d5db] font-sans mt-0.5 opacity-90">
                    {look.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/15 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-[#9ca3af] tracking-wider">
                    FEATURED SILHOUETTES:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {look.garments.map((g, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-xs text-white backdrop-blur-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
