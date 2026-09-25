"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { FitMergingHero } from "@/components/home/fit-merging-hero";

export function HeroSection() {
  const { user } = useAuth();
  const [videoError, setVideoError] = useState(false);

  // If user is authenticated, elevate to the signature Fit Merging Transformation Hero
  if (user) {
    return <FitMergingHero userName={user.full_name} userRole={user.role} />;
  }

  // Logged-out visitors see the high-impact campaign hero with video/poster fallback
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-end justify-start overflow-hidden pb-16 sm:pb-24 pt-32 bg-[#09090b]">
      {/* Background Media Layer: Looping video with graceful poster fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            poster="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=85"
            className="w-full h-full object-cover object-center filter contrast-110 brightness-90"
          >
            <source
              src="https://vjs.zencdn.net/v/oceans.mp4"
              type="video/mp4"
            />
          </video>
        ) : null}

        {/* Fallback image (if video error or on mobile) */}
        <Image
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=85"
          alt="ay2fly Drop 01 campaign editorial with male model"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-top filter contrast-105 transition-opacity duration-1000 ${
            !videoError ? "opacity-30" : "opacity-100"
          }`}
        />

        {/* Layered cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/90 via-[#09090b]/45 to-transparent" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-6"
        >
          {/* Metadata pill */}
          <div className="flex items-center gap-3">
            <Badge variant="metallic" className="py-1 px-3">
              <Sparkles className="h-3 w-3 text-white" />
              GLOBAL RELEASE 01
            </Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-[#cbd5e1] hidden sm:inline-block">
              520 GSM · RAW JAPANESE SELVEDGE · ARCHITECTURAL CUTS
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.92]">
            RAW <br />
            <span className="metallic-text">MONOLITH</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#d1d5db] font-sans leading-relaxed max-w-lg">
            Heavyweight boxy silhouettes engineered with architectural restraint. Constructed from unwashed Japanese denim, 520 GSM loopback cotton, and solid silver hardware.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="group">
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="flex items-center gap-2">
                <LogIn className="h-4 w-4 text-[#9ca3af]" />
                Sign In to Unlock Proportions
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom ticker bar */}
      <div className="absolute bottom-0 inset-x-0 h-10 border-t border-white/10 bg-black/50 backdrop-blur-md hidden md:flex items-center justify-between px-8 text-[11px] font-mono uppercase text-[#a1a1aa] tracking-widest">
        <div>SPRING / SUMMER 2026</div>
        <div>COMPLIMENTARY EXPRESS DELIVERY OVER $150</div>
        <div>AUTHENTICATED NFC EMBEDDED HEMS</div>
      </div>
    </section>
  );
}
