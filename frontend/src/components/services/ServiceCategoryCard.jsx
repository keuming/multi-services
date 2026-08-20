import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { getCategoryIcon } from "../../lib/categories";

export function ServiceCategoryCard({ category }) {
  const Icon = getCategoryIcon(category.icon);

  return (
    <Card
      as={Link}
      to={`/services/${category.slug}`}
      className="group block transition-shadow hover:shadow-card-hover"
    >
      <CardBody className="flex flex-col gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          {category.shortDescription && (
            <p className="mt-1 text-sm text-gray-500">{category.shortDescription}</p>
          )}
        </div>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
          Découvrir
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </CardBody>
    </Card>
  );
}

/** Skeleton counterpart, same footprint, used while categories.list is loading. */
export function ServiceCategoryCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 h-11 w-11 animate-pulse rounded-lg bg-gray-200" />
      <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
    </div>
  );
}
