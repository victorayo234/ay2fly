import React from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Collections & Releases | ay2fly",
  description: "Browse the curated architectural capsules and seasonal releases from ay2fly.",
};

export default async function CollectionsPage() {
  const collections = await db.getCollections();

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b border-[#202028] pb-8 space-y-3">
          <Badge variant="metallic">CAPSULE RELEASES</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            ARCHITECTURAL CAPSULES
          </h1>
          <p className="text-xs sm:text-sm text-[#9ca3af] max-w-2xl leading-relaxed">
            Every collection is developed around a singular material hypothesis and aesthetic thesis.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-12">
          {collections.map((col, index) => (
            <div
              key={col.id}
              className="group relative bg-[#0f0f13] border border-[#202028] hover:border-[#3a3a46] rounded-xs overflow-hidden transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Visual Banner */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[450px] overflow-hidden bg-black">
                  <Image
                    src={
                      col.banner_image ||
                      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0f0f13]" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="new">CAPSULE 0{index + 1}</Badge>
                  </div>
                </div>

                {/* Details & CTA */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                      RELEASE SERIES
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                      {col.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/shop?collection=${col.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-display uppercase tracking-widest text-xs font-bold rounded-xs hover:bg-neutral-200 transition-colors shadow-lg"
                    >
                      Shop This Capsule <ArrowRight className="h-4 w-4" />
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
