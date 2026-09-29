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
        description: "Interaction completed instantly.",
        variant: "accent",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 p-6 md:p-12 max-w-7xl mx-auto space-y-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-8 gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 relative bg-white border border-slate-200 p-2 rounded-2xl flex items-center justify-center shadow-sm">
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
              <h1 className="font-display text-3xl font-extrabold tracking-tight uppercase text-slate-900">
                ay2fly
              </h1>
              <Badge variant="accent">Brand System v2.0</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Bright, Bold & Human Design Tokens & Primitives
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="sm">
              View Storefront
            </Button>
          </Link>
          <Button
            variant="accent"
            size="sm"
            onClick={() =>
              toast({
                title: "ADDED TO BAG",
                description: "Overdyed Tangerine Hoodie (Size L) added.",
                variant: "accent",
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
        <h2 className="font-display text-lg tracking-wider uppercase text-slate-900 font-bold">
          01. Palette & Surface Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-4 bg-[#ff5500] text-white rounded-2xl space-y-1 shadow-sm">
            <div className="text-[10px] font-mono opacity-80">#FF5500</div>
            <div className="text-xs font-bold uppercase">Electric Tangerine</div>
            <div className="text-[11px] opacity-90">Brand Primary</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
            <div className="text-[10px] text-slate-400 font-mono">#FFFFFF</div>
            <div className="text-xs font-bold text-slate-900">Pure White</div>
            <div className="text-[11px] text-slate-500">Card & Modal Base</div>
          </div>
          <div className="p-4 bg-[#fafaf9] border border-slate-200 rounded-2xl space-y-1 shadow-sm">
            <div className="text-[10px] text-slate-400 font-mono">#FAFAF9</div>
            <div className="text-xs font-bold text-slate-900">Soft Canvas</div>
            <div className="text-[11px] text-slate-500">Root App Background</div>
          </div>
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1 shadow-sm">
            <div className="text-[10px] font-mono opacity-80">#0F172A</div>
            <div className="text-xs font-bold uppercase">Deep Slate</div>
            <div className="text-[11px] opacity-90">Primary Typography</div>
          </div>
          <div className="p-4 bg-emerald-500 text-white rounded-2xl space-y-1 shadow-sm">
            <div className="text-[10px] font-mono opacity-80">#10B981</div>
            <div className="text-xs font-bold uppercase">Emerald Pulse</div>
            <div className="text-[11px] opacity-90">Success & In Stock</div>
          </div>
          <div className="p-4 bg-blue-600 text-white rounded-2xl space-y-1 shadow-sm">
            <div className="text-[10px] font-mono opacity-80">#2563EB</div>
            <div className="text-xs font-bold uppercase">Cobalt Sky</div>
            <div className="text-[11px] opacity-90">Accent Secondary</div>
          </div>
        </div>
      </section>

      {/* Button Hierarchy */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-slate-900 font-bold">
          02. Button Hierarchy & Interactive States
        </h2>
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="accent" size="lg" className="shadow-lg shadow-orange-500/20">
              Accent Button (Drop CTA) <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="primary" size="lg">
              Primary Dark <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg">
              Secondary Pill
            </Button>
            <Button variant="outline" size="lg">
              Outline
            </Button>
            <Button variant="ghost" size="lg">
              Ghost Link
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
            <Button
              variant="accent"
              size="md"
              isLoading={btnLoading}
              onClick={triggerLoading}
            >
              Click for Loading Animation
            </Button>
            <Button variant="secondary" size="sm">
              Small Button
            </Button>
            <Button variant="outline" size="icon" aria-label="Icon test">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-slate-900 font-bold">
          03. Badge & Status Tags
        </h2>
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl flex flex-wrap gap-3 shadow-sm">
          <Badge variant="accent">FRESH DROP</Badge>
          <Badge variant="emerald">IN STOCK</Badge>
          <Badge variant="amber">LOW INVENTORY</Badge>
          <Badge variant="outOfStock">SOLD OUT</Badge>
          <Badge variant="default">LIMITED 2026</Badge>
          <Badge variant="outline">OVERSIZED FIT</Badge>
        </div>
      </section>

      {/* Form Controls */}
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wider uppercase text-slate-900 font-bold">
          04. Form Controls & Inputs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Standard Input
              </label>
              <Input
                placeholder="Enter your email address..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Icon Input
              </label>
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder="Search collection..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Custom Select
              </label>
              <Select defaultValue="oversized">
                <option value="oversized">Oversized Drape Cut</option>
                <option value="boxy">Boxy Cropped Silhouette</option>
                <option value="relaxed">Relaxed Streetwear Fit</option>
              </Select>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-5 shadow-sm">
            <Checkbox
              checked={checkboxChecked}
              onCheckedChange={setCheckboxChecked}
              label="Opt-in to SMS alerts for immediate drop access"
            />

            <RadioGroup value={radioVal} onValueChange={setRadioVal}>
              <RadioItem
                value="standard"
                label="Standard Ground Delivery (Free over $150)"
                description="3-5 business days dispatch with live transit tracking"
              />
              <RadioItem
                value="express"
                label="ay2fly Priority Courier ($22.00)"
                description="Guaranteed next business day delivery"
              />
            </RadioGroup>
          </div>
        </div>
      </section>
    </div>
  );
}
