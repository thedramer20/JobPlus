import React from "react";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../context/PreferencesContext";

export const ThemeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = usePreferences();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? t("common.themeLight") : t("common.themeDark")}
      className={`jp-theme-toggle ${theme === "dark" ? "is-dark" : ""}`}
    >
      <span className="jp-theme-icon">L</span>
      <span className="jp-theme-icon">D</span>
      <span className={`jp-theme-thumb ${theme === "dark" ? "is-dark" : ""}`} />
    </button>
  );
};
