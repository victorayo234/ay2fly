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
            className={`relative h-20 w-16 sm:h-24 sm:w-20 rounded-xs overflow-hidden border transition-all cursor-pointer bg-[#141418] shrink-0 ${
              selectedIndex === idx
                ? "border-white ring-1 ring-white"
                : "border-[#272730] opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.image_url}
              alt={img.alt_text || `${productName} view ${idx + 1}`}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-[3/4] sm:aspect-[4/5] bg-[#121216] rounded-xs overflow-hidden border border-[#202028] group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id || selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text || productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Cue */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Open fullscreen image zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Carousel Arrow Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Position dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  selectedIndex === idx
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Lightbox Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setIsZoomOpen(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between text-white z-10">
              <span className="font-display uppercase tracking-widest text-xs font-semibold">
                {productName} — View {selectedIndex + 1} of {displayImages.length}
              </span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-2 text-[#71717a] hover:text-white transition-colors"
                aria-label="Close zoom viewer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Large Image Stage */}
            <div
              className="relative flex-1 max-h-[85vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full max-w-4xl">
                <Image
                  src={currentImage.image_url}
                  alt={currentImage.alt_text || productName}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Prev / Next controls */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnail strip */}
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                  className={`relative h-14 w-12 rounded-xs overflow-hidden border transition-all ${
                    selectedIndex === idx ? "border-white" : "border-[#3f3f46] opacity-50"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
