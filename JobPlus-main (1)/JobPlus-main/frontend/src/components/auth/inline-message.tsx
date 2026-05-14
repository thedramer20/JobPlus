import { motion } from "framer-motion";

interface InlineMessageProps {
  type: "error" | "success" | "info";
  message: string;
}

export function InlineMessage({ type, message }: InlineMessageProps) {
  const colors = {
    error: {
      background: "rgba(239, 68, 68, 0.15)",
      border: "rgba(239, 68, 68, 0.3)",
      text: "#EF4444"
    },
    success: {
      background: "rgba(34, 197, 94, 0.15)",
      border: "rgba(34, 197, 94, 0.3)",
      text: "#22C55E"
    },
    info: {
      background: "rgba(59, 130, 246, 0.15)",
      border: "rgba(59, 130, 246, 0.3)",
      text: "#3B82F6"
    }
  };

  const style = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`status ${type === "error" ? "status-danger" : type === "success" ? "status-success" : "status-info"}`}
      style={{
        padding: "12px 16px",
        borderRadius: "10px",
        background: style.background,
        border: `1px solid ${style.border}`,
        color: style.text,
        fontSize: "0.875rem",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      {message}
    </motion.div>
  );
}

