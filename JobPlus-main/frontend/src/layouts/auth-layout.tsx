import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="page-shell jp-auth-layout-shell">
      <Outlet />
    </div>
  );
}
