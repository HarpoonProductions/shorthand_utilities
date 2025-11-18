/* sw-core.v1.js — sitemap-driven deep precache */

const CORE_VERSION = "1.2.0"; // bump to rotate caches if you want
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
const PAGES_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1h

// Derive origin/scope (works on dummy & prod)
const ROOT_ORIGIN = self.location.origin; // e.g. https://hpn-edn.s3.eu-west-2.amazonaws.com
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // /dummy-magazine
const SITEMAP_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/sitemap.xml`; // <-- use your existing sitemap
const OFFLINE_FALLBACK_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/offline.html`;

// If some assets are cross-origin, set SAME_ORIGIN_ONLY=false and add to ALLOW_ORIGINS
const SAME_ORIGIN_ONLY = true;
const ALLOW_ORIGINS = [];

// ---------- helpers ----------
const isHTML = (r) => r.mode === "navigate" || r.destination === "document";
const isStatic = (r) => STATIC_DESTS.includes(r.destination);

function sameOriginAndInScope(urlString) {
  try {
    const u = new URL(urlString);
    const okOrigin =
      u.origin === ROOT_ORIGIN ||
      (!SAME_ORIGIN_ONLY && ALLOW_ORIGINS.includes(u.origin));
    return okOrigin && u.pathname.startsWith(SCOPE_PATH + "/");
  } catch {
    return false;
  }
}

function toIndexHtml(u) {
  try {
    const url = new URL(u);
    if (url.pathname.endsWith("/")) url.pathname += "index.html";
    return url.toString();
  } catch {
    return u;
  }
}

// quick-n-dirty XML <loc> extraction (no DOMParser needed)
function extractLocsFromSitemap(xmlText) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xmlText))) locs.push(m[1].trim());
  return Array.from(new Set(locs));
}

async function fetchSitemapPages() {
  try {
    const res = await fetch(SITEMAP_URL, { cache: "no-cache" });
    if (!res.ok) return [];
    const xml = await res.text();
    const urls = extractLocsFromSitemap(xml)
      .map(toIndexHtml)
      .filter(sameOriginAndInScope);
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

function extractAssetUrls(html, baseHref) {
  const urls = new Set();
  const push = (url) => {
    try {
      const abs = new URL(url, baseHref);
      const okOrigin =
        abs.origin === ROOT_ORIGIN ||
        (!SAME_ORIGIN_ONLY && ALLOW_ORIGINS.includes(abs.origin));
      if (!okOrigin) return;
      if (
        !(abs.origin === ROOT_ORIGIN
          ? abs.pathname.startsWith(SCOPE_PATH + "/")
          : true)
      )
        return;
      urls.add(abs.toString());
    } catch {}
  };
  // href/src/srcset/url(...) — simple but effective
  const reHref = /href\s*=\s*"([^"]+)"/gi;
  const reSrc = /src\s*=\s*"([^"]+)"/gi;
  const reSrcS = /srcset\s*=\s*"([^"]+)"/gi;
  const reCss = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;

  let m;
  while ((m = reHref.exec(html))) push(m[1]);
  while ((m = reSrc.exec(html))) push(m[1]);
  while ((m = reSrcS.exec(html)))
    m[1].split(",").forEach((p) => push(p.trim().split(" ")[0]));
  while ((m = reCss.exec(html))) push(m[1]);

  return Array.from(urls);
}

// optional tiny meta storage for “new content” toasts
async function getMeta(key) {
  const c = await caches.open(META_CACHE);
  const r = await c.match(new Request(key));
  return r ? await r.text() : null;
}
async function setMeta(key, val) {
  const c = await caches.open(META_CACHE);
  await c.put(new Request(key), new Response(val));
}

// -------- INSTALL / ACTIVATE --------
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
      // clean old caches (when CORE_VERSION changes)
      const keep = new Set([HTML_CACHE, ASSET_CACHE, META_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );

      // initial deep precache from sitemap
      const pages = await fetchSitemapPages();
      await deepPrecachePages(pages);
      scheduleSitemapRefresh();
    })()
  );
});

// -------- DEEP PRECACHE: pages + assets ----------
async function deepPrecachePages(pages) {
  if (!pages.length) return;
  const htmlCache = await caches.open(HTML_CACHE);
  const assetCache = await caches.open(ASSET_CACHE);

  let done = 0;
  for (const pageUrl of pages) {
    let htmlRes;
    try {
      htmlRes = await fetch(pageUrl, { credentials: "same-origin" });
      if (htmlRes.ok) {
        await cachePutSafe(htmlCache, new Request(pageUrl), htmlRes.clone());
        // also cache folder URL for offline “/dir/”
        if (pageUrl.endsWith("/index.html")) {
          await cachePutSafe(
            htmlCache,
            new Request(pageUrl.replace(/index\.html$/, "")),
            htmlRes.clone()
          );
        }
      }
    } catch {}

    // extract & cache assets
    try {
      const html = htmlRes ? await htmlRes.clone().text() : "";
      const assets = extractAssetUrls(html, pageUrl);
      for (const a of assets) {
        try {
          const r = new Request(a, { credentials: "same-origin" });
          const res = await fetch(r);
          if (res && res.ok) await cachePutSafe(assetCache, r, res.clone());
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
  const cs = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  cs.forEach((c) => c.postMessage({ type: "PWA_PRECACHE_DONE" }));
}

// periodic background refresh
function scheduleSitemapRefresh() {
  (async function loop() {
    while (true) {
      await new Promise((r) => setTimeout(r, PAGES_REFRESH_INTERVAL_MS));
      try {
        const pages = await fetchSitemapPages();
        await deepPrecachePages(pages);
        // optional “content updated” toast
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
      try {
        const abs = new URL(u, ROOT_ORIGIN);
        if (!sameOriginAndInScope(abs.toString())) return;
        await cache.add(
          new Request(abs.toString(), { credentials: "same-origin" })
        );
      } catch {}
    })
  );
}

// fetch routing
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (!sameOriginAndInScope(req.url)) return;

  if (isHTML(req)) {
    event.respondWith(handleHTML(event));
    return;
  }
  if (isStatic(req)) {
    event.respondWith(handleStatic(req));
    return;
  }
});

async function handleHTML(event) {
  const cache = await caches.open(HTML_CACHE);
  const indexReq = (function asIndexRequest(r) {
    const url = new URL(r.url);
    if (url.pathname.endsWith("/")) {
      url.pathname += "index.html";
      return new Request(url.toString(), { credentials: "same-origin" });
    }
    return r;
  })(event.request);

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
  const hit = await cache.match(request);
  if (hit) {
    fetch(request)
      .then((res) => {
        if (res && res.ok) cachePutSafe(cache, request, res.clone());
      })
      .catch(() => {});
    return hit;
  }
  try {
    const net = await fetch(request);
    if (net && net.ok) cachePutSafe(cache, request, net.clone());
    return net;
  } catch {
    return new Response("", { status: 504 });
  }
}
