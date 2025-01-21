import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Base alias for `src`
      '@types': path.resolve(__dirname, 'src/types') // Alias for `src/types`
    },
  },
});
