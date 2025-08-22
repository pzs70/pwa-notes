const CACHE_NAME = "pwa-notes-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./README.md",
  "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
];

// Telepítéskor cache feltöltése
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache feltöltése");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktiválás: régi cache törlése
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Régi cache törölve:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Kérések kezelése
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Ha van cache-elt válasz, azt adjuk vissza
      if (response) {
        return response;
      }
      // Ha nincs, próbáljuk a hálózatot
      return fetch(event.request).catch(() => {
        // Offline fallback: ha index.html kell, de nincs net
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
