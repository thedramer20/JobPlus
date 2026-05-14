import { NavLink, Outlet } from "react-router-dom";
import { roleNavigation } from "../constants/navigation";
import { authStore } from "../store/auth-store";
import { formatRole } from "../lib/utils";
import { SettingsMenu } from "../components/shared/settings-menu";
import { useQuery } from "@tanstack/react-query";
import { listNotifications } from "../services/meta-service";
import { listJobs } from "../services/jobs-service";
import { listCompanies } from "../services/companies-service";
import { HiringInsightsWidget, ProfileSummaryWidget, SuggestedCompaniesWidget, SuggestedJobsWidget } from "../components/shared/sidebar-widgets";
import { useTranslation } from "react-i18next";

export function DashboardLayout() {
  const { t } = useTranslation();
  const { user, logout } = authStore();
  const navItems = user && user.role !== "guest" ? roleNavigation[user.role] : [];
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    enabled: !!user
  });
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", "dashboard-suggestions"],
    queryFn: () => listJobs(),
    enabled: !!user
  });
  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["companies", "dashboard-suggestions"],
    queryFn: listCompanies,
    enabled: !!user
  });

  return (
    <div className="jp-dashboard-shell">
      <aside className="sidebar jp-dashboard-left">
        <div className="stack jp-workspace-stack">
          <div className="jp-workspace-header">
            <div className="eyebrow">{t("dashboard.workspace")}</div>
            <h2 className="jp-workspace-name">{user?.name}</h2>
            <div className="helper jp-workspace-role">{formatRole(user?.role ?? "guest")}</div>
          </div>
          <nav className="side-links jp-workspace-nav">
            {navItems?.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `side-link jp-workspace-link ${isActive ? "active" : ""}`}>
                <span className="jp-workspace-link-icon" aria-hidden="true">
                  {getWorkspaceIcon(item.key)}
                </span>
                <span>{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </nav>
          <button className="btn btn-secondary jp-workspace-signout" onClick={logout}>
            {t("common.signOut")}
          </button>
        </div>
      </aside>
      <main className="main-panel jp-dashboard-main">
        <div className="topbar jp-dashboard-topbar surface">
          <div className="jp-control-center-copy">
            <div className="eyebrow">{t("dashboard.controlCenter")}</div>
            <h1 className="jp-control-center-title">{t("dashboard.headline")}</h1>
            <p className="helper jp-control-center-subtitle">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="row jp-control-center-actions" style={{ alignItems: "center" }}>
            <NavLink className="jp-control-btn" to="/" aria-label={t("dashboard.home")} title={t("dashboard.home")}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V21h13.5V9.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6h4.5v6" />
              </svg>
              <span>{t("dashboard.home")}</span>
            </NavLink>
            <NavLink className="jp-control-btn jp-control-btn-notifications" to={resolveNotificationsRoute(user?.role)}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.8a4.2 4.2 0 0 1 4.2 4.2v2.2c0 1 .3 2 .9 2.8l.8 1.1a1 1 0 0 1-.8 1.6H6.9a1 1 0 0 1-.8-1.6l.8-1.1c.6-.8.9-1.8.9-2.8V9a4.2 4.2 0 0 1 4.2-4.2Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 19a1.7 1.7 0 0 0 3.4 0" />
              </svg>
              <span>{t("common.notifications")}</span>
              <span className="jp-control-btn-badge">{notifications.length}</span>
            </NavLink>
            <SettingsMenu />
          </div>
        </div>
        <Outlet />
      </main>
      <aside className="jp-dashboard-right stack">
        <ProfileSummaryWidget
          name={user?.name ?? "JobPlus User"}
          roleLabel={formatRole(user?.role ?? "guest")}
          title={user?.title}
          profileHref={resolveProfileRoute(user?.role)}
        />
        <SuggestedJobsWidget jobs={jobs} loading={jobsLoading} />
        <SuggestedCompaniesWidget companies={companies} loading={companiesLoading} />
        <HiringInsightsWidget notifications={notifications} loading={notificationsLoading} />
      </aside>
    </div>
  );
}

function getWorkspaceIcon(key: string) {
  if (key.includes("dashboard")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="13" y="3.5" width="7.5" height="4.8" rx="1.5" />
        <rect x="13" y="10.7" width="7.5" height="9.8" rx="1.5" />
        <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      </svg>
    );
  }
  if (key.includes("application")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8.8 8h6.4M8.8 11.5h6.4M8.8 15h4.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (key.includes("message")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4.5 6.8A1.8 1.8 0 0 1 6.3 5h11.4a1.8 1.8 0 0 1 1.8 1.8v7.8a1.8 1.8 0 0 1-1.8 1.8H9.2L5 19.3v-2.9H6.3a1.8 1.8 0 0 1-1.8-1.8Z" />
      </svg>
    );
  }
  if (key.includes("saved")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M6 4.8h12a1 1 0 0 1 1 1V21l-7-4.1L5 21V5.8a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }
  if (key.includes("notification")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 4.8a4.2 4.2 0 0 1 4.2 4.2v2.2c0 1 .3 2 .9 2.8l.8 1.1a1 1 0 0 1-.8 1.6H6.9a1 1 0 0 1-.8-1.6l.8-1.1c.6-.8.9-1.8.9-2.8V9a4.2 4.2 0 0 1 4.2-4.2Z" />
      </svg>
    );
  }
  if (key.includes("profile")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    );
  }
  if (key.includes("setting")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" />
        <path strokeLinecap="round" d="M19.3 15.1 21 16l-1.7 3-1.9-1a8.5 8.5 0 0 1-1.8 1l-.2 2H12l-.2-2a8.5 8.5 0 0 1-1.8-1l-1.9 1-1.7-3 1.7-.9a8.8 8.8 0 0 1 0-2.1L6.4 12l1.7-3 1.9 1a8.5 8.5 0 0 1 1.8-1l.2-2h3.4l.2 2a8.5 8.5 0 0 1 1.8 1l1.9-1 1.7 3-1.7.9a8.8 8.8 0 0 1 0 2.2Z" />
      </svg>
    );
  }
  if (key.includes("company")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4.5 20V7a2 2 0 0 1 2-2h6v15" />
        <path d="M12.5 20v-8.7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V20" />
      </svg>
    );
  }
  if (key.includes("job")) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M8.5 7V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8V7" />
        <rect x="3.8" y="7" width="16.4" height="12.2" rx="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" d="M12 8.2v4.6l2.8 1.8" />
    </svg>
  );
}

function resolveNotificationsRoute(role?: string): string {
  if (role === "admin") {
    return "/admin/notifications";
  }
  if (role === "employer") {
    return "/employer/notifications";
  }
  if (role === "candidate") {
    return "/app/notifications";
  }
  return "/login";
}

function resolveProfileRoute(role?: string): string {
  if (!role) {
    return "/login";
  }
  if (role === "admin") {
    return "/admin/profile";
  }
  if (role === "employer") {
    return "/profile/nadia.mensah";
  }
  return "/app/profile";
}
