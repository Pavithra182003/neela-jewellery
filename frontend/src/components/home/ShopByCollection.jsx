import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../common/Container";

// Category images
import necklace from "../../assets/images/categories/necklace.jpg";
import earrings from "../../assets/images/categories/earrings.jpg";
import fingerRing from "../../assets/images/categories/finger-rings.jpg";
import bangles from "../../assets/images/categories/bangles.jpg";
import bracelets from "../../assets/images/categories/bracelets.jpg";
import anklets from "../../assets/images/categories/anklets.jpg";
import waistChain from "../../assets/images/categories/waist-chain.jpg";
import handChain from "../../assets/images/categories/hand-chain.jpg";
import comboSets from "../../assets/images/categories/combo-sets.jpg";

const COLLECTIONS = [
  {
    id: 1,
    name: "Necklace",
    image: necklace,
    link: "/shop?category=necklace",
  },
  {
    id: 2,
    name: "Earrings",
    image: earrings,
    link: "/shop?category=earrings",
  },
  {
    id: 3,
    name: "Finger Rings",
    image: fingerRing,
    link: "/shop?category=finger-rings",
  },
  {
    id: 4,
    name: "Bangles",
    image: bangles,
    link: "/shop?category=bangles",
  },
  {
    id: 5,
    name: "Bracelets",
    image: bracelets,
    link: "/shop?category=bracelets",
  },
  {
    id: 6,
    name: "Anklets",
    image: anklets,
    link: "/shop?category=anklets",
  },
  {
    id: 7,
    name: "Waist Chain",
    image: waistChain,
    link: "/shop?category=waist-chain",
  },
  {
    id: 8,
    name: "Hand Chain",
    image: handChain,
    link: "/shop?category=hand-chain",
  },
  {
    id: 9,
    name: "Combo Sets",
    image: comboSets,
    link: "/shop?category=combo-sets",
  },
];

export default function ShopByCollection() {
  return (
    <section
      id="shop-by-collection"
      className="w-full overflow-hidden bg-cream py-12 sm:py-16 lg:py-20"
    >
      <Container>
        {/* Section Heading */}
        <div className="mb-8 text-center sm:mb-12">
          <p className="mb-2 text-xs tracking-[0.3em] text-[#9c8155] sm:text-sm">
            EXPLORE
          </p>

          <h2 className="font-display text-3xl text-charcoal sm:text-4xl lg:text-5xl">
            Shop by Collection
          </h2>
        </div>

        {/* Collection Grid */}
        <div
          className="
            grid
            w-full
            grid-cols-2
            gap-x-4
            gap-y-8
            sm:grid-cols-3
            sm:gap-x-6
            sm:gap-y-10
            lg:grid-cols-5
            lg:gap-x-8
            lg:gap-y-12
          "
        >
          {COLLECTIONS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className="min-w-0"
            >
              <Link
                to={item.link}
                className="group flex w-full min-w-0 flex-col items-center"
              >
                {/* Image */}
                <div
                  className="
                    aspect-square
                    w-full
                    max-w-[140px]
                    overflow-hidden
                    rounded-full
                    shadow-md
                    transition
                    duration-500
                    group-hover:scale-105
                    sm:max-w-[160px]
                    lg:max-w-[192px]
                  "
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Category Name */}
                <h3
                  className="
                    mt-3
                    w-full
                    truncate
                    text-center
                    text-sm
                    font-semibold
                    text-gray-900
                    transition
                    group-hover:text-[#9c8155]
                    sm:mt-4
                    sm:text-base
                    lg:mt-5
                    lg:text-2xl
                  "
                >
                  {item.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}