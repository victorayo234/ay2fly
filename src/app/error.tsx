"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-[#0e0e12] border border-red-900/40 rounded-xs text-center space-y-6">
        <div className="h-14 w-14 rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 mx-auto">
          <AlertOctagon className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold uppercase text-white">
            Atelier System Notice
          </h2>
          <p className="text-xs text-[#8e8e99] leading-relaxed">
            An unexpected error interrupted this session. The error has been captured.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button variant="primary" size="sm" onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Action
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
