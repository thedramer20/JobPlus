import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function NotFoundPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="section"
      style={{
        background: "var(--bg-base, #0A0A0F)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="container">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="surface glass-card"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
            maxWidth: "600px"
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
          >404</motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="headline"
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "2.8rem",
              fontWeight: 800,
              color: "var(--text-primary, #F0F0FF)",
              margin: "0.3rem 0"
            }}
          >That page could not be found.</motion.h1>
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
          >Use search or return to the marketplace to continue your journey.</motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="row"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "1rem"
            }}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link className="btn btn-primary" to="/jobs"
                style={{
                  background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                  color: "#ffffff",
                  padding: "14px 32px",
                  borderRadius: "999px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)"
                }}
              >Browse jobs</Link>
            </motion.div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link className="btn btn-secondary" to="/"
                style={{
                  background: "var(--bg-elevated, #1A1A24)",
                  color: "var(--text-primary, #F0F0FF)",
                  padding: "14px 32px",
                  borderRadius: "999px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                  cursor: "pointer",
                  textDecoration: "none"
                }}
              >Home</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
