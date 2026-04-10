import React from "react";
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
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V21h13.5V9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6h4.5v6" />
      </svg>
    )
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
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
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
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
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
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
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v8.5A1.75 1.75 0 0 1 18.25 17H9l-4.25 3v-3H5.75A1.75 1.75 0 0 1 4 15.25v-8.5A1.75 1.75 0 0 1 5.75 5Z" />
      </svg>
    )
  },
  {
    label: "Notifications",
    path: "/app/notifications",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
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
    <header className="surface-muted" style={{ position: "sticky", top: 0, zIndex: 30, borderRadius: 0, borderLeft: "none", borderRight: "none" }}>
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "1rem",
          minHeight: "5.4rem"
        }}
      >
        <NavLink to="/" className="headline" style={{ fontSize: "1.65rem", color: "var(--primary-dark)", whiteSpace: "nowrap" }}>
          JobPlus
        </NavLink>

        <nav
          aria-label="Primary"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "0.2rem",
            flexWrap: "wrap"
          }}
        >
          {topbarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => (isActive ? "is-active" : "")}
              style={({ isActive }) => ({
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.32rem",
                minWidth: "5.8rem",
                minHeight: "4.3rem",
                padding: "0.7rem 0.8rem",
                borderRadius: "16px",
                color: isActive ? "var(--primary-dark)" : "var(--text-soft)",
                background: isActive ? "rgba(37, 99, 235, 0.08)" : "transparent",
                borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                transition: "background 0.18s ease, color 0.18s ease, transform 0.18s ease"
              })}
            >
              <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, lineHeight: 1 }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.7rem" }}>
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

          <button
            type="button"
            className="surface"
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              cursor: "pointer",
              color: "var(--primary-dark)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(235,244,255,0.96))",
              fontWeight: 800
            }}
            aria-label="Profile"
            title={user?.name ?? "Profile"}
          >
            {avatarText}
          </button>

          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
