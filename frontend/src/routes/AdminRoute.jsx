import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm tracking-widest text-charcoal/50">LOADING…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // UserSerializer now exposes is_staff (read-only) so this is a real
  // check, not just a UX nicety — though every admin/ endpoint also
  // enforces IsAdminUser server-side regardless, so this can never be
  // bypassed by editing client-side state.
  if (user && user.is_staff === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
