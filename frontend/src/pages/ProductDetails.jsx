import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiCheck, FiHeart, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

import Container from "../components/common/Container";
import ProductGallery from "../components/product/ProductGallery";
import ProductTabs from "../components/product/ProductTabs";
import ProductRow from "../components/product/ProductRow";
import ShareButton from "../components/product/ShareButton";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { productService } from "../services/productService";
import { recordRecentlyViewed, getRecentlyViewed } from "../utils/recentlyViewed";

function StarRow({ rating, count }) {
  if (!count) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm text-charcoal/60">
      <span className="text-gold-dark">★</span>
      <span>{rating}</span>
      <span className="text-charcoal/40">({count} review{count === 1 ? "" : "s"})</span>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartState, setCartState] = useState("idle"); // idle | adding | added
  const [wishlistBusy, setWishlistBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setQuantity(1);

    productService
      .getProduct(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        recordRecentlyViewed(data);
        setRecentlyViewed(getRecentlyViewed(data.id));
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    productService
      .getRelated(slug)
      .then((data) => !cancelled && setRelated(data.results || data))
      .catch(() => !cancelled && setRelated([]));

    window.scrollTo({ top: 0 });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-charcoal/5" />
          <div className="space-y-4">
            <div className="h-3 w-1/4 animate-pulse bg-charcoal/10" />
            <div className="h-8 w-2/3 animate-pulse bg-charcoal/10" />
            <div className="h-5 w-1/3 animate-pulse bg-charcoal/10" />
            <div className="h-24 w-full animate-pulse bg-charcoal/10" />
          </div>
        </div>
      </Container>
    );
  }

  if (notFound || !product) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-2xl text-charcoal">Product not found</h1>
        <p className="mt-2 text-sm text-charcoal/60">This piece may have sold out or moved.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-sm border border-gold-dark px-6 py-2.5 text-sm text-gold-dark transition-colors hover:bg-gold-dark hover:text-cream"
        >
          Continue Shopping
        </Link>
      </Container>
    );
  }

  const wishlisted = isAuthenticated && isWishlisted(product.id);
  const maxQuantity = Math.min(product.stock_quantity, 10);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/login", { state: { from: { pathname: `/product/${slug}` } } });
    setCartState("adding");
    try {
      await addToCart(product.id, quantity);
      setCartState("added");
      setTimeout(() => setCartState("idle"), 2000);
    } catch {
      setCartState("idle");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return navigate("/login", { state: { from: { pathname: `/product/${slug}` } } });
    await addToCart(product.id, quantity);
    navigate("/cart");
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated || wishlistBusy) return;
    setWishlistBusy(true);
    try {
      await toggle(product.id);
    } finally {
      setWishlistBusy(false);
    }
  };

  return (
    <Container className="py-10">
      <nav className="mb-8 text-xs text-charcoal/50">
        <Link to="/" className="hover:text-gold-dark">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-gold-dark">Shop</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-gold-dark">
          {product.category?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} />

        <div>
          <p className="text-xs tracking-[0.25em] text-gold-dark">{product.category?.name}</p>
          <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">{product.name}</h1>

          <div className="mt-3">
            <StarRow rating={product.average_rating} count={product.review_count} />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-charcoal">₹{product.current_price}</span>
            {product.discount_percentage > 0 && (
              <>
                <span className="text-lg text-charcoal/40 line-through">₹{product.price}</span>
                <span className="rounded-sm bg-gold/15 px-2 py-1 text-xs font-medium text-gold-dark">
                  Save {product.discount_percentage}%
                </span>
              </>
            )}
          </div>

          {product.short_description && (
            <p className="mt-5 max-w-md text-sm leading-relaxed text-charcoal/70">
              {product.short_description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${product.in_stock ? "bg-green-600" : "bg-red-500"}`}
            />
            <span className={product.in_stock ? "text-charcoal/70" : "text-red-600"}>
              {product.in_stock ? `In Stock (${product.stock_quantity} available)` : "Out of Stock"}
            </span>
          </div>

          {product.in_stock && (
            <div className="mt-6">
              <p className="mb-2 text-xs tracking-wide text-charcoal/60">QUANTITY</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-sm border border-charcoal/20">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center text-charcoal transition-colors hover:text-gold-dark disabled:opacity-30"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    disabled={quantity >= maxQuantity}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center text-charcoal transition-colors hover:text-gold-dark disabled:opacity-30"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock || cartState === "adding"}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-charcoal px-6 py-3.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:min-w-[200px]"
            >
              {cartState === "added" ? <FiCheck size={16} /> : <FiShoppingBag size={16} />}
              {!product.in_stock ? "Out of Stock" : cartState === "added" ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.in_stock}
              className="flex flex-1 items-center justify-center rounded-sm border border-gold-dark px-6 py-3.5 text-sm tracking-wide text-gold-dark transition-colors hover:bg-gold-dark hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:min-w-[160px]"
            >
              Buy Now
            </button>

            <button
              onClick={handleToggleWishlist}
              aria-label="Toggle wishlist"
              className={`flex h-[50px] w-[50px] items-center justify-center rounded-sm border transition-colors ${
                wishlisted
                  ? "border-gold-dark text-gold-dark"
                  : "border-charcoal/20 text-charcoal hover:border-gold-dark hover:text-gold-dark"
              }`}
            >
              <FiHeart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-5">
            <ShareButton title={product.name} />
          </div>
        </div>
      </div>

      <ProductTabs product={product} />

      <ProductRow title="Related Products" products={related} />
      <ProductRow title="Recently Viewed" products={recentlyViewed} />
    </Container>
  );
}
