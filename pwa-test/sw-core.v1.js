/* sw-core.v1.js — sitemap-driven deep precache + cross-origin allowlist
   Host this on GitHub Pages. Your on-origin /dummy-magazine/service-worker.js uses:
   importScripts('https://harpoonproductions.github.io/shorthand_utilities/ucl/sw-core.v1.js')
*/

const CORE_VERSION = "1.3.0"; // bump to rotate caches
const HTML_CACHE = `html-${CORE_VERSION}`;
const ASSET_CACHE = `assets-${CORE_VERSION}`;
const META_CACHE = `meta-${CORE_VERSION}`;

const STATIC_DESTS = [
  "script",
  "style",
  "image",
  "font",
  "audio",
  "video",
  "track",
];
const PAGES_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1h background refresh while app is open

// Scope/origin derived from registration (works on dummy + prod)
const ROOT_ORIGIN = self.location.origin; // e.g. https://hpn-edn.s3.eu-west-2.amazonaws.com
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // e.g. /dummy-magazine
const SITEMAP_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/sitemap.xml`;
const OFFLINE_FALLBACK_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/offline.html`;

/* ===== Cross-origin caching controls =====
   If you use third-party CDNs (fonts, JS, charts, your utilities repo, OneSignal, etc.)
   set SAME_ORIGIN_ONLY=false and whitelist their origins below.
*/
const SAME_ORIGIN_ONLY = false;
const ALLOW_ORIGINS = [
  "https://harpoonproductions.github.io",
  "https://cdn.onesignal.com",
  // common CDNs you might use — keep/remove as needed:
  "https://cdn.jsdelivr.net",
  "https://unpkg.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.plot.ly",
  "https://d3js.org",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

// ---- helpers ----
const isHTML = (req) =>
  req.mode === "navigate" || req.destination === "document";
const isStatic = (req) => STATIC_DESTS.includes(req.destination);

// Should we cache/serve this URL at all?
function isCacheableURL(u) {
  try {
    const url = new URL(u);
    if (url.origin === ROOT_ORIGIN) {
      // same-origin: keep within SW scope
      return (
        url.pathname === SCOPE_PATH || url.pathname.startsWith(SCOPE_PATH + "/")
      );
    }
    // cross-origin assets allowed?
    return !SAME_ORIGIN_ONLY && ALLOW_ORIGINS.includes(url.origin);
  } catch {
    return false;
  }
}

// Map "/dir/" → "/dir/index.html" for S3 REST endpoints
function asIndexRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== ROOT_ORIGIN) return request; // only rewrite same-origin HTML
  if (url.pathname.endsWith("/")) {
    url.pathname += "index.html";
    return new Request(url.toString(), { credentials: "same-origin" });
  }
  return request;
}

// extract assets from HTML (href/src/srcset/url(...))
function extractAssetUrls(html, baseHref) {
  const out = new Set();
  const push = (v) => {
    try {
      const abs = new URL(v, baseHref);
      if (isCacheableURL(abs.toString())) out.add(abs.toString());
    } catch {}
  };
  let m;
  const HREF = /href\s*=\s*"([^"]+)"/gi;
  const SRC = /src\s*=\s*"([^"]+)"/gi;
  const SRCSET = /srcset\s*=\s*"([^"]+)"/gi;
  const CSSURL = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;

  while ((m = HREF.exec(html))) push(m[1]);
  while ((m = SRC.exec(html))) push(m[1]);
  while ((m = SRCSET.exec(html)))
    m[1].split(",").forEach((p) => push(p.trim().split(" ")[0]));
  while ((m = CSSURL.exec(html))) push(m[1]);
  return Array.from(out);
}

// simple meta store (for “content updated” toasts if you use them)
async function getMeta(key) {
  const c = await caches.open(META_CACHE);
  const r = await c.match(new Request(key));
  return r ? await r.text() : null;
}
async function setMeta(key, val) {
  const c = await caches.open(META_CACHE);
  await c.put(new Request(key), new Response(val));
}

async function fetchSitemapPages() {
  try {
    const res = await fetch(SITEMAP_URL, { cache: "no-cache" });
    if (!res.ok) return [];
    const xml = await res.text();
    const locs = [];
    const re = /<loc>([^<]+)<\/loc>/gi;
    let m;
    while ((m = re.exec(xml))) locs.push(m[1].trim());
    // normalise folder → index.html and filter to cacheable URLs
    const norm = locs
      .map((u) => {
        try {
          const url = new URL(u);
          if (url.origin === ROOT_ORIGIN && url.pathname.endsWith("/"))
            url.pathname += "index.html";
          return url.toString();
        } catch {
          return u;
        }
      })
      .filter(isCacheableURL);
    return Array.from(new Set(norm));
  } catch {
    return [];
  }
}

async function cachePutSafe(cache, req, res) {
  try {
    await cache.put(req, res);
  } catch {}
}

// choose fetch init for a URL (CORS vs opaque)
function requestInitFor(url) {
  const u = new URL(url);
  if (u.origin === ROOT_ORIGIN) return { credentials: "same-origin" };
  // cross-origin: request opaque so we can cache even if CDN omits CORS
  return { mode: "no-cors" };
}

// ---- install/activate ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const c = await caches.open(HTML_CACHE);
        await c.add(
          new Request(OFFLINE_FALLBACK_URL, { credentials: "same-origin" })
        );
      } catch {}
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim();
      // purge old buckets
      const keep = new Set([HTML_CACHE, ASSET_CACHE, META_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );
      // initial deep precache
      const pages = await fetchSitemapPages();
      await deepPrecachePages(pages);
      scheduleSitemapRefresh();
    })()
  );
});

// ---- deep precache (pages + assets) ----
async function deepPrecachePages(pages) {
  if (!pages.length) return;
  const htmlCache = await caches.open(HTML_CACHE);
  const assetCache = await caches.open(ASSET_CACHE);

  let done = 0;
  for (const pageUrl of pages) {
    // fetch & store HTML (same-origin only)
    let htmlRes;
    try {
      if (new URL(pageUrl).origin === ROOT_ORIGIN) {
        htmlRes = await fetch(pageUrl, { credentials: "same-origin" });
        if (htmlRes.ok) {
          await cachePutSafe(htmlCache, new Request(pageUrl), htmlRes.clone());
          // also under folder path for offline "/dir/"
          if (pageUrl.endsWith("/index.html")) {
            await cachePutSafe(
              htmlCache,
              new Request(pageUrl.replace(/index\.html$/, "")),
              htmlRes.clone()
            );
          }
        }
      }
    } catch {}

    // extract & cache assets (same-origin and allowlisted cross-origin)
    try {
      const html = htmlRes ? await htmlRes.clone().text() : "";
      const assets = extractAssetUrls(html, pageUrl);
      for (const a of assets) {
        if (!isCacheableURL(a)) continue;
        try {
          const init = requestInitFor(a);
          const req = new Request(a, init);
          const res = await fetch(req);
          // accept ok same-origin or opaque cross-origin
          if (res && (res.ok || res.type === "opaque")) {
            await cachePutSafe(assetCache, req, res.clone());
          }
        } catch {}
      }
    } catch {}

    done++;
    // (optional) progress messages
    const cs = await clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });
    cs.forEach((c) =>
      c.postMessage({
        type: "PWA_PRECACHE_PROGRESS",
        done,
        total: pages.length,
      })
    );
  }
  const cs = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  cs.forEach((c) => c.postMessage({ type: "PWA_PRECACHE_DONE" }));
}

// periodic background refresh from sitemap
function scheduleSitemapRefresh() {
  (async function loop() {
    while (true) {
      await new Promise((r) => setTimeout(r, PAGES_REFRESH_INTERVAL_MS));
      try {
        const pages = await fetchSitemapPages();
        await deepPrecachePages(pages);
        const stamp = new Date().toISOString();
        await setMeta("last-refresh", stamp);
        const cs = await clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
        cs.forEach((c) =>
          c.postMessage({ type: "PWA_CONTENT_UPDATED", at: stamp })
        );
      } catch {}
    }
  })();
}

// messages: asset push + manual refresh
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PWA_ASSETS" && Array.isArray(msg.assets)) {
    event.waitUntil(backgroundAddAssets(msg.assets));
  }
  if (msg.type === "PWA_REFRESH_INDEX") {
    event.waitUntil(
      (async () => {
        const pages = await fetchSitemapPages();
        await deepPrecachePages(pages);
      })()
    );
  }
  if (msg.type === "SKIP_WAITING") self.skipWaiting();
});

async function backgroundAddAssets(urls) {
  const cache = await caches.open(ASSET_CACHE);
  const unique = Array.from(new Set(urls));
  await Promise.all(
    unique.map(async (u) => {
      if (!isCacheableURL(u)) return;
      try {
        const init = requestInitFor(u);
        const req = new Request(u, init);
        const res = await fetch(req);
        if (res && (res.ok || res.type === "opaque")) {
          await cachePutSafe(cache, req, res.clone());
        }
      } catch {}
    })
  );
}

// ---- fetch routing ----
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // HTML: only same-origin within scope
  if (isHTML(req)) {
    const url = new URL(req.url);
    if (url.origin !== ROOT_ORIGIN || !isCacheableURL(req.url)) return;
    event.respondWith(handleHTML(event));
    return;
  }

  // Static assets: allow same-origin and allowlisted cross-origin
  if (isStatic(req) && isCacheableURL(req.url)) {
    event.respondWith(handleStatic(req));
  }
});

async function handleHTML(event) {
  const cache = await caches.open(HTML_CACHE);
  const indexReq = asIndexRequest(event.request);
  try {
    const net = await fetch(indexReq);
    cachePutSafe(cache, indexReq, net.clone());
    if (indexReq.url !== event.request.url)
      cachePutSafe(cache, event.request, net.clone());
    return net;
  } catch {
    const hit =
      (await cache.match(event.request)) || (await cache.match(indexReq));
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
  const url = new URL(request.url);
  const sameOrigin = url.origin === ROOT_ORIGIN;

  // Build a cache key & fetch init that match what we precached
  const init = sameOrigin
    ? { credentials: "same-origin" }
    : { mode: "no-cors" };
  const keyReq = new Request(request.url, init);

  // Try cache first (SWR)
  const hit = await cache.match(keyReq);
  if (hit) {
    fetch(new Request(request.url, init))
      .then((res) => {
        if (res && (res.ok || res.type === "opaque"))
          cachePutSafe(cache, keyReq, res.clone());
      })
      .catch(() => {});
    return hit;
  }

  // Else go to network
  try {
    const net = await fetch(new Request(request.url, init));
    if (net && (net.ok || net.type === "opaque"))
      cachePutSafe(cache, keyReq, net.clone());
    return net;
  } catch {
    return new Response("", { status: 504 });
  }
}
