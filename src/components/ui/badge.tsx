import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-display uppercase tracking-wider font-bold transition-all rounded-full border select-none",
  {
    variants: {
      default: {
        true: "bg-slate-100 text-slate-800 border-slate-200",
      },
      variant: {
        default:
          "bg-slate-100 text-slate-800 border-slate-200/80 shadow-xs",
        vibrant:
          "bg-orange-500 text-white border-transparent shadow-[0_2px_10px_rgba(255,85,0,0.35)]",
        metallic:
          "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-[0_2px_10px_rgba(255,85,0,0.3)]",
        new:
          "bg-black text-white border-transparent shadow-sm",
        sale:
          "bg-red-50 text-red-600 border-red-200 font-bold",
        lowStock:
          "bg-amber-50 text-amber-700 border-amber-200",
        outOfStock:
          "bg-slate-100 text-slate-400 border-slate-200 line-through",
        outline:
          "bg-transparent text-slate-700 border-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
