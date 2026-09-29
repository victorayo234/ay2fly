import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-36 pb-24 max-w-lg mx-auto px-4 text-center space-y-6 w-full">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
          <div className="relative h-16 w-16 mx-auto animate-bounce">
            <Image
              src="/images/logo.png"
              alt="ay2fly mark"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <Badge variant="accent">404 // NOT FOUND</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              The page or garment link you&apos;re looking for has moved, sold out, or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/">
              <Button variant="accent" size="md" className="shadow-lg shadow-orange-500/20 active:scale-95">
                Go to Homepage
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="md" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Browse Shop <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
