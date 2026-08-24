import { Phone, Mail } from "lucide-react";
import { Container } from "./Container";

/**
 * Slim contact bar above the main navbar. Purely informational (phone +
 * email as click-to-call / click-to-email links) — no navigation here.
 */
export function TopBar() {
  return (
    <div className="bg-brand-900 text-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-xs sm:justify-end sm:text-sm">
        <a
          href="tel:+224623767616"
          className="flex items-center gap-1.5 text-gray-200 hover:text-white"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          +224 623 76 76 16
        </a>
        <a
          href="mailto:contact@connecta-services.com"
          className="flex items-center gap-1.5 text-gray-200 hover:text-white"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          contact@connecta-services.com
        </a>
      </Container>
    </div>
  );
}
