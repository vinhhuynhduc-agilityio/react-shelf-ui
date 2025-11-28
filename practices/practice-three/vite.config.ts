import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import preload from "vite-plugin-preload";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preload()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  esbuild: {
    target: "es2020",
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "zustand"],
          icons: [
            "@fortawesome/react-fontawesome",
            "@fortawesome/free-solid-svg-icons",
          ],
        },
      },
    },

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },

    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    assetsDir: "assets",
    outDir: "dist",
    emptyOutDir: true,
  },
});
