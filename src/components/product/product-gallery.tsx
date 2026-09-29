"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types/database";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            id: "default-img",
            product_id: "",
            image_url:
              "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
            alt_text: productName,
            position: 0,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnail Selector Column */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-none shrink-0">
        {displayImages.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative h-20 w-16 sm:h-24 sm:w-20 rounded-2xl overflow-hidden border transition-all cursor-pointer bg-slate-100 shrink-0 ${
              selectedIndex === idx
                ? "border-[#ff5500] ring-2 ring-[#ff5500]/30 shadow-xs scale-102"
                : "border-slate-200 opacity-70 hover:opacity-100"
            }`}
            aria-label={`View photo ${idx + 1} of ${productName}`}
          >
            <Image
              src={img.image_url}
              alt={img.alt_text || `${productName} preview ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id || selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text || productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Brand Logo Watermark on Main Gallery Image */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-xs border border-slate-200/60 z-10 pointer-events-none">
          <div className="relative h-3.5 w-3.5">
            <Image
              src="/images/logo.png"
              alt="ay2fly"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display text-[10px] font-black uppercase text-slate-900 tracking-wider">
            ay2fly original
          </span>
        </div>

        {/* Image index counter */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-slate-700 shadow-xs border border-slate-200/60 pointer-events-none">
          {selectedIndex + 1} / {displayImages.length}
        </div>

        {/* Navigation Arrows on Hover */}
        {displayImages.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:text-[#ff5500] hover:bg-white flex items-center justify-center transition-all shadow-md pointer-events-auto active:scale-95 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:text-[#ff5500] hover:bg-white flex items-center justify-center transition-all shadow-md pointer-events-auto active:scale-95 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Zoom Trigger Button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-slate-950 hover:bg-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          aria-label="Enlarge image"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors z-50 cursor-pointer"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>

            <div
              className="relative w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.image_url}
                alt={productName}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
