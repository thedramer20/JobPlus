import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  optimizeDeps:
    process.platform === "win32"
      ? {
          include: [
            "react",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "react-dom",
            "react-dom/client",
            "react-router-dom",
            "@tanstack/react-query",
            "i18next",
            "react-i18next",
            "zustand"
          ]
        }
      : undefined,
  server: {
    port: 5173
  }
});
