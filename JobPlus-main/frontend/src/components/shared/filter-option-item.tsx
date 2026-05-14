import type { KeyboardEvent } from "react";

interface FilterOptionItemProps {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  mode: "single" | "multiple";
  onToggle: () => void;
}

export function FilterOptionItem({ id, label, count, checked, mode, onToggle }: FilterOptionItemProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      id={id}
      role={mode === "single" ? "radio" : "checkbox"}
      aria-checked={checked}
      className={`jp-filter-option ${checked ? "is-selected" : ""}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
    >
      <span className={`jp-filter-indicator ${mode === "single" ? "is-radio" : ""} ${checked ? "is-selected" : ""}`} aria-hidden="true" />
      <span className="jp-filter-option-copy">
        <span>{label}</span>
        <span className="jp-filter-count">{count.toLocaleString()}</span>
      </span>
    </button>
  );
}
