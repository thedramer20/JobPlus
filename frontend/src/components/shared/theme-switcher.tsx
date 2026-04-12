import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../context/PreferencesContext";

type ThemeMode = "light" | "dark";

const themes: Array<{ value: ThemeMode; icon: string; labelKey: string }> = [
  { value: "light", icon: "☀", labelKey: "common.light" },
  { value: "dark", icon: "🌙", labelKey: "common.dark" }
];

export const ThemeSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="jp-theme-switcher" ref={containerRef}>
      <button type="button" className="jp-compact-control" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="jp-control-with-icon">
          <span aria-hidden="true">{theme === "dark" ? "🌙" : "☀"}</span>
          <span>{t(theme === "dark" ? "common.dark" : "common.light")}</span>
        </span>
        <span className={`jp-chevron ${open ? "is-open" : ""}`}>v</span>
      </button>

      {open ? (
        <ul className="jp-dropdown" role="listbox">
          {themes.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`jp-dropdown-item ${theme === option.value ? "is-active" : ""}`}
                role="option"
                aria-selected={theme === option.value}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
              >
                <span className="jp-control-with-icon">
                  <span aria-hidden="true">{option.icon}</span>
                  <span>{t(option.labelKey)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
