import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center p-6 select-none">
      {/* Animated Brand Pulse */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-16 w-16 animate-bounce">
          <Image
            src="/images/logo.png"
            alt="ay2fly loading mark"
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-display text-xl font-black uppercase tracking-wider text-slate-900">
            ay2fly
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5500] animate-ping" />
            <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
              Loading Streetwear...
            </span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -inset-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-blue-500/10 rounded-full blur-2xl -z-10 animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}
