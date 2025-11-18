/* sw-core.v1.js — sitemap-driven deep precache + cross-origin allowlist
   + periodic revalidation of pages/assets + pruning of stale assets
*/
const CORE_VERSION = "1.4.0"; // bump to rotate caches
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

// Refresh cadence while the app is open:
const PAGES_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1h
// Force conditional revalidation on background refresh:
const REVALIDATE_FETCH_INIT = { cache: "no-cache" };

// Scope/origin derived from registration (works on dummy + prod)
const ROOT_ORIGIN = self.location.origin;
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const SITEMAP_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/sitemap.xml`;
const OFFLINE_FALLBACK_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/offline.html`;

/* Cross-origin caching controls */
const SAME_ORIGIN_ONLY = false;
const ALLOW_ORIGINS = [
  "https://harpoonproductions.github.io",
  "https://cdn.onesignal.com",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.plot.ly",
  "https://d3js.org",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

// Optionally keep some URLs even if not re-discovered (e.g., static promo images)
const KEEP_URL_PATTERNS = [
  // example: /\/icons\/pwa-promo\.png$/
];

const isHTML = (req) =>
  req.mode === "navigate" || req.destination === "document";
const isStatic = (req) => STATIC_DESTS.includes(req.destination);

function isCacheableURL(u) {
  try {
    const url = new URL(u);
    if (url.origin === ROOT_ORIGIN) {
      return (
        url.pathname === SCOPE_PATH || url.pathname.startsWith(SCOPE_PATH + "/")
      );
    }
    return !SAME_ORIGIN_ONLY && ALLOW_ORIGINS.includes(url.origin);
  } catch {
    return false;
  }
}

function asIndexRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== ROOT_ORIGIN) return request;
  if (url.pathname.endsWith("/")) {
    url.pathname += "index.html";
    return new Request(url.toString(), { credentials: "same-origin" });
  }
  return request;
}

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

async function getMeta(key) {
  const c = await caches.open(META_CACHE);
  const r = await c.match(new Request(key));
  return r ? await r.text() : null;
}
async function setMeta(key, val) {
  const c = await caches.open(META_CACHE);
  await c.put(new Request(key), new Response(val));
}

async function fetchSitemapXML() {
  const res = await fetch(SITEMAP_URL, { cache: "no-cache" });
  if (!res.ok) throw new Error("sitemap fetch failed");
  return res.text();
}
function parseSitemapLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return Array.from(new Set(locs));
}
function normalisePageURL(u) {
  try {
    const url = new URL(u);
    if (url.origin === ROOT_ORIGIN && url.pathname.endsWith("/"))
      url.pathname += "index.html";
    return url.toString();
  } catch {
    return u;
  }
}
async function fetchSitemapPages() {
  try {
    const xml = await fetchSitemapXML();
    const urls = parseSitemapLocs(xml)
      .map(normalisePageURL)
      .filter(isCacheableURL);
    return Array.from(new Set(urls));
  } catch {
    return [];
  }
}

async function cachePutSafe(cache, req, res) {
  try {
    await cache.put(req, res);
  } catch {}
}
function requestInitFor(url, revalidate = false) {
  const u = new URL(url);
  if (u.origin === ROOT_ORIGIN) {
    return revalidate
      ? { ...REVALIDATE_FETCH_INIT, credentials: "same-origin" }
      : { credentials: "same-origin" };
  }
  return revalidate
    ? { ...REVALIDATE_FETCH_INIT, mode: "no-cors" }
    : { mode: "no-cors" };
}
function shouldKeepURL(urlStr) {
  return KEEP_URL_PATTERNS.some((re) => re.test(urlStr));
}

/* INSTALL / ACTIVATE */
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
      const keep = new Set([HTML_CACHE, ASSET_CACHE, META_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );

      const pages = await fetchSitemapPages();
      await deepPrecachePages(pages, { revalidate: true, prune: true });
      scheduleSitemapRefresh();
    })()
  );
});

/* DEEP PRECACHE + PRUNE */
async function deepPrecachePages(
  pages,
  { revalidate = false, prune = false } = {}
) {
  if (!pages.length) return;
  const htmlCache = await caches.open(HTML_CACHE);
  const assetCache = await caches.open(ASSET_CACHE);

  const discoveredAssets = new Set();

  let done = 0;
  for (const pageUrl of pages) {
    // HTML (same-origin only)
    let htmlRes;
    try {
      if (new URL(pageUrl).origin === ROOT_ORIGIN) {
        const init = requestInitFor(pageUrl, revalidate);
        htmlRes = await fetch(pageUrl, init);
        if (htmlRes.ok || htmlRes.type === "opaqueredirect") {
          await cachePutSafe(
            htmlCache,
            new Request(pageUrl, init),
            htmlRes.clone()
          );
          if (pageUrl.endsWith("/index.html")) {
            await cachePutSafe(
              htmlCache,
              new Request(pageUrl.replace(/index\.html$/, ""), init),
              htmlRes.clone()
            );
          }
        }
      }
    } catch {}

    // Assets
    try {
      const html = htmlRes ? await htmlRes.clone().text() : "";
      const assets = extractAssetUrls(html, pageUrl);
      for (const a of assets) {
        if (!isCacheableURL(a)) continue;
        discoveredAssets.add(a);
        try {
          const init = requestInitFor(a, revalidate);
          const req = new Request(a, init);
          const res = await fetch(req);
          if (res && (res.ok || res.type === "opaque")) {
            await cachePutSafe(assetCache, req, res.clone());
          }
        } catch {}
      }
    } catch {}

    done++;
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

  if (prune) {
    await pruneStaleAssets(assetCache, discoveredAssets);
  }

  const cs = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  cs.forEach((c) => c.postMessage({ type: "PWA_PRECACHE_DONE" }));
}

async function pruneStaleAssets(assetCache, discoveredAssets) {
  try {
    const keys = await assetCache.keys();
    const keep = new Set(discoveredAssets);
    for (const req of keys) {
      const url = req.url;
      if (!isCacheableURL(url)) continue; // out of scope → ignore
      if (shouldKeepURL(url)) continue; // protected by KEEP_URL_PATTERNS
      if (!keep.has(url)) {
        try {
          await assetCache.delete(req);
        } catch {}
      }
    }
  } catch {}
}

/* PERIODIC REFRESH */
function scheduleSitemapRefresh() {
  (async function loop() {
    while (true) {
      await new Promise((r) => setTimeout(r, PAGES_REFRESH_INTERVAL_MS));
      try {
        const pages = await fetchSitemapPages();
        // Revalidate even if sitemap didn't change, and prune stale assets
        await deepPrecachePages(pages, { revalidate: true, prune: true });
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

/* MESSAGES */
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PWA_ASSETS" && Array.isArray(msg.assets)) {
    event.waitUntil(backgroundAddAssets(msg.assets));
  }
  if (msg.type === "PWA_REFRESH_INDEX") {
    event.waitUntil(
      (async () => {
        const pages = await fetchSitemapPages();
        await deepPrecachePages(pages, { revalidate: true, prune: true });
      })()
    );
  }
  if (msg.type === "SKIP_WAITING") self.skipWaiting();
});

async function backgroundAddAssets(urls) {
  const cache = await caches.open(ASSET_CACHE);
  const unique = Array.from(new Set(urls)).filter(isCacheableURL);
  await Promise.all(
    unique.map(async (u) => {
      try {
        const init = requestInitFor(u, true);
        const req = new Request(u, init);
        const res = await fetch(req);
        if (res && (res.ok || res.type === "opaque")) {
          await cachePutSafe(cache, req, res.clone());
        }
      } catch {}
    })
  );
}

/* FETCH ROUTING */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // HTML: same-origin within scope
  if (isHTML(req)) {
    const url = new URL(req.url);
    if (url.origin !== ROOT_ORIGIN || !isCacheableURL(req.url)) return;
    event.respondWith(handleHTML(event));
    return;
  }

  // Static assets: same-origin + allowlisted cross-origin
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
  const init = sameOrigin
    ? { credentials: "same-origin" }
    : { mode: "no-cors" };
  const keyReq = new Request(request.url, init);

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
  try {
    const net = await fetch(new Request(request.url, init));
    if (net && (net.ok || net.type === "opaque"))
      cachePutSafe(cache, keyReq, net.clone());
    return net;
  } catch {
    return new Response("", { status: 504 });
  }
}
