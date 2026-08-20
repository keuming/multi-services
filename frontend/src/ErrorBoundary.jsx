import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/Button";
import { Container } from "./components/layout/Container";

/**
 * Last-resort safety net. React Query already handles data-fetching errors
 * gracefully (see ErrorState), so this only fires on genuine render bugs —
 * but without it, a single bad render blanks the entire page.
 */
export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Nexova Services — erreur non gérée :", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900">Une erreur est survenue</h1>
        <p className="max-w-sm text-gray-500">
          Quelque chose s'est mal passé. Vous pouvez réessayer en revenant à
          l'accueil.
        </p>
        <Button onClick={this.handleReload}>Retour à l'accueil</Button>
      </Container>
    );
  }
}
