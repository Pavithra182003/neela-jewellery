import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Container from "../common/Container";

// Curated brand testimonials. Product-specific reviews are real and
// live on each Product Details page (the Reviews API); this section
// is hand-picked homepage marketing copy, the way most luxury
// retailers feature their homepage quotes.
const TESTIMONIALS = [
  {
    id: 1,
    quote: "The craftsmanship is extraordinary — my engagement ring looks even better in person than online.",
    name: "Ananya R.",
    location: "Mumbai",
    photo: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: 2,
    quote: "Fast, insured shipping and the packaging alone felt like a gift. Will be back for my anniversary.",
    name: "Karthik M.",
    location: "Bengaluru",
    photo: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 3,
    quote: "I've bought from three different jewelers before Neela. This is the first time everything fit perfectly.",
    name: "Priya S.",
    location: "Delhi",
    photo: "https://i.pravatar.cc/100?img=32",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[index];
  const goTo = (i) => setIndex(((i % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="bg-charcoal py-24 text-cream">
      <Container className="max-w-2xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs tracking-[0.35em] text-gold">WHAT OUR CUSTOMERS SAY</p>
          <h2 className="font-display text-3xl sm:text-4xl">Loved, Worn, Treasured</h2>
        </div>

        <div className="relative flex items-center justify-center gap-4 sm:gap-8">
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous testimonial"
            className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-gold hover:text-gold sm:flex"
          >
            <FiChevronLeft size={18} />
          </button>

          <div className="min-h-[220px] flex-1 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={t.photo}
                  alt={t.name}
                  className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-gold object-cover"
                />
                <div className="mb-4 flex justify-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={14} className="fill-gold" />
                  ))}
                </div>
                <p className="font-display text-lg leading-relaxed text-cream/90">"{t.quote}"</p>
                <p className="mt-4 text-xs tracking-widest text-gold">
                  {t.name.toUpperCase()} — {t.location.toUpperCase()}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next testimonial"
            className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-gold hover:text-gold sm:flex"
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-gold" : "w-1.5 bg-cream/20 hover:bg-cream/40"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
