import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lastminute-rentacar.hr',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  build: {
    // Inline small CSS to reduce requests
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Enable minification
      minify: 'esbuild',
      // Split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate React into its own chunk
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },
  // Enable prefetch for faster navigation
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
});
