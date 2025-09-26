// Block mouseup for clicks that land on #inputField1
function blockIfInsideInput(e) {
  if (
    e.target &&
    (e.target.closest("#inputField1") ||
      e.target.closest(".project-search-input") ||
      e.target.closest(".Theme-SearchInput"))
  ) {
    e.stopImmediatePropagation(); // stop later capture + all bubble listeners
    // e.preventDefault(); // only if needed
  }
}

// Attach on window and document (capture) to be as early as possible
window.addEventListener("mouseup", blockIfInsideInput, true);
document.addEventListener("mouseup", blockIfInsideInput, true);
