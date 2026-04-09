import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n from "../i18n";

type ThemeMode = "light" | "dark";
type LanguageCode = "en" | "zh";

interface PreferencesContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem("jobplus-theme");
    return saved === "dark" ? "dark" : "light";
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = window.localStorage.getItem("jobplus-language");
    return saved === "zh" ? "zh" : "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("jobplus-theme", theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    window.localStorage.setItem("jobplus-language", language);
  }, [language]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      language,
      setLanguage: setLanguageState
    }),
    [theme, language]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
