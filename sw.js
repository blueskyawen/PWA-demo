/**
 * Created by root on 2/16/19.
 */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js");
var cacheStorageKey = 'story-pwa';
var cacheList=[
    '/',
    'index.html',
    'assets/css/main.css',
    'icons/android-icon-36x36.png',
    'icons/android-icon-48x48.png',
    'icons/android-icon-72x72.png',
    'icons/android-icon-96x96.png',
    'icons/android-icon-144x144.png',
    'icons/android-icon-192x192.png',
    'icons/favicon.ico',
    'icons/favicon-16x16.png',
    'icons/favicon-32x32.png',
    'icons/favicon-96x96.png',
    'icons/ms-icon-70x70.png',
    'icons/ms-icon-144x144.png',
    'icons/ms-icon-150x150.png',
    'icons/ms-icon-310x310.png'
];
self.addEventListener('install',function(e) {
    e.waitUntil(
        caches.open(cacheStorageKey)
            .then(function(cache) {cache.addAll(cacheList);})
        .then(function() {self.skipWaiting();})
    )
});

self.addEventListener('fetch',function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            if(response != null){
                return response
            }
            return fetch(e.request.url)

            var requestToCache = e.request.clone();
            return fetch(requestToCache).then(
                function(response){
                    if(!response || response.status !== 200){
                        return response;
                    }
                    var responseToCache = response.clone();
                    caches.open(cacheStorageKey)
                        .then(function(cache){
                            cache.put(requestToCache, responseToCache);
                        });
                    return response;
                }
            );
        })
    )
});
self.addEventListener('activate',function(e){
    e.waitUntil(
        //获取所有cache名称
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                // 获取所有不同于当前版本名称cache下的内容
                cacheNames.filter(function(cacheNames) {
                    return cacheNames !== cacheStorageKey
                }).map(function(cacheNames) {
                return caches.delete(cacheNames)
            })
        )
        }).then(function() {
            return self.clients.claim()
        })
    )
});

/*importScripts('sw-toolbox.js');
toolbox.precache(["index.html",”style/style.css”]);
toolbox.router.get('/images/*’, toolbox.cacheFirst); ' +
    toolbox.router.get('/*’, toolbox.networkFirst, { networkTimeoutSeconds: 5});*/
