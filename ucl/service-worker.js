// Upload once. Never needs changing again.
try {
  importScripts(
    "https://harpoonproductions.github.io/shorthand_utilities/ucl/sw-core.v1.js"
  );
} catch (e) {
  console.error("[PWA] core worker load failed", e);
}
