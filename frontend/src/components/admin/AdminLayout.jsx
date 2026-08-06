import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid,
  FiLayers,
  FiMessageSquare,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiUsers,
  FiInstagram,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/categories", label: "Categories", icon: FiLayers },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/coupons", label: "Coupons", icon: FiTag },
  { to: "/admin/reviews", label: "Reviews", icon: FiMessageSquare },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/gallery", label: "Instagram Gallery", icon: FiInstagram },
];

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-gold/15 bg-charcoal text-cream lg:flex">
        <div className="border-b border-cream/10 px-6 py-6">
          <p className="font-display text-lg tracking-widest">NEELA</p>
          <p className="text-[10px] tracking-[0.3em] text-gold">ADMIN</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-gold-dark text-charcoal" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                  }`
                }
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-cream/10 px-6 py-4">
          <p className="truncate text-xs text-cream/50">{user?.email}</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-gold/15 bg-cream px-6 py-4 lg:hidden">
          <p className="font-display text-lg text-charcoal">NEELA Admin</p>
        </header>
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
