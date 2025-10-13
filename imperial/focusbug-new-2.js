(function () {
  // Prevent double-injection
  if (window.__safeInput_v5) return;
  window.__safeInput_v5 = true;

  /**
   * CONFIG
   */
  const SAFE_SEL = "#inputField1, .project-search-input"; // add more if needed
  const ALLOW_SEL =
    'button,[type="submit"],[role="button"],[data-escape-input="true"]';
  const SHIELD_MS = 500; // brief window after focus where we guard against accidental blur
  const ALLOW_BLUR_GRACE_MS = 1200; // give ourselves time to blur intentionally after clicks

  /**
   * Utils
   */
  const isEl = (n) => n && n.nodeType === 1;
  const isProtected = (n) =>
    isEl(n) && (n.matches(SAFE_SEL) || n.closest?.(SAFE_SEL));
  const isEscapeTarget = (n) => isEl(n) && !!n.closest?.(ALLOW_SEL);
  const now = () => performance.now();

  /**
   * State
   */
  let lastProtectedFocusTs = 0;
  let lastProtectedEl = null;
  let allowProgrammaticBlurUntil = 0;

  const withinShieldWindow = () => now() - lastProtectedFocusTs < SHIELD_MS;

  /**
   * Track protected input focus
   */
  document.addEventListener(
    "focusin",
    (e) => {
      if (isProtected(e.target)) {
        lastProtectedFocusTs = now();
        lastProtectedEl = e.target;
      }
    },
    true
  );

  /**
   * Guard at the source of focus changes: pointerdown/touchstart.
   * - During the shield window, block outside taps that would steal focus.
   * - But allow "escape" targets (buttons, submit, etc.) through.
   */
  function guardPointerDown(e) {
    const activeIsProtected = isProtected(document.activeElement);
    if (!activeIsProtected || !withinShieldWindow()) return;

    const target = e.target;
    if (isProtected(target)) return; // tapping inside the input: allow

    if (isEscapeTarget(target)) {
      // Let it through. We’ll blur intentionally after click (below).
      return;
    }

    // Outside tap during shield: block focus steal & keep the input active
    e.stopImmediatePropagation();
    e.preventDefault?.();
    // Re-focus if something already stole it (rare race)
    if (!isProtected(document.activeElement) && lastProtectedEl?.focus) {
      try {
        lastProtectedEl.focus({ preventScroll: true });
      } catch (_) {}
    }
  }

  ["pointerdown", "mousedown", "touchstart"].forEach((t) => {
    window.addEventListener(t, guardPointerDown, true);
    document.addEventListener(t, guardPointerDown, true);
  });

  /**
   * Let escape targets work and intentionally blur after click,
   * with a temporary exemption so our blur veto doesn't block it.
   */
  function afterUpOrClick(e) {
    const target = e.target;
    if (!isEscapeTarget(target)) return;

    const activeIsProtected = isProtected(document.activeElement);
    if (!activeIsProtected) return;

    // Schedule a safe, intentional blur that bypasses the veto.
    queueMicrotask(() => {
      allowProgrammaticBlurUntil = now() + ALLOW_BLUR_GRACE_MS;
      try {
        document.activeElement.blur();
      } catch (_) {}
    });
  }

  ["mouseup", "pointerup", "touchend", "click"].forEach((t) => {
    window.addEventListener(t, afterUpOrClick, true);
    document.addEventListener(t, afterUpOrClick, true);
  });

  /**
   * Relaxed blur veto:
   * - Block blur on protected inputs only during the shield window,
   *   unless we've explicitly allowed it (escape target path).
   */
  const _blur = HTMLElement.prototype.blur;
  HTMLElement.prototype.blur = function () {
    if (
      isProtected(this) &&
      withinShieldWindow() &&
      now() > allowProgrammaticBlurUntil
    ) {
      // Accidental blur during shield window — ignore
      return;
    }
    return _blur.apply(this, arguments);
  };

  /**
   * Wrap addEventListener so newly-added handlers also respect the guard.
   * Only short-circuit during the shield window for non-escape outside taps.
   */
  const _add = EventTarget.prototype.addEventListener;
  const _remove = EventTarget.prototype.removeEventListener;
  const wrapMap = new WeakMap();
  const GUARDED_TYPES = new Set([
    "pointerdown",
    "mousedown",
    "touchstart",
    "mouseup",
    "pointerup",
    "touchend",
    "click",
  ]);

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (!GUARDED_TYPES.has(type) || typeof listener !== "function") {
      return _add.call(this, type, listener, options);
    }

    const wrapped = function (e) {
      const activeIsProtected = isProtected(document.activeElement);
      const targetIsProtected = isProtected(e.target);
      const targetAllowsEscape = isEscapeTarget(e.target);

      if (!activeIsProtected || !withinShieldWindow()) {
        return listener.call(this, e);
      }

      // pointerdown/touchstart need to be blocked for non-escape, outside targets
      if (
        type === "pointerdown" ||
        type === "mousedown" ||
        type === "touchstart"
      ) {
        if (!targetIsProtected && !targetAllowsEscape) {
          // swallow
          return;
        }
      }

      // For up/click, allow escape targets; others behave normally
      return listener.call(this, e);
    };

    wrapMap.set(listener, wrapped);
    return _add.call(this, type, wrapped, options);
  };

  EventTarget.prototype.removeEventListener = function (
    type,
    listener,
    options
  ) {
    const wrapped = wrapMap.get(listener) || listener;
    return _remove.call(this, type, wrapped, options);
  };

  /**
   * (Optional) Debug aid for stray overlays after nav transitions
   */
  window.addEventListener(
    "transitionend",
    (e) => {
      if (e.target?.id === "navigation" || e.target?.closest?.("#navigation")) {
        const el = document.elementFromPoint(innerWidth / 2, 10);
        if (el && !el.closest("#navigation")) {
          console.debug?.("[safe-input] top element after nav transition:", el);
        }
      }
    },
    true
  );
})();
