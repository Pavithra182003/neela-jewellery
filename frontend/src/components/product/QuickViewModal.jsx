import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiStar, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function QuickViewModal({ product, onClose }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  if (!product) return null;
  const wishlisted = isAuthenticated && isWishlisted(product.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-lg bg-cream shadow-2xl sm:grid-cols-2"
        >
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute right-3 top-3 z-10 rounded-full bg-cream/90 p-1.5 text-charcoal hover:text-gold-dark"
          >
            <FiX size={18} />
          </button>

          <div className="aspect-square bg-charcoal/5">
            <img
              src={product.primary_image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-[11px] tracking-[0.2em] text-charcoal/50">{product.category}</p>
            <h3 className="mt-1 font-display text-xl text-charcoal">{product.name}</h3>

            {product.review_count > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-charcoal/60">
                <FiStar size={12} className="fill-gold text-gold" />
                <span>{product.average_rating}</span>
                <span className="text-charcoal/40">({product.review_count} reviews)</span>
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-2xl text-charcoal">₹{product.current_price}</span>
              {product.discount_percentage > 0 && (
                <>
                  <span className="text-sm text-charcoal/40 line-through">₹{product.price}</span>
                  <span className="text-xs font-medium text-gold-dark">
                    -{product.discount_percentage}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => isAuthenticated && addToCart(product.id, 1)}
                disabled={!product.in_stock || !isAuthenticated}
                className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-charcoal px-5 py-3 text-sm text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiShoppingBag size={15} />
                {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={() => isAuthenticated && toggle(product.id)}
                disabled={!isAuthenticated}
                aria-label="Toggle wishlist"
                className={`flex h-11 w-11 items-center justify-center rounded-sm border transition-colors ${
                  wishlisted ? "border-gold-dark text-gold-dark" : "border-charcoal/20 text-charcoal hover:border-gold-dark hover:text-gold-dark"
                }`}
              >
                <FiHeart size={16} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="mt-4 text-center text-xs tracking-wide text-charcoal/60 underline-offset-2 hover:text-gold-dark hover:underline"
            >
              View Full Details
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
