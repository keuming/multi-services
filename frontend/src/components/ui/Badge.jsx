import { cn } from "../../lib/utils";

const TONES = {
  brand: "bg-brand-100 text-brand-800",
  gray: "bg-gray-100 text-gray-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
};

export function Badge({ tone = "gray", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
