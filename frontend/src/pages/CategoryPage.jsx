import { Navigate, useParams } from "react-router-dom";

/**
 * Redirects the legacy path-style category URL (/shop/:categorySlug)
 * to the query-param style the rest of the app actually uses
 * (/shop?category=slug), which is what ShopFilters/ActiveFilters/
 * Pagination all read from. Keeps old/bookmarked links working.
 */
export default function CategoryPage() {
  const { categorySlug } = useParams();
  return <Navigate to={`/shop?category=${categorySlug}`} replace />;
}
