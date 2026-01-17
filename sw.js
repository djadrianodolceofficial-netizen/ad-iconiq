/**
 * ADICONIQ SERVICE WORKER 
 * Fully Functional Offline & Performance Engine
 */

const CACHE_NAME = 'adiconiq-v1.1'; // Increment this (v1.2, v1.3) when you update your app
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    '/offline.html',
    '/manifest.webmanifest',
    // Add your logo and essential luxury icons below
    '/logo.png' 
];

// 1. INSTALLATION: Pre-cache all essential 3D assets and UI
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('ADICONIQ: Pre-caching glassmorphism assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

// 2. ACTIVATION: Clean up old versions of the app to save space
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('ADICONIQ: Clearing old cache storage');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Ensure that the service worker takes control of the page immediately.
    self.clients.claim();
});

// 3. FETCH STRATEGY: "Network First, Falling back to Cache"
// This ensures users always see the latest products if online, 
// but the "Glass" UI still loads instantly from the cache.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If the network works, clone the response to the cache for later
                if (event.request.method === 'GET') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // If network fails (Offline mode), try the cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If the specific page isn't cached, show the luxury offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                });
            })
    );
});
