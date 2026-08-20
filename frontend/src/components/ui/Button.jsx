import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300",
  secondary:
    "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-400",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

/**
 * Base button used everywhere in the app. Handles its own loading/disabled
 * visual state so callers never have to hand-roll a spinner.
 */
export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;
  // Only native <button> understands `type`/`disabled`; a polymorphic
  // target (e.g. react-router's Link) gets its own semantics instead.
  const nativeButtonProps =
    Component === "button" ? { type, disabled: isDisabled } : {};

  return (
    <Component
      ref={ref}
      aria-busy={isLoading || undefined}
      aria-disabled={Component !== "button" && isDisabled ? true : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...nativeButtonProps}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </Component>
  );
});
