const CACHE_NAME = "home-control-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/static/js/main.js",
  "/static/js/controls.js",
  "/static/css/style.css",
  "/static/media/images/bg.jpg",
  "/static/media/images/icon/climate.png",
  "/static/media/images/icon/home.png",
  "/static/media/images/icon/lights.png",
  "/static/media/images/icon/settings.png",
  "/static/media/sounds/alert.mp3",
  "/static/media/sounds/click.mp3",
  "/static/media/sounds/error.mp3",
  "/static/media/sounds/notification.mp3",
  "/static/media/sounds/ping.mp3",
];

// Install event - cache all assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - cleanup old caches if needed
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event - serve cached assets first, then network fallback
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
