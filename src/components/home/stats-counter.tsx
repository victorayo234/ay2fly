"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Truck, Sparkles, Box } from "lucide-react";

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: StatItem[] = [
  {
    id: "pieces",
    value: 850,
    suffix: "+",
    label: "ARCHITECTURAL PIECES SHIPPED",
    sublabel: "Across 42 countries worldwide",
  },
  {
    id: "gsm",
    value: 520,
    suffix: " GSM",
    label: "PEAK KNIT DENSITY",
    sublabel: "Custom unbrushed loopback cotton",
  },
  {
    id: "styles",
    value: 34,
    suffix: "",
    label: "AUTHORITATIVE STYLES",
    sublabel: "Strictly curated men's streetwear",
  },
  {
    id: "selvedge",
    value: 100,
    suffix: "%",
    label: "ZERO COMPROMISE WEAVES",
    sublabel: "No synthetic polyester blends",
  },
];

function CountingNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800; // ms
    const increment = value / (duration / 25);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display text-4xl sm:text-5xl font-black text-white">
      {count}
      <span className="metallic-text">{suffix}</span>
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#09090b] via-[#101015] to-[#09090b] border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              className="p-6 bg-[#0c0c10] border border-[#202028] hover:border-[#383842] rounded-xs transition-all duration-300 space-y-2 lustre-card"
            >
              <CountingNumber value={stat.value} suffix={stat.suffix} />
              <div className="text-xs font-display font-bold uppercase tracking-wider text-white">
                {stat.label}
              </div>
              <div className="text-[11px] font-mono text-[#8e8e99]">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
