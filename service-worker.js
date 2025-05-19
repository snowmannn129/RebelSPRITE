// RebelSPRITE Service Worker

const CACHE_NAME = 'rebelsprite-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_16x16.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_32x32.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_48x48.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_64x64.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_96x96.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_128x128.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_152x152.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_167x167.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_180x180.png',
  '/assets/RebelSPRITE_Assetts/RebelSPRITE_Icon_192x192.png'
];

// Install event - cache all required resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request - stream can only be consumed once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response - stream can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // Only cache same-origin requests
              if (event.request.url.startsWith(self.location.origin)) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        });
      })
  );
});
