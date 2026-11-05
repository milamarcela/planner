/* StudyBloom service worker — PWA instalable en Android/Chrome.
   Estrategia:
   - Navegación: red primero, con respaldo a la app cacheada (funciona sin conexión).
   - Assets del build (js/css/fuentes/iconos): cache first (son inmutables, con hash).
   - Resto (APIs de Spotify): solo red. */
const CACHE_VERSION = "studybloom-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

/* Precachea el shell: página principal, manifest, íconos y los assets con hash
   referenciados por el index (js/css) para que la app abra sin conexión desde
   la primera visita. */
async function precacheShell() {
  const cache = await caches.open(CACHE_VERSION);
  await cache.addAll(APP_SHELL);
  const response = await fetch("./index.html");
  const html = await response.clone().text();
  await cache.put("./index.html", response);
  const assets = [...html.matchAll(/(?:src|href)="(\.\/(assets|icons)\/[^"]+)"/g)].map((m) => m[1]);
  await Promise.all(assets.map((asset) => cache.add(asset).catch(() => undefined)));
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isSpotifyRequest = (url) =>
  url.hostname === "api.spotify.com" || url.hostname === "accounts.spotify.com" || url.hostname === "open.spotify.com";

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Spotify y demás: directo a la red
  if (isSpotifyRequest(url)) return;

  if (request.mode === "navigate") {
    // Red primero; sin conexión sirven la última copia local del shell.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request, { ignoreVary: true })
            .then((cached) => cached ?? caches.match("./index.html", { ignoreVary: true })),
        ),
    );
    return;
  }

  // Assets con hash: cache first. ignoreVary evita fallos de match cuando el
  // servidor agrega headers como "Vary: Origin" (dev server, algunos hosts).
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
