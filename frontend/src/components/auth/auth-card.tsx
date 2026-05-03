import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "../../styles/auth-form-new.css";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="surface jp-auth-card glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
      }}
    >
      <header className="stack" style={{ gap: "0.5rem" }}>
        <h2 style={{ 
          margin: 0,
          fontFamily: "var(--font-display, Syne, sans-serif)",
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "var(--text-primary, #F0F0FF)"
        }}>
          {title}
        </h2>
        <p className="helper" style={{ 
          margin: 0,
          color: "var(--text-secondary, #8888AA)",
          fontSize: "0.875rem"
        }}>
          {subtitle}
        </p>
      </header>
      {children}
    </motion.section>
  );
}
