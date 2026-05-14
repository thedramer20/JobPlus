import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import zh from "./locales/zh.json";

export const supportedLanguages = ["en", "ar", "zh", "fr", "es"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const rtlLanguages: SupportedLanguage[] = ["ar"];

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  zh: { translation: zh },
  fr: { translation: fr },
  es: { translation: es }
} as const;

function getStoredLanguage(): SupportedLanguage | null {
  try {
    const value = window.localStorage.getItem("jobplus-language");
    return value && supportedLanguages.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : null;
  } catch {
    return null;
  }
}

function getBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === "undefined") {
    return "en";
  }
  const browser = navigator.language.toLowerCase();
  const exact = supportedLanguages.find((lang) => browser === lang);
  if (exact) {
    return exact;
  }
  const prefix = supportedLanguages.find((lang) => browser.startsWith(`${lang}-`) || browser.startsWith(lang));
  return prefix ?? "en";
}

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage() ?? getBrowserLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages as unknown as string[],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false
  },
  returnNull: false
});

export default i18n;
