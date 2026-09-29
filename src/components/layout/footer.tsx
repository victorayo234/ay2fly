"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, ShieldCheck, Truck } from "lucide-react";
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
        variant: "danger",
      });
      return;
    }
    setSubscribed(true);
    toast({
      title: "ACCESS CONFIRMED",
      description: "You're enrolled in early-access drop notifications.",
      variant: "vibrant",
    });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl bg-white p-1.5 shadow-sm flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="ay2fly mark"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-display text-2xl font-black uppercase tracking-tight text-white">
                ay2fly
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Bold Gen-Z streetwear crafted for movement, energy, and individuality. Premium heavyweight hoodies, baggy selvedge denim, and authentic street drops.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#ff5500]">
              <span>LAGOS</span>
              <span>·</span>
              <span>ABUJA</span>
              <span>·</span>
              <span>LONDON</span>
              <span>·</span>
              <span>WORLDWIDE</span>
            </div>
          </div>

          {/* Links Column 1: Shop */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Streetwear
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=drop-01" className="hover:text-white transition-colors">
                  Drop 01: Fresh Monolith
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tops" className="hover:text-white transition-colors">
                  Heavyweight Hoodies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bottoms" className="hover:text-white transition-colors">
                  Baggy Selvedge Denim
                </Link>
              </li>
              <li>
                <Link href="/shop?category=jackets" className="hover:text-white transition-colors">
                  Jackets & Bombers
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Customer Care */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Member Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About ay2fly
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Fast Drop Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Early Access
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign up for drop invitations before public release.
            </p>
            {subscribed ? (
              <div className="p-3 bg-white/10 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>You&apos;re subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
                />
                <button
                  type="submit"
                  className="w-full h-10 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Get Drop Alerts
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ay2fly Streetwear. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/shop" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/shop" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/shop" className="hover:text-slate-300 transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
