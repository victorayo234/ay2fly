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
            "flex h-11 w-full appearance-none bg-white px-4 py-2 pr-10 text-sm text-slate-900 border border-slate-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:border-[#ff5500] focus-visible:ring-1 focus-visible:ring-[#ff5500] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs",
            error && "border-red-500 focus-visible:border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-sans">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
