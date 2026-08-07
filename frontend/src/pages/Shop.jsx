import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSliders } from "react-icons/fi";

import Container from "../components/common/Container";
import ProductCard from "../components/product/ProductCard";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import ShopFilters from "../components/shop/ShopFilters";
import MobileFilterDrawer from "../components/shop/MobileFilterDrawer";
import ActiveFilters from "../components/shop/ActiveFilters";
import SortDropdown from "../components/shop/SortDropdown";
import Pagination from "../components/shop/Pagination";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const FILTER_KEYS = [
  "search",
  "category",
  //"material",
  "gender",
  "min_price",
  "max_price",
  "in_stock",
  "is_featured",
  "is_bestseller",
  "is_new_arrival",
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Derive the current filter/sort/page state straight from the URL —
  // this is the single source of truth, so filters survive refresh,
  // back/forward navigation, and are shareable as a link.
  const filters = useMemo(() => {
    const obj = {};
    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const ordering = searchParams.get("ordering") || "-created_at";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 12;

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => setCategories(data.results || data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .getProducts({ ...filters, ordering, page, page_size: pageSize })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.results || data);
        setCount(data.count ?? (data.results || data).length);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setCount(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === "" || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete("page"); // any filter change resets to page 1
    setSearchParams(next);
  };
  const updateMultipleParams = (params) => {
  const next = new URLSearchParams(searchParams);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === "" || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });

  next.delete("page");
  setSearchParams(next);
};

  const handleSortChange = (value) => {
    const next = new URLSearchParams(searchParams);
    next.set("ordering", value);
    next.delete("page");
    setSearchParams(next);
  };

  const handlePageChange = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", nextPage);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => setSearchParams({});

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const pageTitle = filters.search
    ? `Search results for "${filters.search}"`
    : filters.is_new_arrival
    ? "New Arrivals"
    : filters.is_bestseller
    ? "Best Sellers"
    : filters.is_featured
    ? "Featured Pieces"
    : "Shop All Jewelry";

  return (
    <Container className="py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">
          {loading ? "…" : `${count} PIECE${count === 1 ? "" : "S"}`}
        </p>
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">{pageTitle}</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ShopFilters filters={filters} onChange={updateParam} onMultiChange={updateMultipleParams} onClearAll={clearAll} categories={categories} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-gold/25 px-4 py-2 text-sm text-charcoal transition-colors hover:border-gold-dark hover:text-gold-dark lg:hidden"
            >
              <FiSliders size={15} />
              Filters
            </button>
            <div className="ml-auto">
              <SortDropdown value={ordering} onChange={handleSortChange} />
            </div>
          </div>

          <ActiveFilters filters={filters} categories={categories} onRemove={(key) => updateParam(key, null)} />

          {!loading && products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-xl text-charcoal">No pieces match these filters</p>
              <p className="mt-2 text-sm text-charcoal/60">Try adjusting or clearing your filters.</p>
              <button
                onClick={clearAll}
                className="mt-6 rounded-sm border border-gold-dark px-6 py-2.5 text-sm text-gold-dark transition-colors hover:bg-gold-dark hover:text-cream"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: pageSize }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: (i % pageSize) * 0.04 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={updateParam}
        onClearAll={clearAll}
        categories={categories}
      />
    </Container>
  );
}
