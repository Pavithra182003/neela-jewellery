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
         className="relative border-b border-gold/20 bg-[#ddd4c7] shadow-sm"
      >
        <Container
  className="
    flex
    h-[68px]
    w-full
    max-w-none
    items-center
    px-3
    sm:h-20
    sm:px-5
    lg:h-28
    lg:max-w-7xl
    lg:px-8
  "
>
  {/* Mobile menu */}
  <button
    className={`
      mr-2
      flex
      shrink-0
      items-center
      justify-center
      p-2
      lg:hidden
      ${isLight ? "text-cream" : "text-charcoal"}
    `}
    onClick={() => setMobileOpen(true)}
    aria-label="Open menu"
  >
    <FiMenu size={22} />
  </button>

  {/* Logo + Name */}
  <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none">
    <Logo />

    <h1
      className={`
        min-w-0
        whitespace-nowrap
        font-serif
        font-semibold
        leading-none
        text-[15px]
        tracking-[1px]
        sm:text-2xl
        sm:tracking-[3px]
        lg:text-4xl
        lg:tracking-[8px]
        ${isLight ? "text-cream" : "text-charcoal"}
      `}
    >
      NEELA
      <span
        className="
          ml-1
          font-normal
          text-[#9c8155]
          tracking-[0.5px]
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

  {/* Right icons */}
  <div className="ml-auto flex shrink-0 items-center gap-0 sm:gap-1 lg:gap-4">

    <button
      className={iconClasses}
      onClick={() => setSearchOpen((v) => !v)}
      aria-label="Search"
    >
      <FiSearch size={18} />
    </button>

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

    {/* Account only on laptop */}
    <div className="relative hidden lg:block">
      {/* your existing account button/menu */}
    </div>

  </div>
</Container>

        <AnimatePresence>
          {megaMenuOpen && (
            <div onMouseEnter={() => setMegaMenuOpen(true)} onMouseLeave={() => setMegaMenuOpen(false)}>
              <MegaMenu categories={categories} onNavigate={() => setMegaMenuOpen(false)} />
            </div>
          )}
        </AnimatePresence>

        {searchOpen && (
          <div className="border-t border-gold/20 bg-cream">
            <Container className="py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <FiSearch className="text-charcoal/40" size={18} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for rings, necklaces, earrings…"
                  className="flex-1 bg-transparent py-2 text-sm placeholder:text-charcoal/40 focus:outline-none"
                />
              </form>
            </Container>
          </div>
        )}
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
