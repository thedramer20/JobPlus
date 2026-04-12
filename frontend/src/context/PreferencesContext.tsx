import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n, { rtlLanguages, supportedLanguages, type SupportedLanguage } from "../i18n";

type ThemeMode = "light" | "dark";
type LanguageCode = SupportedLanguage;

interface PreferencesContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return readStoredValue("jobplus-theme") === "dark" ? "dark" : "light";
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = readStoredValue("jobplus-language");
    return stored && supportedLanguages.includes(stored as SupportedLanguage) ? (stored as SupportedLanguage) : "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    writeStoredValue("jobplus-theme", theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    writeStoredValue("jobplus-language", language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", rtlLanguages.includes(language) ? "rtl" : "ltr");
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

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so UI still renders.
  }
}
