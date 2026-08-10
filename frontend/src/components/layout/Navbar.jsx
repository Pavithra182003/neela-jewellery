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
        setCategories(
          Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data)
            ? data
            : []
        );
      })
      .catch(() => setCategories([]));
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

  const iconClasses = `
    relative
    p-1.5
    sm:p-2
    transition-all
    duration-300
    ${
      isLight
        ? "text-cream hover:text-gold-light"
        : "text-charcoal hover:text-[#9c8155]"
    }
  `;

  return (
    <header className="relative z-50 w-full min-w-0">
      
      {/* NAVBAR */}
      <nav
        className={`
          relative
          w-full
          border-b
          border-gold/20
          transition-all
          duration-300
          ${
            isLight
              ? "bg-transparent"
              : "bg-[#ddd4c7] shadow-sm"
          }
        `}
      >
        <Container
          className="
            relative
            flex
            h-[68px]
            w-full
            max-w-none
            items-center
            justify-between
            px-3
            sm:h-20
            sm:px-6
            lg:grid
            lg:h-28
            lg:max-w-7xl
            lg:grid-cols-[220px_1fr_220px]
            lg:px-8
          "
        >

          {/* MOBILE MENU */}
          <button
            className={`
              flex
              shrink-0
              items-center
              justify-center
              p-2
              lg:hidden
              ${
                isLight
                  ? "text-cream"
                  : "text-charcoal"
              }
            `}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>


          {/* MOBILE + DESKTOP BRAND */}
          <div
            className="
              absolute
              left-1/2
              flex
              -translate-x-1/2
              items-center
              justify-center
              lg:static
              lg:translate-x-0
              lg:justify-start
            "
          >
            <h1
              className={`
                whitespace-nowrap
                font-serif
                font-semibold
                text-[17px]
                leading-none
                tracking-[1.5px]
                sm:text-2xl
                sm:tracking-[3px]
                lg:text-4xl
                lg:tracking-[8px]
                ${
                  isLight
                    ? "text-cream"
                    : "text-charcoal"
                }
              `}
            >
              NEELA

              <span
                className="
                  ml-1
                  text-[#9c8155]
                  font-normal
                  tracking-[1px]
                  sm:ml-2
                  sm:tracking-[2px]
                  lg:ml-4
                  lg:tracking-[4px]
                "
              >
                JEWELLERS
              </span>
            </h1>
          </div>


          {/* DESKTOP LOGO */}
          <div className="hidden justify-center lg:flex">
            <Logo />
          </div>


          {/* RIGHT ICONS */}
          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-0
              sm:gap-1
              lg:gap-4
            "
          >

            {/* SEARCH */}
            <button
              className={iconClasses}
              onClick={() =>
                setSearchOpen((v) => !v)
              }
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>


            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className={iconClasses}
              aria-label="Wishlist"
            >
              <FiHeart size={18} />

              <IconBadge
                count={wishlistCount}
                light={isLight}
              />
            </Link>


            {/* CART */}
            <Link
              to="/cart"
              className={iconClasses}
              aria-label="Cart"
            >
              <FiShoppingBag size={18} />

              <IconBadge
                count={cartCount}
                light={isLight}
              />
            </Link>


            {/* USER - LAPTOP ONLY */}
            <div className="relative hidden lg:block">
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
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gold/20 bg-cream py-2 shadow-lg">

                  {isAuthenticated ? (
                    <>
                      <p className="truncate px-4 py-1.5 text-xs text-charcoal/50">
                        {user?.email}
                      </p>

                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                      >
                        My Account
                      </Link>

                      <Link
                        to="/account/orders"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                      >
                        My Orders
                      </Link>

                      {user?.is_staff && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gold-dark hover:bg-gold/10"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={logout}
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
        </Container>


        {/* SEARCH BAR */}
        {searchOpen && (
          <div
            className={`
              w-full
              border-t
              border-gold/20
              ${
                isLight
                  ? "bg-black/40 backdrop-blur-md"
                  : "bg-cream"
              }
            `}
          >
            <Container
              className="
                w-full
                max-w-none
                py-3
                sm:py-4
                lg:max-w-7xl
              "
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3"
              >
                <FiSearch
                  className={
                    isLight
                      ? "text-cream/60"
                      : "text-charcoal/40"
                  }
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
                  className={`
                    flex-1
                    bg-transparent
                    py-2
                    text-sm
                    focus:outline-none
                    ${
                      isLight
                        ? "text-cream placeholder:text-cream/50"
                        : "text-charcoal placeholder:text-charcoal/40"
                    }
                  `}
                />
              </form>
            </Container>
          </div>
        )}


        {/* DESKTOP CATEGORY NAV */}
        <div className="hidden lg:block">
          <CategoryNavbar />
        </div>


        {/* MEGA MENU */}
        <AnimatePresence>
          {megaMenuOpen && (
            <div
              onMouseEnter={() =>
                setMegaMenuOpen(true)
              }
              onMouseLeave={() =>
                setMegaMenuOpen(false)
              }
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

      </nav>


      {/* MOBILE MENU */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        navLinks={NAV_LINKS}
      />

    </header>
  );
}