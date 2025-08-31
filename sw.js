// mude o número SEMPRE que publicar uma versão nova
const CACHE = 'benatti-gym-v8';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.webmanifest'
    ]))
  );
});

self.addEventListener('activate', (e) => self.clients.claim());

// Cache-first para imagens e vídeos após primeira visita
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    if (cached) return cached;

    const res = await fetch(e.request);
    const dst = e.request.destination;
    if (dst === 'image' || dst === 'video') {
      cache.put(e.request, res.clone());
    }
    return res;
  })());
});
