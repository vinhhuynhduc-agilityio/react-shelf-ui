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
      name: "fix-css-blocking",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        transform(html) {
          return html.replace(
            /(<link rel="stylesheet"[^>]*href=")([^"]+\.css)("[^>]*>)/g,
            '<link rel="preload" as="style" fetchpriority="high" href="$2" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$2"></noscript>'
          );
        },
      },
    },
  ],

  resolve: { alias: { "@": path.resolve(__dirname, "src") } },

  build: {
    target: "es2022",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "zustand", "@tanstack/react-query"],
          antd: ["antd", "@ant-design/plots"],
          fortune: ["@fortune-sheet/react"],
          grid: ["react-grid-layout", "react-rnd", "react-resizable"],
          icons: [
            "@heroicons/react",
            "react-icons",
            "@fortawesome/react-fontawesome",
          ],
        },
      },
    },
  },
});
