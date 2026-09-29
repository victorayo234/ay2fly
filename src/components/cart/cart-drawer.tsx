"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem, subtotal, totalCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const currentSubtotal = subtotal();
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(
    100,
    (currentSubtotal / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl rounded-l-3xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag Preview"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff5500]">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <span className="font-display uppercase tracking-wider text-sm font-black text-slate-900">
                  Your Bag ({totalCount()})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close bag"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-slate-50 border-b border-slate-100">
              <div className="text-xs font-sans text-slate-700 flex justify-between font-medium">
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-[#ff5500] font-bold">{formatPrice(remainingForFreeShipping)}</strong> more for Free Express Delivery!
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    You unlocked Complimentary Express Delivery!
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff5500] to-emerald-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 uppercase">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Looks like you haven&apos;t added any streetwear pieces to your bag yet.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={closeCart}
                    className="mt-2"
                  >
                    Explore Fresh Drops
                  </Button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-2xl hover:border-slate-300 transition-all shadow-xs"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200 block"
                      >
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${item.productSlug}`}
                              onClick={closeCart}
                              className="font-display text-xs font-bold text-slate-900 hover:text-[#ff5500] transition-colors line-clamp-1 uppercase"
                            >
                              {item.productName}
                            </Link>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {item.color} · Size <span className="font-bold text-slate-700">{item.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Quantity controls & Price */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="p-1.5 px-2.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-1.5 px-2.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer with Dual Flow: View Cart & Proceed to Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-white space-y-4 shadow-[0_-10px_25px_-5px_rgba(15,23,42,0.05)]">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {formatPrice(currentSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Shipping</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {currentSubtotal >= freeShippingThreshold
                        ? "FREE EXPRESS"
                        : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2.5 border-t border-slate-100 text-slate-900">
                    <span className="font-display uppercase tracking-wider">
                      Estimated Total
                    </span>
                    <span className="font-mono text-base font-black text-slate-900">
                      {formatPrice(currentSubtotal)}
                    </span>
                  </div>
                </div>

                {/* Dual Navigation Buttons for Workflow Reference */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link href="/cart" onClick={closeCart} className="block">
                    <Button variant="secondary" size="md" className="w-full">
                      View Full Bag
                    </Button>
                  </Link>

                  <Link href="/checkout" onClick={closeCart} className="block">
                    <Button variant="primary" size="md" className="w-full">
                      Checkout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
