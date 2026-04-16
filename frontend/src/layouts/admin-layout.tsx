import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SettingsMenu } from "../components/shared/settings-menu";
import { authStore } from "../store/auth-store";
import { listAdminNotificationsData } from "../services/admin-service";
import { useResizable } from "../lib/use-resizable";

interface AdminNavItem {
  label: string;
  path: string;
  key: string;
  end?: boolean;
}

const navGroups: { title: string; items: AdminNavItem[] }[] = [
  { title: "Overview", items: [{ label: "Executive Dashboard", path: "/admin", key: "dashboard", end: true }] },
  {
    title: "Operations",
    items: [
      { label: "Users", path: "/admin/users", key: "users" },
      { label: "Companies", path: "/admin/companies", key: "companies" },
      { label: "Jobs", path: "/admin/jobs", key: "jobs" },
      { label: "Applications", path: "/admin/applications", key: "applications" },
      { label: "Categories", path: "/admin/categories", key: "categories" }
    ]
  },
  {
    title: "Trust & Safety",
    items: [
      { label: "Reports", path: "/admin/reports", key: "reports" },
      { label: "Support", path: "/admin/support", key: "support" },
      { label: "Monitoring", path: "/admin/monitoring", key: "monitoring" },
      { label: "Notifications", path: "/admin/notifications", key: "notifications" }
    ]
  },
  {
    title: "Governance",
    items: [
      { label: "Analytics", path: "/admin/analytics", key: "analytics" },
      { label: "Permissions", path: "/admin/permissions", key: "permissions" },
      { label: "Audit Logs", path: "/admin/audit-logs", key: "audit" },
      { label: "Settings", path: "/admin/settings", key: "settings" },
      { label: "Profile", path: "/admin/profile", key: "profile" }
    ]
  }
];

const breadcrumbMap: Record<string, string> = {
  "/admin": "Executive overview",
  "/admin/users": "User management",
  "/admin/companies": "Company management",
  "/admin/jobs": "Job operations",
  "/admin/applications": "Applications",
  "/admin/categories": "Categories",
  "/admin/reports": "Moderation center",
  "/admin/support": "Support operations",
  "/admin/monitoring": "Monitoring",
  "/admin/notifications": "Alerts",
  "/admin/analytics": "Analytics",
  "/admin/permissions": "Permissions",
  "/admin/audit-logs": "Audit logs",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile"
};

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = authStore();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(280);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-width");
    if (saved) setSidebarWidth(parseInt(saved, 10));
  }, []);

  const { containerRef, resizerRef, size, isResizing } = useResizable({
    initialSize: sidebarWidth,
    minSize: 220,
    maxSize: 500,
    direction: "horizontal",
    onResize: (newSize) => {
      setSidebarWidth(newSize);
      localStorage.setItem("admin-sidebar-width", String(newSize));
    }
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: listAdminNotificationsData
  });

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
  const activeLabel = breadcrumbMap[location.pathname] ?? "Executive overview";
  const searchSuggestions = useMemo(
    () =>
      navGroups
        .flatMap((group) => group.items)
        .filter((item) => item.label.toLowerCase().includes(query.toLowerCase().trim()))
        .slice(0, 6),
    [query]
  );

  return (
    <div ref={containerRef} className={`jp-admin-layout ${collapsed ? "is-collapsed" : ""} ${isResizing ? "is-resizing" : ""}`} style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
      <aside className="jp-admin-sidebar surface" style={{ width: size, minWidth: size, maxWidth: size, flexShrink: 0 }}>
        <div className="jp-admin-sidebar-header">
          <div>
            <div className="eyebrow">JobPlus Enterprise</div>
            <h2 style={{ margin: "0.3rem 0 0", fontSize: "1.1rem" }}>Operations control</h2>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>

        <nav className="jp-admin-nav">
          {navGroups.map((group) => (
            <div key={group.title} className="jp-admin-nav-group">
              <span className="jp-admin-nav-group-label">{group.title}</span>
              {group.items.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => `jp-admin-nav-link ${isActive ? "active" : ""}`}>
                  <span className="jp-admin-nav-icon">{renderIcon(item.key)}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="jp-admin-sidebar-summary">
          <div>
            <span className="helper">Pending items</span>
            <strong>62</strong>
          </div>
          <div>
            <span className="helper">Unread alerts</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => { logout(); navigate("/login"); }}>
          Sign out
        </button>
      </aside>

      <div ref={resizerRef} className={`resizer admin-resizer ${isResizing ? "is-resizing" : ""}`} title="Drag to resize sidebar" style={{ width: "4px", height: "100%", backgroundColor: isResizing ? "var(--primary)" : "var(--border)", cursor: "col-resize", transition: isResizing ? "none" : "background-color var(--transition-fast)", flexShrink: 0 }} />

      <main className="jp-admin-main" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header className="jp-admin-topbar surface">
          <div className="jp-admin-topbar-context">
            <div className="jp-admin-breadcrumbs">
              <span>Admin</span>
              <span className="jp-admin-breadcrumb-separator">/</span>
              <strong>{activeLabel}</strong>
            </div>
            <h1>{activeLabel}</h1>
            <p>Manage platform scale, moderation workflows, and critical operations with executive clarity.</p>
          </div>

          <div className="jp-admin-topbar-actions">
            <div className="jp-admin-search-bar">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="jp-admin-search-icon">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
              <input type="search" placeholder="Search users, companies, jobs, incidents..." value={query} onChange={(event) => setQuery(event.target.value)} />
              {query ? <button type="button" className="jp-admin-search-clear" onClick={() => setQuery("")} aria-label="Clear search">×</button> : null}
              {query.trim().length > 1 && searchSuggestions.length > 0 ? (
                <div className="jp-admin-search-suggestions">
                  {searchSuggestions.map((item) => (
                    <NavLink key={item.path} to={item.path} className="jp-admin-search-suggestion" onClick={() => setQuery("")}>
                      <strong>{item.label}</strong>
                      <small>{item.path}</small>
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
            <button className="btn btn-secondary">Quick update</button>
            <button className="jp-admin-bell" aria-label="Notifications dashboard">
              {renderBellIcon()}
              {unreadCount > 0 ? <span className="jp-admin-badge">{unreadCount}</span> : null}
            </button>
            <button className="jp-topbar-avatar" type="button" aria-label="Admin profile">
              {(user?.name ?? "Admin").split(" ").map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2)}
            </button>
            <SettingsMenu />
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto", paddingTop: "1rem" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function renderIcon(key: string) {
  const iconProps = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;
  if (key === "dashboard") return <svg {...iconProps}><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" /><rect x="13" y="3.5" width="7.5" height="4.8" rx="1.5" /><rect x="13" y="10.7" width="7.5" height="9.8" rx="1.5" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" /></svg>;
  if (key === "users") return <svg {...iconProps}><path d="M16 20a4 4 0 0 0-8 0" /><circle cx="12" cy="10" r="3" /><path d="M5 20a3 3 0 0 1 3-3" /><path d="M19 20a3 3 0 0 0-3-3" /></svg>;
  if (key === "companies") return <svg {...iconProps}><path d="M4.5 20V7a2 2 0 0 1 2-2h6v15" /><path d="M12.5 20v-8.7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V20" /></svg>;
  if (key === "jobs" || key === "applications") return <svg {...iconProps}><path d="M8.5 7V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8V7" /><rect x="3.8" y="7" width="16.4" height="12.2" rx="2" /></svg>;
  if (key === "categories") return <svg {...iconProps}><path d="M4 6.5h7M4 12h7M4 17.5h7" /><rect x="13" y="4.5" width="7" height="4" rx="1" /><rect x="13" y="10" width="7" height="4" rx="1" /><rect x="13" y="15.5" width="7" height="4" rx="1" /></svg>;
  if (key === "reports" || key === "monitoring") return <svg {...iconProps}><path d="M4.5 12h3l2-5 3.5 10 2-5h4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (key === "notifications") return renderBellIcon();
  if (key === "analytics") return <svg {...iconProps}><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20v-4" /></svg>;
  if (key === "support") return <svg {...iconProps}><path d="M8 12a4 4 0 1 1 8 0v1.2a2 2 0 0 0 2 2H6a2 2 0 0 0 2-2Z" /><path d="M8.5 18h7" /></svg>;
  if (key === "permissions") return <svg {...iconProps}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
  if (key === "audit") return <svg {...iconProps}><path d="M4 6h16" /><path d="M7 10h10" /><path d="M7 14h6" /><path d="M7 18h8" /></svg>;
  if (key === "settings") return <svg {...iconProps}><path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" /><path strokeLinecap="round" d="M19.3 15.1 21 16l-1.7 3-1.9-1a8.5 8.5 0 0 1-1.8 1l-.2 2H12l-.2-2a8.5 8.5 0 0 1-1.8-1l-1.9 1-1.7-3 1.7-.9a8.8 8.8 0 0 1 0-2.1L6.4 12l1.7-3 1.9 1a8.5 8.5 0 0 1 1.8-1l.2-2h3.4l.2 2a8.5 8.5 0 0 1 1.8 1l1.9-1 1.7 3-1.7.9a8.8 8.8 0 0 1 0 2.2Z" /></svg>;
  return <svg {...iconProps}><circle cx="12" cy="12" r="8.5" /><path strokeLinecap="round" d="M12 8.2v4.6l2.8 1.8" /></svg>;
}

function renderBellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.8a4.2 4.2 0 0 1 4.2 4.2v2.2c0 1 .3 2 .9 2.8l.8 1.1a1 1 0 0 1-.8 1.6H6.9a1 1 0 0 1-.8-1.6l.8-1.1c.6-.8.9-1.8.9-2.8V9a4.2 4.2 0 0 1 4.2-4.2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 19a1.7 1.7 0 0 0 3.4 0" />
    </svg>
  );
}
