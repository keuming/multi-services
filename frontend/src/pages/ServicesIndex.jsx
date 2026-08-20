import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { trpc } from "../lib/trpc";
import { Container } from "../components/layout/Container";
import { CategoryFilterBar } from "../components/services/CategoryFilterBar";
import { ListingGrid } from "../components/services/ListingCard";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";
import { FALLBACK_CATEGORIES } from "../lib/categories";

export function ServicesIndex() {
  const [activeSlug, setActiveSlug] = useState(null); // null = "Tous"
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedCity = useDebouncedValue(city, 300);

  const categoriesQuery = trpc.categories.list.useQuery();
  const listingsQuery = trpc.listings.list.useQuery({
    categorySlug: activeSlug ?? undefined,
    search: debouncedSearch || undefined,
    city: debouncedCity || undefined,
    pageSize: 24,
  });

  const categories = categoriesQuery.data?.length ? categoriesQuery.data : FALLBACK_CATEGORIES;

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold text-gray-900">Tous les services</h1>
      <p className="mt-1 text-sm text-gray-500">
        Parcourez les 7 verticales ou filtrez par recherche et ville.
      </p>

      <div
        role="tablist"
        aria-label="Filtrer par catégorie"
        className="mt-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSlug === null}
          onClick={() => setActiveSlug(null)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === null
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Tous
        </button>

        {categoriesQuery.isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}

        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            role="tab"
            aria-selected={activeSlug === category.slug}
            onClick={() => setActiveSlug(category.slug)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeSlug === category.slug
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <CategoryFilterBar
          search={search}
          onSearchChange={setSearch}
          city={city}
          onCityChange={setCity}
        />
      </div>

      <div className="mt-6">
        <ListingGrid
          isLoading={listingsQuery.isLoading}
          isError={listingsQuery.isError}
          items={listingsQuery.data?.items}
          onRetry={() => listingsQuery.refetch()}
          emptyDescription="Essayez une autre catégorie ou élargissez votre recherche."
        />
      </div>

      {activeSlug && (
        <p className="mt-6 text-sm text-gray-500">
          Voir la page dédiée :{" "}
          <Link to={`/services/${activeSlug}`} className="font-medium text-brand-700 hover:underline">
            {categories.find((c) => c.slug === activeSlug)?.name}
          </Link>
        </p>
      )}
    </Container>
  );
}
