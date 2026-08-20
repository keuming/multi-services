import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

/**
 * Text input with built-in label/error/hint wiring via aria-describedby so
 * screen readers announce validation state without any extra work at the
 * call site.
 */
export const Input = forwardRef(function Input(
  { label, error, hint, id, className, required, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-800">
          {label}
          {required && <span className="text-red-600" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          "rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-brand-600",
          error ? "border-red-400" : "border-gray-300",
          className
        )}
        {...props}
      />
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
