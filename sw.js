self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open('benatti-gym-v1').then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.webmanifest'
    ]))
  );
});

self.addEventListener('activate', (e) => self.clients.claim());

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});
