this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('chat-v1').then(function(cache) {
            return cache.addAll([
                './',
                './bundle.js',
            ]);
        })
    );
});

this.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
