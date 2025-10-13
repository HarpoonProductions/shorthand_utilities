(function () {
  // Prevent double-injection
  if (window.__safeInput_v4) return;
  window.__safeInput_v4 = true;

  /**
   * CONFIG
   * - SAFE_SEL: inputs that should be protected against accidental blur.
   * - ALLOW_SEL: elements that should be clickable even while a protected input is focused.
   * - SHIELD_MS: how long after focusing a protected input we suppress stray outside clicks.
   */
  const SAFE_SEL = "#inputField1, .project-search-input"; // add more selectors if needed
  const ALLOW_SEL =
    'button,[type="submit"],[role="button"],[data-escape-input="true"]';
  const SHIELD_MS = 500;

  // --- utils ---
  const isEl = (n) => n && n.nodeType === 1;
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isProtected = (n) =>
    isEl(n) && (n.matches(SAFE_SEL) || n.closest?.(SAFE_SEL));
  const isEscapeTarget = (n) => isEl(n) && !!n.closest?.(ALLOW_SEL);

  // --- state ---
  let lastProtectedFocusTs = 0;
  let lastProtectedEl = null;

  const now = () => performance.now();
  const withinShieldWindow = () => now() - lastProtectedFocusTs < SHIELD_MS;

  // Track when a protected input gains focus
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
   * hardShield:
   * Only suppress "up/click" events that happen within SHIELD_MS, *outside* the protected input,
   * and not on known-allowed targets (buttons etc). This fixes the "visible but dead button" issue.
   */
  function hardShield(e) {
    const activeIsProtected = isProtected(document.activeElement);
    const targetIsProtected = isProtected(e.target);
    const withinShield = withinShieldWindow();
    const targetAllowsEscape = isEscapeTarget(e.target);

    // Allow deliberate actions (buttons) through, even during shield.
    if (targetAllowsEscape) {
      // Optional: close keyboard after the click runs, for better UX
      // (We don't block blur below, so this will work.)
      queueMicrotask(() => {
        if (activeIsProtected && document.activeElement?.blur) {
          try {
            document.activeElement.blur();
          } catch (_) {}
        }
      });
      return; // let the event proceed
    }

    // Suppress only if we JUST focused a protected input and the click is outside it.
    if (withinShield && activeIsProtected && !targetIsProtected) {
      e.stopImmediatePropagation();
      if (e.type === "click") e.preventDefault?.(); // be conservative: only prevent default on click
      // Keep focus on the protected input to avoid accidental blur
      if (!isProtected(document.activeElement) && lastProtectedEl?.focus) {
        try {
          lastProtectedEl.focus({ preventScroll: true });
        } catch (_) {}
      }
    }
  }

  // Capture-phase on likely culprits; we don't need to block pointerdown.
  ["mouseup", "pointerup", "click", "touchend"].forEach((t) => {
    window.addEventListener(t, hardShield, true);
    document.addEventListener(t, hardShield, true);
  });

  /**
   * Relaxed blur veto:
   * Only veto blur on protected inputs *during the brief shield window* to stop accidental blurs.
   * Outside that window, allow blur so buttons/forms can intentionally close the keyboard.
   */
  const _blur = HTMLElement.prototype.blur;
  HTMLElement.prototype.blur = function () {
    if (isProtected(this) && withinShieldWindow()) {
      // Accidental blur within the shield window — ignore
      // console.trace?.('[safe-input] blocked blur() during shield window');
      return;
    }
    return _blur.apply(this, arguments);
  };

  /**
   * Wrap addEventListener so newly-added handlers also respect the shield.
   * We only short-circuit during the shield window and only for outside clicks,
   * NOT for the entire lifetime of the focused input.
   */
  const _add = EventTarget.prototype.addEventListener;
  const _remove = EventTarget.prototype.removeEventListener;
  const wrapMap = new WeakMap();
  const GUARDED_TYPES = new Set(["mouseup", "pointerup", "click", "touchend"]);

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (!GUARDED_TYPES.has(type) || typeof listener !== "function") {
      return _add.call(this, type, listener, options);
    }

    const wrapped = function (e) {
      const activeIsProtected = isProtected(document.activeElement);
      const targetIsProtected = isProtected(e.target);
      const withinShield = withinShieldWindow();
      const targetAllowsEscape = isEscapeTarget(e.target);
      if (
        !(
          withinShield &&
          activeIsProtected &&
          !targetIsProtected &&
          !targetAllowsEscape
        )
      ) {
        return listener.call(this, e);
      }
      // Swallow only during the brief shield for outside, non-escape targets
      return;
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

  // --- Optional: overlay sanity check after nav transitions (debug aid) ---
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

  // Helper: allow programmatic opt-out per element
  // <button data-escape-input="true">Submit</button>
})();
