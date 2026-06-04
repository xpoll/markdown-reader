import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
const isTauriBuild = process.env.TAURI_ENV_PLATFORM !== undefined;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    target: "es2021",
    minify: isTauriBuild ? "esbuild" : "esbuild",
    sourcemap: false,
    cssMinify: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("mermaid") || id.includes("cytoscape") || id.includes("dagre")) {
            return "mermaid";
          }
          if (id.includes("katex")) return "katex";
          if (id.includes("react-dom") || id.includes("react/")) return "react";
        },
      },
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
