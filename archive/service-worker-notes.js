// Notes at end of file

const registerWorker = () => {
  const successHandler = reg => console.log("ServiceWorker reg successful with scope: ", reg.scope);
  const errorHandler = err => console.log( "ServiceWorker registration failed: ", err);
  const result = navigator.serviceWorker.register("/sw.js").then(successHandler,errorHandler);
  console.log("registerWorker's result is: ", result);
};

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

const installProcess = event => {
  console.log("The event passed into installProcess is: ", event)
  event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(urlsToCache)).then(self.skipWaiting()));
}

const activateProcess = event => {
  console.log(event)
  const filterCacheNames = cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
  const deleteCaches = cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)));
  event.waitUntil(caches.keys().then(filterCacheNames).then(deleteCaches).then(() => self.clients.claim()));
}
// const fetchProcess = event => event.respondWith(caches.match(event.request).then(response => response ? response : fetch(event.request)));

const fetchProcess = event => {
  console.log(event)
  // Skip cross-origin requests, like those for Google Analytics.
  const origin = event.request.url.startsWith(self.location.origin);
  if(origin) event.respondWith(caches.match(event.request).then(cachedResponse => cachedResponse ? cachedResponse : caches.open(RUNTIME).then(cache => fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() => response)))));
};

if ("serviceWorker" in navigator) window.addEventListener("load", registerWorker);
self.addEventListener('install', installProcess);
self.addEventListener('activate', activateProcess);
self.addEventListener('fetch', fetchProcess);

// This code block waits for an InstallEvent to fire, then runs waitUntil() to handle the install process for the app. This consists of calling CacheStorage.open to create a new cache, then using addAll() to add a series of assets to it.

// The ServiceWorkerGlobalScope.skipWaiting() method of the ServiceWorkerGlobalScope forces the waiting service worker to become the active service worker. Use this method with Clients.claim() to ensure that updates to the underlying service worker take effect immediately for both the current client and all other active clients.

// In service workers, waitUntil() tells the browser that work is ongoing until the promise settles, and it shouldn't terminate the service worker if it wants that work to complete. The install events in service workers use waitUntil() to hold the service worker in the installing phase until tasks complete. If the promise passed to waitUntil() rejects, the install is considered a failure, and the installing service worker is discarded. This is primarily used to ensure that a service worker is not considered installed until all of the core caches it depends on are successfully populated.

// "caches" is a global read-only variable, which is an instance of CacheStorage. The open() method of the CacheStorage interface returns a Promise that resolves to the cache object matching the cacheName.
    
// The addAll() method of the Cache interface takes an array of URLs, retrieves them, and adds the resulting response objects to the given cache. The request objects created during retrieval become keys to the stored response operations.

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.