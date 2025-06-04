self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("home-control-cache").then(cache => {
      return cache.addAll(["/", "/static/js/main.js", "/static/css/main.css"]);
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
