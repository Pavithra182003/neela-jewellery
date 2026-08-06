import { NavLink as RouterNavLink } from "react-router-dom";

export default function NavItem({ to, children, end = false, light = false }) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) => {
        const activeColor = light ? "text-gold-light" : "text-gold-dark";
        const idleColor = light
          ? "text-cream hover:text-gold-light"
          : "text-charcoal hover:text-gold-dark";
        return `group relative py-2 text-sm tracking-wide transition-colors ${
          isActive ? activeColor : idleColor
        }`;
      }}
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`pointer-events-none absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${
              light ? "bg-gold-light" : "bg-gold-dark"
            } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </>
      )}
    </RouterNavLink>
  );
}
