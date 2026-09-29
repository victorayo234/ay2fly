"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-display tracking-wide text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-95 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#ff5500] text-white hover:bg-[#e04b00] shadow-[0_8px_20px_-4px_rgba(255,85,0,0.35)] hover:shadow-[0_12px_25px_-4px_rgba(255,85,0,0.45)] border border-transparent",
        dark:
          "bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-[0_8px_20px_-4px_rgba(15,23,42,0.25)] border border-transparent",
        secondary:
          "bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] shadow-sm hover:shadow-md",
        outline:
          "bg-transparent text-[#0f172a] border border-[#cbd5e1] hover:border-[#0f172a] hover:bg-slate-50",
        ghost:
          "bg-transparent text-[#475569] hover:text-[#0f172a] hover:bg-slate-100 border border-transparent",
        vibrant:
          "bg-gradient-to-r from-[#ff5500] via-[#ff7700] to-[#ff3b00] text-white shadow-[0_10px_25px_-5px_rgba(255,85,0,0.4)] hover:brightness-105 border border-white/20",
        metallic:
          "bg-gradient-to-r from-[#ff5500] via-[#ff7700] to-[#2563eb] text-white shadow-[0_10px_25px_-5px_rgba(255,85,0,0.35)] hover:brightness-105 border border-white/20",
        danger:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
      },
      size: {
        sm: "h-9 px-4 text-xs gap-2 rounded-xl",
        md: "h-11 px-6 text-xs gap-2.5 rounded-xl font-bold",
        lg: "h-13 px-8 text-sm gap-3 rounded-2xl font-bold",
        icon: "h-10 w-10 p-0 rounded-xl",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
