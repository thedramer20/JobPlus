import React, { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export const SettingsMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        className="jp-settings-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open settings"
      >
        <svg viewBox="0 0 24 24" className="jp-settings-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.75a1.5 1.5 0 0 1 1.465 1.18l.198.92a6.77 6.77 0 0 1 1.492.616l.84-.52a1.5 1.5 0 0 1 1.86.22l.98.98a1.5 1.5 0 0 1 .22 1.86l-.52.84c.25.47.456.97.615 1.492l.92.198A1.5 1.5 0 0 1 20.25 12a1.5 1.5 0 0 1-1.18 1.465l-.92.198a6.77 6.77 0 0 1-.616 1.492l.52.84a1.5 1.5 0 0 1-.22 1.86l-.98.98a1.5 1.5 0 0 1-1.86.22l-.84-.52a6.77 6.77 0 0 1-1.492.615l-.198.92A1.5 1.5 0 0 1 12 20.25a1.5 1.5 0 0 1-1.465-1.18l-.198-.92a6.77 6.77 0 0 1-1.492-.616l-.84.52a1.5 1.5 0 0 1-1.86-.22l-.98-.98a1.5 1.5 0 0 1-.22-1.86l.52-.84a6.77 6.77 0 0 1-.615-1.492l-.92-.198A1.5 1.5 0 0 1 3.75 12a1.5 1.5 0 0 1 1.18-1.465l.92-.198a6.77 6.77 0 0 1 .616-1.492l-.52-.84a1.5 1.5 0 0 1 .22-1.86l.98-.98a1.5 1.5 0 0 1 1.86-.22l.84.52a6.77 6.77 0 0 1 1.492-.615l.198-.92A1.5 1.5 0 0 1 12 3.75Z"
          />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      </button>
      {open ? (
        <div className="jp-settings-panel" role="menu">
          <div className="jp-settings-group">
            <span className="jp-settings-label">Theme</span>
            <ThemeToggle />
          </div>
          <div className="jp-settings-group">
            <span className="jp-settings-label">Language</span>
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
};
