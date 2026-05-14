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
      <span>
        {label}
        {required ? <span className="jp-required-marker"> *</span> : null}
      </span>
      <input
        className={`input ${error ? "jp-input-error" : ""}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {error ? <span className="jp-field-error">{error}</span> : null}
    </label>
  );
}
