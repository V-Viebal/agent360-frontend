import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
      interval: 500,
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/.tmp/**"],
    },
    hmr: {
      overlay: true,
    },
    proxy: {
      "/api": {
        target: "https://ai.hmz.one",
        changeOrigin: true,
        secure: false,
        headers: {
          host: "ai.hmz.one",
        },
      },
    },
  },
});
