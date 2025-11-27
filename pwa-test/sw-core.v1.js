/* sw-core.v1.js — v1.6.0
   - Sitemap-driven deep precache (pages + assets)
   - Throttled background fetches + delayed start
   - Periodic revalidation + prune
   - Cross-origin allowlist (opaque ok)
   - Same-origin path allowlist (for /assets, etc.)
*/

const CORE_VERSION = "1.6.8";
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
const REVALIDATE_FETCH_INIT = { cache: "no-cache" };

const MAX_PAGES_FIRST_RUN = 10;

// Start control + throttle
const START_DELAY_MS = 3000;
const FALLBACK_START_MS = 15000;
const MAX_CONCURRENT = 6;

function createLimiter(max) {
  let active = 0,
    queue = [];
  const runNext = () => {
    if (active >= max || queue.length === 0) return;
    active++;
    const fn = queue.shift();
    fn().finally(() => {
      active--;
      runNext();
    });
  };
  return (task) =>
    new Promise((resolve, reject) => {
      queue.push(() => task().then(resolve, reject));
      runNext();
    });
}
const limit = createLimiter(MAX_CONCURRENT);

// Scope/origin
const ROOT_ORIGIN = self.location.origin; // e.g. https://hpn-edn.s3.eu-west-2.amazonaws.com
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // e.g. /dummy-magazine
const SITEMAP_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/sitemap.xml`;
const OFFLINE_FALLBACK_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/offline.html`;

// If the original Shorthand project lived under /dummy-magazine on S3,
// but the new site is mounted at the root (https://dummy-magazine.com/),
// we strip that prefix when mapping sitemap URLs onto the new origin.
const PROJECT_PREFIX = "/dummy-magazine";

function mapSitemapPath(pathname) {
  // Exact project root (/dummy-magazine or /dummy-magazine/)
  if (pathname === PROJECT_PREFIX || pathname === PROJECT_PREFIX + "/") {
    return "/index.html";
  }

  // Any nested story: /dummy-magazine/story/index.html -> /story/index.html
  if (pathname.startsWith(PROJECT_PREFIX + "/")) {
    const stripped = pathname.slice(PROJECT_PREFIX.length); // remove "/dummy-magazine"
    if (stripped === "" || stripped === "/") return "/index.html";
    return stripped;
  }

  // Anything else: leave as-is
  return pathname;
}

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
  "https://hpn-edn.s3.eu-west-2.amazonaws.com",
];

/* Same-origin path allowlist (outside SCOPE_PATH) */
const SAME_ORIGIN_PATH_ALLOWLIST = [
  "/assets/",
  "/static/",
  "/icons/",
  "/theme.min.css",
  "/project/",
];

const NAV_ASSETS_ALWAYS = [
  // Core Shorthand static bundles on dummy-magazine.com
  "https://dummy-magazine.com/static/story.539906.min.js",
  "https://dummy-magazine.com/static/project.539906.min.js",
  "https://dummy-magazine.com/static/footer.539906.min.js",

  // Shorthand project scripts on S3 (rebased site still uses them)
  "https://hpn-edn.s3.eu-west-2.amazonaws.com/dummy-magazine/project.js",
  "https://hpn-edn.s3.eu-west-2.amazonaws.com/dummy-magazine/static/project-search.539906.min.js",

  // Slider libs for the nav UI
  "https://cdnjs.cloudflare.com/ajax/libs/splidejs/4.1.4/js/splide.min.js",
  "https://cdn.jsdelivr.net/npm/glider-js@1.7.8/glider.min.js",

  // Your custom nav widget script
  "https://harpoonproductions.github.io/shorthand_utilities/dummy-magazine/script_scroll_low_no_nav.js",
];

// Optionally keep URLs even if not rediscovered
const KEEP_URL_PATTERNS = [
  // /\/icons\/pwa-promo\.png$/
];

const isHTML = (req) =>
  req.mode === "navigate" || req.destination === "document";
const isStatic = (req) => STATIC_DESTS.includes(req.destination);

function isPageCandidate(u) {
  try {
    const url = new URL(u);

    // 1) Drop the SW and sitemap
    if (url.pathname === "/service-worker.js") return false;
    if (url.pathname === "/sitemap.xml") return false;

    // 2) Drop the special PWA query variants
    if (url.searchParams.has("source")) return false; // e.g. ?source=pwa

    // 3) Optionally, only keep "edition" / "dummy-" type paths:
    //    this is optional, but you can tighten it if you want:
    // if (!url.pathname.includes("front-page") &&
    //     !url.pathname.includes("dummy-") &&
    //     !url.pathname.includes("edition-") &&
    //     !url.pathname.includes("archive-page")) {
    //   return false;
    // }

    return true;
  } catch {
    return false;
  }
}

function isCacheableURL(u) {
  try {
    const url = new URL(u);
    if (url.origin === ROOT_ORIGIN) {
      if (
        url.pathname === SCOPE_PATH ||
        url.pathname.startsWith(SCOPE_PATH + "/")
      )
        return true;
      return SAME_ORIGIN_PATH_ALLOWLIST.some((p) => url.pathname.startsWith(p));
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

// Extract assets from HTML
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
    m[1].split(",").forEach((s) => push(s.trim().split(" ")[0]));
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
  const res = await limit(() => fetch(SITEMAP_URL, { cache: "no-cache" }));
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
    const original = new URL(u);

    // 1) Map the sitemap path from the original host (S3) to the PWA layout
    // 2) Re-base onto ROOT_ORIGIN (dummy-magazine.com)
    let rebasedPath = mapSitemapPath(original.pathname);

    // Ensure leading slash
    if (!rebasedPath.startsWith("/")) rebasedPath = "/" + rebasedPath;

    const rebased = new URL(rebasedPath + original.search, ROOT_ORIGIN);

    // Normalise directory-style URLs to index.html
    if (rebased.pathname.endsWith("/")) {
      rebased.pathname += "index.html";
    }

    return rebased.toString();
  } catch {
    return u;
  }
}

async function fetchSitemapPages() {
  try {
    const xml = await fetchSitemapXML();
    const urlsFromSitemap = parseSitemapLocs(xml);

    const rebased = urlsFromSitemap
      .map(normalisePageURL)
      .filter(isCacheableURL)
      .filter(isPageCandidate); // <---- NEW

    const unique = Array.from(new Set(rebased));

    console.log("[PWA] urlsFromSitemap:", urlsFromSitemap.length);
    console.log("[PWA] rebased unique (pages only):", unique.length);

    return unique;
  } catch (e) {
    // existing error handling
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
  if (u.origin === ROOT_ORIGIN)
    return revalidate
      ? { ...REVALIDATE_FETCH_INIT, credentials: "same-origin" }
      : { credentials: "same-origin" };
  return revalidate
    ? { ...REVALIDATE_FETCH_INIT, mode: "no-cors" }
    : { mode: "no-cors" };
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
        htmlRes = await limit(() => fetch(pageUrl, init));
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

    // Assets (same-origin + allowlisted cross-origin)
    try {
      const html = htmlRes ? await htmlRes.clone().text() : "";
      const assets = extractAssetUrls(html, pageUrl);
      for (const a of assets) {
        if (!isCacheableURL(a)) continue;
        discoveredAssets.add(a);
        try {
          const init = requestInitFor(a, revalidate);
          const req = new Request(a, init);
          const res = await limit(() => fetch(req));
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

  if (prune) await pruneStaleAssets(assetCache, discoveredAssets);

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
      if (!isCacheableURL(url)) continue;
      if (KEEP_URL_PATTERNS.some((re) => re.test(url))) continue;
      if (!keep.has(url)) {
        try {
          await assetCache.delete(req);
        } catch {}
      }
    }
  } catch {}
}

/* PERIODIC REFRESH LOOP */
function scheduleSitemapRefresh() {
  (async function loop() {
    while (true) {
      await new Promise((r) => setTimeout(r, PAGES_REFRESH_INTERVAL_MS));
      try {
        const pages = await fetchSitemapPages();
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

/* BACKGROUND START CONTROL */
let _started = false;
async function startBackgroundWork() {
  if (_started) return;
  _started = true;
  console.log("[PWA] startBackgroundWork begin");

  const pages = await fetchSitemapPages();
  console.log("[PWA] pages length from sitemap:", pages.length);

  await deepPrecachePages(pages, { revalidate: true, prune: true });
  scheduleSitemapRefresh();
}
// Safety fallback: begin even if page didn't message us
// setTimeout(() => {
//   startBackgroundWork().catch(() => {});
// }, FALLBACK_START_MS);

/* MESSAGES */
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PWA_START_PRECACHE") {
    event.waitUntil(
      (async () => {
        await new Promise((r) => setTimeout(r, START_DELAY_MS)); // let page settle
        await startBackgroundWork();
      })()
    );
  }
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
        const res = await limit(() => fetch(req));
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

  // HTML: only same-origin within scope or allowed same-origin paths
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
    limit(() => fetch(new Request(request.url, init)))
      .then((res) => {
        if (res && (res.ok || res.type === "opaque"))
          cachePutSafe(cache, keyReq, res.clone());
      })
      .catch(() => {});
    return hit;
  }
  try {
    const net = await limit(() => fetch(new Request(request.url, init)));
    if (net && resOk(net)) cachePutSafe(cache, keyReq, net.clone());
    return net;
  } catch {
    return new Response("", { status: 504 });
  }
}
function resOk(res) {
  return res && (res.ok || res.type === "opaque");
}
