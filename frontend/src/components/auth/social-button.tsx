import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialButton({ icon, label, onClick, disabled = false }: SocialButtonProps) {
  return (
    <motion.button
      type="button"
      className="btn btn-secondary jp-social-button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: "var(--bg-surface, #111118)",
        border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
        color: "var(--text-primary, #F0F0FF)",
        transition: "all 0.2s ease-out"
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}
