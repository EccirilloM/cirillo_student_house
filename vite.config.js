import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  base: './',
  server: { watch: { usePolling: true, interval: 300 } },
  build: { target: 'es2022' },
});
