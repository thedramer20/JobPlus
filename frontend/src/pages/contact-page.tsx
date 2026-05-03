import { motion } from "framer-motion";

export function ContactPage() {
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
      <div className="container grid grid-2">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="surface jp-reveal-up glass-card"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.5rem"
          }}
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
          >Contact</motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="headline"
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "var(--text-primary, #F0F0FF)",
              margin: "0.4rem 0"
            }}
          >Talk to the JobPlus team.</motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="helper"
            style={{
              color: "var(--text-secondary, #8888AA)",
              fontSize: "1rem",
              lineHeight: 1.6
            }}
          >Use this page for support, employer onboarding questions, or partnership requests.</motion.p>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="surface jp-reveal-up glass-card"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.5rem"
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="stack"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="field"
            >
              <motion.label
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                style={{
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  display: "block"
                }}
              >Name</motion.label>
              <motion.input
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.4 }}
                whileFocus={{ scale: 1.02 }}
                className="input"
                placeholder="Your name"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-elevated, #1A1A24)",
                  border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                  borderRadius: "8px",
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </motion.div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="field"
            >
              <motion.label
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                style={{
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  display: "block"
                }}
              >Email</motion.label>
              <motion.input
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.4 }}
                whileFocus={{ scale: 1.02 }}
                className="input"
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-elevated, #1A1A24)",
                  border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                  borderRadius: "8px",
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </motion.div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              className="field"
            >
              <motion.label
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.4 }}
                style={{
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  display: "block"
                }}
              >Message</motion.label>
              <motion.textarea
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.4 }}
                whileFocus={{ scale: 1.02 }}
                className="textarea"
                placeholder="How can we help?"
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px 16px",
                  background: "var(--bg-elevated, #1A1A24)",
                  border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                  borderRadius: "8px",
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "none"
                }}
              />
            </motion.div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              style={{
                background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                color: "#ffffff",
                padding: "14px 32px",
                borderRadius: "999px",
                fontSize: "1rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)"
              }}
            >Send message</motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
