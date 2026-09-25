import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Flame, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrandStory() {
  const pillars = [
    {
      icon: Layers,
      title: "STRUCTURAL FABRICATIONS",
      desc: "Custom high-density weaves from 450 to 520 GSM loopback cotton that preserve sharp architectural volume without collapsing.",
    },
    {
      icon: Cpu,
      title: "TACTICAL HARDWARE",
      desc: "FIDLOCK magnetic buckles, YKK Aquaguard taped seams, and laser-engraved 316L solid silver-finished metal closures.",
    },
    {
      icon: ShieldCheck,
      title: "CRYPTOGRAPHIC NFC CHIP",
      desc: "Every garment hem is embedded with an untamperable digital passport verifying authenticity, drop edition, and provenance.",
    },
    {
      icon: Flame,
      title: "LIMITED PRODUCTION DROPS",
      desc: "Manufactured in small controlled quantities. No mass replenishment. Built for permanence and long-term personal rotation.",
    },
  ];

  return (
    <section className="py-24 bg-[#09090b] relative overflow-hidden border-t border-[#18181f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Mission Statement */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-block border border-white/20 px-3 py-1 rounded-xs bg-white/5 backdrop-blur-xs">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#d1d5db]">
              THE AY2FLY MANIFESTO
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            SIMPLE PRODUCTS. <br />
            <span className="metallic-text">STRONG STYLING.</span> <br />
            EXCEPTIONAL EXPERIENCE.
          </h2>

          <p className="text-sm sm:text-base text-[#9ca3af] font-sans leading-relaxed max-w-2xl mx-auto">
            ay2fly was conceived to eliminate the noise of disposable fast fashion. We create heavyweight, minimalist garments rooted in subcultural streetwear codes, engineered with architectural restraint.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-6 bg-[#0e0e12] border border-[#202028] hover:border-[#383844] rounded-xs transition-colors space-y-3"
              >
                <div className="h-10 w-10 rounded-xs bg-[#16161c] border border-[#272732] flex items-center justify-center text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#8e8e99] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Atelier CTA banner */}
        <div className="mt-16 text-center">
          <Link href="/about">
            <Button variant="secondary" size="md">
              Read Our Sourcing & Design Philosophy
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
