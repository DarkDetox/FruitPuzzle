const CACHE_NAME = 'fruit-match-v6.0-ultimate';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell and content');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('[Service Worker] Cache failed during install:', error);
            })
    );
    
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Take control of all pages immediately
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return the cached response
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }

                // Cache miss - fetch from network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                
                return fetch(event.request).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache the fetched response for future use
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);
                
                // Return offline page if available
                return caches.match('./index.html');
            })
    );
});

// Background sync event (optional - for future enhancements)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-game-data') {
        event.waitUntil(syncGameData());
    }
});

// Sync game data function (placeholder for future implementation)
function syncGameData() {
    return new Promise((resolve) => {
        console.log('[Service Worker] Syncing game data...');
        // Add your sync logic here
        resolve();
    });
}

// Push notification event (optional - for future enhancements)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%23667eea" width="192" height="192" rx="40"/%3E%3Ctext x="96" y="130" font-size="100" text-anchor="middle" fill="white"%3E🍎%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Ccircle fill="%23667eea" cx="48" cy="48" r="48"/%3E%3Ctext x="48" y="65" font-size="50" text-anchor="middle" fill="white"%3E🍎%3C/text%3E%3C/svg%3E',
        vibrate: [200, 100, 200],
        tag: 'fruit-match-notification'
    };

    event.waitUntil(
        self.registration.showNotification('Fruit Match', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('./')
    );
});

// Message event - communicate with main app
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }
});