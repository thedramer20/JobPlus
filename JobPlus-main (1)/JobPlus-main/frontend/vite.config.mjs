import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
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
      port: 5173,
      strictPort: true,
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:9090",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    }
  };
});
