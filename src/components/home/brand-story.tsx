import React from "react";
import Link from "next/link";
import { ShieldCheck, Flame, Layers, Compass, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BrandStory() {
  const pillars = [
    {
      icon: Layers,
      title: "Heavyweight Knits",
      desc: "Custom dense weaves from 450 to 520 GSM loopback cotton that preserve structural volume naturally and hold shape wash after wash.",
    },
    {
      icon: Compass,
      title: "Built for Movement",
      desc: "Comfortable drop-shoulder silhouettes, roomier chest allowances, and relaxed rises tailored for effortless daily city movement.",
    },
    {
      icon: Flame,
      title: "Authentic Drops",
      desc: "Curated in small, intentional release batches. No mass factory overstock — each garment is produced with genuine pride.",
    },
    {
      icon: Heart,
      title: "Lagos Street Culture",
      desc: "Infused with confident Nigerian youth energy, unapologetic bold styling, and a clean global streetwear sensibility.",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#f8fafc] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Mission Statement */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="vibrant">THE AY2FLY MANIFESTO</Badge>

          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            BOLD CLOTHES. <br />
            <span className="brand-gradient-text">REAL CULTURE.</span> <br />
            ZERO COMPROMISE.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto">
            ay2fly was founded to champion high-energy Gen-Z streetwear. We make heavyweight, minimalist garments that stand out through superior drape, tactile fabric weight, and effortless confidence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-7 bg-white border border-slate-200/80 rounded-3xl transition-all duration-300 space-y-3 shadow-xs hover:shadow-md hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-2xl bg-orange-50 text-[#ff5500] flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* About CTA */}
        <div className="mt-14 text-center">
          <Link href="/about">
            <Button variant="secondary" size="lg" className="rounded-2xl shadow-xs">
              Read Our Full Story <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
