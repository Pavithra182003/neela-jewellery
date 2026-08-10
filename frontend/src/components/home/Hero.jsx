import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTransparentHeader } from "../../context/HeaderThemeContext";
import heroBanner from "../../assets/images/hero/hero-banner.jpg";

const HERO_IMAGE = heroBanner;

export default function Hero() {
  useTransparentHeader();

  return (
    <section className="relative min-h-[calc(100svh-40px)] w-full overflow-hidden bg-charcoal">
      
      {/* Hero Image */}
      <motion.img
        src={HERO_IMAGE}
        alt="Neela Jewellery"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          sm:object-center
        "
      />

      {/* Dark overlay for text readability */}
      <div
        className="
          absolute
          inset-0
          bg-black/30
          sm:bg-black/25
        "
      />

      {/* Bottom gradient - especially useful on mobile */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-2/3
          bg-gradient-to-t
          from-black/65
          via-black/20
          to-transparent
        "
      />

      {/* Hero Content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[calc(100svh-40px)]
          w-full
          items-end
          justify-center
          px-5
          pb-20
          text-center
          sm:items-center
          sm:justify-start
          sm:px-10
          sm:pb-0
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="
            w-full
            max-w-xl
            sm:text-left
          "
        >
          {/* Eyebrow */}
          <p
            className="
              mb-3
              text-[10px]
              font-medium
              tracking-[0.28em]
              text-cream
              sm:mb-4
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            THE SIGNATURE COLLECTION
          </p>

          {/* Main Heading */}
          <h1
            className="
              font-display
              text-[42px]
              leading-[1.02]
              text-cream
              sm:text-6xl
              md:text-7xl
            "
          >
            Every Piece
            <br />
            Has a Legacy
          </h1>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-4
              max-w-[330px]
              text-[13px]
              leading-relaxed
              text-cream/90
              sm:mx-0
              sm:mt-5
              sm:max-w-md
              sm:text-base
            "
          >
            From everyday elegance to unforgettable celebrations,
            explore jewellery that reflects your unique style.
          </p>

          {/* Buttons */}
          <div
            className="
              mt-6
              flex
              w-full
              flex-col
              items-center
              gap-3
              sm:mt-9
              sm:flex-row
              sm:justify-start
              sm:gap-4
            "
          >
            {/* Shop Now */}
            <Link
              to="/shop"
              className="
                flex
                w-full
                max-w-[230px]
                items-center
                justify-center
                rounded-sm
                bg-gold
                px-7
                py-3.5
                text-sm
                font-medium
                tracking-wide
                text-charcoal
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-gold-light
                sm:w-auto
                sm:max-w-none
              "
            >
              Shop Now
            </Link>

            {/* Explore Collection */}
            <Link
              to="/#shop-by-collection"
              onClick={(e) => {
                e.preventDefault();

                const section =
                  document.getElementById("shop-by-collection");

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="
                flex
                w-full
                max-w-[230px]
                items-center
                justify-center
                rounded-sm
                border
                border-cream/60
                px-7
                py-3.5
                text-sm
                font-medium
                tracking-wide
                text-cream
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-gold
                hover:text-gold-light
                sm:w-auto
                sm:max-w-none
              "
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - desktop only */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          hidden
          h-9
          w-5
          -translate-x-1/2
          rounded-full
          border
          border-cream/40
          sm:block
        "
      >
        <div className="mx-auto mt-1.5 h-1.5 w-1 rounded-full bg-cream/70" />
      </motion.div>
    </section>
  );
}