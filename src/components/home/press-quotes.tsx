"use client";

import React from "react";
import { Quote } from "lucide-react";

interface PressItem {
  publication: string;
  quote: string;
  sourceCity: string;
}

const PRESS: PressItem[] = [
  {
    publication: "HYPEBEAST",
    quote: "ay2fly redefines heavyweight streetwear with uncompromising 520 GSM loopback cotton and brutalist boxy tailoring.",
    sourceCity: "London / Tokyo",
  },
  {
    publication: "GQ STYLE",
    quote: "The rare Gen-Z label that prioritizes architectural construction, raw Japanese selvedge, and tangible permanence over disposable drops.",
    sourceCity: "New York",
  },
  {
    publication: "HIGHSNOBIETY",
    quote: "A masterclass in proportions. The fit transformation engine sets a new standard for modern digital fashion atelier experiences.",
    sourceCity: "Berlin",
  },
];

export function PressQuotes() {
  return (
    <section className="py-20 bg-[#070709] border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
            EDITORIAL RECOGNITION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRESS.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#0c0c10] border border-[#202028] hover:border-[#383842] rounded-xs transition-all duration-300 flex flex-col justify-between space-y-6 lustre-card"
            >
              <div className="space-y-4">
                <Quote className="h-6 w-6 text-white/30" />
                <p className="font-sans text-sm text-[#d1d5db] leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1a1a22] flex items-center justify-between text-xs">
                <span className="font-display font-black tracking-widest text-white">
                  {item.publication}
                </span>
                <span className="font-mono text-[10px] text-[#71717a] uppercase">
                  {item.sourceCity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
