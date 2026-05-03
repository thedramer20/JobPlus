import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "../../styles/auth-shell-new.css";
import { JobPlusLogo } from "../shared/jobplus-logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="section jp-auth-shell"
      style={{
        minHeight: "100vh",
        background: "var(--bg-base, #0A0A0F)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Gradient Mesh Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(108, 99, 255, 0.08) 0%, transparent 50%)
        `,
        filter: "blur(60px)",
        animation: "gradient-shift 10s ease infinite",
        backgroundSize: "200% 200%"
      }} />

      <div className="container jp-auth-grid" style={{ position: "relative", zIndex: 1 }}>
        <aside className="jp-auth-brand">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="jp-auth-logo"
          >
            <JobPlusLogo variant="lockup" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="jp-auth-headline"
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "3rem",
              fontWeight: 700,
              color: "var(--text-primary, #F0F0FF)",
              background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="jp-auth-subtitle"
            style={{
              color: "var(--text-secondary, #8888AA)",
              fontSize: "1.125rem",
              marginTop: "1rem"
            }}
          >
            {subtitle}
          </motion.p>

          {/* Floating Job Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="jp-auth-floating"
          >
            <motion.div
              className="jp-float-card jp-float-card-1 glass-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "16px"
              }}
            >
              <div className="jp-float-card-header">
                <span className="jp-match-badge" style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#22C55E",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>92% match</span>
              </div>
              <h3 className="jp-float-card-title" style={{
                color: "var(--text-primary, #F0F0FF)",
                fontSize: "1rem",
                fontWeight: 600,
                margin: "8px 0 4px"
              }}>Senior Product Designer</h3>
              <p className="jp-float-card-company" style={{
                color: "var(--text-secondary, #8888AA)",
                fontSize: "0.875rem",
                margin: 0
              }}>TechCorp Inc.</p>
              <div className="jp-float-card-footer" style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                fontSize: "0.875rem",
                color: "var(--text-secondary, #8888AA)"
              }}>
                <span className="jp-salary">$120k - $160k</span>
                <span className="jp-location">San Francisco</span>
              </div>
            </motion.div>

            <motion.div
              className="jp-float-card jp-float-card-2 glass-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "16px"
              }}
            >
              <div className="jp-float-card-header">
                <span className="jp-match-badge" style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#22C55E",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>87% match</span>
              </div>
              <h3 className="jp-float-card-title" style={{
                color: "var(--text-primary, #F0F0FF)",
                fontSize: "1rem",
                fontWeight: 600,
                margin: "8px 0 4px"
              }}>Full Stack Engineer</h3>
              <p className="jp-float-card-company" style={{
                color: "var(--text-secondary, #8888AA)",
                fontSize: "0.875rem",
                margin: 0
              }}>InnovateLabs</p>
              <div className="jp-float-card-footer" style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                fontSize: "0.875rem",
                color: "var(--text-secondary, #8888AA)"
              }}>
                <span className="jp-salary">$140k - $180k</span>
                <span className="jp-location">Remote</span>
              </div>
            </motion.div>

            <motion.div
              className="jp-float-card jp-float-card-3 glass-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "16px"
              }}
            >
              <div className="jp-float-card-header">
                <span className="jp-match-badge" style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#22C55E",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>95% match</span>
              </div>
              <h3 className="jp-float-card-title" style={{
                color: "var(--text-primary, #F0F0FF)",
                fontSize: "1rem",
                fontWeight: 600,
                margin: "8px 0 4px"
              }}>UX Researcher</h3>
              <p className="jp-float-card-company" style={{
                color: "var(--text-secondary, #8888AA)",
                fontSize: "0.875rem",
                margin: 0
              }}>DesignHub</p>
              <div className="jp-float-card-footer" style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                fontSize: "0.875rem",
                color: "var(--text-secondary, #8888AA)"
              }}>
                <span className="jp-salary">$110k - $145k</span>
                <span className="jp-location">New York</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Trust Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="jp-auth-trust"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              color: "var(--text-secondary, #8888AA)",
              fontSize: "0.875rem"
            }}
          >
            <svg className="jp-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px" }}>
              <path d="M12 22s8-4 8-10V5l-8-3v10Z"/>
              <path d="M12 22s-8-4-8-10V5l8-3v10Z"/>
            </svg>
            <span className="jp-trust-text">Trusted by 10,000+ candidates and 1,200+ companies worldwide</span>
          </motion.div>
        </aside>
        <div className="jp-auth-form-zone">{children}</div>
      </div>
    </motion.section>
  );
}
