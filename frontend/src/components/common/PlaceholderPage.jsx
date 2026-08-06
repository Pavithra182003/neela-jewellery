import Container from "./Container";

export default function PlaceholderPage({ title, description }) {
  return (
    <Container className="py-24 text-center">
      <p className="mb-3 text-xs tracking-[0.35em] text-gold-dark">COMING SOON</p>
      <h1 className="mb-4 font-display text-3xl text-charcoal sm:text-4xl">{title}</h1>
      <p className="mx-auto max-w-md text-charcoal/60">
        {description || "This page is being crafted and will be built out in an upcoming module."}
      </p>
    </Container>
  );
}
