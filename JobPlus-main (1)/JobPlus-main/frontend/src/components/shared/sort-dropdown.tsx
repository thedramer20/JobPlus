import { useEffect, useId, useMemo, useRef, useState } from "react";

export interface SortOption {
  value: string;
  label: string;
  helper?: string;
}

interface SortDropdownProps {
  label?: string;
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
}

export function SortDropdown({ label = "Sort", value, options, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === value);
    return index >= 0 ? index : 0;
  }, [options, value]);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const activeButton = listRef.current?.querySelector<HTMLButtonElement>(`button[data-index="${activeIndex}"]`);
    activeButton?.focus();
  }, [activeIndex, open]);

  const selected = options[selectedIndex] ?? options[0];

  return (
    <div className="jp-sort-dropdown">
      <button
        ref={buttonRef}
        type="button"
        className={`jp-sort-trigger ${open ? "is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex(event.key === "ArrowDown" ? Math.min(options.length - 1, selectedIndex + 1) : Math.max(0, selectedIndex - 1));
          }
        }}
      >
        <span className="jp-sort-trigger-copy">
          <small>{label}</small>
          <strong>{selected?.label ?? "Select sort"}</strong>
        </span>
        <svg className={`jp-chevron ${open ? "is-open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div ref={listRef} id={listboxId} className="jp-sort-menu" role="listbox" aria-label="Sort jobs">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                data-index={index}
                aria-selected={isSelected}
                className={`jp-sort-option ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((current) => Math.min(options.length - 1, current + 1));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((current) => Math.max(0, current - 1));
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange(option.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }
                }}
              >
                <span className="jp-sort-option-main">
                  <strong>{option.label}</strong>
                  {option.helper ? <small>{option.helper}</small> : null}
                </span>
                {isSelected ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
