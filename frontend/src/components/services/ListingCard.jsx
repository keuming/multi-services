import { Link } from "react-router-dom";
import { MapPin, BadgeCheck, ImageOff } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ListingGridSkeleton } from "../ui/Skeleton";
import { EmptyState, ErrorState } from "../ui/EmptyState";

export function ListingCard({ listing }) {
  return (
    <Card
      as={Link}
      to={`/annonces/${listing.id}`}
      className="group block overflow-hidden transition-shadow hover:shadow-card-hover"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>
      <CardBody>
        <div className="mb-1.5 flex items-center gap-2">
          <Badge tone="brand">{listing.categoryName}</Badge>
          {listing.isFeatured && <Badge tone="warning">En vedette</Badge>}
        </div>
        <h3 className="line-clamp-2 font-semibold text-gray-900">{listing.title}</h3>
        {listing.city && (
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {listing.city}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {listing.priceLabel ?? "Prix sur devis"}
          </span>
          {listing.providerVerified && (
            <span
              className="flex items-center gap-1 text-xs font-medium text-brand-700"
              title="Prestataire vérifié"
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Vérifié
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Composes the loading / error / empty / success states for any listings
 * query so pages don't repeat this branching logic.
 */
export function ListingGrid({ isLoading, isError, items, onRetry, emptyDescription }) {
  if (isLoading) return <ListingGridSkeleton />;

  if (isError) {
    return (
      <ErrorState
        description="Impossible de charger les annonces. Vérifiez votre connexion."
        onRetry={onRetry}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="Aucune annonce pour le moment"
        description={emptyDescription ?? "Revenez bientôt, de nouvelles annonces arrivent régulièrement."}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
