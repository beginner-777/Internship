import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The generated Tailwind sheet is small enough to inline. This removes the
 * stylesheet network round-trip from the critical rendering path without
 * changing any selectors or their cascade order.
 */
function inlineCss() {
  return {
    name: 'inline-entry-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find(
        (item) => item.type === 'asset' && item.fileName.endsWith('.html')
      );

      if (!html || typeof html.source !== 'string') return;

      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type !== 'asset' || !fileName.endsWith('.css')) continue;

        const escapedName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const stylesheetTag = new RegExp(
          `<link[^>]+href=["']/?${escapedName}["'][^>]*>`,
          'g'
        );

        const nextHtml = html.source.replace(stylesheetTag, `<style>${item.source}</style>`);
        if (nextHtml !== html.source) {
          html.source = nextHtml;
          delete bundle[fileName];
        }
      }

      const landingFonts = Object.values(bundle)
        .filter(
          (item) =>
            item.type === 'asset' &&
            (item.fileName.includes('inter-latin-wght-normal') ||
              item.fileName.includes('orbitron-latin-wght-normal'))
        )
        .map(
          (item) =>
            `<link rel="preload" href="/${item.fileName}" as="font" type="font/woff2" crossorigin fetchpriority="high">`
        )
        .join('');

      if (landingFonts) {
        html.source = html.source.replace('</head>', `${landingFonts}</head>`);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCss()],
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the UI runtime independent from the 3D runtime. Without this
          // explicit boundary Rollup can place React inside the R3F chunk,
          // causing the browser to preload Three.js on the landing page.
          if (
            id.includes('vite/preload-helper') ||
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/') ||
            id.includes('/node_modules/zustand/') ||
            id.includes('/node_modules/react-icons/')
          ) {
            return 'ui-vendor';
          }

          if (id.includes('/node_modules/framer-motion/')) return 'motion';

          if (
            id.includes('/node_modules/three/') ||
            id.includes('/node_modules/three-stdlib/')
          ) {
            return 'three';
          }

          if (
            id.includes('/node_modules/@react-three/fiber/') ||
            id.includes('/node_modules/@react-three/drei/')
          ) {
            return 'r3f';
          }

          if (
            id.includes('/node_modules/@react-three/postprocessing/') ||
            id.includes('/node_modules/postprocessing/')
          ) {
            return 'postprocessing';
          }

          if (id.includes('/node_modules/gsap/')) return 'gsap';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
  optimizeDeps: {
    exclude: ['three-stdlib'],
  },
});
