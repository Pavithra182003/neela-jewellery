import { Link } from "react-router-dom";

export default function LuxuryBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-[4/3] md:aspect-auto">
        <img
          src="https://picsum.photos/seed/neela-luxury-banner/900/900"
          alt="The Heritage Edit"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start justify-center bg-charcoal px-8 py-16 text-cream sm:px-16">
        <p className="mb-3 text-xs tracking-[0.35em] text-gold">LIMITED EDITION</p>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">The Heritage Edit</h2>
        <p className="mt-4 max-w-sm text-sm text-cream/70">
          A capsule of twelve pieces, each hand-finished by a single artisan and
          numbered on issue. Once each design sells out, it will not be remade.
        </p>
        <Link
          to="/shop?is_featured=true"
          className="mt-8 border border-gold px-7 py-3 text-sm tracking-wide text-gold transition-colors hover:bg-gold hover:text-charcoal"
        >
          Discover the Edit
        </Link>
      </div>
    </section>
  );
}
