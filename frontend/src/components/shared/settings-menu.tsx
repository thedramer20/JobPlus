import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { authStore } from "../../store/auth-store";

export const SettingsMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user } = authStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsPath = user?.role === "admin" ? "/admin/settings" : user?.role === "employer" ? "/employer/settings" : "/app/settings";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="jp-settings" ref={menuRef}>
      <button
        type="button"
        className={`jp-settings-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("common.settings")}
        title={t("common.settings")}
        data-tooltip={t("common.settings")}
      >
        <span className="jp-settings-icon-shell" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="jp-settings-icon" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.8c.7 0 1.3.45 1.5 1.1l.24.95c.52.14 1.02.35 1.48.62l.9-.5c.62-.34 1.4-.24 1.9.26l.86.86c.5.5.6 1.28.25 1.9l-.5.9c.28.46.49.96.63 1.48l.95.24c.66.17 1.11.78 1.11 1.48s-.45 1.31-1.1 1.48l-.96.24a6.6 6.6 0 0 1-.63 1.48l.5.9c.35.62.25 1.4-.25 1.9l-.86.86c-.5.5-1.28.6-1.9.26l-.9-.5c-.46.27-.96.48-1.48.62l-.24.95c-.17.66-.78 1.1-1.48 1.1-.7 0-1.31-.44-1.48-1.1l-.24-.95a6.6 6.6 0 0 1-1.48-.62l-.9.5c-.62.34-1.4.24-1.9-.26l-.86-.86c-.5-.5-.6-1.28-.25-1.9l.5-.9a6.6 6.6 0 0 1-.63-1.48l-.95-.24a1.53 1.53 0 0 1 0-2.96l.95-.24c.14-.52.35-1.02.63-1.48l-.5-.9c-.35-.62-.25-1.4.25-1.9l.86-.86c.5-.5 1.28-.6 1.9-.26l.9.5c.46-.27.96-.48 1.48-.62l.24-.95c.17-.65.78-1.1 1.48-1.1Z"
          />
          <circle cx="12" cy="12" r="3.4" />
        </svg>
        </span>
      </button>
      {open ? (
        <div className="jp-settings-panel" role="menu">
          <div className="jp-settings-group">
            <span className="jp-settings-label">{t("dashboard.controlCenter")}</span>
            <Link to={settingsPath} className="btn btn-secondary" onClick={() => setOpen(false)}>
              {t("common.settings")}
            </Link>
          </div>
          <div className="jp-settings-group">
            <span className="jp-settings-label">{t("common.theme")}</span>
            <ThemeSwitcher />
          </div>
          <div className="jp-settings-group">
            <span className="jp-settings-label">{t("common.language")}</span>
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
};
