// PDP Service Worker — v6 (Firebase)
// Bump CACHE_NAME any time you want clients to pick up a new shell.
const CACHE_NAME = 'pdp-v6';

// App shell: core assets that should always be available offline.
// Firebase SDK is served from gstatic CDN — we cache those too so
// the app stays functional when the back room has no signal.
const PRECACHE = [
  './',
  './index.html',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js',
];

// ── Install: open cache and pre-fetch shell assets ──────────────────────
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activate: delete old caches ──────────────────────────────────────────
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch strategy ────────────────────────────────────────────────────────
//
// Firebase Auth / Firestore / Storage API requests:
//   → Network-only. The Firebase SDK manages its own offline queue via
//     IndexedDB (enablePersistence). The SW must NOT intercept these or
//     it breaks the SDK's sync logic.
//
// Firebase CDN scripts (gstatic):
//   → Cache-first. Once cached at install time, serve instantly offline.
//
// Anthropic API (Claude Vision):
//   → Network-only. Requires live internet; no caching.
//
// Everything else (app shell, local assets):
//   → Cache-first, fall back to network, update cache with fresh copy.

const PASSTHROUGH_ORIGINS = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'identitytoolkit.googleapis.com',   // Firebase Auth REST
  'securetoken.googleapis.com',        // Firebase token refresh
  'firebasestorage.googleapis.com',    // Storage upload/download
  'api.anthropic.com',                 // Claude Vision API
];

const CACHE_FIRST_ORIGINS = [
  'www.gstatic.com',  // Firebase SDK scripts
];

self.addEventListener('fetch', function(e) {
  var url;
  try { url = new URL(e.request.url); } catch(_) { return; }

  // Pass Firebase + Anthropic traffic straight to the network
  for (var i = 0; i < PASSTHROUGH_ORIGINS.length; i++) {
    if (url.hostname === PASSTHROUGH_ORIGINS[i] ||
        url.hostname.endsWith('.' + PASSTHROUGH_ORIGINS[i])) {
      return; // no e.respondWith → browser handles natively
    }
  }

  // Cache-first for gstatic CDN (Firebase SDK)
  for (var j = 0; j < CACHE_FIRST_ORIGINS.length; j++) {
    if (url.hostname === CACHE_FIRST_ORIGINS[j]) {
      e.respondWith(
        caches.match(e.request).then(function(cached) {
          return cached || fetch(e.request).then(function(res) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
            return res;
          });
        })
      );
      return;
    }
  }

  // App shell: cache-first, refresh cache in background
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(e.request).then(function(cached) {
        var networkFetch = fetch(e.request).then(function(res) {
          if (res && res.status === 200 && res.type !== 'opaque') {
            cache.put(e.request, res.clone());
          }
          return res;
        }).catch(function() { return cached; });
        return cached || networkFetch;
      });
    })
  );
});
