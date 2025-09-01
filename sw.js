const CACHE = 'benatti-gym-v25';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
      './',
      './index.html',
      './css/style.css',
      './js/app.js',
      './js/treino.js',
      './media/aquecimento.mp4',
      './media/leg-press.mp4',
      './media/cadeira-extensora.mp4',
      './media/mesa-flexora.mp4',
      './media/remada-baixa.mp4',
      './media/prancha.mp4',
      './media/eliptico.mp4',
      './media/alongamento.mp4'
    ]))
  );
});

self.addEventListener('activate', (e) => self.clients.claim());

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    if (cached) return cached;
    const res = await fetch(e.request);
    const dst = e.request.destination;
    if (['image','video','script','style'].includes(dst)) cache.put(e.request, res.clone());
    return res;
  })());
});
