const CACHE_NAME = 'toolnest-v4';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
];

async function warmManifestAssets() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));

  try {
    const res = await fetch('/precache-manifest.json', { cache: 'no-store' });
    if (!res.ok) return (await cache.keys()).length;
    const data = await res.json();
    const assets = Array.isArray(data && data.assets) ? data.assets : [];
    const existing = new Set((await cache.keys()).map((req) => new URL(req.url).pathname));
    const missing = assets.filter((u) => typeof u === 'string' && !existing.has(u));
    await Promise.allSettled(missing.map((url) => cache.add(url)));
    return (await cache.keys()).length;
  } catch {
    return (await cache.keys()).length;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(warmManifestAssets().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'WARM_OFFLINE_CACHE') {
    const replyPort = event.ports && event.ports[0];
    event.waitUntil(
      warmManifestAssets().then((cachedCount) => {
        if (replyPort) {
          replyPort.postMessage({ type: 'OFFLINE_CACHE_READY', cachedCount });
        }
      })
    );
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
