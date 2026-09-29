import React from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Streetwear Collections & Drops | ay2fly",
  description: "Explore curated seasonal drops, limited streetwear capsules, and signature fits from ay2fly.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await db.getCollections();

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <Badge variant="accent">SEASONAL DROPS</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Every collection brings together heavyweight textiles, oversized cuts, and vivid color combinations designed to be worn together.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-10">
          {collections.map((col, index) => (
            <div
              key={col.id}
              className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Visual Banner */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[420px] overflow-hidden bg-slate-100">
                  <Image
                    src={
                      col.banner_image ||
                      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="accent" className="bg-[#ff5500] text-white">COLLECTION 0{index + 1}</Badge>
                  </div>
                </div>

                {/* Details & CTA */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#ff5500] font-bold">
                      LIMITED RELEASE
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
                      {col.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/shop?collection=${col.slug}`}
                      className="inline-block"
                    >
                      <Button variant="accent" size="lg" className="shadow-lg shadow-orange-500/20 active:scale-95">
                        Shop Collection <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
