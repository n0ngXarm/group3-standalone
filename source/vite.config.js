import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: "group3-dev-fix-relative-base-html",
      apply: "serve",
      transformIndexHtml: {
        order: "post",
        handler(html, ctx) {
          const base = ctx.server?.config.base ?? ctx.config?.base;
          if (base && base.length > 1 && base.endsWith("/")) {
            const double = `${base}${base.slice(1)}`;
            if (html.includes(double)) return html.split(double).join(base);
          }
          return html;
        },
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@features": path.resolve(__dirname, "./src/shared/features"),
      "@surfaces": path.resolve(__dirname, "./src/surfaces"),
      "@lib": path.resolve(__dirname, "./src/shared/lib"),
      "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@services": path.resolve(__dirname, "./src/shared/services"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@styles": path.resolve(__dirname, "./src/shared/styles"),
    },
  },
  base: `${(process.env.VITE_BASE_PATH || "").replace(/\/+$/, "")}/`,
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:5101",
      "/health": "http://127.0.0.1:5101",
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});

