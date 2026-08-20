import { cn } from "../../lib/utils";

/**
 * Generic surface used by ListingCard, ServiceCategoryCard, forms, etc.
 * Kept unopinionated (no padding by default) so callers compose it freely.
 */
export function Card({ as: Component = "div", className, children, ...props }) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}
