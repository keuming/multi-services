import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export const Select = forwardRef(function Select(
  { label, error, hint, id, className, required, children, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-gray-800">
          {label}
          {required && <span className="text-red-600" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          className={cn(
            "w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-900",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-brand-600",
            error ? "border-red-400" : "border-gray-300",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
