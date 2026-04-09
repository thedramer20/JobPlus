import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../store/auth-store";
import type { UserRole } from "../types/auth";

export function ProtectedRoute() {
  const { user } = authStore();
  const location = useLocation();
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <Outlet />;
}

export function RoleRoute({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { user } = authStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}
