import { NavLink, Outlet } from "react-router-dom";
import { roleNavigation } from "../constants/navigation";
import { authStore } from "../store/auth-store";
import { formatRole } from "../lib/utils";
import { SettingsMenu } from "../components/shared/settings-menu";
import { useQuery } from "@tanstack/react-query";
import { listNotifications } from "../services/meta-service";

export function DashboardLayout() {
  const { user, logout } = authStore();
  const navItems = user && user.role !== "guest" ? roleNavigation[user.role] : [];
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    enabled: !!user
  });

  return (
    <div className="sidebar-layout jp-dashboard-shell">
      <aside className="sidebar">
        <div className="stack">
          <div>
            <div className="eyebrow">JobPlus Workspace</div>
            <h2 style={{ marginBottom: "0.4rem" }}>{user?.name}</h2>
            <div className="helper">{formatRole(user?.role ?? "guest")}</div>
          </div>
          <nav className="side-links">
            {navItems?.map((item) => (
              <NavLink key={item.path} to={item.path} className="side-link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button className="btn btn-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-panel">
        <div className="topbar jp-dashboard-topbar surface">
          <div>
            <div className="eyebrow">Control Center</div>
            <h1 style={{ margin: "0.3rem 0 0" }}>Ship hiring workflows with clarity</h1>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <NavLink className="jp-home-link" to="/" aria-label="Go to home page" title="Home">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V21h13.5V9.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6h4.5v6" />
              </svg>
              <span>Home</span>
            </NavLink>
            <div className="pill">Notifications: {notifications.length}</div>
            <SettingsMenu />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
