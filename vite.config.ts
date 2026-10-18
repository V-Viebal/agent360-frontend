import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const APP_BUILD = process.env.APP_BUILD || new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

export default defineConfig({
  define: {
    __APP_BUILD__: JSON.stringify(APP_BUILD),
  },
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-icons": ["lucide-react"],
          "vendor-motion": ["motion/react"],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
      interval: 800,
    },
    // Local dev: AGENT360_API_TARGET=http://127.0.0.1:5290 runs against a local backend (paths are mapped to
    // /api/v1 like the production nginx). Without it the dev server proxies to the production frontend origin.
    proxy: {
      "/api": process.env.AGENT360_API_TARGET
        ? {
            target: process.env.AGENT360_API_TARGET,
            changeOrigin: true,
            ws: true,
            rewrite: (p) => p.replace(/^\/api\//, "/api/v1/"),
          }
        : {
            target: "https://agent360.antares.vn",
            changeOrigin: true,
            ws: true,
            secure: false,
            rewrite: (p) => p,
          },
    },
  },
});
