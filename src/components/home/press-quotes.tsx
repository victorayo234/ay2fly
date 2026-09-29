"use client";

import React from "react";
import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PressItem {
  publication: string;
  quote: string;
  sourceCity: string;
}

const PRESS: PressItem[] = [
  {
    publication: "HYPEBEAST",
    quote: "ay2fly brings unapologetic street energy and heavyweight luxury cotton straight to the global fashion stage.",
    sourceCity: "Lagos / London",
  },
  {
    publication: "GQ STYLE",
    quote: "The rare Gen-Z label that combines authentic youth culture, incredible drape, and premium craftsmanship without artificial hype.",
    sourceCity: "New York",
  },
  {
    publication: "HIGHSNOBIETY",
    quote: "Everyday streetwear elevated with obsessive care for silhouette, fit, and movement. An absolute wardrobe staple.",
    sourceCity: "Berlin",
  },
];

export function PressQuotes() {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <Badge variant="vibrant">VOICES & CULTURE</Badge>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
            What the Culture is Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESS.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#fafaf9] border border-slate-200/80 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md hover:-translate-y-1"
            >
              <div className="space-y-4">
                <Quote className="h-7 w-7 text-[#ff5500]/40" />
                <p className="font-sans text-sm text-slate-700 leading-relaxed italic font-medium">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-display font-black tracking-wider text-slate-900">
                  {item.publication}
                </span>
                <span className="font-mono text-[11px] text-slate-400 font-bold uppercase">
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
