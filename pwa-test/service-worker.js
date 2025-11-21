// /service-worker.js at https://dummy-magazine.com/

// Bump the version query when you publish a new core to bust any CDN cache.
const CORE_URL =
  "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/sw-core.v1.js?v=1.6.0";
const ONESIGNAL_SW =
  "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js";

try {
  importScripts(CORE_URL); // caching/routing core
} catch (e) {
  console.error("[PWA] core worker load failed", e);
}

try {
  importScripts(ONESIGNAL_SW); // push handling
} catch (e) {
  console.error("[PWA] OneSignal SW load failed", e);
}
