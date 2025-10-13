(function () {
  if (window.__safeInput_v3) return;
  window.__safeInput_v3 = true;

  // const SAFE_SEL = '#inputField1, .project-search-input, .Theme-SearchInput';
  const SAFE_SEL = "#inputField1, .project-search-input";

  const isEl = (n) => n && n.nodeType === 1;
  const isProtected = (n) =>
    isEl(n) && (n.matches(SAFE_SEL) || n.closest?.(SAFE_SEL));

  // --- 1) Time-boxed shield after focusing a protected input ---
  let lastProtectedFocusTs = 0;
  const SHIELD_MS = 500; // window to ignore "mouseup/click" that try to blur

  document.addEventListener(
    "focusin",
    (e) => {
      if (isProtected(e.target)) {
        lastProtectedFocusTs = performance.now();
      }
    },
    true
  );

  function withinShieldWindow() {
    return performance.now() - lastProtectedFocusTs < SHIELD_MS;
  }

  function hardShield(e) {
    // If the event touches a protected input OR we just focused one, kill it
    if (
      isProtected(e.target) ||
      withinShieldWindow() ||
      isProtected(document.activeElement)
    ) {
      e.stopImmediatePropagation();
      // Prevent default click behaviors that might steal focus
      if (
        e.type === "click" ||
        e.type === "mouseup" ||
        e.type === "pointerup" ||
        e.type === "touchend"
      ) {
        e.preventDefault?.();
      }
      // Re-focus a protected input if it lost focus
      const a = document.activeElement;
      if (!isProtected(a)) {
        // Prefer the event's input, else the last focused protected element in DOM order
        (
          e.target?.closest?.('input,textarea,[contenteditable="true"]') ||
          document.querySelector(SAFE_SEL)
        )?.focus({ preventScroll: true });
      }
    }
  }

  // Capture-phase on window & document for all likely culprits
  ["mouseup", "pointerup", "click", "touchend"].forEach((t) => {
    window.addEventListener(t, hardShield, true);
    document.addEventListener(t, hardShield, true);
  });

  // --- 2) Veto explicit blur() calls on protected inputs (and log offender) ---
  const _blur = HTMLElement.prototype.blur;
  HTMLElement.prototype.blur = function () {
    if (isProtected(this)) {
      console.trace("[safe-input] blocked blur() on protected input");
      return; // veto
    }
    return _blur.apply(this, arguments);
  };

  // --- 3) Wrap future addEventListener so new handlers auto-skip when protected is involved ---
  const _add = EventTarget.prototype.addEventListener;
  const _remove = EventTarget.prototype.removeEventListener;
  const wrapMap = new WeakMap();

  const GUARDED_TYPES = new Set(["mouseup", "pointerup", "click", "touchend"]);

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (GUARDED_TYPES.has(type) && typeof listener === "function") {
      const wrapped = function (e) {
        if (
          isProtected(e.target) ||
          withinShieldWindow() ||
          isProtected(document.activeElement)
        ) {
          // Skip this newly-added handler when our inputs are involved
          return;
        }
        return listener.call(this, e);
      };
      wrapMap.set(listener, wrapped);
      return _add.call(this, type, wrapped, options);
    }
    return _add.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function (
    type,
    listener,
    options
  ) {
    const wrapped = wrapMap.get(listener) || listener;
    return _remove.call(this, type, wrapped, options);
  };

  // --- 4) Optional: sanity check overlay/backdrop after nav toggles ---
  // If your nav leaves an invisible overlay, this reveals it in console:
  window.addEventListener(
    "transitionend",
    (e) => {
      if (e.target?.id === "navigation" || e.target?.closest?.("#navigation")) {
        const el = document.elementFromPoint(innerWidth / 2, 10);
        if (el && !el.closest("#navigation")) {
          // Top-most element at top-center after close; inspect if it's a backdrop stealing events
          console.debug("[safe-input] top element after nav transition:", el);
        }
      }
    },
    true
  );
})();
