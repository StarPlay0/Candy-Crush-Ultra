// Minimal, robust Service Worker implementation
const CACHE_NAME = 'candy-ultra-v3';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png',
  '/privacy.html',
  '/comparison',
  '/reviews',
  '/faq',
  '/features/free-match-3-game',
  '/locations/us'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA partial cache load:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Never intercept sw.js to prevent self-caching loops and MIME mismatches
  if (url.pathname === '/sw.js') {
    return;
  }

  const pathname = url.pathname;
  const isJsOrCss = pathname.endsWith('.js') || pathname.endsWith('.mjs') || pathname.endsWith('.css');

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If the requested resource is not a JS or CSS file, return 404 directly
          // instead of falling back to index.html (which breaks script parsing)
          if (!isJsOrCss && event.request.mode !== 'navigate') {
            return new Response('Not Found', {
              status: 404,
              statusText: 'Not Found',
              headers: { 'Content-Type': 'text/plain' }
            });
          }

          // Only for navigation requests when offline, return cached root
          if (event.request.mode === 'navigate') {
            return caches.match('/').then((rootRes) => {
              return rootRes || new Response('Offline', { status: 503, statusText: 'Offline' });
            });
          }

          // Otherwise return 404 for failed non-cached asset
          return new Response('Asset not found', {
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});

