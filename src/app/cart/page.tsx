"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Tag,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar />
        <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4 max-w-md mx-auto">
            <div className="h-8 bg-slate-200 rounded-xl" />
            <div className="h-64 bg-slate-100 rounded-3xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentSubtotal = subtotal();
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(
    100,
    (currentSubtotal / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);

  const discountAmount = appliedDiscount ? currentSubtotal * appliedDiscount : 0;
  const shippingCost = currentSubtotal >= freeShippingThreshold || currentSubtotal === 0 ? 0 : 15;
  const finalTotal = currentSubtotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError("");
    const clean = couponCode.trim().toUpperCase();
    if (clean === "AY2FLY10" || clean === "FRESH10") {
      setAppliedDiscount(0.1);
      toast({
        title: "PROMO CODE APPLIED",
        description: "10% discount applied to your order.",
        variant: "vibrant",
      });
    } else if (clean === "AY2FLY20") {
      setAppliedDiscount(0.2);
      toast({
        title: "VIP PROMO APPLIED",
        description: "20% VIP discount applied to your order.",
        variant: "vibrant",
      });
    } else {
      setDiscountError("Invalid code. Try AY2FLY10 for 10% off.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Header */}
        <div className="pb-8 border-b border-slate-200/80 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Shopping Bag</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
                Your Shopping Bag
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review your selected streetwear pieces before heading to checkout.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-xs font-display font-bold text-[#ff5500]">
              <ShoppingBag className="h-4 w-4" />
              {totalCount()} {totalCount() === 1 ? "Item" : "Items"} in Bag
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Bag View */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="h-20 w-20 rounded-full bg-orange-50 text-[#ff5500] flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-slate-900">
                Your bag is currently empty
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                Discover our newest heavyweight hoodies, baggy selvedge denim, tactical pants, and streetwear essentials.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Explore Fresh Drops <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: Items List */}
            <div className="lg:col-span-7 space-y-6">
              {/* Free Delivery Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-sans text-slate-700 font-medium">
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-[#ff5500] font-bold">{formatPrice(remainingForFreeShipping)}</strong> more to unlock <span className="font-bold text-slate-900">Free Express Delivery</span>!
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      Congratulations! You unlocked Free Worldwide Express Delivery.
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-slate-400 font-bold">
                    {Math.round(progressToFreeShipping)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff5500] to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="relative h-28 w-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200"
                    >
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-display text-sm font-bold text-slate-900 hover:text-[#ff5500] transition-colors uppercase block line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-xs text-slate-500 font-sans flex items-center gap-3">
                        <span>Color: <strong className="text-slate-700">{item.color}</strong></span>
                        <span>·</span>
                        <span>Size: <strong className="text-slate-700">{item.size}</strong></span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 pt-0.5">
                        Unit Price: {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                      <div className="flex items-center border border-slate-200 bg-white rounded-xl shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-sm sm:text-base font-bold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <Truck className="h-4 w-4 text-[#ff5500] shrink-0" />
                  <span>Complimentary Express over $150</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <RotateCcw className="h-4 w-4 text-[#ff5500] shrink-0" />
                  <span>14-day hassle-free exchanges</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-[#ff5500] shrink-0" />
                  <span>100% Authentic Streetwear</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5 space-y-6 sticky top-28">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-display font-bold uppercase text-slate-700 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-[#ff5500]" />
                    Promo Code or Voucher
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. AY2FLY10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="uppercase font-mono text-xs"
                    />
                    <Button type="submit" variant="secondary" size="md">
                      Apply
                    </Button>
                  </div>
                  {discountError && (
                    <p className="text-xs text-red-500 font-sans">{discountError}</p>
                  )}
                  {appliedDiscount && (
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Promo active ({appliedDiscount * 100}% OFF)
                    </p>
                  )}
                </form>

                {/* Calculations */}
                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {formatPrice(currentSubtotal)}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount ({appliedDiscount * 100}%)</span>
                      <span className="font-mono font-bold">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold pt-4 border-t border-slate-200 text-slate-900">
                    <span className="font-display uppercase tracking-wider">
                      Total
                    </span>
                    <span className="font-mono text-xl font-black text-slate-900">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link href="/checkout" className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/shop" className="block text-center">
                    <span className="text-xs font-display font-bold text-slate-500 hover:text-slate-900 transition-colors">
                      ← Or Continue Browsing
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
