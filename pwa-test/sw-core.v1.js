/* sw-core.v1.js — deep-precaches pages + their assets */

const CORE_VERSION = "1.1.0"; // bump to rotate cache buckets (did so here)
const HTML_CACHE = `html-${CORE_VERSION}`;
const ASSET_CACHE = `assets-${CORE_VERSION}`;

const STATIC_DESTS = [
  "script",
  "style",
  "image",
  "font",
  "audio",
  "video",
  "track",
];
const PAGES_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

// Derive origin/scope from registration (works on dummy + prod)
const ROOT_ORIGIN = self.location.origin;
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const OFFLINE_FALLBACK_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/offline.html`;

// Your JSON of pages (dummy for now)
const PAGES_INDEX_URL =
  "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/dummy-magazine-pages.json";

// Allow assets from same-origin only (toggle if your assets live elsewhere)
const SAME_ORIGIN_ONLY = false;
// If you have cross-origin assets, set SAME_ORIGIN_ONLY=false and fill this allowlist:
const ALLOW_ORIGINS = [
  "https://harpoonproductions.github.io",
  "https://cdn.onesignal.com",
];

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

// Map "/path/" → "/path/index.html" for S3 REST endpoints
function asIndexRequest(request) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/")) {
    url.pathname += "index.html";
    return new Request(url.toString(), { credentials: "same-origin" });
  }
  return request;
}

// VERY simple asset extraction from HTML (no DOM needed)
function extractAssetUrls(html, baseHref) {
  const urls = new Set();
  const push = (url) => {
    try {
      const abs = new URL(url, baseHref);
      // same-origin (or allowlisted) only
      const okOrigin =
        abs.origin === ROOT_ORIGIN ||
        (!SAME_ORIGIN_ONLY && ALLOW_ORIGINS.includes(abs.origin));
      if (!okOrigin) return;
      // keep within scope or allowlist
      if (
        !(abs.origin === ROOT_ORIGIN
          ? abs.pathname.startsWith(SCOPE_PATH + "/")
          : true)
      )
        return;
      urls.add(abs.toString());
    } catch {}
  };

  // href/src/srcset pulls
  const reHref = /href\s*=\s*"(.*?)"/gi;
  const reSrc = /src\s*=\s*"(.*?)"/gi;
  const reSrcS = /srcset\s*=\s*"(.*?)"/gi;

  let m;
  while ((m = reHref.exec(html))) push(m[1]);
  while ((m = reSrc.exec(html))) push(m[1]);
  while ((m = reSrcS.exec(html))) {
    m[1].split(",").forEach((part) => push(part.trim().split(" ")[0]));
  }

  // Common inline CSS url(...) cases (LQIPs/backgrounds)
  const reCssUrl = /url\(\s*['"]?(.*?)['"]?\s*\)/gi;
  while ((m = reCssUrl.exec(html))) push(m[1]);

  return Array.from(urls);
}

async function fetchPagesIndex() {
  try {
    const res = await fetch(PAGES_INDEX_URL, { cache: "no-cache" });
    if (!res.ok) return { pages: [] };
    const json = await res.json();
    const raw = Array.isArray(json.pages) ? json.pages : [];
    // normalise & keep explicit index.html preferred
    const pages = raw
      .map((p) => {
        const u = new URL(p);
        return u.toString();
      })
      .filter(sameOriginAndInScope);
    return { pages: Array.from(new Set(pages)) };
  } catch {
    return { pages: [] };
  }
}

async function cachePutSafe(cache, req, res) {
  try {
    await cache.put(req, res);
  } catch {}
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
      // clean old caches
      const keep = new Set([HTML_CACHE, ASSET_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );
      // initial deep precache
      const { pages } = await fetchPagesIndex();
      await deepPrecachePages(pages);
      schedulePagesRefresh();
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
    // Fetch HTML (prefer index.html URLs)
    let htmlRes;
    try {
      htmlRes = await fetch(pageUrl, { credentials: "same-origin" });
      if (!htmlRes.ok) throw new Error("bad status");
      await cachePutSafe(htmlCache, new Request(pageUrl), htmlRes.clone());
      // Also store under folder path if applicable
      if (pageUrl.endsWith("/index.html")) {
        const folderReq = new Request(pageUrl.replace(/index\.html$/, ""));
        await cachePutSafe(htmlCache, folderReq, htmlRes.clone());
      }
    } catch {}

    // Extract & cache assets
    try {
      const htmlText = htmlRes ? await htmlRes.clone().text() : "";
      const assets = extractAssetUrls(htmlText, pageUrl);
      for (const a of assets) {
        try {
          const r = new Request(a, { credentials: "same-origin" });
          const res = await fetch(r);
          if (res && res.ok) await cachePutSafe(assetCache, r, res.clone());
        } catch {}
      }
    } catch {}

    done++;
    // optional: progress events to clients
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
  cs.forEach((c) =>
    c.postMessage({ type: "PWA_PRECACHE_DONE", total: pages.length })
  );
}

// Periodic background refresh of the pages index (and deep-precache new ones)
function schedulePagesRefresh() {
  (async function loop() {
    while (true) {
      await new Promise((r) => setTimeout(r, PAGES_REFRESH_INTERVAL_MS));
      try {
        const { pages } = await fetchPagesIndex();
        await deepPrecachePages(pages);
      } catch {}
    }
  })();
}

// -------- messages: asset push + manual refresh ----------
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PWA_ASSETS" && Array.isArray(msg.assets)) {
    event.waitUntil(backgroundAddAssets(msg.assets));
  }
  if (msg.type === "PWA_REFRESH_INDEX") {
    event.waitUntil(
      (async () => {
        const { pages } = await fetchPagesIndex();
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

// -------- fetch routing ----------
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
  const indexReq = asIndexRequest(event.request);

  try {
    const net = await fetch(indexReq);
    cachePutSafe(cache, indexReq, net.clone());
    if (indexReq.url !== event.request.url) {
      cachePutSafe(cache, event.request, net.clone());
    }
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
