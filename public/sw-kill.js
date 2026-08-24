/**
 * Killer service worker for the NativePHP mobile shell.
 *
 * The Workbox/VitePWA service worker installed by the Vite dev server
 * (scope: localhost:5173 or the Jump origin) intercepts ALL requests and
 * returns stale CacheFirst responses — including 404s for main.js and other
 * modules — preventing the Vue app from loading.
 *
 * This SW takes over immediately (skipWaiting + clients.claim), deletes every
 * cache, then unregisters itself. After one page reload everything is clean.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Claim all open clients so this SW is immediately in control
      await self.clients.claim();

      // Delete every cache the old Workbox SW left behind
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Unregister ourselves — we have no further purpose
      const reg = await self.registration;
      if (reg) await reg.unregister();
    })()
  );
});

// Pass all fetches through to the network — no caching whatsoever
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
