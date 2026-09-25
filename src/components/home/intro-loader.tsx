"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hasSeenIntro = sessionStorage.getItem("ay2fly-intro-seen");

    if (!hasSeenIntro && !prefersReducedMotion) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("ay2fly-intro-seen", "true");
      }, 1500);
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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#09090b] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="relative h-20 w-20 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]">
              <Image
                src="/images/logo.png"
                alt="ay2fly mark"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display text-2xl font-black uppercase tracking-widest metallic-text">
                ay2fly
              </span>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a] mt-1">
                Atelier 2026 // Drop 01
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
