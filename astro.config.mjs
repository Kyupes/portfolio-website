// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    // Keep the demo script external so Vite resolves its lazy import preload marker.
    build: { assetsInlineLimit: 1024 },
  },
  redirects: {
    '/': '/pt/',
  },
});
