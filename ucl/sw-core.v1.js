/* sw-core.v1.js — host on GitHub Pages
   Works with a tiny on-origin bootstrap:
   try { importScripts('https://harpoonproductions.github.io/shorthand_utilities/ucl/sw-core.v1.js'); } catch (e) {}

   Update behavior:
   - Any change to THIS file's bytes triggers a Service Worker update/install.
   - If you also want to rotate cache buckets (flush old), bump CORE_VERSION below.
*/

const CORE_VERSION = "1.0.0"; // ← bump to force a new cache namespace (optional)
const HTML_CACHE = `html-${CORE_VERSION}`;
const ASSET_CACHE = `assets-${CORE_VERSION}`;
const OFFLINE_FALLBACK_URL = "/offline.html";

// Tunables
const STATIC_DESTS = [
  "script",
  "style",
  "image",
  "font",
  "audio",
  "video",
  "track",
];
const PRECACHE_URLS = ["/", OFFLINE_FALLBACK_URL]; // keep very small
const SAME_ORIGIN_ONLY = true; // set false if you want to cache whitelisted CDNs

// Utilities
const sameOrigin = (u) =>
  new URL(u, self.location.href).origin === self.location.origin;
const isHTML = (req) =>
  req.mode === "navigate" || req.destination === "document";
const isStatic = (req) => STATIC_DESTS.includes(req.destination);

// ----- INSTALL -----
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(HTML_CACHE);
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (e) {
        /* ignore */
      }
    })()
  );
  self.skipWaiting(); // take control ASAP; page can choose to reload on update
});

// ----- ACTIVATE -----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim();
      // Clean old cache buckets from previous CORE_VERSIONs
      const keep = new Set([HTML_CACHE, ASSET_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );
    })()
  );
});

// ----- MESSAGES FROM PAGE -----
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  // Background cache a set of assets discovered on the page
  if (msg.type === "PWA_ASSETS" && Array.isArray(msg.assets)) {
    event.waitUntil(backgroundAddAssets(msg.assets));
  }
  // Allow page to force-activate an updated SW if you wire a "refresh" button
  if (msg.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function backgroundAddAssets(urls) {
  const cache = await caches.open(ASSET_CACHE);
  const list = Array.from(new Set(urls)).filter(Boolean);
  await Promise.all(
    list.map(async (u) => {
      try {
        // Use same-origin by default; loosen if you trust specific CDNs
        const url = new URL(u, self.location.href);
        if (SAME_ORIGIN_ONLY && url.origin !== self.location.origin) return;
        await cache.add(
          new Request(url.toString(), { credentials: "same-origin" })
        );
      } catch (_) {
        /* ignore individual failures */
      }
    })
  );
}

// ----- FETCH ROUTING -----
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (SAME_ORIGIN_ONLY && !sameOrigin(req.url)) return;

  if (isHTML(req)) {
    event.respondWith(handleHTML(event));
    return;
  }
  if (isStatic(req)) {
    event.respondWith(handleStatic(event));
    return;
  }
  // For everything else (e.g., APIs), you can add a strategy or let it pass-through.
});

async function handleHTML(event) {
  const { request } = event;
  const cache = await caches.open(HTML_CACHE);
  try {
    // Network-first so republished pages show immediately when online
    const net = await fetch(request);
    event.waitUntil(cache.put(request, net.clone()));
    return net;
  } catch {
    // Offline fallback to cached page or offline.html
    const hit = await cache.match(request);
    if (hit) return hit;
    const fallback = await caches.match(OFFLINE_FALLBACK_URL);
    return (
      fallback ||
      new Response("<h1>Offline</h1>", {
        headers: { "Content-Type": "text/html" },
      })
    );
  }
}

async function handleStatic(event) {
  const { request } = event;
  const cache = await caches.open(ASSET_CACHE);

  const cached = await cache.match(request);
  if (cached) {
    // Stale-While-Revalidate: return fast, refresh in background
    event.waitUntil(
      (async () => {
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.ok) await cache.put(request, fresh.clone());
        } catch {
          /* ignore */
        }
      })()
    );
    return cached;
  }

  try {
    const net = await fetch(request);
    if (net && net.ok) event.waitUntil(cache.put(request, net.clone()));
    return net;
  } catch {
    // No cache, no network
    return new Response("", { status: 504 });
  }
}
