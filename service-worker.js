const CACHE_NAME = "planego-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",
  "icon.png",
  "icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
