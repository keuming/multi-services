import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "../components/layout/Container";
import { Button } from "../components/ui/Button";
import { RequestFormModal } from "../components/services/RequestFormModal";

export function Contact() {
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  return (
    <Container className="py-14">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900">Contactez Nexova Services</h1>
        <p className="mt-2 text-gray-600">
          Une question, un partenariat, ou besoin d'aide pour trouver un
          prestataire ? Notre équipe vous répond rapidement.
        </p>

        <dl className="mt-8 space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <dd>Cocody Riviera 2, Immeuble Paul, Abidjan</dd>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <dd>+224 620 00 00 00</dd>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <dd>contact@nexova-services.com</dd>
          </div>
        </dl>

        <Button onClick={() => setIsRequestOpen(true)} className="mt-8">
          Envoyer une demande
        </Button>
      </div>

      {/* No categoryId/listingId: this is a general inquiry, not tied to a vertical. */}
      <RequestFormModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        contextLabel="Demande générale (via la page Contact)"
      />
    </Container>
  );
}
