import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../common/Container";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";

export default function ProductSection({ eyebrow, title, fetcher, viewAllLink, className = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
  .then((data) => {
    if (!cancelled) {
      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];

      setProducts(productList);
    }
  })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  if (!loading && products.length === 0) return null;

  return (
    <section className={`py-24 ${className}`}>
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">{eyebrow}</p>
            <h2 className="font-display text-3xl text-charcoal sm:text-4xl">{title}</h2>
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="hidden text-sm tracking-wide text-charcoal/70 transition-colors hover:text-gold-dark sm:block"
            >
              View All →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : (Array.isArray(products) ? products : [])
              .slice(0, 8)
              .map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
      </div>

        {viewAllLink && (
          <div className="mt-8 text-center sm:hidden">
            <Link to={viewAllLink} className="text-sm tracking-wide text-charcoal/70 hover:text-gold-dark">
              View All →
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
