self.addEventListener("install", e => {
  console.log("Service Worker telepítve");
});

self.addEventListener("activate", e => {
  console.log("Service Worker aktiválva");
});
