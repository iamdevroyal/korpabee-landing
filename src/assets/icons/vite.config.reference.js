/**
 * vite.config.js — REFERENCE FILE
 * Merge this into your existing vite.config.js — don't overwrite it.
 * The only new piece is the VitePWA(...) plugin entry; keep your existing
 * plugins (vue(), etc.) and any aliases/server config you already have.
 *
 * Install first:
 *   npm install -D vite-plugin-pwa
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon-16.png', 'icons/favicon-32.png'],

      // Lets you test install behavior with `npm run dev` instead of only in a prod build.
      devOptions: {
        enabled: true,
        type: 'module',
      },

      manifest: {
        name: 'Your App Name',          // <-- replace
        short_name: 'YourApp',          // <-- replace, max ~12 chars, shown under the home screen icon
        description: 'Your app description',
        start_url: '/login',            // <-- launching from the home screen icon goes straight here
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',    // splash screen background while the app boots
        theme_color: '#4d11d3',         // status bar / task switcher color — matches your logo purple
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },

      workbox: {
        // Required for SPA history-mode routing: any unmatched navigation falls back to index.html
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          {
            // Your Laravel API: NetworkOnly by default since responses are
            // user-specific/auth-gated. Switch a *specific* read-only, non-sensitive
            // endpoint to NetworkFirst if you want it available offline.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly',
          },
          {
            // Static images/fonts from your own app shell
            urlPattern: ({ request }) =>
              ['image', 'font'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
