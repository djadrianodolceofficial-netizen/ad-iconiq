const CACHE = "adiconiq-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./catalog.html",
  "./cart.html",
  "./account.html",
  "./styles.css",
  "./main.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null))))
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => cached))
  );
});