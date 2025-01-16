const CACHE_NAME = 'lved-v1'
const OFFLINE_URL = './' // for main page that works offline without js

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    // precache main page and styles
    await cache.addAll([
      './',
      './lved.css',
      './logo🩷lved.svg',
      './manifest.json',
      './lved.js',
      './logo🩷lved.png',
      './logo🩷lved-192.png',
      // add more static assets as needed
    ])
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // cleanup old caches
    const keys = await caches.keys()
    for(const key of keys) {
      if(key !== CACHE_NAME) {
        await caches.delete(key)
      }
    }
  })())
})

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const requestURL = new URL(event.request.url)
    if (requestURL.protocol !== 'http:' && requestURL.protocol !== 'https:') {
      return fetch(event.request)
    }
    try {
      const response = await fetch(event.request)
      const cache = await caches.open(CACHE_NAME)
      cache.put(event.request, response.clone())
      return response
    } catch (e) {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(event.request)
      return cachedResponse || cache.match(OFFLINE_URL)
    }
  })())
})

fetch('manifest.json')
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .catch(() => {
    console.log("Manifest failed to load. Running on file:// URL. For full PWA functionality, use a local or remote HTTP/HTTPS server.");
  });

