// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import preload from "vite-plugin-preload";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preload(),
    {
      name: "defer-css",
      apply: "build",
      transformIndexHtml: {
        enforce: "post",
        transform(html: string) {
          return html.replace(
            /<link rel="stylesheet"([^>]*?) href="([^"]+\.css)"([^>]*?)>/g,
            `<link rel="preload" as="style" href="$2" onload="this.onload=null;this.rel='stylesheet'">$2"><noscript><link rel="stylesheet" href="$2"></noscript>`
          );
        },
      },
    },
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "@tanstack/react-query", "zustand"],
          grid: ["react-grid-layout", "react-rnd", "react-resizable"],
          fortune: ["@fortune-sheet/react"],
          antd: ["antd", "@ant-design/plots"],
          icons: [
            "@heroicons/react",
            "react-icons",
            "@fortawesome/react-fontawesome",
          ],
        },
      },
    },
  },

  server: {
    watch: {
      ignored: ["**/db.json"],
    },
  },
});
