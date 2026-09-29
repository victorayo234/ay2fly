"use client";

import React from "react";
import { Sparkles, Flame } from "lucide-react";

export function BrandMarquee() {
  const items = [
    "AY2FLY BOLD STREETWEAR",
    "LAGOS TO THE WORLD",
    "PREMIUM HEAVYWEIGHT HOODIES",
    "LIMITED EDITION DROPS",
    "BAGGY RAW DENIM",
    "BUILT FOR MOVEMENT",
    "FREE EXPRESS DELIVERY OVER $150",
    "CRAFTED FOR THE CULTURE",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#ff5500] text-white py-3.5 select-none shadow-md">
      <div className="flex w-max animate-marquee">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center mx-6 sm:mx-8 gap-6 sm:gap-8">
            <span className="text-xs sm:text-sm font-display font-black uppercase tracking-[0.25em] text-white flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-amber-200 fill-amber-200" />
              {item}
            </span>
            <span className="text-white/60 text-xs">★</span>
          </div>
        ))}
      </div>
    </div>
  );
}
