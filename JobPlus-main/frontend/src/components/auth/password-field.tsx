import { useMemo, useState } from "react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  showStrength?: boolean;
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  required = false,
  showStrength = false
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const strength = useMemo(() => getPasswordStrength(value), [value]);

  return (
    <label className="field jp-auth-field">
      <span>
        {label}
        {required ? <span className="jp-required-marker"> *</span> : null}
      </span>
      <div className="jp-password-wrap">
        <input
          className={`input ${error ? "jp-input-error" : ""}`}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="btn btn-secondary jp-password-toggle"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.24A10.94 10.94 0 0112 4c5.05 0 9.27 3.11 10.5 7.5a10.73 10.73 0 01-3.03 4.57" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.61 6.61A10.72 10.72 0 001.5 11.5C2.73 15.89 6.95 19 12 19c1.74 0 3.39-.37 4.87-1.03" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5.5 4 12 4s10.5 8 10.5 8-4 8-10.5 8S1.5 12 1.5 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {showStrength ? (
        <div className="jp-strength">
          <span className={`jp-strength-dot ${strength.level >= 1 ? "is-active" : ""}`} />
          <span className={`jp-strength-dot ${strength.level >= 2 ? "is-active" : ""}`} />
          <span className={`jp-strength-dot ${strength.level >= 3 ? "is-active" : ""}`} />
          <span className="helper">{strength.label}</span>
        </div>
      ) : null}
      {error ? <span className="jp-field-error">{error}</span> : null}
    </label>
  );
}

function getPasswordStrength(value: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!value) return { level: 0, label: "Password strength" };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;
  if (score === 1) return { level: 1, label: "Weak" };
  if (score === 2) return { level: 2, label: "Medium" };
  return { level: 3, label: "Strong" };
}
