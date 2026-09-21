// Service Worker Self-Unregister & Cache Buster
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      console.log('[SW] Service worker actively unregistering self...');
      return self.registration.unregister();
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', () => {
  // Pass-through to network unconditionally
});
