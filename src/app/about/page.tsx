import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Layers, Scissors, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | ay2fly Streetwear",
  description:
    "Born in Lagos, built for the world. Learn about ay2fly's commitment to heavyweight cotton, selvedge denim, and effortless streetwear silhouettes.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 w-full">
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <Badge variant="accent">OUR STORY</Badge>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-slate-900">
            Lagos Energy. <br />
            <span className="text-[#ff5500]">Global Streetwear.</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            ay2fly was founded with one clear ambition: create vibrant, heavyweight streetwear that feels incredible to wear, looks bold from every angle, and lasts for years.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85"
            alt="ay2fly garment design and craft"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono uppercase text-white font-bold tracking-wider">
            <span>LAGOS · LONDON · WORLDWIDE</span>
            <span>DROP 01 EDITION</span>
          </div>
        </div>

        {/* The 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff5500] border border-orange-200">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-slate-900 tracking-wide">
              Heavyweight Cotton
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We spin premium combed cotton into 450 to 520 GSM loopback French terry. The result is a substantial hoodie and sweatpant that never clings, wrinkles, or loses its shape.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200">
              <Scissors className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-slate-900 tracking-wide">
              Authentic Selvedge Denim
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Crafted on vintage shuttle looms from 14.5 oz unwashed indigo denim. Built to withstand daily city life while developing genuine personalized fades over time.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-200">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-slate-900 tracking-wide">
              Everyday Confidence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dropped shoulders, relaxed armholes, and balanced proportions. Our cuts are designed to feel comfortable the moment you slip them on and give you instant confidence.
            </p>
          </div>
        </div>

        {/* Mission Statement Banner */}
        <div className="p-8 sm:p-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-center space-y-6 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />
          <Badge variant="accent" className="bg-[#ff5500] text-white border-none">FRESH DROPS ONLY</Badge>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Ready to upgrade your streetwear rotation?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Every garment in our catalog is produced in strictly limited runs. Once a colorway sells out, it rarely returns.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="accent" size="lg" className="shadow-lg shadow-orange-500/25 active:scale-95">
                Explore The Shop <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
