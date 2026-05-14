interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  autoComplete?: string;
  error?: string;
  required?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  error,
  required = false
}: TextFieldProps) {
  return (
    <label className="field jp-auth-field">
      <span style={{
        color: "var(--text-secondary, #8888AA)",
        fontSize: "0.875rem",
        fontWeight: 500
      }}>
        {label}
        {required ? <span className="jp-required-marker" style={{ color: "var(--color-danger, #EF4444)" }}> *</span> : null}
      </span>
      <input
        className={`input ${error ? "jp-input-error" : ""}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          background: "var(--bg-surface, #111118)",
          borderColor: error ? "var(--color-danger, #EF4444)" : "var(--border-subtle, rgba(255,255,255,0.06))",
          color: "var(--text-primary, #F0F0FF)",
          "::placeholder": {
            color: "var(--text-muted, #44445A)"
          }
        }}
      />
      {error ? <span className="jp-field-error" style={{ color: "var(--color-danger, #EF4444)" }}>{error}</span> : null}
    </label>
  );
}
