/**
 * Service Worker for Koen Schreij Portfolio
 * Provides basic caching for improved performance
 */

const CACHE_NAME = 'koen-portfolio-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/portfolio.html',
  '/resume.html',
  '/shop.html',
  '/contact.html',
  '/assets/styles.css',
  '/assets/enhanced-styles.css',
  '/assets/images/logobw.png',
  '/assets/images/me.jpeg',
  '/assets/images/favicon/favicon-32x32.png',
  '/assets/images/favicon/favicon-16x16.png',
  '/assets/images/favicon/apple-touch-icon.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});