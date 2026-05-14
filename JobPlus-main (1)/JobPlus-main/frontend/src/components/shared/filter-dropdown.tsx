import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { JobFilterConfig, JobFilterOption } from "../../types/job";
import { FilterOptionItem } from "./filter-option-item";

interface FilterDropdownProps {
  config: JobFilterConfig;
  options: JobFilterOption[];
  value: string[];
  onApply: (nextValue: string[]) => void;
}

export function FilterDropdown({ config, options, value, onApply }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<string[]>(value);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 180);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(debouncedSearch));
  }, [debouncedSearch, options]);

  const selectedSummary = useMemo(() => {
    if (!value.length) {
      return config.label;
    }
    if (value.length === 1) {
      return value[0];
    }
    return `${config.label} (${value.length})`;
  }, [config.label, value]);

  const openPanel = () => {
    setDraftValue(value);
    setSearch("");
    setOpen((current) => !current);
  };

  const toggleOption = (optionValue: string) => {
    if (config.selectionMode === "single") {
      setDraftValue((current) => (current[0] === optionValue ? [] : [optionValue]));
      return;
    }

    setDraftValue((current) =>
      current.includes(optionValue) ? current.filter((item) => item !== optionValue) : [...current, optionValue]
    );
  };

  return (
    <div className="jp-filter-dropdown" ref={containerRef}>
      <button
        type="button"
        className={`jp-filter-trigger ${value.length ? "is-selected" : ""}`}
        onClick={openPanel}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{selectedSummary}</span>
        <svg className={`jp-chevron ${open ? "is-open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div className="jp-filter-menu surface" role="dialog" aria-labelledby={headingId}>
          <div className="jp-filter-menu-header">
            <div>
              <strong id={headingId}>{config.label}</strong>
              <div className="helper">Refine roles with real marketplace filters.</div>
            </div>
            {config.searchable ? (
              <input
                className="jp-filter-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={config.searchPlaceholder ?? "Add a filter"}
              />
            ) : null}
          </div>

          <div className="jp-filter-options" role={config.selectionMode === "single" ? "radiogroup" : "group"}>
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <FilterOptionItem
                  key={option.value}
                  id={`${config.key}-${option.value}`}
                  label={option.label}
                  count={option.count}
                  checked={draftValue.includes(option.value)}
                  mode={config.selectionMode}
                  onToggle={() => toggleOption(option.value)}
                />
              ))
            ) : (
              <div className="jp-filter-empty">No matches for that search yet.</div>
            )}
          </div>

          <div className="jp-filter-menu-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setDraftValue([])}>
              Clear
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onApply(draftValue);
                setOpen(false);
                setSearch("");
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
