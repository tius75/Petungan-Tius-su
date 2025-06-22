const CACHE_NAME = 'Dashboard - Petungan-Jawa-v22'; // Tingkatkan nomor versi jika Anda sering mengubah konten
const urlsToCache = [
  './', // Penting untuk meng-cache root path (index.html)
  './index.html',
  './manifest-dashboard.json', // Pastikan nama file ini sudah 'manifest-dashboard.json'
  './favicon32x.png',
  './logo192x.png',
  './logo512.png',
  // Library eksternal (CDN) tetap menggunakan URL absolut mereka
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache dibuka.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Gagal menyimpan aset ke cache:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, lakukan fetch dari jaringan
        return fetch(event.request)
          .then(networkResponse => {
            // Coba tambahkan respons jaringan ke cache untuk penggunaan selanjutnya (opsional, tergantung strategi caching)
            // Namun, untuk start, fokus pada caching saat install saja
            // let responseClone = networkResponse.clone();
            // caches.open(CACHE_NAME).then(cache => {
            //   cache.put(event.request, responseClone);
            // });
            return networkResponse;
          })
          .catch(error => {
            console.warn('Service Worker: Fetch gagal atau offline:', event.request.url, error);
            // Anda bisa mengembalikan fallback page di sini jika ada
            // return caches.match('/offline.html');
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});
