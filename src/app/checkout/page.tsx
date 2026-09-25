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
      if (user.addresses.length > 0) {
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
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: {
            name,
            address,
            city,
            state,
            country,
            postal_code: postalCode,
            phone,
          },
          deliveryMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to complete order.");
        setLoading(false);
        return;
      }

      // Success
      setCompletedOrder(data.order);
      clearCart();
      setLoading(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ffffff", "#cbd5e1", "#94a3b8", "#18181b"],
        });
      } catch (err) {
        // confetti fallback
      }

      toast({
        title: "ORDER CONFIRMED",
        description: `Order #${data.order.order_number} has been recorded in database.`,
        variant: "metallic",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // If order was successfully completed, show Confirmation View
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
        <Navbar />

        <main className="pt-36 pb-24 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="bg-[#0e0e12] border border-white/20 rounded-xs p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="h-16 w-16 mx-auto rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <Badge variant="metallic">DISPATCH SCHEDULED</Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
                Order Confirmed
              </h1>
              <div className="font-mono text-lg text-emerald-400 font-bold">
                #{completedOrder.order_number}
              </div>
              <p className="text-xs text-[#8e8e99] max-w-md mx-auto leading-relaxed pt-1">
                Your order has been recorded in our production inventory database.
                A confirmation summary was generated for{" "}
                <strong className="text-white">{completedOrder.user_email}</strong>.
              </p>
            </div>

            {/* Order Items Breakdown */}
            <div className="p-4 bg-[#141419] border border-[#222228] rounded-xs text-left divide-y divide-[#1f1f26]">
              {completedOrder.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 bg-[#1c1c22] rounded-xs overflow-hidden shrink-0 border border-[#272730]">
                      <Image
                        src={item.image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-display uppercase font-semibold text-white">
                        {item.product_name}
                      </div>
                      <div className="text-[11px] text-[#71717a] font-mono">
                        {item.color} · Size {item.size} · Qty {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-white">
                    {formatPrice(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="pt-3 flex justify-between text-sm font-display uppercase font-bold text-white">
                <span>Total Amount Charged</span>
                <span className="font-mono">{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/orders" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full">
                  <Package className="h-4 w-4" />
                  View in Order History
                </Button>
              </Link>
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Continue Shopping
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
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#202028] pb-6 flex items-center justify-between">
          <div>
            <Badge variant="metallic">DISPATCH GATEWAY</Badge>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-2">
              Atelier Checkout
            </h1>
          </div>
          <div className="text-xs font-mono text-[#71717a] flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            256-BIT ENCRYPTED
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
            <ShoppingBag className="h-10 w-10 text-[#71717a] mx-auto stroke-1" />
            <h3 className="font-display uppercase text-base font-semibold text-white">
              Your bag is currently empty
            </h3>
            <p className="text-xs text-[#8e8e99]">
              Add items from the collection before initiating checkout.
            </p>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Browse Collection
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Checkout Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              {/* Step 1: Contact Information */}
              <div className="space-y-4 p-6 bg-[#0e0e12] border border-[#202028] rounded-xs">
                <div className="flex items-center justify-between border-b border-[#1f1f26] pb-3">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    01. Contact Details
                  </h2>
                  {!user && (
                    <Link
                      href="/login"
                      className="text-xs text-[#a1a1aa] hover:text-white underline font-mono"
                    >
                      Sign In for Express Checkout
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
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
              <div className="space-y-4 p-6 bg-[#0e0e12] border border-[#202028] rounded-xs">
                <div className="border-b border-[#1f1f26] pb-3 flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    02. Shipping Destination
                  </h2>
                  {user && user.addresses.length > 0 && (
                    <span className="text-[11px] font-mono text-emerald-400">
                      ✓ Profile Address Autofilled
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
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
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
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
                      <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
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
                      <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
                        State / County
                      </label>
                      <Input
                        placeholder="NY"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
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
              <div className="space-y-4 p-6 bg-[#0e0e12] border border-[#202028] rounded-xs">
                <div className="border-b border-[#1f1f26] pb-3">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
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
                        ? "Standard Ground Delivery (COMPLIMENTARY)"
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
              <div className="space-y-4 p-6 bg-[#111117] border border-white/20 rounded-xs relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#22222a] pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-white" />
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                      04. Payment Boundary (Demo Project)
                    </h2>
                  </div>
                  <Badge variant="metallic">PORTFOLIO DEMO</Badge>
                </div>

                {/* Important Prompt Requirement Notice */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xs text-xs text-amber-200 leading-relaxed">
                  <strong>Notice:</strong> Demo checkout — payment integration is not enabled in this portfolio project.
                  Clicking <strong>&ldquo;Authorize Demo Order&rdquo;</strong> will execute real server-side stock validation, decrement variant inventory in the database, and issue a verifiable order confirmation record.
                </div>

                {/* Stylized Mock Card Preview */}
                <div className="p-4 bg-gradient-to-tr from-[#141419] to-[#22222c] border border-white/10 rounded-xs space-y-3 font-mono text-xs text-[#cbd5e1]">
                  <div className="flex justify-between items-center text-[10px] text-[#71717a]">
                    <span>AY2FLY METALLIC SECURE CARD</span>
                    <span>DEMO MODE</span>
                  </div>
                  <div className="text-sm tracking-widest text-white">
                    •••• •••• •••• 2026
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>EXP: 12/28</span>
                    <span>CVC: •••</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-6 sticky top-28 self-start shadow-2xl">
              <div className="border-b border-[#1f1f26] pb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Order Summary ({items.length} items)
                </h3>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 bg-[#16161c] rounded-xs overflow-hidden border border-[#24242c] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-display uppercase font-semibold text-white line-clamp-1">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-[#71717a] font-mono">
                          {item.color} · Size {item.size} · Qty {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 border-t border-[#1f1f26] pt-4 text-xs">
                <div className="flex justify-between text-[#8e8e99]">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">
                    {formatPrice(currentSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#8e8e99]">
                  <span>Delivery ({deliveryMethod})</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#8e8e99]">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-white">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#202028]">
                  <span className="font-display uppercase tracking-wider">
                    Total Due
                  </span>
                  <span className="font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-14"
                isLoading={loading}
              >
                Authorize Demo Order <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-center text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
                COMPLIMENTARY ARCHIVAL RETURNS WITHIN 14 DAYS
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
