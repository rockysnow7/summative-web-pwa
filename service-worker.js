var cacheName = "message-board-v1";
var contentToCache = [
    "/",
    "/views/about.html",
    "/views/index.html",
    "/views/most-liked.html",
    "/css/style.css",
    "/resources/cat.jpg",
    "/resources/like.png",
];

self.addEventListener("install", e => {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("[Service Worker] Caching all: app shell and content");
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(r => {
            console.log("[Service Worker] Fetching resource: " + e.request.url);
            return r || fetch(e.request).then(response => {
                return caches.open(cacheName).then(cache => {
                    console.log("[Service Worker] Caching new resource: " + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== cacheName) {
                    console.log("[Service Worker] Removing old cache", key);
                    return caches.delete(key);
                }
            }));
        })
    );
});