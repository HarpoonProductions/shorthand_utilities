// /dummy-magazine/service-worker.js (on S3)

// (Optional) bump this query when you deploy a new core to force a fresh fetch.
const CORE_URL =
  "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/sw-core.v1.js?v=1.5.0";
const ONESIGNAL_SW =
  "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js";

try {
  importScripts(CORE_URL); // your caching/routing logic
} catch (e) {
  console.error("[PWA] core worker load failed", e);
}

try {
  importScripts(ONESIGNAL_SW); // push handling
} catch (e) {
  console.error("[PWA] OneSignal SW load failed", e);
}
