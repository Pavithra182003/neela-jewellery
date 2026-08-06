import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../common/Container";
import { categoryService } from "../../services/categoryService";

const FALLBACK_IMAGE = "https://picsum.photos/seed/neela-category/500/600";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => setCategories((data.results || data).slice(0, 8)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">SHOP BY CATEGORY</p>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">Featured Categories</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-charcoal/5" />
              ))
            : categories.map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                >
                  <Link
                    to={`/shop?category=${category.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-lg border-2 border-transparent shadow-sm transition-all duration-300 hover:border-gold hover:shadow-xl"
                  >
                    <img
                      src={category.image || FALLBACK_IMAGE}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent transition-opacity duration-300 group-hover:from-charcoal/85" />

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-display text-lg text-cream">{category.name}</p>
                      <p className="text-xs tracking-widest text-cream/70">
                        {category.product_count} PIECE{category.product_count === 1 ? "" : "S"}
                      </p>

                      <span className="mt-3 inline-block translate-y-2 rounded-sm border border-gold bg-cream/0 px-4 py-1.5 text-xs tracking-wide text-gold-light opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-gold group-hover:text-charcoal group-hover:opacity-100">
                        Shop Now
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </Container>
    </section>
  );
}
