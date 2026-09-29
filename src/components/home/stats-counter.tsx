"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

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
    label: "Orders Delivered Worldwide",
    sublabel: "Across 42 countries with express courier",
  },
  {
    id: "cotton",
    value: 100,
    suffix: "%",
    label: "Premium Cotton Knits",
    sublabel: "Custom-spun heavyweight loopback fleece",
  },
  {
    id: "styles",
    value: 34,
    suffix: "",
    label: "Curated Streetwear Styles",
    sublabel: "Strictly authenticated wardrobe essentials",
  },
  {
    id: "rating",
    value: 99,
    suffix: "%",
    label: "Customer Satisfaction",
    sublabel: "Based on real verified buyer reviews",
  },
];

function CountingNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1600; // ms
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
    <span ref={ref} className="font-display text-4xl sm:text-5xl font-black text-slate-900">
      {count}
      <span className="text-[#ff5500]">{suffix}</span>
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              className="p-6 bg-[#fafaf9] border border-slate-200/80 rounded-3xl transition-all duration-300 space-y-1.5 shadow-xs hover:shadow-md hover:-translate-y-1"
            >
              <CountingNumber value={stat.value} suffix={stat.suffix} />
              <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-900 pt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500 font-sans leading-tight">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
