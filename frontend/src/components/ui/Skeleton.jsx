import { cn } from "../../lib/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      aria-hidden="true"
    />
  );
}

/** Matches ListingCard's layout so loading states don't jump when data arrives. */
export function ListingCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <Skeleton className="mb-3 h-40 w-full rounded-lg" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-3 h-3 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Chargement des annonces…</span>
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
