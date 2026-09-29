import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
}

const RadioContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}>({});

export function RadioGroup({
  value,
  onValueChange,
  children,
  className,
  name,
}: RadioGroupProps) {
  return (
    <RadioContext.Provider value={{ value, onValueChange, name }}>
      <div className={cn("grid gap-3", className)} role="radiogroup">
        {children}
      </div>
    </RadioContext.Provider>
  );
}

export interface RadioItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ className, value, label, description, disabled, id, ...props }, ref) => {
    const context = React.useContext(RadioContext);
    const checked = context.value === value;
    const inputId = id || React.useId();

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none",
          checked
            ? "border-[#ff5500] bg-orange-50/50 shadow-sm ring-1 ring-[#ff5500]"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="pt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="radio"
            name={context.name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={() => context.onValueChange?.(value)}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
              checked ? "border-[#ff5500]" : "border-slate-300"
            )}
          >
            {checked && <div className="h-2 w-2 rounded-full bg-[#ff5500]" />}
          </div>
        </div>
        <div className="flex-1">
          {label && (
            <div className="text-xs font-semibold text-slate-900 tracking-wide">
              {label}
            </div>
          )}
          {description && (
            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </label>
    );
  }
);
RadioItem.displayName = "RadioItem";
