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
import logo from "../../assets/images/logo/logo-neela.jpeg";

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
          relative
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
        {/* LEFT - Mobile Menu + Logo */}
        <div className="flex items-center">
          <button
            className="mr-1 flex shrink-0 items-center justify-center p-2 text-charcoal lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={logo}
              alt="Neela Jewellery"
              className="h-12 w-12 object-contain sm:h-16 sm:w-16 lg:h-20 lg:w-20"
            />
          </Link>
        </div>

        {/* CENTER - BRAND NAME */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            whitespace-nowrap
          "
        >
          <h1
            className="
              font-serif
              font-semibold
              leading-none
              text-charcoal
              text-[16px]
              tracking-[1px]
              sm:text-2xl
              sm:tracking-[4px]
              lg:text-4xl
              lg:tracking-[8px]
            "
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

        {/* RIGHT - ICONS */}
        {/* RIGHT SIDE - ALL ICONS */}
         
         <div className="ml-auto flex items-center">

  {/* Search - Laptop only */}
  <button
    className={`${iconClasses} hidden lg:flex`}
    onClick={() => setSearchOpen((v) => !v)}
    aria-label="Search"
  >
    <FiSearch size={19} />
  </button>

  {/* Wishlist - Laptop only */}
  <Link
    to="/wishlist"
    className={`${iconClasses} hidden lg:flex`}
    aria-label="Wishlist"
  >
    <FiHeart size={19} />

    <IconBadge
      count={wishlistCount}
      light={isLight}
    />
  </Link>

  {/* Cart - Laptop only */}
  <Link
    to="/cart"
    className={`${iconClasses} hidden lg:flex`}
    aria-label="Cart"
  >
    <FiShoppingBag size={19} />

    <IconBadge
      count={cartCount}
      light={isLight}
    />
  </Link>

  {/* Profile - Mobile + Laptop */}
  <div className="relative">

    <button
      className={iconClasses}
      onClick={() => setAccountMenuOpen((v) => !v)}
      aria-label="Account"
    >
      <FiUser size={20} />
    </button>

    {accountMenuOpen && (
      <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-gold/20 bg-cream py-2 shadow-lg">

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              onClick={() => setAccountMenuOpen(false)}
              className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setAccountMenuOpen(false)}
              className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/account"
              onClick={() => setAccountMenuOpen(false)}
              className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10"
            >
              My Account
            </Link>

            <Link
              to="/account/orders"
              onClick={() => setAccountMenuOpen(false)}
              className="block px-4 py-2 text-sm text-charcoal hover:bg-gold/10"
            >
              My Orders
            </Link>
          </>
        )}

      </div>
    )}

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
