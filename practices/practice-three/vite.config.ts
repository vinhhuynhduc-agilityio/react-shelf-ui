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
      "@": path.resolve(__dirname, "src"), // Base alias for `src`
    },
  },
  server: {
    watch: {
      ignored: ["**/db.json"], // Ignore changes in db.json
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Auto preload for main CSS
        manualChunks: undefined,
      },
    },
  },
});
