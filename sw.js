const CACHE_NAME = 'jarvis-hud-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
  // add '/icon-192.png', '/icon-512.png' if present
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE).catch(()=>{/* ignore */});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // respond with cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).catch(()=> caches.match('/'));
    })
  );
});
