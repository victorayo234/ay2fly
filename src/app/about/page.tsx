import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Compass, Scissors, Layers, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Atelier & Sourcing | ay2fly",
  description:
    "Explore the architectural design philosophy, heavyweight yarn sourcing, and Japanese selvedge denim behind ay2fly.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <Badge variant="metallic">ATELIER ARCHIVES</Badge>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
            THE ANATOMY OF <br />
            <span className="metallic-text">AY2FLY</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
            Founded with a singular commitment: eliminate superfluous graphics, focus purely on garment structure, silhouette drape, and unyielding fabric durability.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-xs overflow-hidden border border-[#272732] shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85"
            alt="ay2fly pattern cutting atelier"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono uppercase text-[#cbd5e1]">
            <span>PATTERN LAB · LONDON</span>
            <span>EDITION 2026</span>
          </div>
        </div>

        {/* The 3 Core Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#0f0f13] border border-[#202028] rounded-xs space-y-4">
            <div className="h-10 w-10 bg-[#16161d] rounded-xs flex items-center justify-center text-white border border-[#272730]">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold uppercase text-white tracking-wide">
              Heavy Gauge Knits
            </h3>
            <p className="text-xs text-[#8e8e99] leading-relaxed">
              We exclusively spin combed organic cotton into 450 GSM to 520 GSM loopback French terry. The resulting fabric holds an architectural shape that never clings or wrinkles.
            </p>
          </div>

          <div className="p-6 bg-[#0f0f13] border border-[#202028] rounded-xs space-y-4">
            <div className="h-10 w-10 bg-[#16161d] rounded-xs flex items-center justify-center text-white border border-[#272730]">
              <Scissors className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold uppercase text-white tracking-wide">
              Kurabo Raw Selvedge
            </h3>
            <p className="text-xs text-[#8e8e99] leading-relaxed">
              Woven on vintage shuttle looms in Okayama, Japan. 14.5 oz unwashed indigo denim that develops bespoke fades, whiskering, and honeycomb creases unique to the wearer.
            </p>
          </div>

          <div className="p-6 bg-[#0f0f13] border border-[#202028] rounded-xs space-y-4">
            <div className="h-10 w-10 bg-[#16161d] rounded-xs flex items-center justify-center text-white border border-[#272730]">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold uppercase text-white tracking-wide">
              Anatomical Ergonomics
            </h3>
            <p className="text-xs text-[#8e8e99] leading-relaxed">
              Engineered with dropped shoulder seams, pitched sleeves, and curved hems calibrated to balance modern oversized streetwear proportions without sacrificing posture.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 bg-gradient-to-r from-[#141418] via-[#101014] to-[#141418] border border-white/20 rounded-xs text-center space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
            EXPERIENCE DROP 01
          </h2>
          <p className="text-xs sm:text-sm text-[#9ca3af] max-w-lg mx-auto leading-relaxed">
            Discover the initial release of raw essentials. Limited pieces available for immediate dispatch.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Explore The Shop <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
