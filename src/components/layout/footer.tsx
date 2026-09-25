"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "INVALID EMAIL",
        description: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }
    setSubscribed(true);
    toast({
      title: "ACCESS GRANTED",
      description: "You are enrolled in early-access midnight drop notifications.",
      variant: "metallic",
    });
  };

  return (
    <footer className="bg-[#060608] border-t border-[#1c1c22] text-[#f4f4f6] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/images/logo.png"
                  alt="ay2fly mark"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-xl font-bold uppercase tracking-tight metallic-text">
                ay2fly
              </span>
            </Link>
            <p className="text-xs text-[#8e8e99] max-w-sm leading-relaxed">
              Architectural Gen-Z streetwear label engineered with obsessive restraint.
              Simple products, strong styling, and an exceptional digital experience.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#71717a]">
              <span>LONDON</span>
              <span>·</span>
              <span>TOKYO</span>
              <span>·</span>
              <span>NEW YORK</span>
            </div>
          </div>

          {/* Links Column 1: Shop */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#a1a1aa]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=drop-01" className="hover:text-white transition-colors">
                  Drop 01: Raw Monolith
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=tactical-atelier" className="hover:text-white transition-colors">
                  Tactical Atelier
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=midnight-core" className="hover:text-white transition-colors">
                  Midnight Core
                </Link>
              </li>
              <li>
                <Link href="/shop?category=denim" className="hover:text-white transition-colors">
                  Japanese Selvedge
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Client Service */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white">
              Client Service
            </h4>
            <ul className="space-y-2.5 text-xs text-[#a1a1aa]">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-white transition-colors">
                  Design System Spec
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-white/90">
                  Admin Portal
                </Link>
              </li>
              <li>
                <span className="text-[#646470] cursor-not-allowed">
                  Global Shipping & Duties
                </span>
              </li>
              <li>
                <span className="text-[#646470] cursor-not-allowed">
                  Complimentary Returns
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white">
              Midnight Pass
            </h4>
            <p className="text-xs text-[#8e8e99] leading-relaxed">
              Strictly zero spam. Receive encrypted access codes 15 minutes before public drop launch.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/20 rounded-xs text-xs text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Enrolled for next drop</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 bg-[#121217] border border-[#272732] rounded-xs px-3 text-xs text-white placeholder:text-[#52525b] focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-white text-black hover:bg-neutral-200 rounded-xs text-[11px] font-display uppercase tracking-wider font-bold transition-all flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#1c1c22] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717a] gap-4">
          <div>
            © {new Date().getFullYear()} ay2fly Atelier Ltd. All rights reserved. Portfolio exhibition project.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">NFC Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
