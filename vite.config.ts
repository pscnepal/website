import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

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

/**
 * vite-plugin-pwa's dev entry script calls `import.meta.hot.send(...)` unconditionally.
 * When `DISABLE_HMR=true`, Vite's HMR WebSocket is disabled (`ws` is undefined), which
 * causes `@vite/client` `send()` to throw an unhandled error. Replace that dev-only
 * HMR bootstrap script with direct `navigator.serviceWorker.register('/dev-sw.js?dev-sw')`.
 */
function pwaNoHmrDevPlugin(): Plugin {
  return {
    name: 'pwa-no-hmr-dev-compat',
    apply: 'serve',
    enforce: 'post',
    transform(code, id) {
      if (process.env.DISABLE_HMR !== 'true') {
        return null;
      }
      const normalized = id.replace(/\\/g, '/');
      if (normalized.endsWith('vite/dist/client/client.mjs')) {
        const patched = code
          .replace(
            'transport.connect(createHMRHandler(handleMessage));',
            '/* HMR WebSocket disabled when DISABLE_HMR=true */'
          )
          .replace(
            'ws.send(JSON.stringify(data));',
            'if (ws && ws.readyState === 1) ws.send(JSON.stringify(data));'
          );
        if (patched !== code) {
          return { code: patched, map: null };
        }
      }
      return null;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (process.env.DISABLE_HMR !== 'true') {
          return html;
        }
        return html.replace(
          /<script id="vite-plugin-pwa:register-dev-sw"[^>]*>[\s\S]*?<\/script>/i,
          `<script id="vite-plugin-pwa:register-dev-sw">
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/dev-sw.js?dev-sw', { scope: '/', type: 'classic' }).catch(function () {});
  });
}
</script>`
        );
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      pageFlipCompatPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'site.webmanifest',
        includeAssets: [
          'favicon.ico',
          'favicon.svg',
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'sounds/*.wav',
        ],
        manifest: {
          id: '/',
          name: 'PSC Nepal — Lok Sewa Preparation Hub',
          short_name: 'PSC Nepal',
          description:
            'Prepare for Nepal Lok Sewa Aayog exams with official syllabi, OMR & written simulations, timed MCQs, bilingual answers, and PDF flipbooks.',
          theme_color: '#003893',
          background_color: '#060f22',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          globIgnores: ['**/pdf.worker*'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/__\//, /^\/materials\/.*\.pdf$/i],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/materials\/.*\.pdf(\?.*)?$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'psc-study-pdfs-cache',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 90,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/sounds\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'psc-audio-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 90,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/assets\/pdf\.worker.*\.mjs$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'psc-pdf-worker-cache',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/(?:images|assets)\/.*\.(?:png|jpg|jpeg|webp|svg)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'psc-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      pwaNoHmrDevPlugin(),
    ],
    resolve: {
      alias: {
        'page-flip': path.resolve(
          import.meta.dirname,
          'node_modules/page-flip/src/PageFlip.ts'
        ),
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
    build: {
      chunkSizeWarningLimit: 600,
      rolldownOptions: {
        output: {
          codeSplitting: {
            minSize: 15000,
            groups: [
              {
                name: 'vendor-react',
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|@reduxjs[\\/]toolkit|react-redux|immer|reselect)[\\/]/,
                priority: 30,
              },
              {
                name: 'vendor-firestore',
                test: /[\\/]node_modules[\\/](@firebase[\\/]firestore|firebase[\\/]firestore)[\\/]/,
                priority: 28,
              },
              {
                name: 'vendor-firebase',
                test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
                priority: 25,
              },
              {
                name: 'vendor-motion',
                test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
                priority: 20,
              },
              {
                name: 'vendor-pdf',
                test: /[\\/]node_modules[\\/](pdfjs-dist|page-flip)[\\/]/,
                priority: 20,
              },
              {
                name: 'vendor-icons',
                test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
                priority: 15,
              },
              {
                name: 'data-syllabus',
                test: /[\\/]src[\\/]data[\\/](pscSyllabusData\.ts|syllabus[\\/])/,
                priority: 12,
              },
              {
                name: 'data-quiz',
                test: /[\\/]src[\\/]data[\\/](quizData\.ts|quiz[\\/])/,
                priority: 12,
              },
              {
                name: 'data-written',
                test: /[\\/]src[\\/]data[\\/](writtenQuestionsData\.ts|written[\\/])/,
                priority: 12,
              },
              {
                name: 'data-materials',
                test: /[\\/]src[\\/]data[\\/]readingMaterials\.ts/,
                priority: 12,
              },
            ],
          },
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
});
