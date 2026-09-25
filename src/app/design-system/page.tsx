"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { Search, Mail, Shield, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

export default function DesignSystemPage() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioVal, setRadioVal] = useState("express");
  const [inputVal, setInputVal] = useState("");

  const triggerLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      toast({
        title: "ACTION COMPLETED",
        description: "State transition simulation finished successfully.",
        variant: "metallic",
      });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6] p-6 md:p-12 max-w-7xl mx-auto space-y-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#272730] pb-8 gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 relative bg-[#141418] border border-white/20 p-2 rounded-xs flex items-center justify-center shadow-lg">
            <Image
              src="/images/logo.png"
              alt="ay2fly mark"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight uppercase metallic-text">
                ay2fly
              </h1>
              <Badge variant="metallic">Design System v1.0</Badge>
            </div>
            <p className="text-sm text-[#9ca3af] mt-1">
              Component sanity-check & token validation reference for Phase 1
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="sm">
              View Landing Page
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              toast({
                title: "ADDED TO CART",
                description: "Overdyed Tactical Cargo (Size L) added.",
                variant: "success",
              })
            }
          >
            <Sparkles className="h-3.5 w-3.5" />
            Test Toast
          </Button>
        </div>
      </div>

      {/* Color Tokens */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
          01. Palette & Surface Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-4 bg-[#09090b] border border-[#272730] rounded-xs space-y-1">
            <div className="text-[10px] text-[#71717a] font-mono">#09090B</div>
            <div className="text-xs font-semibold text-white">Obsidian Black</div>
            <div className="text-[11px] text-[#9ca3af]">Root background</div>
          </div>
          <div className="p-4 bg-[#111115] border border-[#272730] rounded-xs space-y-1">
            <div className="text-[10px] text-[#71717a] font-mono">#111115</div>
            <div className="text-xs font-semibold text-white">Surface Base</div>
            <div className="text-[11px] text-[#9ca3af]">Cards & Panels</div>
          </div>
          <div className="p-4 bg-[#18181d] border border-[#272730] rounded-xs space-y-1">
            <div className="text-[10px] text-[#71717a] font-mono">#18181D</div>
            <div className="text-xs font-semibold text-white">Surface Hover</div>
            <div className="text-[11px] text-[#9ca3af]">Interactive hover</div>
          </div>
          <div className="p-4 bg-[#202026] border border-[#272730] rounded-xs space-y-1">
            <div className="text-[10px] text-[#71717a] font-mono">#202026</div>
            <div className="text-xs font-semibold text-white">Surface Elevated</div>
            <div className="text-[11px] text-[#9ca3af]">Modals & Drawers</div>
          </div>
          <div className="p-4 bg-[#27272e] border border-[#3f3f4c] rounded-xs space-y-1">
            <div className="text-[10px] text-[#71717a] font-mono">#27272E</div>
            <div className="text-xs font-semibold text-white">Border Charcoal</div>
            <div className="text-[11px] text-[#9ca3af]">Subtle separation</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-neutral-200 via-white to-neutral-400 text-black rounded-xs space-y-1 shadow-md">
            <div className="text-[10px] font-mono opacity-80">METALLIC</div>
            <div className="text-xs font-bold uppercase">Silver Chrome</div>
            <div className="text-[11px] font-medium opacity-90">Brand Accent</div>
          </div>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
          02. Typography Hierarchy
        </h2>
        <div className="p-6 bg-[#111115] border border-[#272730] rounded-xs space-y-6">
          <div className="border-b border-[#272730]/60 pb-4">
            <div className="text-[10px] font-mono text-[#71717a] uppercase mb-1">
              Display Hero / Headlines (Space Grotesk)
            </div>
            <div className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight">
              ARCHITECTURAL GEN-Z STREETWEAR
            </div>
          </div>
          <div className="border-b border-[#272730]/60 pb-4">
            <div className="text-[10px] font-mono text-[#71717a] uppercase mb-1">
              Section Title (Space Grotesk - Semibold)
            </div>
            <div className="font-display text-2xl font-semibold uppercase tracking-wide">
              DROP 01 — RAW DECONSTRUCTED ESSENTIALS
            </div>
          </div>
          <div className="border-b border-[#272730]/60 pb-4">
            <div className="text-[10px] font-mono text-[#71717a] uppercase mb-1">
              Subheader / UI Labels (Inter - Medium / Uppercase)
            </div>
            <div className="font-sans text-sm font-medium uppercase tracking-widest text-[#cbd5e1]">
              TACTICAL FIT / OVERSIZED DROP SHOULDER / 460 GSM
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#71717a] uppercase mb-1">
              Body Copy (Inter - Regular)
            </div>
            <p className="font-sans text-sm text-[#9ca3af] max-w-2xl leading-relaxed">
              Designed with obsessive restraint. Crafted from heavyweight loopback French terry, custom silver-finished hardware, and anatomical panel stitching engineered to drape naturally across contemporary oversized proportions.
            </p>
          </div>
        </div>
      </section>

      {/* Button System */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
            03. Button System & States
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={triggerLoading}
            disabled={btnLoading}
          >
            Simulate Async State
          </Button>
        </div>

        <div className="p-6 bg-[#111115] border border-[#272730] rounded-xs space-y-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[#71717a]">Variants (Normal / Hover)</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Solid</Button>
              <Button variant="metallic">Metallic Chrome</Button>
              <Button variant="secondary">Secondary Slate</Button>
              <Button variant="outline">Outline Silver</Button>
              <Button variant="ghost">Ghost Minimal</Button>
              <Button variant="danger">Danger Action</Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[#71717a]">States (Loading / Disabled)</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading={btnLoading}>
                {btnLoading ? "Processing" : "Primary Action"}
              </Button>
              <Button variant="metallic" isLoading={btnLoading}>
                {btnLoading ? "Submitting" : "Metallic Action"}
              </Button>
              <Button variant="primary" disabled>
                Disabled Solid
              </Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[#71717a]">Sizes & Icon Variations</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary">
                Large Button <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="md" variant="primary">
                Medium (Default)
              </Button>
              <Button size="sm" variant="primary">
                Small Action
              </Button>
              <Button size="icon" variant="secondary" aria-label="Cart">
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges & Tags */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
          04. Badges & Stock Tags
        </h2>
        <div className="p-6 bg-[#111115] border border-[#272730] rounded-xs flex flex-wrap items-center gap-3">
          <Badge variant="new">NEW DROP</Badge>
          <Badge variant="metallic">LIMITED EDITION</Badge>
          <Badge variant="sale">SALE -30%</Badge>
          <Badge variant="lowStock">ONLY 2 LEFT</Badge>
          <Badge variant="outOfStock">OUT OF STOCK</Badge>
          <Badge variant="outline">RELAXED FIT</Badge>
          <Badge variant="default">460 GSM</Badge>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
          05. Form Inputs & Controls
        </h2>
        <div className="p-6 bg-[#111115] border border-[#272730] rounded-xs grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
                Standard Text Input
              </label>
              <Input
                placeholder="Enter your email address..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
                Input with Icon
              </label>
              <Input
                placeholder="Search collection, product, fit..."
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
                Input Error State
              </label>
              <Input
                defaultValue="invalid-email-format"
                error="Please enter a valid email address."
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
                Custom Select
              </label>
              <Select defaultValue="oversized">
                <option value="fitted">Fitted Silhouette</option>
                <option value="regular">Regular Silhouette</option>
                <option value="oversized">Signature Oversized Fit</option>
                <option value="boxy">Boxy Cropped Cut</option>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-2">
                Checkboxes
              </label>
              <div className="space-y-3">
                <Checkbox
                  checked={checkboxChecked}
                  onCheckedChange={setCheckboxChecked}
                  label="Subscribe to exclusive midnight drop announcements"
                />
                <Checkbox
                  checked={false}
                  label="Remember this shipping address for express checkout"
                />
                <Checkbox
                  checked={false}
                  disabled
                  label="Disabled agreement checkbox state"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-2">
                Radio Group (Delivery Methods)
              </label>
              <RadioGroup value={radioVal} onValueChange={setRadioVal}>
                <RadioItem
                  value="standard"
                  label="Standard Ground Delivery ($10.00)"
                  description="3-5 business days with live tracking link"
                />
                <RadioItem
                  value="express"
                  label="ay2fly Express Courier ($22.00)"
                  description="Guaranteed next-day delivery before 6 PM"
                />
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
          06. Card System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="new">DROP 01</Badge>
                <span className="text-xs text-[#71717a] font-mono">SKU-094</span>
              </div>
              <CardTitle className="mt-2">Heavyweight Boxy Hoodie</CardTitle>
              <CardDescription>
                Washed Vintage Black · 520 GSM Japanese Terry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display text-white">$145.00</div>
              <p className="text-xs text-[#9ca3af] mt-2 leading-relaxed">
                Features double-lined hood without drawstrings, wide ribbing, and subtle tonal embroidery.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm" className="w-full">
                Add to Bag
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-white/20 bg-gradient-to-b from-[#181820] to-[#111115]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="metallic">FEATURED</Badge>
                <Shield className="h-4 w-4 text-neutral-400" />
              </div>
              <CardTitle className="mt-2">Authentication Guaranteed</CardTitle>
              <CardDescription>
                Every garment is tagged with a unique cryptographic NFC tag.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Scan your left wrist hem patch with any smartphone to inspect digital ownership certificates and release metadata.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" className="w-full">
                Learn Protocol
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-950/40 bg-[#160d0d]">
            <CardHeader>
              <Badge variant="lowStock">LOW INVENTORY</Badge>
              <CardTitle className="mt-2 text-red-200">Deconstructed Raw Denim</CardTitle>
              <CardDescription className="text-red-400/80">
                Size 32 & 34 running low in stock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display text-white">$210.00</div>
              <div className="mt-2 text-xs text-red-300">
                Only 2 pairs remaining in inventory.
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="danger" size="sm" className="w-full">
                Quick Claim
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Toast Notification Triggers */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-white/90">
          07. Toast Notification System
        </h2>
        <div className="p-6 bg-[#111115] border border-[#272730] rounded-xs flex flex-wrap gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast({
                title: "ITEM ADDED",
                description: "Oversized Acid Washed Tee added to your bag.",
                variant: "default",
              })
            }
          >
            Default Toast
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast({
                title: "ORDER CONFIRMED",
                description: "Order #AY-82910 has been placed successfully.",
                variant: "success",
              })
            }
          >
            Success Toast
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast({
                title: "STOCK ERROR",
                description: "This variant was claimed by another customer.",
                variant: "error",
              })
            }
          >
            Error Toast
          </Button>
          <Button
            variant="metallic"
            size="sm"
            onClick={() =>
              toast({
                title: "EXCLUSIVE PASS UNLOCKED",
                description: "You have early access to DROP 02 previews.",
                variant: "metallic",
              })
            }
          >
            Metallic Brand Toast
          </Button>
        </div>
      </section>
    </div>
  );
}
