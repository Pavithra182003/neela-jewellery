import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import QuickViewModal from "./QuickViewModal";

const FALLBACK_IMAGE =
  "https://picsum.photos/seed/neela-placeholder/600/600"; // swap for real product photography via the admin panel

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [cartState, setCartState] = useState("idle"); // idle | adding | added
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);

  const wishlisted = isAuthenticated && isWishlisted(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || cartState === "adding" || !product.in_stock) return;
    setCartState("adding");
    try {
      await addToCart(product.id, 1);
      setCartState("added");
      setTimeout(() => setCartState("idle"), 1800);
    } catch {
      setCartState("idle");
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || wishlistBusy) return;
    setWishlistBusy(true);
    try {
      await toggle(product.id);
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setQuickViewOpen(true);
  };

  return (
    <>
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-charcoal/5">
          <img
            src={product.primary_image || FALLBACK_IMAGE}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              imageHovered && product.secondary_image ? "opacity-0" : "opacity-100"
            }`}
          />
          {product.secondary_image && (
            <img
              src={product.secondary_image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                imageHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.is_new_arrival && (
              <span className="rounded-sm bg-charcoal px-2 py-1 text-[10px] tracking-widest text-cream">NEW</span>
            )}
            {product.is_bestseller && (
              <span className="rounded-sm bg-gold-dark px-2 py-1 text-[10px] tracking-widest text-cream">BESTSELLER</span>
            )}
            {product.discount_percentage > 0 && (
              <span className="rounded-sm bg-cream px-2 py-1 text-[10px] tracking-widest text-charcoal shadow-sm">
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
              wishlisted ? "text-gold-dark" : "text-charcoal hover:text-gold-dark"
            }`}
          >
            <FiHeart size={15} fill={wishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick View — slides up on hover (desktop), always tappable on touch via the icon itself */}
          <button
            onClick={handleQuickView}
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-sm bg-cream/95 py-2.5 text-xs tracking-wide text-charcoal opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <FiEye size={14} />
            Quick View
          </button>

          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream/70">
              <span className="text-xs tracking-widest text-charcoal">OUT OF STOCK</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex min-h-[120px] flex-col">
          <p className="text-[11px] tracking-[0.2em] text-charcoal/50">{product.category}</p>
          <h3 className="truncate font-display text-base text-charcoal">{product.name}</h3>

          {product.review_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-charcoal/60">
              <FiStar size={12} className="fill-gold text-gold" />
              <span>{product.average_rating}</span>
              <span className="text-charcoal/40">({product.review_count})</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-lg font-semibold text-charcoal">
              ₹{product.current_price}
            </span>

            {product.discount_percentage > 0 && (
              <span className="text-sm text-charcoal/40 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock || cartState === "adding"}
              aria-label="Add to cart"
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold/40 text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-dark hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiShoppingBag size={14} />
            </button>
          </div>
          {cartState === "added" && (
            <p className="text-xs text-gold-dark">Added to cart</p>
          )}
        </div>
      </Link>

      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
