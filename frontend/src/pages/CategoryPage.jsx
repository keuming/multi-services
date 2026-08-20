import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { trpc } from "../lib/trpc";
import { Container } from "../components/layout/Container";
import { CategoryFilterBar } from "../components/services/CategoryFilterBar";
import { ListingGrid } from "../components/services/ListingCard";
import { RequestFormModal } from "../components/services/RequestFormModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/EmptyState";
import { getCategoryIcon, getCategoryAccent } from "../lib/categories";
import { ChevronRight } from "lucide-react";

export function CategoryPage() {
  const { slug } = useParams();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedCity = useDebouncedValue(city, 300);

  const categoryQuery = trpc.categories.bySlug.useQuery({ slug });
  const listingsQuery = trpc.listings.list.useQuery({
    categorySlug: slug,
    search: debouncedSearch || undefined,
    city: debouncedCity || undefined,
    pageSize: 24,
  });

  const Icon = useMemo(
    () => getCategoryIcon(categoryQuery.data?.icon),
    [categoryQuery.data?.icon]
  );
  const accent = useMemo(() => getCategoryAccent(slug), [slug]);

  if (categoryQuery.isError) {
    return (
      <Container className="py-14">
        <ErrorState onRetry={() => categoryQuery.refetch()} />
      </Container>
    );
  }

  if (!categoryQuery.isLoading && !categoryQuery.data) {
    return (
      <Container className="py-14">
        <ErrorState
          title="Catégorie introuvable"
          description="Cette catégorie de services n'existe pas ou plus."
        />
      </Container>
    );
  }

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        <Container className="py-8">
          <nav aria-label="Fil d'ariane" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
            <Link to="/" className="hover:text-brand-700">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link to="/services" className="hover:text-brand-700">Services</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span aria-current="page" className="text-gray-700">
              {categoryQuery.data?.name ?? <Skeleton className="inline-block h-4 w-24" />}
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: accent.bg, color: accent.text }}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                {categoryQuery.isLoading ? (
                  <Skeleton className="h-7 w-56" />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{categoryQuery.data.name}</h1>
                )}
                {categoryQuery.data?.shortDescription && (
                  <p className="mt-1 text-sm text-gray-500">
                    {categoryQuery.data.shortDescription}
                  </p>
                )}
              </div>
            </div>
            <Button onClick={() => setIsRequestOpen(true)}>Être mis en relation</Button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="mb-6">
          <CategoryFilterBar
            search={search}
            onSearchChange={setSearch}
            city={city}
            onCityChange={setCity}
          />
        </div>

        <ListingGrid
          isLoading={listingsQuery.isLoading}
          isError={listingsQuery.isError}
          items={listingsQuery.data?.items}
          onRetry={() => listingsQuery.refetch()}
          emptyDescription="Essayez d'élargir votre recherche ou revenez plus tard."
        />
      </Container>

      {categoryQuery.data && (
        <RequestFormModal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
          categoryId={categoryQuery.data.id}
          contextLabel={`Demande liée à : ${categoryQuery.data.name}`}
        />
      )}
    </>
  );
}
