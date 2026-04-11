interface InlineMessageProps {
  type: "error" | "success" | "info";
  message: string;
}

export function InlineMessage({ type, message }: InlineMessageProps) {
  const className = type === "error" ? "status-danger" : type === "success" ? "status-success" : "status-info";
  return <div className={`status ${className}`}>{message}</div>;
}

