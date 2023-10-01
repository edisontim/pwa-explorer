// const installEvent = () => {
//   self.addEventListener("install", () => {
//     console.log("service worker installed");
//   });
// };
// installEvent();

// const activateEvent = () => {
//   self.addEventListener("activate", () => {
//     console.log("service worker activated");
//   });
// };
// activateEvent();

// const cacheName = "v1";

// const cacheClone = async (e) => {
//   const res = await fetch(e.request);

//   const resClone = res.clone();
//   console.log("Cloning cache");

//   const cache = await caches.open(cacheName);
//   await cache.put(e.request, resClone);
//   return res;
// };

// const handleRequest = async (event) => {
//   console.log("Handling fetch event for", event.request.url);

//   const cachedResponse = await caches.match(event.request, { cacheName: "v1" });
//   if (cachedResponse) {
//     console.log(`Using cache`);
//     const clone = cachedResponse.clone();
//     return cachedResponse;
//   } else {
//     console.log("No response found in cache. About to fetch from network…");
//     try {
//       const netWorkResponse = await fetch(event.request);
//       const clone = netWorkResponse.clone();
//       const resClone = netWorkResponse.clone();
//       const cache = await caches.open(cacheName);
//       await cache.put(event.request, resClone);
//       return netWorkResponse;
//     } catch (err) {
//       console.error("Fetching failed:", err);
//       throw err;
//     }
//   }
// };

// self.addEventListener("fetch", (event) => {
//   if (event.request.method !== "GET") return;
//   if (!event.request.url.startsWith("http")) return;
//   event.respondWith(handleRequest(event));
// });
