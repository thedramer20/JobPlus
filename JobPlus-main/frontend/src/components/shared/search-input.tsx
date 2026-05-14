import React, { useState } from "react";
import { motion } from "framer-motion";

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
      <motion.input
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
        animate={focused || value ? { boxShadow: "0 0 0 3px rgba(108, 99, 255, 0.22)" } : { boxShadow: "none" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <label htmlFor={id} className="jp-floating-label">
        {label}
      </label>
    </div>
  );
};
