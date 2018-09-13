// sw.js version 3

let PRECACHE = "v1";
let RUNTIME = "runtime";
const urlsToCache = [
  'Restaurant-Review/',
  'index.html',
  'Restaurant-Review/css/leaflet.css',
  'Restaurant-Review/css/normalize.css',
  'Restaurant-Review/css/styles.css',
  'Restaurant-Review/data/',
  'Restaurant-Review/data/restaurants.json',
  'Restaurant-Review/js/main.js',
  'Restaurant-Review/js/dbhelper.js',
  'Restaurant-Review/js/restaurant_info.js',
  'Restaurant-Review/js/leaflet/',
  'Restaurant-Review/js/leaflet/leaflet.js',
  'Restaurant-Review/img/',
  'Restaurant-Review/img/1.jpg',
  'Restaurant-Review/img/2.jpg',
  'Restaurant-Review/img/3.jpg',
  'Restaurant-Review/img/4.jpg',
  'Restaurant-Review/img/5.jpg',
  'Restaurant-Review/img/6.jpg',
  'Restaurant-Review/img/7.jpg',
  'Restaurant-Review/img/8.jpg',
  'Restaurant-Review/img/9.jpg',
  'Restaurant-Review/img/10.jpg',
  'Restaurant-Review/img/layers-2x.png',
  'Restaurant-Review/img/layers.png',
  'Restaurant-Review/img/marker-icon-2x.png',
  'Restaurant-Review/img/marker-icon.png',
  'Restaurant-Review/img/marker-shadow.png' 
];

// Install Event
self.addEventListener("install", e => {
  console.log("Service worker installed.");
  // event.waitUntil holds the service worker in the installing phase until all tasks complete.
  e.waitUntil(
    caches
      // caches.open returns a promise that resolves to the Cache object with the matching name. We're opening a cache with name 'v1'.
      .open(PRECACHE)
      // Then we return the cache having added the assets at the urls contained in urlsToCache
      .then(cache => {
        console.log("Service worker caching files.");
        // addAll adds all of the urls provided to the cache
        cache.addAll(urlsToCache);
      })
      // Force the waiting service worker to become the active service worker.
      .then(self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", e =>{
  console.log("Service worker activated.");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== PRECACHE){
            console.log("Service worker clearing  old caches.");
            return caches.delete(cache);
            // What would .then(() => self.clients.claim()) do?
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener("fetch", e => {
  // I originally tried the line below, which avoid cross origin requests by requiring that request urls start with the origin url. Of course, then none of the data loaded
  // const origin = e.request.url.startsWith(self.location.origin);
  if(origin) {
    // event.respondWith() prevents the default fetch handling, allowing us to supply our own handling
    e.respondWith(
      caches
        // caches.match() returns a promise that resolves to the response associated with the first matching request in the cache object. event.request is the request object we're attempting to match.
        .match(e.request)
        .then(response => {
          // Once we have the matched request object, then if the response exists, we return it, otherwise...
          if(response) return response;
          return caches
            // Open the runtime cache, 
            .open(RUNTIME)
            // Then, passing in the cache, ...
            .then(cache => {
              // return the result of fetching the requested url after...
              return fetch(e.request)
                .then(response => {
                   return cache
                    // putting the request/response key/value pair into the cache and returning the response
                    .put(
                      // The key
                      e.request, 
                      // The value - The response will be consumed by the put, so we clone it)
                      response.clone())
                    // Finally we return the response
                    .then(()=>response);
                }); // Close anon. fn. arg, & then statement ln 84
              }); // Close anon. fn. arg, & then statement ln 81
        })
    ) // Close respondWith() 
  } // Close if statement ln 68
}); // Close anon. fn. arg. & event listener ln 65
