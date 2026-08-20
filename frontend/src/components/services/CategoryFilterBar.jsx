import { Search } from "lucide-react";
import { Input } from "../ui/Input";

/**
 * Controlled filter bar. Deliberately stateless (parent owns `search`/`city`)
 * so it can be reused on the "all services" page and on a single category
 * page without duplicating filter state logic.
 */
export function CategoryFilterBar({ search, onSearchChange, city, onCityChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Rechercher une annonce…"
          aria-label="Rechercher une annonce"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="sm:w-56">
        <Input
          type="text"
          placeholder="Filtrer par ville"
          aria-label="Filtrer par ville"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
      </div>
    </div>
  );
}
