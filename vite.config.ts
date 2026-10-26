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
      onwarn(warning, defaultHandler) {
        if (warning.code === "CIRCULAR_DEPENDENCY" || warning.message?.includes("Circular chunk")) {
          throw new Error(`[Vite Build Guard] Circular chunk dependency detected: ${warning.message}`);
        }
        defaultHandler(warning);
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react-router") ||
              id.includes("@remix-run") ||
              id.includes("react-dom") ||
              id.includes("/react/") ||
              id.includes("scheduler")
            ) {
              return "vendor-react";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("motion")) {
              return "vendor-motion";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "vendor-charts";
            }
            return "vendor-core";
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
      interval: 300,
      binaryInterval: 600,
    },
    hmr: {
      overlay: true,
    },
    // Unified local dev proxy: defaults to local backend http://127.0.0.1:5290 (paths mapped to /api/v1 like production nginx).
    // Override with AGENT360_API_TARGET=https://agent360.antares.vn when intentionally testing against remote.
    proxy: {
      "/api": (() => {
        const apiTarget = process.env.AGENT360_API_TARGET || "http://127.0.0.1:5290";
        const isLocalBackend = apiTarget.includes(":5290") || apiTarget.includes(":8080") || apiTarget.includes("127.0.0.1") || apiTarget.includes("localhost");
        return {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
          secure: false,
          rewrite: isLocalBackend
            ? (p: string) => p.replace(/^\/api\/(v\d+\/)?/, "/api/v1/")
            : (p: string) => p.replace(/^\/api\/v1\//, "/api/"),
        };
      })(),
    },
  },
});
