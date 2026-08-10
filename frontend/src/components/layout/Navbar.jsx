import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import CategoryNavbar from "./CategoryNavbar";
import Container from "../common/Container";
import Logo from "../common/Logo";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import TopAnnouncementBar from "./TopAnnouncementBar";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useHeaderTheme } from "../../context/HeaderThemeContext";
import { categoryService } from "../../services/categoryService";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Bracelets", to: "/category/bracelets" },
  { label: "Earrings", to: "/category/earrings" },
  { label: "Necklace", to: "/category/necklace" },
  { label: "Anklets", to: "/category/anklets" },
  { label: "Bangles", to: "/category/bangles" },
  { label: "Finger Rings", to: "/category/finger-rings" },
];

function IconBadge({ count, light }) {
  if (!count) return null;

  return (
    <span
      className={`absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-medium ${
        light
          ? "bg-cream text-charcoal"
          : "bg-gold-dark text-cream"
      }`}
    >
      {count}
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { transparent } = useHeaderTheme();

  const navigate = useNavigate();

  const isLight = transparent && !scrolled;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setCategories(list);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(
      `/shop?search=${encodeURIComponent(
        searchQuery.trim()
      )}`
    );

    setSearchOpen(false);
    setSearchQuery("");
  };

  const iconClasses =
    "relative p-2 text-charcoal transition-all duration-300 hover:text-[#9c8155]";

  return (
    <header className="w-full max-w-full overflow-x-hidden">
      <TopAnnouncementBar />

      <nav className="relative w-full border-b border-gold/20 bg-[#ddd4c7] shadow-sm">
        <Container className="w-full max-w-full px-3 sm:px-6 lg:px-8">
          <div className="flex h-20 w-full items-center justify-between sm:h-24 lg:h-28">

            {/* Mobile Menu Button */}
            <button
              className={`flex shrink-0 items-center justify-center p-2 lg:hidden ${
                isLight
                  ? "text-cream"
                  : "text-charcoal"
              }`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={23} />
            </button>

            {/* Logo */}
            <div className="flex min-w-0 flex-1 items-center justify-center lg:flex-none lg:w-1/3 lg:justify-start">
              <div className="scale-90 sm:scale-100 lg:scale-110">
                <Logo />
              </div>
            </div>

            {/* Center Brand Name - Desktop */}
            <div className="hidden min-w-0 flex-1 justify-center lg:flex">
              <h1 className="whitespace-nowrap text-3xl font-serif font-semibold tracking-[5px] xl:text-4xl xl:tracking-[7px]">
                NEELA
                <span className="ml-3 text-[#9c8155] font-normal tracking-[3px] xl:ml-4 xl:tracking-[4px]">
                  JEWELLERS
                </span>
              </h1>
            </div>

            {/* Right Icons */}
            <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2 lg:w-1/3 lg:gap-4">

              {/* Search */}
              <button
                className={iconClasses}
                onClick={() =>
                  setSearchOpen((v) => !v)
                }
                aria-label="Search"
              >
                <FiSearch size={19} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className={iconClasses}
                aria-label="Wishlist"
              >
                <FiHeart size={19} />

                <IconBadge
                  count={wishlistCount}
                  light={isLight}
                />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className={iconClasses}
                aria-label="Cart"
              >
                <FiShoppingBag size={19} />

                <IconBadge
                  count={cartCount}
                  light={isLight}
                />
              </Link>

              {/* Account - Desktop */}
              <div className="relative hidden sm:block">
                <button
                  className={iconClasses}
                  onClick={() =>
                    setAccountMenuOpen((v) => !v)
                  }
                  aria-label="Account"
                >
                  <FiUser size={19} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-gold/20 bg-cream py-2 shadow-lg">
                    {isAuthenticated ? (
                      <>
                        <p className="truncate px-4 py-1.5 text-xs text-charcoal/50">
                          {user?.email}
                        </p>

                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                          onClick={() =>
                            setAccountMenuOpen(false)
                          }
                        >
                          My Account
                        </Link>

                        <Link
                          to="/account/orders"
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                          onClick={() =>
                            setAccountMenuOpen(false)
                          }
                        >
                          My Orders
                        </Link>

                        {user?.is_staff && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gold-dark hover:bg-gold/10"
                            onClick={() =>
                              setAccountMenuOpen(false)
                            }
                          >
                            Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() =>
                            setAccountMenuOpen(false)
                          }
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                        >
                          Login
                        </Link>

                        <Link
                          to="/register"
                          onClick={() =>
                            setAccountMenuOpen(false)
                          }
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>

        {/* Mega Menu */}
        <AnimatePresence>
          {megaMenuOpen && (
            <div
              onMouseEnter={() =>
                setMegaMenuOpen(true)
              }
              onMouseLeave={() =>
                setMegaMenuOpen(false)
              }
              className="hidden lg:block"
            >
              <MegaMenu
                categories={categories}
                onNavigate={() =>
                  setMegaMenuOpen(false)
                }
              />
            </div>
          )}
        </AnimatePresence>

        {/* Search */}
        {searchOpen && (
          <div className="border-t border-gold/20 bg-cream">
            <Container className="w-full max-w-full px-4 sm:px-6 lg:px-8">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3 py-3 sm:py-4"
              >
                <FiSearch
                  className="shrink-0 text-charcoal/40"
                  size={18}
                />

                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search for rings, necklaces, earrings…"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm placeholder:text-charcoal/40 focus:outline-none"
                />
              </form>
            </Container>
          </div>
        )}
      </nav>

      {/* Desktop Category Navigation */}
      <div className="hidden lg:block">
        <CategoryNavbar />
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        navLinks={NAV_LINKS}
      />
    </header>
  );
}