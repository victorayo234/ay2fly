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
          "relative flex items-start gap-3.5 p-3.5 rounded-xs border transition-all cursor-pointer select-none",
          checked
            ? "border-white bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.06)]"
            : "border-[#272730] bg-[#111115] hover:border-[#3f3f4c] hover:bg-[#15151a]",
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
              "h-4 w-4 rounded-full border border-[#3f3f4c] flex items-center justify-center transition-all",
              checked && "border-white"
            )}
          >
            {checked && <div className="h-2 w-2 rounded-full bg-white" />}
          </div>
        </div>
        <div className="flex-1">
          {label && (
            <div className="text-xs font-semibold text-white tracking-wide">
              {label}
            </div>
          )}
          {description && (
            <div className="text-[11px] text-[#9ca3af] mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </label>
    );
  }
);
RadioItem.displayName = "RadioItem";
