import React from "react";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IntroLoader } from "@/components/home/intro-loader";
import { HeroSection } from "@/components/home/hero-section";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { NewDropGrid } from "@/components/home/new-drop-grid";
import { CategoryGrid } from "@/components/home/category-grid";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { FabricReveal } from "@/components/home/fabric-reveal";
import { StatsCounter } from "@/components/home/stats-counter";
import { TrendingCarousel } from "@/components/home/trending-carousel";
import { FitPreview } from "@/components/home/fit-preview";
import { PressQuotes } from "@/components/home/press-quotes";
import { BrandStory } from "@/components/home/brand-story";
import { NewsletterSection } from "@/components/home/newsletter-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProducts, categories] = await Promise.all([
    db.getProducts({ sort: "newest" }),
    db.getCategories(),
  ]);

  const drop01Products = allProducts.filter(
    (p) => p.collection_id === "col-drop-01"
  );
  const trendingProducts = allProducts.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      {/* Reduced-motion aware initial brand reveal */}
      <IntroLoader />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Dynamic Hero (Fit Transformation Engine for members, campaign video for guests) */}
      <HeroSection />

      {/* Looping Brand Ticker Marquee */}
      <BrandMarquee />

      {/* Drop 01 Feature Grid */}
      <NewDropGrid
        products={drop01Products.length > 0 ? drop01Products : allProducts}
      />

      {/* Department Highlights (All 7 authorized categories) */}
      <CategoryGrid categories={categories} />

      {/* Horizontal Editorial Lookbook Gallery */}
      <LookbookGallery />

      {/* Material & Fabric Close-Up Inspection */}
      <FabricReveal />

      {/* Impact Stats Counter */}
      <StatsCounter />

      {/* Trending Streetwear Carousel */}
      <TrendingCarousel products={trendingProducts} />

      {/* Interactive Complete the Fit Preview */}
      <FitPreview />

      {/* Press & Editorial Recognition */}
      <PressQuotes />

      {/* Brand Manifesto & Pillars */}
      <BrandStory />

      {/* VIP Access Newsletter */}
      <NewsletterSection />

      {/* Brand Footer */}
      <Footer />
    </main>
  );
}
