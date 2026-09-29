import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-100 skeleton-shimmer border border-slate-200/50",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-2xl p-3 space-y-3 shadow-xs">
      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
      <div className="space-y-2 pt-2 px-1">
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/4 rounded-md" />
      </div>
    </div>
  );
}
