import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTransparentHeader } from "../../context/HeaderThemeContext";
import heroBanner from "../../assets/images/hero/hero-banner.jpg";

const HERO_IMAGE = heroBanner;

export default function Hero() {
  // Tells the Navbar to render transparent/glass over this hero instead
  // of its normal solid background. Automatically resets when this page
  // unmounts (see HeaderThemeContext.jsx).
  useTransparentHeader();

  return (
    <section className="relative -mt-20 flex h-screen min-h-[600px] w-full items-center overflow-hidden">
      <motion.img
        src={HERO_IMAGE}
        alt="Neela Jewellery"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/40" />

      

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="max-w-xl text-center sm:text-left"
        >
          <p className="mb-4 text-xs tracking-[0.4em] text-gold-light">
          THE SIGNATURE COLLECTION
        </p>

        <h1 className="font-display text-4xl leading-[1.1] text-cream sm:text-6xl">
          Every Piece
          <br />
          Has a Legacy
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base">
          From everyday elegance to unforgettable celebrations, explore jewellery that reflects your unique style.
        </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4 sm:justify-start">
            <Link
              to="/shop"
              className="rounded-sm bg-gold px-8 py-3.5 text-sm tracking-wide text-charcoal shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
            >
              Shop Now
            </Link>
            <Link
              to="/#shop-by-collection"
              onClick={(e) => {
                e.preventDefault();

                const section = document.getElementById("shop-by-collection");

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="rounded-sm border border-cream/50 px-8 py-3.5 text-sm tracking-wide text-cream transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold-light"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 h-9 w-5 -translate-x-1/2 rounded-full border border-cream/40"
      >
        <div className="mx-auto mt-1.5 h-1.5 w-1 rounded-full bg-cream/70" />
      </motion.div>
    </section>
  );
}
