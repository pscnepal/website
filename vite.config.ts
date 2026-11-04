import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * StPageFlip (page-flip@2.0.7) ships TypeScript source in node_modules/page-flip/src
 * with cross-file `export const enum` declarations. Transforming `const enum` to
 * standard `enum` ensures single-file esbuild/Rollup transpilation works cleanly.
 */
function pageFlipCompatPlugin(): Plugin {
  return {
    name: 'page-flip-compat',
    enforce: 'pre',
    transform(code, id) {
      const normalized = id.replace(/\\/g, '/');
      if (normalized.includes('node_modules/page-flip/src/') && normalized.endsWith('.ts')) {
        return {
          code: code.replace(/export\s+const\s+enum\s+/g, 'export enum '),
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [pageFlipCompatPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        'page-flip': path.resolve(__dirname, 'node_modules/page-flip/src/PageFlip.ts'),
      },
    },
    optimizeDeps: {
      exclude: ['page-flip'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
});
