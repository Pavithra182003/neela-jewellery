import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FiChevronDown, FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
import CategoryNavbar from "./CategoryNavbar";
import Container from "../common/Container";
import Logo from "../common/Logo";
import NavItem from "../common/NavItem";
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
        light ? "bg-cream text-charcoal" : "bg-gold-dark text-cream"
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

  // "Light" mode = transparent hero mode AND not yet scrolled: cream
  // text/icons over the hero image. Everywhere else uses dark text on
  // a solid/glass cream background.
  const isLight = transparent && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => setCategories(data.results || data))
      .catch(() => setCategories([]));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const iconClasses = "relative p-2 text-charcoal hover:text-[#9c8155] transition-all duration-300";
  return (
    <header className="sticky top-0 z-40">
      {(!transparent || scrolled) && <TopAnnouncementBar />}

      <nav
  className={`relative z-50 w-full border-b border-gold/20 transition-all duration-300 ${
    isLight
      ? "bg-transparent"
      : "bg-[#ddd4c7] shadow-sm"
  }`}
>
  <Container
    className="
      flex
      h-[72px]
      w-full
      items-center
      justify-between
      px-4
      sm:h-20
      sm:px-6
      lg:grid
      lg:h-28
      lg:grid-cols-[220px_1fr_220px]
      lg:px-8
    "
  >

    {/* MOBILE MENU BUTTON */}
    <button
      className={`
        flex
        items-center
        justify-center
        p-2
        lg:hidden
        ${isLight ? "text-cream" : "text-charcoal"}
      `}
      onClick={() => setMobileOpen(true)}
      aria-label="Open menu"
    >
      <FiMenu size={23} />
    </button>


    {/* LOGO */}
    <div
      className="
        absolute
        left-1/2
        -translate-x-1/2
        lg:static
        lg:translate-x-0
      "
    >
      <div className="flex items-center justify-center">
        <h1
          className={`
            whitespace-nowrap
            font-serif
            text-xl
            font-semibold
            tracking-[4px]
            sm:text-2xl
            sm:tracking-[5px]
            lg:text-4xl
            lg:tracking-[8px]
            ${isLight ? "text-cream" : "text-charcoal"}
          `}
        >
          NEELA
          <span
            className="
              ml-2
              text-[#9c8155]
              font-normal
              tracking-[2px]
              sm:ml-3
              sm:tracking-[3px]
              lg:ml-4
              lg:tracking-[4px]
            "
          >
            JEWELLERS
          </span>
        </h1>
      </div>
    </div>


    {/* DESKTOP CENTER */}
    <div className="hidden lg:flex lg:justify-center">
      <Logo />
    </div>


    {/* RIGHT SIDE ICONS */}
    <div
      className="
        ml-auto
        flex
        items-center
        gap-1
        sm:gap-2
        lg:gap-4
      "
    >

      {/* SEARCH */}
      <button
        className={`
          relative
          p-2
          transition-all
          duration-300
          ${
            isLight
              ? "text-cream hover:text-gold-light"
              : "text-charcoal hover:text-[#9c8155]"
          }
        `}
        onClick={() => setSearchOpen((v) => !v)}
        aria-label="Search"
      >
        <FiSearch size={19} />
      </button>


      {/* WISHLIST */}
      <Link
        to="/wishlist"
        className={`
          relative
          p-2
          transition-all
          duration-300
          ${
            isLight
              ? "text-cream hover:text-gold-light"
              : "text-charcoal hover:text-[#9c8155]"
          }
        `}
        aria-label="Wishlist"
      >
        <FiHeart size={19} />

        <IconBadge
          count={wishlistCount}
          light={isLight}
        />
      </Link>


      {/* CART */}
      <Link
        to="/cart"
        className={`
          relative
          p-2
          transition-all
          duration-300
          ${
            isLight
              ? "text-cream hover:text-gold-light"
              : "text-charcoal hover:text-[#9c8155]"
          }
        `}
        aria-label="Cart"
      >
        <FiShoppingBag size={19} />

        <IconBadge
          count={cartCount}
          light={isLight}
        />
      </Link>


      {/* USER - DESKTOP ONLY */}
      <div className="relative hidden sm:block">
        <button
          className={`
            p-2
            transition-all
            duration-300
            ${
              isLight
                ? "text-cream hover:text-gold-light"
                : "text-charcoal hover:text-[#9c8155]"
            }
          `}
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
                  onClick={() => setAccountMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-dark"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setAccountMenuOpen(false)}
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
        border-t
        border-gold/20
        ${
          isLight
            ? "bg-black/40 backdrop-blur-md"
            : "bg-cream"
        }
      `}
    >
      <Container className="py-3 sm:py-4">
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


  {/* DESKTOP CATEGORY NAVIGATION */}
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
      <CategoryNavbar />

        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          categories={categories}
          navLinks={NAV_LINKS}
        />
    </header>
  );
}
