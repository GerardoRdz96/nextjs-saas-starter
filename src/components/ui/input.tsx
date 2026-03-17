import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-lg border px-3 py-2 text-sm",
            "bg-white dark:bg-slate-900",
            "border-slate-300 dark:border-slate-700",
            "text-slate-900 dark:text-slate-100",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
