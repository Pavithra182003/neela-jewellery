import { NavLink, Outlet } from "react-router-dom";
import Container from "../components/common/Container";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/orders", label: "My Orders" },
  { to: "/account/addresses", label: "Saved Addresses" },
];

export default function Account() {
  const { user, logout } = useAuth();

  return (
    <Container className="py-16">
      <h1 className="mb-2 font-display text-3xl text-charcoal">My Account</h1>
      <p className="mb-10 text-charcoal/60">Welcome back, {user?.full_name}.</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block border-l-2 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "border-gold-dark bg-gold/5 text-gold-dark"
                    : "border-transparent text-charcoal/70 hover:border-gold/40 hover:text-gold-dark"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="block w-full px-4 py-2.5 text-left text-sm text-charcoal/70 transition-colors hover:text-red-600"
          >
            Logout
          </button>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
