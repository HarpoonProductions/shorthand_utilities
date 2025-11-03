/* sw-core.v1.js — host on GitHub Pages
   Used by /autumn-2025/service-worker.js via importScripts(...)

   Update rules:
   - Overwrite THIS file at the same URL to ship code updates (browser installs new SW when bytes differ).
   - Bump CORE_VERSION to rotate caches (optional but useful on big changes).
*/

const CORE_VERSION = "1.0.0"; // bump to rotate cache buckets
const STATIC_DESTS = [
  "script",
  "style",
  "image",
  "font",
  "audio",
  "video",
  "track",
];
const SAME_ORIGIN_ONLY = true;

// Derive the base path (e.g., '/autumn-2025')
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const OFFLINE_FALLBACK_URL = `${SCOPE_PATH}/offline.html`;

// Sitemap pages to precache (HTML). Using *paths* so we stay within scope.
const SITEMAP_HTML = [
  "/autumn-2025/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/features/the-library-of-lost-maps-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/features/loveucl-a-decade-in-pictures-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/features/advancing-people-and-planet-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/features/designing-healthier-places-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/people-ideas/the-algorithm-will-see-you-now-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/people-ideas/inspired-by-achala-moulik-a-life-in-chapters-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/people-ideas/inspired-by-professor-kevin-fong-stellar-ambitions-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/people-ideas/spotlight-the-ceremonial-mace-of-ucl-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/people-ideas/students-and-south-africa-ucl-and-anti-apartheid-campaigns-portico-magazine-ucl/index.html",
  "/autumn-2025/portico-magazine-autumn-2025-ucl/people-ideas/provosts-view-portico-magazine-ucl/index.html",
];
// Also include directory URLs (navigate requests are typically to the folder path, not index.html)
const SITEMAP_DIRS = SITEMAP_HTML.map((p) => p.replace(/\/index\.html$/, "/"));
const PRECACHE_HTML = Array.from(
  new Set([
    `${SCOPE_PATH}/`, // project root landing
    ...SITEMAP_HTML,
    ...SITEMAP_DIRS,
  ])
).filter((p) => p.startsWith(SCOPE_PATH + "/") || p === `${SCOPE_PATH}/`);

const HTML_CACHE = `html-${CORE_VERSION}`;
const ASSET_CACHE = `assets-${CORE_VERSION}`;

// Utilities
const isHTML = (req) =>
  req.mode === "navigate" || req.destination === "document";
const isStatic = (req) => STATIC_DESTS.includes(req.destination);
const sameOrigin = (u) =>
  new URL(u, self.location.href).origin === self.location.origin;

// ----- INSTALL -----
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const c = await caches.open(HTML_CACHE);
      // Precache all HTML entry points (bounded list from sitemap)
      try {
        await c.addAll(PRECACHE_HTML);
      } catch (_) {}
      // Also ensure offline fallback is present
      try {
        await c.add(OFFLINE_FALLBACK_URL);
      } catch (_) {}
    })()
  );
  self.skipWaiting();
});

// ----- ACTIVATE -----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim();
      const keep = new Set([HTML_CACHE, ASSET_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );
    })()
  );
});

// ----- MESSAGE (background asset caching from page) -----
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PWA_ASSETS" && Array.isArray(msg.assets)) {
    event.waitUntil(backgroundAddAssets(msg.assets));
  }
  if (msg.type === "SKIP_WAITING") self.skipWaiting();
});

async function backgroundAddAssets(urls) {
  const cache = await caches.open(ASSET_CACHE);
  const uniq = Array.from(new Set(urls));
  await Promise.all(
    uniq.map(async (u) => {
      try {
        const abs = new URL(u, self.location.href);
        if (SAME_ORIGIN_ONLY && abs.origin !== self.location.origin) return;
        await cache.add(
          new Request(abs.toString(), { credentials: "same-origin" })
        );
      } catch (_) {}
    })
  );
}

// ----- FETCH ROUTING -----
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (SAME_ORIGIN_ONLY && !sameOrigin(req.url)) return;

  if (isHTML(req)) {
    event.respondWith(handleHTML(req));
    return;
  }
  if (isStatic(req)) {
    event.respondWith(handleStatic(req));
    return;
  }
  // pass-through for others (APIs, etc.) — add strategy if needed
});

async function handleHTML(request) {
  const cache = await caches.open(HTML_CACHE);
  try {
    // Network-first → published changes show immediately online
    const net = await fetch(request);
    // cache updated copy in background
    cache.put(request, net.clone()).catch(() => {});
    return net;
  } catch {
    // Offline fallback: cached page or offline.html
    const hit = await cache.match(request);
    if (hit) return hit;
    const fb = await caches.match(OFFLINE_FALLBACK_URL);
    return (
      fb ||
      new Response("<h1>Offline</h1>", {
        headers: { "Content-Type": "text/html" },
      })
    );
  }
}

async function handleStatic(request) {
  const cache = await caches.open(ASSET_CACHE);
  const hit = await cache.match(request);
  if (hit) {
    // SWR: serve fast, refresh in background
    fetch(request)
      .then((res) => {
        if (res && res.ok) cache.put(request, res.clone());
      })
      .catch(() => {});
    return hit;
  }
  try {
    const net = await fetch(request);
    if (net && net.ok) cache.put(request, net.clone()).catch(() => {});
    return net;
  } catch {
    return new Response("", { status: 504 });
  }
}
