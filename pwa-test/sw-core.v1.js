/* sw-core.v1.js — core Service Worker for dummy-magazine

   Hosted on GitHub Pages and imported by:
   https://hpn-edn.s3.eu-west-2.amazonaws.com/dummy-magazine/service-worker.js
*/

const CORE_VERSION = "1.0.0"; // bump to rotate cache buckets
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
const PAGES_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// Origin & scope derived from registration
const ROOT_ORIGIN = self.location.origin; // https://hpn-edn.s3.eu-west-2.amazonaws.com
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // /dummy-magazine
const OFFLINE_FALLBACK_URL = `${ROOT_ORIGIN}${SCOPE_PATH}/offline.html`;

// JSON index of pages to precache
const PAGES_INDEX_URL =
  "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/dummy-magazine-pages.json";

// ------------- helpers -------------

function asIndexRequest(request) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/")) {
    url.pathname += "index.html";
    return new Request(url.toString(), { credentials: "same-origin" });
  }
  return request;
}

const isHTML = (req) =>
  req.mode === "navigate" || req.destination === "document";
const isStatic = (req) => STATIC_DESTS.includes(req.destination);

function sameOriginAndInScope(urlString) {
  try {
    const url = new URL(urlString);
    return (
      url.origin === ROOT_ORIGIN && url.pathname.startsWith(SCOPE_PATH + "/")
    );
  } catch {
    return false;
  }
}

function normalisePages(pages) {
  const out = [];
  for (const p of pages || []) {
    try {
      const url = new URL(p);
      if (!sameOriginAndInScope(url.toString())) continue;
      url.hash = "";
      out.push(url.toString());
    } catch {
      // ignore bad entry
    }
  }
  return Array.from(new Set(out));
}

async function fetchPagesIndex() {
  try {
    const res = await fetch(PAGES_INDEX_URL, { cache: "no-cache" });
    if (!res.ok) return { pages: [] };
    const json = await res.json();
    return {
      version: json.version || null,
      pages: normalisePages(json.pages),
    };
  } catch {
    return { pages: [] };
  }
}

async function precachePages(pages) {
  if (!pages.length) return;
  const cache = await caches.open(HTML_CACHE);
  const unique = Array.from(new Set(pages));
  await Promise.all(
    unique.map(async (u) => {
      try {
        await cache.add(new Request(u, { credentials: "same-origin" }));
      } catch {
        // ignore per-URL failures
      }
    })
  );
}

// ------------- install / activate -------------

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(HTML_CACHE);
        await cache.add(
          new Request(OFFLINE_FALLBACK_URL, { credentials: "same-origin" })
        );
      } catch {
        // offline fallback is optional
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim();
      // clean old caches if CORE_VERSION changes
      const keep = new Set([HTML_CACHE, ASSET_CACHE]);
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (keep.has(k) ? null : caches.delete(k)))
      );

      // initial full-site precache
      const { pages } = await fetchPagesIndex();
      await precachePages(pages);
    })()
  );
});

// ------------- periodic refresh of page index -------------

function schedulePagesRefresh() {
  (async function loop() {
    while (true) {
      await new Promise((r) => setTimeout(r, PAGES_REFRESH_INTERVAL_MS));
      try {
        const { pages } = await fetchPagesIndex();
        await precachePages(pages);
      } catch {
        // ignore refresh failures
      }
    }
  })();
}
schedulePagesRefresh();

// ------------- messages (optional asset caching) -------------

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "PWA_ASSETS" && Array.isArray(msg.assets)) {
    event.waitUntil(backgroundAddAssets(msg.assets));
  }
  if (msg.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
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
      } catch {
        // ignore
      }
    })
  );
}

// ------------- fetch routing -------------

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (!sameOriginAndInScope(req.url)) return;

  if (isHTML(req)) {
    event.respondWith(handleHTML(req));
    return;
  }
  if (isStatic(req)) {
    event.respondWith(handleStatic(req));
    return;
  }
});

async function handleHTML(request) {
  const cache = await caches.open(HTML_CACHE);

  // Map "/path/" → "/path/index.html" for S3 REST endpoint
  const indexReq = asIndexRequest(request);

  try {
    const net = await fetch(indexReq);
    cache.put(indexReq, net.clone()).catch(() => {});
    // also cache under the folder URL so offline navigation to "/path/" works:
    if (indexReq.url !== request.url) {
      cache.put(request, net.clone()).catch(() => {});
    }
    return net;
  } catch {
    // try both cache keys
    const hit = (await cache.match(request)) || (await cache.match(indexReq));
    if (hit) return hit;
    return new Response("<h1>Offline</h1>", {
      headers: { "Content-Type": "text/html" },
    });
  }
}

async function handleStatic(request) {
  const cache = await caches.open(ASSET_CACHE);
  const hit = await cache.match(request);
  if (hit) {
    // SWR: update in background
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
