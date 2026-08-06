import { Link } from "react-router-dom";
import Container from "../components/common/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center py-24">
      <p className="mb-3 font-display text-6xl text-gold-dark">404</p>
      <h1 className="mb-4 font-display text-2xl text-charcoal">This page has slipped away</h1>
      <p className="mb-8 max-w-sm text-charcoal/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="border border-gold-dark px-6 py-3 text-sm tracking-wide text-gold-dark transition-colors hover:bg-gold-dark hover:text-cream"
      >
        Return Home
      </Link>
    </Container>
  );
}
