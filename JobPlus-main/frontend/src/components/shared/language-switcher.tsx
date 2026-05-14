import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../context/PreferencesContext";
import { supportedLanguages, type SupportedLanguage } from "../../i18n";

const langs: { code: SupportedLanguage }[] = supportedLanguages.map((code) => ({ code }));

export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = usePreferences();
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="jp-lang-switcher">
      <button onClick={() => setOpen((prev) => !prev)} className="jp-compact-control" aria-haspopup="listbox" aria-expanded={open}>
        <span>{t(`languages.${language}`)}</span>
        <span className={`jp-chevron ${open ? "is-open" : ""}`}>v</span>
      </button>
      {open ? (
        <ul className="jp-dropdown" role="listbox">
          {langs.map((lang) => (
            <li key={lang.code}>
              <button
                className={`jp-dropdown-item ${language === lang.code ? "is-active" : ""}`}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                role="option"
                aria-selected={language === lang.code}
              >
                {t(`languages.${lang.code}`)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
