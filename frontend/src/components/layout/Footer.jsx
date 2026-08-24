import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "./Container";
import { FALLBACK_CATEGORIES } from "../../lib/categories";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-brand-900 text-gray-300">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <img src="/logo.png" alt="" className="h-9 w-9 rounded-md object-contain" />
            CONNECTA
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Location • Agrégats • Artisans • Bétail — et bien plus : matériaux,
            ramassage des ordures, gaz, plans de construction.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Liens rapides
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white">
                Tous les services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Nos services
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {FALLBACK_CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link to={`/services/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Belle Vue Rond Point, Commune de Dixinn
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href="tel:+224623767616" className="hover:text-white">
                +224 623 76 76 16
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href="mailto:contact@connecta-services.com" className="hover:text-white">
                contact@connecta-services.com
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-4 text-xs text-gray-400">
          © {new Date().getFullYear()} CONNECTA — Compagnie des Services
          Numériques (CSN).
        </Container>
      </div>
    </footer>
  );
}
