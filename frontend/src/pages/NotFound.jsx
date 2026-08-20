import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Container } from "../components/layout/Container";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <Compass className="h-12 w-12 text-gray-300" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-gray-900">Page introuvable</h1>
      <p className="max-w-sm text-gray-500">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Button as={Link} to="/">
        Retour à l'accueil
      </Button>
    </Container>
  );
}
