(function () {
  // Idempotent install
  if (window.__safeInputShield) return;
  window.__safeInputShield = true;

  const SAFE_SEL = "#inputField1, .project-search-input, .Theme-SearchInput";

  const isProtectedEl = (el) =>
    !!el &&
    el.nodeType === 1 &&
    (el.matches(SAFE_SEL) || el.closest?.(SAFE_SEL));

  // 1) Capture-phase shield: stop any mouseup that would blur a protected input
  const mouseupShield = (e) => {
    const ael = document.activeElement;
    if (isProtectedEl(e.target) || isProtectedEl(ael)) {
      // Kill later capture/bubble handlers registered after us
      e.stopImmediatePropagation();
      // Keep focus on the input if something already stole it
      if (!isProtectedEl(document.activeElement)) {
        // Prefer target; else re-focus the last protected element in the path
        const t = e.target.closest?.('input,textarea,[contenteditable="true"]');
        (t && isProtectedEl(t) ? t : document.querySelector(SAFE_SEL))?.focus({
          preventScroll: true,
        });
      }
    }
  };

  window.addEventListener("mouseup", mouseupShield, true);
  document.addEventListener("mouseup", mouseupShield, true);

  // 2) Veto rogue blur() calls on protected inputs (reveals culprit too)
  const origBlur = HTMLElement.prototype.blur;
  HTMLElement.prototype.blur = function () {
    if (isProtectedEl(this)) {
      console.trace("[blocked blur()] on protected input");
      return; // veto
    }
    return origBlur.apply(this, arguments);
  };

  // 3) (Optional) handle touch as well
  const touchShield = (e) => mouseupShield(e);
  window.addEventListener("touchend", touchShield, true);
  document.addEventListener("touchend", touchShield, true);
})();
