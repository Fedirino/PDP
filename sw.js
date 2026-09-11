const CACHE_NAME = 'pdp-v5.50.0';
const SHELL = './index.html';
const ASSETS = [
  './',
  SHELL,
  './plan-photos.js',
  './icon192.png',
  './icon512.png',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const request = e.request;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;

  const isShell = request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');
  if (isShell) {
    e.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(SHELL, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(SHELL).then(cached => cached || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
