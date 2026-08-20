import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, MapPin, BadgeCheck, ImageOff, Phone } from "lucide-react";
import { trpc } from "../lib/trpc";
import { Container } from "../components/layout/Container";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/EmptyState";
import { RequestFormModal } from "../components/services/RequestFormModal";

export function ListingDetail() {
  const { id } = useParams();
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const listingQuery = trpc.listings.byId.useQuery(
    { id: Number(id) },
    { enabled: Number.isFinite(Number(id)) }
  );

  if (listingQuery.isLoading) {
    return (
      <Container className="py-10">
        <Skeleton className="mb-6 h-4 w-40" />
        <Skeleton className="mb-4 h-72 w-full rounded-2xl" />
        <Skeleton className="mb-2 h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </Container>
    );
  }

  if (listingQuery.isError || !listingQuery.data) {
    return (
      <Container className="py-14">
        <ErrorState
          title="Annonce introuvable"
          description="Cette annonce n'existe plus ou a été retirée."
          onRetry={listingQuery.isError ? () => listingQuery.refetch() : undefined}
        />
      </Container>
    );
  }

  const listing = listingQuery.data;

  return (
    <>
      <Container className="py-8">
        <nav aria-label="Fil d'ariane" className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand-700">Accueil</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link to={`/services/${listing.categorySlug}`} className="hover:text-brand-700">
            {listing.categoryName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span aria-current="page" className="line-clamp-1 text-gray-700">
            {listing.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
              {listing.imageUrl ? (
                <img src={listing.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <ImageOff className="h-10 w-10" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="mt-6">
              <Badge tone="brand">{listing.categoryName}</Badge>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">{listing.title}</h1>
              {listing.city && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {listing.city}
                </p>
              )}
              {listing.description && (
                <p className="mt-5 whitespace-pre-line text-gray-700">{listing.description}</p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-card">
              <p className="text-lg font-semibold text-gray-900">
                {listing.priceLabel ?? "Prix sur devis"}
              </p>

              {listing.providerName && (
                <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
                    {listing.providerName.charAt(0)}
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      {listing.providerName}
                      {listing.providerVerified && (
                        <BadgeCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
                      )}
                    </p>
                    {listing.providerCity && (
                      <p className="text-xs text-gray-500">{listing.providerCity}</p>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => setIsRequestOpen(true)}
                className="mt-5 w-full"
                leftIcon={<Phone className="h-4 w-4" aria-hidden="true" />}
              >
                Être mis en relation
              </Button>
            </div>
          </aside>
        </div>
      </Container>

      <RequestFormModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        categoryId={listing.categoryId}
        listingId={listing.id}
        contextLabel={`Demande liée à : ${listing.title}`}
      />
    </>
  );
}
