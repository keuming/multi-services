import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trpc } from "../lib/trpc";
import { Container } from "../components/layout/Container";
import { Button } from "../components/ui/Button";
import {
  ServiceCategoryCard,
  ServiceCategoryCardSkeleton,
} from "../components/services/ServiceCategoryCard";
import { ListingGrid } from "../components/services/ListingCard";
import { ErrorState } from "../components/ui/EmptyState";
import { FALLBACK_CATEGORIES } from "../lib/categories";

export function Home() {
  const categoriesQuery = trpc.categories.list.useQuery();
  const featuredQuery = trpc.listings.list.useQuery({
    featuredOnly: true,
    pageSize: 6,
  });

  return (
    <>
      <section className="border-b border-gray-200 bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Une seule plateforme pour tous vos besoins du quotidien
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Véhicules, matériaux de construction, artisans, ramassage des
              ordures, gaz, plans de construction et bétail — trouvez un
              prestataire fiable en quelques minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                as={Link}
                to="/services"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Voir tous les services
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="categories-heading" className="py-14">
        <Container>
          <h2 id="categories-heading" className="text-xl font-semibold text-gray-900">
            Nos 7 services
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choisissez une catégorie pour parcourir les annonces disponibles.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesQuery.isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <ServiceCategoryCardSkeleton key={i} />
              ))}

            {categoriesQuery.isError && (
              <div className="sm:col-span-2 lg:col-span-3">
                <ErrorState onRetry={() => categoriesQuery.refetch()} />
              </div>
            )}

            {!categoriesQuery.isLoading &&
              !categoriesQuery.isError &&
              (categoriesQuery.data?.length ? categoriesQuery.data : FALLBACK_CATEGORIES).map(
                (category) => (
                  <ServiceCategoryCard key={category.slug} category={category} />
                )
              )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="featured-heading" className="border-t border-gray-200 bg-gray-50 py-14">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h2 id="featured-heading" className="text-xl font-semibold text-gray-900">
                Annonces en vedette
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Une sélection d'annonces mises en avant cette semaine.
              </p>
            </div>
            <Link
              to="/services"
              className="hidden text-sm font-medium text-brand-700 hover:text-brand-800 sm:block"
            >
              Voir tout
            </Link>
          </div>

          <div className="mt-6">
            <ListingGrid
              isLoading={featuredQuery.isLoading}
              isError={featuredQuery.isError}
              items={featuredQuery.data?.items}
              onRetry={() => featuredQuery.refetch()}
              emptyDescription="Aucune annonce en vedette pour le moment."
            />
          </div>
        </Container>
      </section>
    </>
  );
}
