"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Lock,
  Package,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { useCartStore } from "@/store/cart-store";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types/database";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  useEffect(() => {
    setMounted(true);
    if (user) {
      setEmail(user.email);
      setName(user.full_name);
      setPhone(user.phone || "");
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses[0];
        setAddress(defaultAddr.address);
        setCity(defaultAddr.city);
        setState(defaultAddr.state);
        setPostalCode(defaultAddr.postal_code);
        setCountry(defaultAddr.country);
      }
    }
  }, [user]);

  if (!mounted) return null;

  const currentSubtotal = subtotal();
  const shippingFee =
    deliveryMethod === "express" ? 22 : currentSubtotal >= 150 ? 0 : 10;
  const tax = Math.round(currentSubtotal * 0.08 * 100) / 100;
  const total = currentSubtotal + shippingFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!name || !email || !address || !city || !postalCode) {
      setError("Please fill out all required shipping and contact details.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "guest-session",
          userEmail: email,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            productName: i.productName,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            unitPrice: i.price,
            imageUrl: i.image,
          })),
          shippingAddress: {
            name,
            address,
            city,
            state,
            postalCode,
            country,
            phone,
          },
          subtotal: currentSubtotal,
          shippingFee,
          tax,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process order checkout.");
      }

      // Success
      setCompletedOrder(data.order);
      clearCart();

      // Trigger Vibrant Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ff5500", "#3b82f6", "#10b981", "#f59e0b", "#0f172a"],
        });
      } catch (err) {
        // confetti fallback
      }

      toast({
        title: "ORDER CONFIRMED",
        description: `Order #${data.order.order_number} has been recorded in database.`,
        variant: "success",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // If order was successfully completed, show Confirmation View
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
        <Navbar />

        <main className="pt-36 pb-24 max-w-2xl mx-auto px-4 sm:px-6 w-full space-y-8">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="h-18 w-18 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <Badge variant="emerald" className="px-3 py-1">ORDER CONFIRMED</Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">
                You&apos;re All Set!
              </h1>
              <div className="font-mono text-lg text-[#ff5500] font-bold">
                Order #{completedOrder.order_number}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
                Your order is confirmed and currently being prepared for dispatch.
                A confirmation summary was sent to{" "}
                <strong className="text-slate-900">{completedOrder.user_email}</strong>.
              </p>
            </div>

            {/* Order Items Breakdown */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left divide-y divide-slate-200">
              {completedOrder.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-12 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={item.image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-display uppercase font-bold text-slate-900">
                        {item.product_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.color} · Size {item.size} · Qty {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    {formatPrice(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="pt-3 flex justify-between text-sm font-display uppercase font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="font-mono text-[#ff5500]">{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/orders" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full shadow-lg shadow-orange-500/20">
                  <Package className="h-4 w-4" />
                  View in Orders
                </Button>
              </Link>
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Keep Browsing
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
          <div>
            <Badge variant="accent">FAST CHECKOUT</Badge>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 mt-2">
              Checkout
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
            <ShoppingBag className="h-12 w-12 text-slate-400 mx-auto stroke-1" />
            <h3 className="font-display uppercase text-lg font-bold text-slate-900">
              Your Bag is Empty
            </h3>
            <p className="text-xs text-slate-500">
              Add some fresh streetwear pieces to your bag before checking out.
            </p>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="accent" size="md">
                Browse Shop
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column: Checkout Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Contact Information */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                    01. Contact Details
                  </h2>
                  {!user && (
                    <Link
                      href="/login"
                      className="text-xs text-[#ff5500] hover:underline font-medium"
                    >
                      Sign in for faster checkout
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                    02. Shipping Address
                  </h2>
                  {user && user.addresses && user.addresses.length > 0 && (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Profile address autofilled
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Recipient Full Name *
                    </label>
                    <Input
                      required
                      placeholder="Marcus Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Street Address *
                    </label>
                    <Input
                      required
                      placeholder="450 Broadway, Apt 4B"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        City *
                      </label>
                      <Input
                        required
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        State / County
                      </label>
                      <Input
                        placeholder="NY"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Postal Code *
                      </label>
                      <Input
                        required
                        placeholder="10013"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery Speed */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                    03. Delivery Method
                  </h2>
                </div>

                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(val) => setDeliveryMethod(val as any)}
                >
                  <RadioItem
                    value="standard"
                    label={
                      currentSubtotal >= 150
                        ? "Standard Ground Delivery (FREE - Order over $150)"
                        : "Standard Ground Delivery ($10.00)"
                    }
                    description="3-5 business days dispatch with live tracking link"
                  />
                  <RadioItem
                    value="express"
                    label="ay2fly Priority Courier ($22.00)"
                    description="Guaranteed next-business-day delivery before 6 PM"
                  />
                </RadioGroup>
              </div>

              {/* Step 4: Demo Payment Boundary */}
              <div className="space-y-4 p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#ff5500]" />
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                      04. Payment Boundary (Demo Project)
                    </h2>
                  </div>
                  <Badge variant="accent">PORTFOLIO DEMO</Badge>
                </div>

                {/* Important Notice */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
                  <strong>Notice:</strong> Demo checkout — live payment gateway integration is simulated for this portfolio showcase.
                  Clicking <strong>&ldquo;Authorize Demo Order&rdquo;</strong> performs real server-side stock validation, decrements inventory in the live Supabase PostgreSQL database, and creates a verified order record.
                </div>

                {/* Stylized Mock Card Preview */}
                <div className="p-5 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl space-y-3 font-mono text-xs text-slate-300 shadow-md">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-bold tracking-wider text-white">AY2FLY VIRTUAL CARD</span>
                    <span className="bg-[#ff5500] text-white px-1.5 py-0.5 rounded text-[9px] font-bold">DEMO</span>
                  </div>
                  <div className="text-base tracking-widest text-white font-bold py-1">
                    •••• •••• •••• 2026
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>EXP: 12/28</span>
                    <span>CVC: •••</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-6 sticky top-28 self-start shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                  Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-display uppercase font-bold text-slate-900 line-clamp-1">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.color} · Size {item.size} · Qty {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatPrice(currentSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({deliveryMethod})</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono font-semibold text-slate-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span className="font-display uppercase tracking-wider">
                    Total Due
                  </span>
                  <span className="font-mono text-xl text-[#ff5500]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full h-14 text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-95"
                isLoading={loading}
              >
                Authorize Demo Order <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-center text-[11px] font-medium text-slate-500">
                Hassle-free 14-day returns on all unworn streetwear.
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
