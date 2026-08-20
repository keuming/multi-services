import { Inbox, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

/** Generic "nothing here" placeholder — used for empty search/filter results. */
export function EmptyState({
  icon: Icon = Inbox,
  title = "Aucun résultat",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-gray-300" aria-hidden="true" />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Shown when a query fails — always offers a retry so the user isn't stuck. */
export function ErrorState({
  title = "Une erreur est survenue",
  description = "Impossible de charger les données pour le moment.",
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <AlertTriangle className="h-10 w-10 text-red-400" aria-hidden="true" />
      <div>
        <p className="font-medium text-red-900">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-red-700">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
