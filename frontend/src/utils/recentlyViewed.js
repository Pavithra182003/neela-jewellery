const STORAGE_KEY = "nj_recently_viewed";
const MAX_ITEMS = 8;

/**
 * Recently-viewed is intentionally client-side only (localStorage) —
 * the database design doesn't include a RecentlyViewed model, and this
 * is exactly the kind of ephemeral, per-device UI state that doesn't
 * need a backend round trip. Stores lightweight product summaries
 * (enough to render a ProductCard), not full product objects.
 */
export function recordRecentlyViewed(product) {
  if (!product?.id) return;
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = existing.filter((p) => p.id !== product.id);
    const updated = [
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category?.name || product.category,
        price: product.price,
        discount_price: product.discount_price,
        current_price: product.current_price,
        discount_percentage: product.discount_percentage,
        primary_image: product.images?.[0]?.image || product.primary_image,
        average_rating: product.average_rating,
        review_count: product.review_count,
        in_stock: product.in_stock,
        is_new_arrival: product.is_new_arrival,
        is_bestseller: product.is_bestseller,
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — fail silently,
    // recently-viewed is a nice-to-have, not critical functionality
  }
}

export function getRecentlyViewed(excludeId) {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return excludeId ? items.filter((p) => p.id !== excludeId) : items;
  } catch {
    return [];
  }
}
