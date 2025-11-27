// /service-worker.js  (root PWA worker)

const CORE_URL =
  "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/sw-core.v1.js";

try {
  importScripts(CORE_URL); // caching / routing core (sw-core.v1.js)
  console.log("[PWA] core worker loaded:", CORE_URL);
} catch (e) {
  console.error("[PWA] core worker load failed", e);
}

// NOTE:
// OneSignal now uses its *own* service worker under /push/onesignal/,
// so we do NOT import the OneSignal SW here anymore.
