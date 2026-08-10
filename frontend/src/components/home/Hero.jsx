import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTransparentHeader } from "../../context/HeaderThemeContext";
import heroBanner from "../../assets/images/hero/hero-banner.jpg";

const HERO_IMAGE = heroBanner;

export default function Hero() {
  useTransparentHeader();

  return (
    <section
      className="
        relative
        w-full
        min-w-0
        overflow-hidden
        bg-charcoal
        min-h-[calc(100svh-72px)]
        sm:min-h-[calc(100svh-80px)]
        lg:min-h-[calc(100svh-112px)]
      "
    >
      {/* Hero Image */}
      <motion.img
        src={HERO_IMAGE}
        alt="Neela Jewellery"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.4,
          ease: "easeOut",
        }}
        className="
          absolute
          inset-0
          block
          h-full
          w-full
          max-w-none
          object-cover
          object-center
        "
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Bottom gradient for mobile readability */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-2/3
          bg-gradient-to-t
          from-black/70
          via-black/20
          to-transparent
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100svh-72px)]
          w-full
          max-w-7xl
          items-end
          px-4
          pb-16
          sm:min-h-[calc(100svh-80px)]
          sm:px-6
          sm:pb-20
          lg:min-h-[calc(100svh-112px)]
          lg:items-center
          lg:px-8
          lg:pb-0
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.4,
          }}
          className="
            w-full
            max-w-xl
            text-center
            lg:text-left
          "
        >
          {/* Collection label */}
          <p
            className="
              mb-3
              text-[10px]
              tracking-[0.28em]
              text-gold-light
              sm:mb-4
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            THE SIGNATURE COLLECTION
          </p>

          {/* Heading */}
          <h1
            className="
              font-display
              text-[40px]
              leading-[1.05]
              text-cream
              sm:text-5xl
              lg:text-6xl
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
              max-w-[320px]
              text-xs
              leading-relaxed
              text-cream/85
              sm:mt-5
              sm:max-w-md
              sm:text-sm
              lg:mx-0
              lg:text-base
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
              sm:mt-8
              sm:flex-row
              sm:justify-center
              lg:justify-start
            "
          >
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
                tracking-wide
                text-charcoal
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-gold-light
                sm:w-auto
              "
            >
              Shop Now
            </Link>

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
                border-cream/50
                px-7
                py-3.5
                text-sm
                tracking-wide
                text-cream
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-gold
                hover:text-gold-light
                sm:w-auto
              "
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - laptop only */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-8
          left-1/2
          hidden
          h-9
          w-5
          -translate-x-1/2
          rounded-full
          border
          border-cream/40
          lg:block
        "
      >
        <div className="mx-auto mt-1.5 h-1.5 w-1 rounded-full bg-cream/70" />
      </motion.div>
    </section>
  );
}