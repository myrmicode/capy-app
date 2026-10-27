// Généré par scripts/preparer-web.mjs — version 6-4e7835f120783f192e52fce5f70c0cafb0411f73
const CACHE = 'capy-6-4e7835f120783f192e52fce5f70c0cafb0411f73';
const RACINE = '/capy-app/';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([RACINE])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // L'APK n'est jamais mise en cache (trop lourde).
  if (req.url.endsWith('.apk')) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((rep) => {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(RACINE, copie));
          return rep;
        })
        .catch(() => caches.match(RACINE)),
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(
      (trouve) =>
        trouve ||
        fetch(req).then((rep) => {
          if (rep.ok) {
            const copie = rep.clone();
            caches.open(CACHE).then((c) => c.put(req, copie));
          }
          return rep;
        }),
    ),
  );
});
