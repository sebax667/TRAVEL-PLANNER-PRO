// sw.js - Service Worker para forzar actualización de caché
const CACHE_NAME = 'travel-planner-v' + Date.now();
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/countries.js',
  '/js/storage.js',
  '/js/weather.js',
  '/js/currency.js',
  '/js/tourism.js'
];

// Instalar SW y cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // No cachear nada - forzar recarga siempre
      return cache.addAll([]);
    })
  );
  self.skipWaiting();
});

// Activar SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - siempre obtener del servidor
self.addEventListener('fetch', (event) => {
  // Para archivos JS, siempre ir a la red
  if (event.request.url.includes('.js') || 
      event.request.url.includes('.css') ||
      event.request.url.includes('/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
