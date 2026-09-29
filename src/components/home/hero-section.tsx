"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame, CheckCircle, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { FitMergingHero } from "@/components/home/fit-merging-hero";

export function HeroSection() {
  const { user } = useAuth();
  const [videoError, setVideoError] = useState(false);

  // If user is authenticated, elevate to the interactive Fit Guide Hero
  if (user) {
    return <FitMergingHero userName={user.full_name} userRole={user.role} />;
  }

  // Logged-out visitors see the high-impact, bright & bold streetwear campaign hero
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 bg-[#fafaf9]">
      {/* Background Graphic Accents & Colorful Street Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-10 right-1/4 w-[350px] h-[350px] bg-amber-300/20 rounded-full blur-[80px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Human Copy & Prominent Logo */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Prominent Logo & Drop Badge */}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl bg-white p-2 shadow-sm border border-slate-200/80 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="ay2fly emblem"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <Badge variant="vibrant" className="py-1 px-3.5">
                <Flame className="h-3.5 w-3.5 mr-1" />
                FRESH DROP 01 // LIVE NOW
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 leading-[0.95]">
              BOLD STREETWEAR. <br />
              <span className="brand-gradient-text">BUILT TO MOVE.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-lg">
              Heavyweight boxy hoodies, raw baggy denim, and streetwear staples engineered with effortless drape, authentic youth culture, and zero compromise.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="rounded-2xl group shadow-lg">
                  Shop Fresh Drops
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="secondary" size="lg" className="rounded-2xl">
                  Explore Collections
                </Button>
              </Link>
            </div>

            {/* Street Guarantees Pill Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-display font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#ff5500]" />
                <span>Heavyweight 100% Cotton Knits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#ff5500]" />
                <span>Free Express Shipping over $150</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Large High-Resolution Media Card with Real Streetwear Footage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(15,23,42,0.2)] border border-slate-200/90 group"
          >
            {/* Streetwear Video with Seamless Poster Fallback */}
            {!videoError ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
                poster="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85"
                className="w-full h-full object-cover object-center"
              >
                <source
                  src="https://cdn.coverr.co/videos/coverr-skater-wearing-a-hoodie-and-jeans-5544/1080p.mp4"
                  type="video/mp4"
                />
              </video>
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85"
                alt="ay2fly Streetwear Drop 01 Hoodie and Denim"
                fill
                priority
                className="object-cover object-top"
              />
            )}

            {/* Gradient Overlays for Readability and Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />

            {/* Recurring Brand Watermark in Corner */}
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
              <div className="relative h-4 w-4">
                <Image
                  src="/images/logo.png"
                  alt="ay2fly"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-[10px] font-black uppercase tracking-wider text-slate-900">
                ay2fly original
              </span>
            </div>

            {/* Floating Tag Card on the Garment */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-10 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80"
                    alt="Heavyweight Boxy Hoodie"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-display font-bold uppercase text-slate-900">
                    Heavyweight Boxy Hoodie
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Signature Drop · 520 GSM Loopback Cotton
                  </div>
                </div>
              </div>

              <Link href="/products/heavyweight-boxy-hoodie">
                <Button variant="primary" size="sm" className="rounded-xl shadow-xs">
                  View Piece · $145
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
