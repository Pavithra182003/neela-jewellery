import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function MobileMenu({ open, onClose, categories = [], navLinks = [] }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gold/20 px-6 py-5">
              <span className="font-display text-xl tracking-widest text-charcoal">MENU</span>
              <button onClick={onClose} aria-label="Close menu" className="text-charcoal">
                <FiX size={22} />
              </button>
            </div>

            <nav className="space-y-6 px-6 py-6">
              <div>
                <p className="mb-3 text-xs tracking-[0.3em] text-gold-dark">SHOP BY CATEGORY</p>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/shop?category=${category.slug}`}
                        onClick={onClose}
                        className="text-charcoal hover:text-gold-dark"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 border-t border-gold/20 pt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={onClose}
                    className="block text-charcoal hover:text-gold-dark"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gold/20 pt-6">
                {isAuthenticated ? (
                  <>
                    <p className="mb-2 text-sm text-charcoal/60">
                      Signed in as {user?.full_name}
                    </p>
                    <Link to="/account" onClick={onClose} className="block text-charcoal hover:text-gold-dark">
                      My Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={onClose} className="block text-charcoal hover:text-gold-dark">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="mt-2 block text-charcoal hover:text-gold-dark"
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
