"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-display uppercase tracking-wider text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] border border-white",
        secondary:
          "bg-[#18181d] text-[#f4f4f6] border border-[#2e2e38] hover:bg-[#23232a] hover:border-[#4b4b57]",
        outline:
          "bg-transparent text-white border border-[#3f3f4c] hover:border-white hover:bg-white/5",
        ghost:
          "bg-transparent text-[#cbd5e1] hover:text-white hover:bg-white/5 border border-transparent",
        metallic:
          "bg-gradient-to-r from-neutral-200 via-white to-neutral-300 text-black border border-white/60 shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:brightness-110",
        danger:
          "bg-red-950/40 text-red-400 border border-red-800/60 hover:bg-red-900/40 hover:border-red-600",
      },
      size: {
        sm: "h-9 px-4 text-[11px] gap-2 rounded-xs",
        md: "h-11 px-6 text-xs gap-2.5 rounded-xs",
        lg: "h-14 px-8 text-sm gap-3 rounded-xs font-bold",
        icon: "h-10 w-10 p-0 rounded-xs",
        "icon-sm": "h-8 w-8 p-0 rounded-xs",
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
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
