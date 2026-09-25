"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0c0c0f] border-l border-[#272730] z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#272730]/70">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-white" />
                <span className="font-display uppercase tracking-widest text-xs font-bold text-white">
                  BAG ({totalCount()})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[#71717a] hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-5 py-3 bg-[#111116] border-b border-[#272730]/40">
              <div className="text-[11px] font-sans text-[#a1a1aa] flex justify-between">
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> for Complimentary Express Shipping
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    ✓ You unlocked Complimentary Express Shipping!
                  </span>
                )}
              </div>
              <div className="mt-2 h-1 w-full bg-[#272730] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neutral-400 to-white transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-[#18181f] border border-[#272730] flex items-center justify-center text-[#71717a]">
                    <ShoppingBag className="h-7 w-7 stroke-1" />
                  </div>
                  <div>
                    <h3 className="font-display uppercase tracking-wide text-sm font-semibold text-white">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-[#71717a] mt-1 max-w-[240px]">
                      Explore our latest drop of heavyweight oversized streetwear essentials.
                    </p>
                  </div>
                  <Link href="/shop" onClick={closeCart}>
                    <Button variant="primary" size="sm" className="mt-2">
                      Browse Shop
                    </Button>
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden", marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-3 bg-[#111115] border border-[#222228] rounded-xs"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 bg-[#16161b] rounded-xs overflow-hidden shrink-0 border border-[#272730]"
                      >
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/products/${item.productSlug}`}
                              onClick={closeCart}
                              className="font-display text-xs font-semibold uppercase text-white hover:text-neutral-300 transition-colors line-clamp-1"
                            >
                              {item.productName}
                            </Link>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="text-[#71717a] hover:text-red-400 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-[#8e8e99] mt-0.5 font-mono">
                            {item.color} · Size {item.size}
                          </div>
                          <div className="text-xs font-bold text-white mt-1">
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1e1e24]">
                          <div className="flex items-center border border-[#272730] rounded-xs bg-[#09090b]">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="p-1 px-2 text-[#71717a] hover:text-white disabled:opacity-30 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="p-1 px-2 text-[#71717a] hover:text-white disabled:opacity-30 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-xs font-mono font-semibold text-neutral-300">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#272730] bg-[#0c0c0f] space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#8e8e99]">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">
                      {formatPrice(currentSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8e8e99]">
                    <span>Shipping</span>
                    <span className="font-mono text-white">
                      {currentSubtotal >= freeShippingThreshold
                        ? "FREE"
                        : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#272730] text-white">
                    <span className="font-display uppercase tracking-wider">
                      Estimated Total
                    </span>
                    <span className="font-mono text-base">
                      {formatPrice(currentSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/checkout" onClick={closeCart} className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-[#71717a] hover:text-white"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
