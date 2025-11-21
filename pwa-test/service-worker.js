const CORE_URL =
  "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/sw-core.v1.js?v=1.6.2";
const ONESIGNAL_SW =
  "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js";

try {
  importScripts(CORE_URL); // caching/routing core
  console.log("[PWA] core worker loaded:", CORE_URL);
} catch (e) {
  console.error("[PWA] core worker load failed", e);
}

try {
  importScripts(ONESIGNAL_SW); // push handling
  console.log("[PWA] OneSignal SW loaded:", ONESIGNAL_SW);
} catch (e) {
  console.error("[PWA] OneSignal SW load failed", e);
}
