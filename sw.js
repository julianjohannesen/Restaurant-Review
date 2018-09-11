// Service worker

// Register the service worker
if ("serviceWorker" in navigator) {
  //Register worker on page load
  window.addEventListener("load", function() {
    navigator.serviceWorker
    // Register the service worker, passing in the location of the service worker script. This returns a pending promise.
    .register("/sw.js")
    // Handle the success or failure of the promise with 
    .then(reg => console.log("ServiceWorker reg successful with scope: ", reg.scope),
          err => console.log( "ServiceWorker registration failed: ", err)
    )
    
  }); // close function passed to event listener and close event listener
} // close if statement


const PRECACHE = "my-site-cache-v1";
const RUNTIME = "runtime"
const urlsToCache = [
  '/',
  'index.html',
  '/css/leaflet.css',
  '/css/normalize.css',
  '/css/styles.css',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/img/'

];

// This code block waits for an InstallEvent to fire, then runs waitUntil() to handle the install process for the app. This consists of calling CacheStorage.open to create a new cache, then using addAll() to add a series of assets to it.
self.addEventListener('install', function(event) {
  // Perform install steps
  // In service workers, waitUntil() tells the browser that work is ongoing until the promise settles, and it shouldn't terminate the service worker if it wants that work to complete. The install events in service workers use waitUntil() to hold the service worker in the installing phase until tasks complete. If the promise passed to waitUntil() rejects, the install is considered a failure, and the installing service worker is discarded. This is primarily used to ensure that a service worker is not considered installed until all of the core caches it depends on are successfully populated.
  event.waitUntil(
    // "caches" is a global read-only variable, which is an instance of CacheStorage. The open() method of the CacheStorage interface returns a Promise that resolves to the cache object matching the cacheName.
    caches.open(PRECACHE)
      // The addAll() method of the Cache interface takes an array of URLs, retrieves them, and adds the resulting response objects to the given cache. The request objects created during retrieval become keys to the stored response operations.
      .then(cache => cache.addAll(urlsToCache));
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName)))
    .then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))))
    .then(() => self.clients.claim());
  );
});