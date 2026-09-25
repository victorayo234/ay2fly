import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-display uppercase tracking-widest font-semibold transition-colors rounded-xs border select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-white border-white/20 backdrop-blur-xs",
        metallic:
          "bg-gradient-to-r from-white/20 via-white/10 to-transparent text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.1)]",
        new:
          "bg-white text-black border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]",
        sale:
          "bg-red-500/20 text-red-300 border-red-500/40",
        lowStock:
          "bg-amber-500/15 text-amber-300 border-amber-500/40",
        outOfStock:
          "bg-[#18181d] text-[#71717a] border-[#27272e] line-through",
        outline:
          "bg-transparent text-[#cbd5e1] border-[#3f3f4c]",
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
