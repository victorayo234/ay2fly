import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-36 pb-24 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="relative h-16 w-16 mx-auto">
          <Image
            src="/images/logo.png"
            alt="ay2fly mark"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-2">
          <Badge variant="outOfStock">404 // MISSING ARCHIVE</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
            Garment or Route Not Found
          </h1>
          <p className="text-xs text-[#8e8e99] max-w-sm mx-auto leading-relaxed">
            The archive link you navigated to may have been archived, rotated out of production, or does not exist.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button variant="primary" size="md">
              Return to Drop 01
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="md" className="gap-2">
              <Compass className="h-4 w-4" />
              Browse Shop <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
