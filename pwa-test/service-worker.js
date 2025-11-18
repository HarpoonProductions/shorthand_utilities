// /dummy-magazine/service-worker.js on S3
try {
  importScripts(
    "https://harpoonproductions.github.io/shorthand_utilities/pwa-test/sw-core.v1.js",
    "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js"
  );
} catch (e) {
  console.error("[PWA] core worker load failed", e);
}
