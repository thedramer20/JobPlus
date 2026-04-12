import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authStore } from "../../store/auth-store";
import type { UserRole } from "../../types/auth";
import { SettingsMenu } from "./settings-menu";

interface TopbarItem {
  key: string;
  labelKey: string;
  path: (role?: UserRole) => string;
  icon: React.ReactNode;
}

const topbarItems: TopbarItem[] = [
  {
    key: "home",
    labelKey: "common.home",
    path: () => "/",
    icon: (
      <IconBase>
        <path d="M4.5 10.5 12 4l7.5 6.5" />
        <path d="M6.5 9.8V20h11V9.8" />
        <path d="M10 20v-4.6h4V20" />
      </IconBase>
    )
  },
  {
    key: "top-content",
    labelKey: "topbar.topContent",
    path: () => "/top-content",
    icon: (
      <IconBase>
        <path d="M6.5 16.5 10.2 12.8l3 2.9 4.3-5.2" />
        <path d="M15.5 10.5h3v3" />
        <path d="M4.5 19.5h15" />
      </IconBase>
    )
  },
  {
    key: "jobs",
    labelKey: "common.jobs",
    path: () => "/jobs",
    icon: (
      <IconBase>
        <path d="M8.5 7V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8V7" />
        <rect x="3.8" y="7" width="16.4" height="12.2" rx="2" />
        <path d="M3.8 12.3h16.4" />
      </IconBase>
    )
  },
  {
    key: "companies",
    labelKey: "common.companies",
    path: () => "/companies",
    icon: (
      <IconBase>
        <path d="M4.5 20V7a2 2 0 0 1 2-2h6v15" />
        <path d="M12.5 20v-8.7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V20" />
        <path d="M7.8 9.2h1.8M7.8 12.4h1.8M7.8 15.6h1.8M15.8 13.2h.01M15.8 16.2h.01" />
      </IconBase>
    )
  },
  {
    key: "network",
    labelKey: "topbar.network",
    path: (role) => resolveRolePath(role, "profile"),
    icon: (
      <IconBase>
        <circle cx="8.2" cy="8.2" r="2.5" />
        <circle cx="16.2" cy="9.8" r="2.1" />
        <path d="M4.5 18.8a4.2 4.2 0 0 1 7.4-2.7" />
        <path d="M12.6 18.8a3.5 3.5 0 0 1 6.9 0" />
        <path d="M10.4 9.1h3.2" />
      </IconBase>
    )
  },
  {
    key: "messages",
    labelKey: "common.messages",
    path: (role) => resolveRolePath(role, "messages"),
    icon: (
      <IconBase>
        <path d="M4.5 6.8A1.8 1.8 0 0 1 6.3 5h11.4a1.8 1.8 0 0 1 1.8 1.8v7.8a1.8 1.8 0 0 1-1.8 1.8H9.2L5 19.3v-2.9H6.3a1.8 1.8 0 0 1-1.8-1.8Z" />
      </IconBase>
    )
  },
  {
    key: "notifications",
    labelKey: "common.notifications",
    path: (role) => resolveRolePath(role, "notifications"),
    icon: (
      <IconBase>
        <path d="M12 4.8a4.2 4.2 0 0 1 4.2 4.2v2.2c0 1 .3 2 .9 2.8l.8 1.1a1 1 0 0 1-.8 1.6H6.9a1 1 0 0 1-.8-1.6l.8-1.1c.6-.8.9-1.8.9-2.8V9a4.2 4.2 0 0 1 4.2-4.2Z" />
        <path d="M10.3 19a1.7 1.7 0 0 0 3.4 0" />
      </IconBase>
    )
  }
];

export function JobPlusTopbar() {
  const { t } = useTranslation();
  const { user } = authStore();
  const avatarText = (user?.name ?? "JP")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <header className="jp-topbar-shell surface-muted">
      <div className="container jp-topbar-grid">
        <NavLink to="/" className="headline jp-topbar-brand">
          <span className="jp-topbar-brand-mark" aria-hidden="true" />
          <span>{t("common.appName")}</span>
        </NavLink>

        <nav aria-label="Primary" className="jp-topbar-nav">
          {topbarItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path(user?.role)}
              className={({ isActive }) => `jp-topbar-link ${isActive ? "is-active" : ""}`}
            >
              <span className="jp-topbar-link-icon" aria-hidden="true">{item.icon}</span>
              <span className="jp-topbar-link-label">{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="jp-topbar-actions">
          {!user ? (
            <>
              <NavLink className="btn btn-secondary" to="/login">
                {t("common.signIn")}
              </NavLink>
              <NavLink className="btn btn-primary" to="/register">
                {t("common.signUp")}
              </NavLink>
            </>
          ) : null}

          <NavLink
            to={resolveProfileHref(user?.role)}
            className="jp-topbar-avatar"
            aria-label={t("topbar.profile")}
            title={user?.name ?? t("topbar.profile")}
          >
            {avatarText}
          </NavLink>

          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}

function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function resolveProfileHref(role?: string): string {
  if (!role) {
    return "/login";
  }
  if (role.toLowerCase() === "admin") {
    return "/admin/profile";
  }
  if (role.toLowerCase() === "employer") {
    return "/profile/nadia.mensah";
  }
  return "/app/profile";
}

function resolveRolePath(role: UserRole | undefined, key: "messages" | "notifications" | "profile"): string {
  if (!role || role === "guest") {
    if (key === "profile") {
      return "/login";
    }
    return "/login?redirect=/app/dashboard";
  }
  if (role === "admin") {
    if (key === "messages") {
      return "/admin/notifications";
    }
    if (key === "notifications") {
      return "/admin/notifications";
    }
    return "/admin/profile";
  }
  if (role === "employer") {
    if (key === "messages") {
      return "/employer/messages";
    }
    if (key === "notifications") {
      return "/employer/notifications";
    }
    return "/profile/nadia.mensah";
  }
  if (key === "messages") {
    return "/app/messages";
  }
  if (key === "notifications") {
    return "/app/notifications";
  }
  return "/app/profile";
}
