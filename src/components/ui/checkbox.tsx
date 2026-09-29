import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, label, disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-3 select-none cursor-pointer group",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-lg border border-slate-300 bg-white transition-all flex items-center justify-center group-hover:border-slate-400 shadow-xs",
              checked && "bg-[#ff5500] border-[#ff5500] text-white",
              "group-focus-within:ring-2 group-focus-within:ring-[#ff5500]/40"
            )}
          >
            {checked && <Check className="h-3.5 w-3.5 stroke-[3] text-white" />}
          </div>
        </div>
        {label && (
          <span className="text-xs text-slate-700 group-hover:text-slate-900 transition-colors font-medium">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
