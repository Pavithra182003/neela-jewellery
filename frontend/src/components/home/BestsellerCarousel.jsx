import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Container from "../common/Container";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";
import { productService } from "../../services/productService";

const VISIBLE_DESKTOP = 4;

export default function BestsellerCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
  productService
    .getBestsellers()
    .then((data) => {
      const bestsellerProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];

      setProducts(bestsellerProducts);
    })
    .catch((error) => {
      console.error("Bestseller API error:", error);
      setProducts([]);
    })
    .finally(() => setLoading(false));
}, []);

  const pageCount = Math.max(1, Math.ceil(products.length / VISIBLE_DESKTOP));

  const goTo = useCallback(
    (index) => setPage(((index % pageCount) + pageCount) % pageCount),
    [pageCount]
  );

  useEffect(() => {
    if (paused || products.length <= VISIBLE_DESKTOP) return;
    const timer = setInterval(() => goTo(page + 1), 5000);
    return () => clearInterval(timer);
  }, [page, paused, products.length, goTo]);

  if (!loading && products.length === 0) return null;

   const visible = Array.isArray(products)
  ? products.slice(
      page * VISIBLE_DESKTOP,
      page * VISIBLE_DESKTOP + VISIBLE_DESKTOP
    )
  : [];

  return (
    <section
      className="bg-charcoal/[0.02] py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">CUSTOMER FAVORITES</p>
            <h2 className="font-display text-3xl text-charcoal sm:text-4xl">Bestsellers</h2>
          </div>

          {products.length > VISIBLE_DESKTOP && (
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => goTo(page - 1)}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-charcoal transition-colors hover:border-gold-dark hover:text-gold-dark"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() => goTo(page + 1)}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-charcoal transition-colors hover:border-gold-dark hover:text-gold-dark"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {pageCount > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === page ? "w-6 bg-gold-dark" : "w-1.5 bg-charcoal/20 hover:bg-charcoal/40"
                }`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
