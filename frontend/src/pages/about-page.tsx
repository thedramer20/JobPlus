import { motion } from "framer-motion";

export function AboutPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="section"
      style={{
        background: "var(--bg-base, #0A0A0F)",
        minHeight: "100vh"
      }}
    >
      <div className="container stack">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="jp-reveal-up"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="eyebrow"
            style={{
              color: "var(--text-secondary, #8888AA)",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600
            }}
          >About JobPlus</motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="headline"
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "2.7rem",
              fontWeight: 800,
              color: "var(--text-primary, #F0F0FF)",
              margin: "0.3rem 0"
            }}
          >A recruitment platform designed like a real product, not a toy demo.</motion.h1>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-2 jp-reveal-stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="surface jp-reveal glass-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}
          >
            <motion.h3
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              style={{
                fontFamily: "var(--font-display, Syne, sans-serif)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #F0F0FF)",
                margin: 0
              }}
            >For candidates</motion.h3>
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="helper"
              style={{
                color: "var(--text-secondary, #8888AA)",
                fontSize: "1rem",
                lineHeight: 1.6
              }}
            >Discover opportunities, build a professional profile, save jobs, apply, and track progress in one structured workspace.</motion.p>
          </motion.div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="surface jp-reveal glass-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}
          >
            <motion.h3
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              style={{
                fontFamily: "var(--font-display, Syne, sans-serif)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #F0F0FF)",
                margin: 0
              }}
            >For employers</motion.h3>
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="helper"
              style={{
                color: "var(--text-secondary, #8888AA)",
                fontSize: "1rem",
                lineHeight: 1.6
              }}
            >Create company presence, post roles, review applicants, and manage hiring workflows through a clean dashboard.</motion.p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="surface jp-reveal-up glass-card"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.5rem"
          }}
        >
          <motion.h3
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #F0F0FF)",
                margin: 0
              }}
          >Why it feels different</motion.h3>
          <motion.p
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="helper"
            style={{
              color: "var(--text-secondary, #8888AA)",
              fontSize: "1rem",
              lineHeight: 1.6
            }}
          >JobPlus is being built with a full-stack architecture, role-based design, API integration, and real product thinking so it can scale beyond an academic project.</motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
