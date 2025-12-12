import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/AoC/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@aoc/utils': path.resolve(__dirname, '../utils'),
      '@aoc/2025': path.resolve(__dirname, '../2025')
    }
  }
});
