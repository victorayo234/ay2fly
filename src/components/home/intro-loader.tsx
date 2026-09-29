"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hasSeenIntro = sessionStorage.getItem("ay2fly-intro-seen");

    if (!hasSeenIntro && !prefersReducedMotion) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("ay2fly-intro-seen", "true");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#fafaf9] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 text-center relative"
          >
            {/* Ambient aura glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-blue-500/20 rounded-full blur-2xl -z-10 animate-pulse" />

            {/* Bouncing Logo */}
            <div className="relative h-24 w-24 drop-shadow-[0_10px_25px_rgba(255,85,0,0.25)]">
              <Image
                src="/images/logo.png"
                alt="ay2fly mark"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div>
              <span className="font-display text-3xl font-black uppercase tracking-tight text-slate-900">
                ay2fly
              </span>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5500] font-bold mt-1">
                Bold Streetwear // Lagos to the World
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
