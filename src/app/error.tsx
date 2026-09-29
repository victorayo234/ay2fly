"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white border border-slate-200/80 rounded-3xl text-center space-y-6 shadow-xl">
        <div className="h-16 w-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff5500] mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold uppercase text-slate-900">
            Something Went Wrong
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            An unexpected error occurred while loading this page. You can try refreshing the action.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button variant="accent" size="sm" onClick={() => reset()} className="gap-2 shadow-md shadow-orange-500/20 active:scale-95">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary" size="sm">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
