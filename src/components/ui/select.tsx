import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none bg-[#111115] px-4 py-2 pr-10 text-sm text-[#f4f4f6] border border-[#272730] rounded-xs transition-colors focus-visible:outline-none focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            error && "border-red-500 focus-visible:border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a] pointer-events-none" />
        {error && (
          <p className="mt-1.5 text-xs text-red-400 font-sans">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
