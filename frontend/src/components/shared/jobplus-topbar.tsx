import { NavLink } from "react-router-dom";
import { authStore } from "../../store/auth-store";
import { SettingsMenu } from "./settings-menu";

interface TopbarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const topbarItems: TopbarItem[] = [
  {
    label: "Home",
    path: "/",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V21h13.5V9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6h4.5v6" />
      </svg>
    )
  },
  {
    label: "Top Content",
    path: "/top-content",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 4.5c2.2-.23 4.13.31 5 1.18.87.87 1.41 2.8 1.18 5l-5.12 2.37-3.43-3.43L14.5 4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.13 9.62 6.6 15.15a2.25 2.25 0 0 0-.58.98L5 20l3.87-1.02c.37-.1.71-.3.98-.58l5.53-5.53" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 14 6 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.75 6.75 18 11" />
      </svg>
    )
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5.75A1.75 1.75 0 0 1 9.75 4h4.5A1.75 1.75 0 0 1 16 5.75V7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 7h14.5A1.75 1.75 0 0 1 21 8.75v8.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25v-8.5A1.75 1.75 0 0 1 4.75 7Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
      </svg>
    )
  },
  {
    label: "Companies",
    path: "/companies",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V6.75A1.75 1.75 0 0 1 5.75 5h6.5A1.75 1.75 0 0 1 14 6.75V20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 20V10.75A1.75 1.75 0 0 1 15.75 9h2.5A1.75 1.75 0 0 1 20 10.75V20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h2M8 12h2M8 15h2M17 13h.01M17 16h.01" />
      </svg>
    )
  },
  {
    label: "Network",
    path: "/app/profile",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 19a4.5 4.5 0 0 1 9 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 19a3.5 3.5 0 0 1 7 0" />
      </svg>
    )
  },
  {
    label: "Messages",
    path: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v8.5A1.75 1.75 0 0 1 18.25 17H9l-4.25 3v-3H5.75A1.75 1.75 0 0 1 4 15.25v-8.5A1.75 1.75 0 0 1 5.75 5Z" />
      </svg>
    )
  },
  {
    label: "Notifications",
    path: "/app/notifications",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75a4.25 4.25 0 0 1 4.25 4.25v2.33c0 .92.28 1.82.8 2.57l1.02 1.47A1 1 0 0 1 17.25 17H6.75a1 1 0 0 1-.82-1.63l1.02-1.47c.52-.75.8-1.65.8-2.57V9A4.25 4.25 0 0 1 12 4.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    )
  }
];

export function JobPlusTopbar() {
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
          JobPlus
        </NavLink>

        <nav aria-label="Primary" className="jp-topbar-nav">
          {topbarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `jp-topbar-link ${isActive ? "is-active" : ""}`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="jp-topbar-actions">
          {!user ? (
            <>
              <NavLink className="btn btn-secondary" to="/login">
                Log in
              </NavLink>
              <NavLink className="btn btn-primary" to="/register">
                Sign up
              </NavLink>
            </>
          ) : null}

          <NavLink
            to={resolveProfileHref(user?.role)}
            className="jp-topbar-avatar"
            aria-label="Profile"
            title={user?.name ?? "Profile"}
          >
            {avatarText}
          </NavLink>

          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}

function resolveProfileHref(role?: string): string {
  if (!role) {
    return "/login";
  }
  if (role === "ADMIN") {
    return "/admin/profile";
  }
  return "/app/profile";
}
