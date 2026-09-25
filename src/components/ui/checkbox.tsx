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
              "h-4.5 w-4.5 rounded-xs border border-[#3f3f4c] bg-[#111115] transition-all flex items-center justify-center group-hover:border-white/60",
              checked && "bg-white border-white text-black",
              "group-focus-within:ring-2 group-focus-within:ring-white group-focus-within:ring-offset-2 group-focus-within:ring-offset-[#09090b]"
            )}
          >
            {checked && <Check className="h-3 w-3 stroke-[3] text-black" />}
          </div>
        </div>
        {label && (
          <span className="text-xs text-[#d1d5db] group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
