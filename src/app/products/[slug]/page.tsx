import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { RelatedProducts } from "@/components/product/related-products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | ay2fly",
    };
  }

  return {
    title: `${product.name} | ay2fly`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ay2fly Atelier`,
      description: product.description,
      images: [
        {
          url:
            product.images?.[0]?.image_url ||
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await db.getRelatedProducts(product.id, 4);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailView
          product={product}
          sizeGuides={product.size_guides || []}
        />

        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}
