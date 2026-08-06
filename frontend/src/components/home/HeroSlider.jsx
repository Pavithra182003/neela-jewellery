import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Static curated content for now — a future enhancement could move
// this to an admin-managed Banner model, but the brief's database
// design didn't call for one, so these are hand-authored like a real
// jeweler's seasonal campaign copy.
const SLIDES = [
  {
    id: 1,
    eyebrow: "THE SIGNATURE COLLECTION",
    headline: "Heirlooms, made new",
    subcopy: "Hallmarked gold and diamond pieces, hand-finished for a lifetime of wear.",
    cta: { label: "Shop the Collection", to: "/shop?is_featured=true" },
    image: "https://picsum.photos/seed/neela-hero-1/1600/900",
  },
  {
    id: 2,
    eyebrow: "NEW THIS SEASON",
    headline: "The Monsoon Bloom edit",
    subcopy: "Emerald and gold, designed to catch the light after the rain.",
    cta: { label: "Explore New Arrivals", to: "/shop?is_new_arrival=true" },
    image: "https://picsum.photos/seed/neela-hero-2/1600/900",
  },
  {
    id: 3,
    eyebrow: "FOR THE ONE DAY THAT LASTS FOREVER",
    headline: "Bridal, reimagined",
    subcopy: "Statement sets crafted for your most photographed moments.",
    cta: { label: "Shop Bridal", to: "/shop?category=bridal" },
    image: "https://picsum.photos/seed/neela-hero-3/1600/900",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative h-[70vh] min-h-[480px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

          <div className="absolute inset-0 flex items-end sm:items-center">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-lg"
              >
                <p className="mb-3 text-xs tracking-[0.35em] text-gold">{slide.eyebrow}</p>
                <h1 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
                  {slide.headline}
                </h1>
                <p className="mt-4 text-sm text-cream/80 sm:text-base">{slide.subcopy}</p>
                <Link
                  to={slide.cta.to}
                  className="mt-8 inline-block border border-gold px-7 py-3 text-sm tracking-wide text-gold transition-colors hover:bg-gold hover:text-charcoal"
                >
                  {slide.cta.label}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-cream/70 transition-colors hover:text-gold sm:block"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-cream/70 transition-colors hover:text-gold sm:block"
      >
        <FiChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-px transition-all duration-300 ${
              i === index ? "w-8 bg-gold" : "w-4 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
