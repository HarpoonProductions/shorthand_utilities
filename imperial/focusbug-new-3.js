(function () {
  if (window.__safeInput_v6) return;
  window.__safeInput_v6 = true;

  // ---- CONFIG ----
  const SAFE_SEL = "#inputField1, .project-search-input"; // add any other protected inputs
  const ALLOW_SEL =
    'button,[type="submit"],[role="button"],[data-escape-input="true"]';
  const SHIELD_MS = 700; // window after focus to prevent accidental outside blur
  const WATCHDOG_MS = 1500; // keep refocusing if iOS drops focus right after typing/tapping

  // ---- UTILS ----
  const now = () => performance.now();
  const isEl = (n) => n && n.nodeType === 1;
  const isProtected = (n) =>
    isEl(n) && (n.matches(SAFE_SEL) || n.closest?.(SAFE_SEL));
  const isEscapeTarget = (n) => isEl(n) && !!n.closest?.(ALLOW_SEL);

  // ---- STATE ----
  let lastProtectedFocusTs = 0;
  let lastUserIntentTs = 0; // keystroke/pointer inside input
  let lastProtectedEl = null;
  let allowProgrammaticBlur = false;
  let watchdogUntil = 0;

  const withinShield = () => now() - lastProtectedFocusTs < SHIELD_MS;
  const withinWatchdog = () => now() < watchdogUntil;

  // Mark user intent (typing/tapping inside the input)
  function markUserIntent() {
    lastUserIntentTs = now();
    // Keep watchdog alive a bit after recent interaction
    watchdogUntil = Math.max(watchdogUntil, now() + WATCHDOG_MS);
  }

  // ---- TRACK FOCUS ON PROTECTED INPUTS ----
  document.addEventListener(
    "focusin",
    (e) => {
      if (isProtected(e.target)) {
        lastProtectedEl = e.target;
        lastProtectedFocusTs = now();
        watchdogUntil = now() + WATCHDOG_MS;
      }
    },
    true
  );

  // Input typing counts as intent (keeps watchdog alive)
  document.addEventListener(
    "input",
    (e) => {
      if (isProtected(e.target)) markUserIntent();
    },
    true
  );
  document.addEventListener(
    "keydown",
    (e) => {
      if (isProtected(e.target)) markUserIntent();
    },
    true
  );

  // ---- 1) GUARD OUTSIDE POINTERS DURING SHIELD (BUT ALLOW ESCAPE TARGETS) ----
  function onPointerDown(e) {
    const activeIsProtected = isProtected(document.activeElement);
    if (!activeIsProtected || !withinShield()) return;

    const t = e.target;
    if (isProtected(t)) {
      markUserIntent();
      return;
    }
    if (isEscapeTarget(t)) return; // let buttons through

    // Outside tap during shield: prevent accidental blur
    e.stopImmediatePropagation();
    e.preventDefault?.();
    // Keep focus on the protected input
    if (!isProtected(document.activeElement) && lastProtectedEl?.focus) {
      try {
        lastProtectedEl.focus({ preventScroll: true });
      } catch {}
    }
  }
  ["pointerdown", "mousedown", "touchstart"].forEach((t) => {
    window.addEventListener(t, onPointerDown, true);
    document.addEventListener(t, onPointerDown, true);
  });

  // ---- 2) LET ESCAPE TARGETS WORK; INTENTIONALLY BLUR AFTER CLICK ----
  function afterUpOrClick(e) {
    const t = e.target;
    if (!isEscapeTarget(t)) return;
    if (!isProtected(document.activeElement)) return;

    // allow one intentional blur through
    queueMicrotask(() => {
      allowProgrammaticBlur = true;
      try {
        document.activeElement.blur();
      } catch {}
      // reset shortly (micro guard)
      setTimeout(() => {
        allowProgrammaticBlur = false;
      }, 0);
    });
  }
  ["mouseup", "pointerup", "touchend", "click"].forEach((t) => {
    window.addEventListener(t, afterUpOrClick, true);
    document.addEventListener(t, afterUpOrClick, true);
  });

  // ---- 3) VETO PROGRAMMATIC BLUR() DURING SHIELD/WATCHDOG ----
  const _blur = HTMLElement.prototype.blur;
  HTMLElement.prototype.blur = function () {
    if (
      isProtected(this) &&
      !allowProgrammaticBlur &&
      (withinShield() || withinWatchdog())
    ) {
      // ignore accidental/programmatic blur while we're guarding
      return;
    }
    return _blur.apply(this, arguments);
  };

  // ---- 4) VETO PROGRAMMATIC FOCUS() AWAY DURING SHIELD ----
  const _focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (opts) {
    // If something tries to steal focus *away* from a protected input during shield,
    // ignore it unless it's another protected input or an escape target flow.
    const activeIsProtected = isProtected(document.activeElement);
    if (
      activeIsProtected &&
      !isProtected(this) &&
      !allowProgrammaticBlur &&
      withinShield()
    ) {
      return; // deny the move
    }
    return _focus.apply(this, arguments);
  };

  // ---- 5) WATCHDOG: REFRESH FOCUS IF IOS DROPS IT MOMENTARILY ----
  // Some environments drop focus when layout shifts/scroll happen. We nudge it back.
  let rafId = 0;
  function watchdogLoop() {
    rafId = requestAnimationFrame(() => {
      const active = document.activeElement;
      if (withinWatchdog() && lastProtectedEl && !isProtected(active)) {
        try {
          lastProtectedEl.focus({ preventScroll: true });
        } catch {}
      }
      watchdogLoop();
    });
  }
  watchdogLoop();

  // ---- 6) WRAP addEventListener SO FUTURE HANDLERS RESPECT THE GUARD ----
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
      if (!activeIsProtected) return listener.call(this, e);

      if (
        type === "pointerdown" ||
        type === "mousedown" ||
        type === "touchstart"
      ) {
        if (withinShield()) {
          const t = e.target;
          if (!isProtected(t) && !isEscapeTarget(t)) {
            return; // swallow outside starts during shield
          }
        }
      }
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

  // ---- 7) DEBUG HOOKS (comment out if noisy) ----
  document.addEventListener(
    "blur",
    (e) => {
      if (isProtected(e.target)) {
        // console.debug('[safe-input] blur on protected', { withinShield: withinShield(), withinWatchdog: withinWatchdog(), allowProgrammaticBlur });
      }
    },
    true
  );
})();
