import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../common/Container";

// Import your category images
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
    <section id="shop-by-collection" className="py-20 bg-white">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-5xl font-serif text-[#2c2c2c]">
            Shop by Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8">
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
            >
              <Link
                to={item.link}
                className="flex flex-col items-center group"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-md transition duration-500 group-hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-gray-900 group-hover:text-[#9c8155] transition">
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