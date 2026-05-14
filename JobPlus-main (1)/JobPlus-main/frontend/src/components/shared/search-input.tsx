import React, { useState } from "react";

interface SearchInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  id,
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  className = ""
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`jp-floating-field ${focused || value ? "is-active" : ""} ${disabled ? "is-disabled" : ""} ${className}`}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className="jp-floating-input"
      />
      <label htmlFor={id} className="jp-floating-label">
        {label}
      </label>
    </div>
  );
};
