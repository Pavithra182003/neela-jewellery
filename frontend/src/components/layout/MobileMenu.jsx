import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiX,
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function MobileMenu({
  open,
  onClose,
  categories = [],
  navLinks = [],
}) {
  const { isAuthenticated, user } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="
              fixed
              left-0
              top-0
              z-[9999]
              flex
              h-full
              w-[300px]
              max-w-[85vw]
              flex-col
              overflow-y-auto
              bg-cream
              shadow-2xl
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/20 px-5 py-5">
              <div>
                <h2 className="font-display text-xl text-charcoal">
                  NEELA
                  <span className="ml-1 text-gold-dark">
                    JEWELLERS
                  </span>
                </h2>

                <p className="mt-1 text-[10px] tracking-[0.25em] text-charcoal/50">
                  MENU
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-charcoal hover:bg-gold/10"
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-gold/20 px-5 py-4">
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 rounded-md border border-gold/20 bg-white/60 px-3"
              >
                <FiSearch
                  size={17}
                  className="shrink-0 text-charcoal/50"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewellery..."
                  className="w-full bg-transparent py-3 text-sm text-charcoal outline-none placeholder:text-charcoal/40"
                />
              </form>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 border-b border-gold/20">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 border-r border-gold/20 px-5 py-4 text-sm text-charcoal hover:bg-gold/10"
              >
                <FiHeart size={18} />

                <span>
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-1 text-xs text-gold-dark">
                      ({wishlistCount})
                    </span>
                  )}
                </span>
              </Link>

              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-4 text-sm text-charcoal hover:bg-gold/10"
              >
                <FiShoppingBag size={18} />

                <span>
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 text-xs text-gold-dark">
                      ({cartCount})
                    </span>
                  )}
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="space-y-6 px-5 py-6">

              {/* Main Links */}
              <div>
                <p className="mb-4 text-xs font-medium tracking-[0.25em] text-gold-dark">
                  MENU
                </p>

                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        onClick={onClose}
                        className="block text-sm text-charcoal hover:text-gold-dark"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="border-t border-gold/20 pt-6">
                  <p className="mb-4 text-xs font-medium tracking-[0.25em] text-gold-dark">
                    SHOP BY CATEGORY
                  </p>

                  <ul className="space-y-4">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to={`/shop?category=${category.slug}`}
                          onClick={onClose}
                          className="block text-sm text-charcoal hover:text-gold-dark"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Account */}
              {/* Account */}
<div className="border-t border-gold/20 pt-6">
  <div className="mb-4 flex items-center gap-3">
    <FiUser
      size={18}
      className="text-gold-dark"
    />

    <p className="text-xs font-medium tracking-[0.2em] text-gold-dark">
      ACCOUNT
    </p>
  </div>

  {isAuthenticated ? (
    <>
      <p className="mb-3 truncate text-xs text-charcoal/50">
        {user?.email}
      </p>

      <Link
        to="/account"
        onClick={onClose}
        className="block py-2 text-sm text-charcoal hover:text-gold-dark"
      >
        My Account
      </Link>

      <Link
        to="/account/orders"
        onClick={onClose}
        className="block py-2 text-sm text-charcoal hover:text-gold-dark"
      >
        My Orders
      </Link>

      {(user?.is_staff || user?.is_superuser) && (
        <Link
          to="/admin"
          onClick={onClose}
          className="block py-2 text-sm font-medium text-gold-dark hover:text-gold-dark"
        >
          Admin Panel
        </Link>
      )}
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={onClose}
        className="block py-2 text-sm text-charcoal hover:text-gold-dark"
      >
        Login
      </Link>

      <Link
        to="/register"
        onClick={onClose}
        className="block py-2 text-sm text-charcoal hover:text-gold-dark"
      >
        Register
      </Link>
    </>
  )}
</div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}