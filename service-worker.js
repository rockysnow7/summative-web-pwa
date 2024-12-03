var cacheName = "message-board-v1";
var contentToCache = [
    "./",
    "./views/about.html",
    "./views/index.html", 
    "./views/most-liked.html",
    "./css/style.css",
    "./resources/cat.jpg",
    "./resources/like.png",
];

function addOfflineBanner(response) {
    if (!response.headers.get("content-type")?.includes("text/html")) {
        return response;
    }

    return response.text().then(html => {
        const banner = `<div style="background-color: #fff3cd; color: #856404; padding: 12px; text-align: center; position: sticky; top: 0; z-index: 9999;">
            <p>You are viewing a cached version of this page.</p>
        </div>`;
        const modifiedHtml = banner + html;

        return new Response(modifiedHtml, {
            headers: response.headers
        });
    });
}

self.addEventListener("install", e => {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log("[Service Worker] Caching all: app shell and content");
                return Promise.all(
                    contentToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.error(`[Service Worker] Failed to cache: ${url}`, err);
                        });
                    })
                );
            })
            .catch(err => {
                console.error('[Service Worker] Cache installation failed:', err);
            })
    );
});

self.addEventListener("fetch", e => {
    if (!e.request.url.startsWith("http") || !e.request.url.includes(self.location.origin)) {
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then(response => {
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }

                return caches.open(cacheName).then(cache => {
                    try {
                        cache.put(e.request, response.clone());
                        return response;
                    } catch (err) {
                        console.error(`[Service Worker] Cache put failed: ${e.request.url}`, err);
                        return response;
                    }
                });
            })
            .catch(() => {
                return caches.match(e.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return addOfflineBanner(cachedResponse.clone());
                    }
                    return new Response("You are offline, and the requested resource cannot be accessed.", {
                        status: 404,
                        statusText: "Offline and resource not cached",
                    });
                });
            }));
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