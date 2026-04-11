import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SettingsMenu } from "../components/shared/settings-menu";
import { authStore } from "../store/auth-store";
import { listAdminNotificationsData } from "../services/admin-service";

interface AdminNavItem {
  label: string;
  path: string;
  icon: string;
}

const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Users", path: "/admin/users", icon: "👥" },
  { label: "Companies", path: "/admin/companies", icon: "🏢" },
  { label: "Jobs", path: "/admin/jobs", icon: "💼" },
  { label: "Applications", path: "/admin/applications", icon: "📄" },
  { label: "Categories", path: "/admin/categories", icon: "🗂️" },
  { label: "Reports", path: "/admin/reports", icon: "🚩" },
  { label: "Notifications", path: "/admin/notifications", icon: "🔔" },
  { label: "Analytics", path: "/admin/analytics", icon: "📈" },
  { label: "Settings", path: "/admin/settings", icon: "⚙️" },
  { label: "Profile", path: "/admin/profile", icon: "👤" }
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = authStore();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const { data: notifications = [] } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: listAdminNotificationsData
  });

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  return (
    <div className={`jp-admin-layout ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="jp-admin-sidebar surface">
        <div className="stack" style={{ gap: "0.9rem" }}>
          <div className="space-between" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow">Admin Panel</div>
              <h2 style={{ margin: "0.2rem 0 0", fontSize: "1.25rem" }}>JobPlus</h2>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => setCollapsed((v) => !v)}>
              {collapsed ? "Expand" : "Collapse"}
            </button>
          </div>
          <nav className="jp-admin-nav">
            {adminNavItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === "/admin"} className="jp-admin-nav-link">
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <button
            className="btn btn-secondary"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="jp-admin-main">
        <header className="jp-admin-topbar surface">
          <div className="stack" style={{ gap: "0.2rem" }}>
            <div className="eyebrow">System Control</div>
            <h1 style={{ margin: 0, fontSize: "1.45rem" }}>Admin Workspace</h1>
          </div>
          <div className="jp-admin-topbar-actions">
            <input
              className="input"
              placeholder="Search users, jobs, companies..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{ minWidth: "280px" }}
            />
            <NavLink className="btn btn-primary" to="/admin/categories">
              Create Category
            </NavLink>
            <NavLink className="btn btn-secondary" to="/admin/jobs">
              Add Job
            </NavLink>
            <NavLink className="jp-admin-bell" to="/admin/notifications" aria-label="Notifications">
              🔔
              {unreadCount > 0 ? <span className="jp-admin-badge">{unreadCount}</span> : null}
            </NavLink>
            <button className="jp-topbar-avatar" type="button" aria-label="Admin profile">
              {(user?.name ?? "Admin")
                .split(" ")
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("")
                .slice(0, 2)}
            </button>
            <SettingsMenu />
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
