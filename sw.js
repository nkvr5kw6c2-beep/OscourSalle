const CACHE_NAME = "iron-log-v16";
const FILES = ["./", "./index.html", "./gamification.js", "./advanced-features.js", "./manifeste.json"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("iron-log-") && k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const request = event.request.mode === "navigate"
        ? new Request(event.request, { cache: "reload" })
        : event.request;
      const response = await fetch(request);
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    } catch (error) {
      return (await caches.match(event.request)) || (await caches.match("./index.html"));
    }
  })());
});

// Required for real Web Push notifications delivered while the app is not open.
self.addEventListener("push", event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; }
  catch (_) { payload = { body: event.data ? event.data.text() : "" }; }
  const title = typeof payload.title === "string" ? payload.title : "IRON LOG";
  const options = {
    body: typeof payload.body === "string" ? payload.body : "Ton rappel IRON LOG est arrivé.",
    tag: typeof payload.tag === "string" ? payload.tag : "iron-log-push",
    renotify: Boolean(payload.renotify),
    data: { url: typeof payload.url === "string" ? payload.url : "./" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const destination = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(destination);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(destination);
  })());
});
