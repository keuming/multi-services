import { Link } from "react-router-dom";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900">CONNECTA</p>
          <p className="mt-1 text-sm text-gray-500">
            Location • Agrégats • Artisans • Bétail — et bien plus : matériaux,
            ramassage des ordures, gaz, plans de construction.
          </p>
        </div>
        <nav aria-label="Liens de pied de page" className="flex gap-6 text-sm text-gray-600">
          <Link to="/services" className="hover:text-brand-700">
            Services
          </Link>
          <Link to="/contact" className="hover:text-brand-700">
            Contact
          </Link>
        </nav>
      </Container>
      <Container className="border-t border-gray-100 py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} CONNECTA — Compagnie des Services
        Numériques (CSN).
      </Container>
    </footer>
  );
}
