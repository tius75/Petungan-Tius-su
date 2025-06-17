const CACHE_NAME = 'petungan-jawa-cache-v1';
// Daftar file penting yang akan disimpan untuk mode offline
const URLS_TO_CACHE = [
  './',
  './index.html',
  './detail.html',
  './dashboard.html',
  './cms-fix.html',
  './footer-editor.html',
  './login.html',
  './logo.png',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Event saat Service Worker di-install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Event saat ada permintaan jaringan (fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, langsung berikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, coba ambil dari jaringan
        return fetch(event.request);
      }
    )
  );
});
