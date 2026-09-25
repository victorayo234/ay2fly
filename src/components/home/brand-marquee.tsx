"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function BrandMarquee() {
  const items = [
    "DROP 01: RAW MONOLITH",
    "520 GSM LOOPBACK COTTON",
    "15 OZ JAPANESE KURABO SELVEDGE",
    "ARCHITECTURAL BOX SILHOUETTES",
    "ZERO COMPROMISE WEAVES",
    "NFC EMBEDDED DIGITAL PASSPORTS",
    "DESIGNED IN LONDON & TOKYO",
    "LIMITED EDITION PRODUCTION",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#09090b] via-[#141419] to-[#09090b] border-y border-[#202028] py-4 select-none">
      {/* Edge gradient fades for lustrous glow */}
      <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center mx-6 sm:mx-8 gap-6 sm:gap-8">
            <span className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-[0.25em] text-[#d1d5db] hover:text-white transition-colors">
              {item}
            </span>
            <span className="text-white/40 text-xs">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
