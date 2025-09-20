document.addEventListener("DOMContentLoaded", function () {
  function createCeremonyGuideLink(attempts = 0) {
    // Find the first navigation link item
    const firstNavItem = document.querySelector(".Theme-NavigationBarItem");

    if (!firstNavItem) {
      if (attempts > 20) {
        console.warn("Navigation items not found after multiple attempts.");
        return;
      }
      setTimeout(() => createCeremonyGuideLink(attempts + 1), 250); // retry in 250ms
      return;
    }

    // Check if we've already created the Ceremony Guides link
    const existingCeremonyLink = Array.from(
      document.querySelectorAll(".Theme-NavigationLink")
    ).find((link) => link.textContent.trim() === "Ceremony Guides");

    if (existingCeremonyLink) {
      console.log("Ceremony Guides link already exists");
      return; // Don't create duplicate
    }

    // Create new navigation item for Ceremony Guides
    const newNavItem = document.createElement("li");
    newNavItem.className = "Navigation__item Theme-NavigationBarItem";
    newNavItem.style.position = "relative"; // For dropdown positioning

    // Create the link element (label)
    const ceremonyLink = document.createElement("a");
    ceremonyLink.className = "Theme-NavigationLink";
    ceremonyLink.href = "#ceremonies";
    ceremonyLink.textContent = "Ceremony Guides";
    ceremonyLink.setAttribute("tabindex", "2");
    ceremonyLink.style.cursor = "pointer";

    // Add caret button (keyboard and mouse interactive)
    const caretButton = document.createElement("button");
    caretButton.type = "button";
    caretButton.className = "Navigation__button customCaretNew";

    caretButton.setAttribute("aria-label", "show submenu for Ceremony guides");
    caretButton.setAttribute("aria-haspopup", "true");
    caretButton.setAttribute("aria-expanded", "false");

    const caretSpan = document.createElement("span");
    caretSpan.className = "menuCaret";
    caretButton.appendChild(caretSpan);

    // ARIA relationship for menu
    const dropdownId = "ceremony-guides-dropdown";
    caretButton.setAttribute("aria-controls", dropdownId);

    // Compose: <a> label + caret button
    // (We keep the caret as a separate focusable control for keyboard users)
    const labelWrap = document.createElement("span");
    labelWrap.style.display = "inline-flex";
    labelWrap.style.alignItems = "center";
    labelWrap.style.gap = "6px";
    labelWrap.style.width = "100%";
    // Move the caret button next to the label but inside the anchor's visual area
    // NOTE: caret is NOT appended to the <a> to avoid nested interactive controls
    labelWrap.appendChild(ceremonyLink);
    labelWrap.appendChild(caretButton);

    // Prevent default link behaviour on label click (keeps dropdown-only behaviour)
    ceremonyLink.addEventListener("click", (e) => {
      e.preventDefault();
    });

    // Add to the li
    newNavItem.appendChild(labelWrap);

    // Insert the new nav item after the first one
    firstNavItem.parentNode.insertBefore(newNavItem, firstNavItem.nextSibling);

    // ---------- DROPDOWN ----------

    const dropdown = document.createElement("div");
    dropdown.id = dropdownId;
    dropdown.className = "custom-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";
    dropdown.style.background = "rgb(35, 35, 51)";
    dropdown.style.border = "none";
    dropdown.style.display = "none";
    dropdown.style.minWidth = "150%";
    dropdown.style.textAlign = "left";
    dropdown.style.zIndex = "1000";
    dropdown.style.padding = "8px";
    dropdown.setAttribute("role", "menu");

    const items = [
      {
        label: "10.00 Faculty of Medicine",
        scrollToId: "ceremony-1",
        sections:
          ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8, .Theme-Section-Position-9",
      },
      {
        label: "13.15 Faculty of Natural Sciences",
        scrollToId: "ceremony-2",
        sections:
          ".Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-14",
      },
      {
        label: "16.30 Faculty of Engineering",
        scrollToId: "ceremony-3",
        sections:
          ".Theme-Section-Position-15, .Theme-Section-Position-16, .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19",
      },
    ];

    const menuItems = [];

    items.forEach((item) => {
      const link = document.createElement("a");
      link.textContent = item.label;
      link.href = `#${item.scrollToId}`;
      link.setAttribute("role", "menuitem");
      link.setAttribute("tabindex", "-1"); // only tabbable when menu is open

      // Styling
      link.style.display = "block";
      link.style.padding = "8px";
      link.style.textDecoration = "none";
      link.style.color = "#fff";
      link.style.cursor = "pointer";

      // Hover styling (inline to match your pattern)
      link.addEventListener("mouseenter", () => {
        link.style.backgroundColor = "#40E0D04D";
        link.style.color = "white";
      });
      link.addEventListener("mouseleave", () => {
        link.style.backgroundColor = "transparent";
        link.style.color = "#fff";
      });

      // Click handler: keep your section toggle + smooth scroll, then close menu
      link.addEventListener("click", function (e) {
        // We want to control scroll + visibility, so prevent default anchor behaviour
        e.preventDefault();
        e.stopPropagation();

        // Hide all groups
        const allSections = document.querySelectorAll(`
          .Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, 
          .Theme-Section-Position-8, .Theme-Section-Position-9, .Theme-Section-Position-10, 
          .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, 
          .Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16, 
          .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19
        `);
        allSections.forEach((section) => section.classList.remove("showing"));

        // Clear any saved state to prevent conflicts with restoration logic
        try {
          sessionStorage.removeItem("lastActiveToggle");
          sessionStorage.removeItem("lastScrollY");
        } catch (e) {}

        // Show selected group
        const sections = document.querySelectorAll(item.sections);
        sections.forEach((section) => section.classList.add("showing"));

        // Update time toggle buttons (if present)
        const timeToggles = document.querySelectorAll(".time-toggle button");
        if (timeToggles.length > 0) {
          timeToggles.forEach((btn) => btn.classList.remove("active"));
          let toggleIndex = -1;
          if (item.scrollToId === "ceremony-1") toggleIndex = 0;
          else if (item.scrollToId === "ceremony-2") toggleIndex = 1;
          else if (item.scrollToId === "ceremony-3") toggleIndex = 2;
          if (toggleIndex >= 0 && timeToggles[toggleIndex]) {
            timeToggles[toggleIndex].classList.add("active");
            try {
              sessionStorage.setItem("lastActiveToggle", String(toggleIndex));
            } catch (e) {}
          }
        }

        // Smooth scroll to the anchor target
        const target = document.getElementById(item.scrollToId);

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        closeDropdown();
      });

      dropdown.appendChild(link);
      menuItems.push(link);
    });

    // Append dropdown to the nav item
    newNavItem.appendChild(dropdown);

    // ---------- OPEN/CLOSE + KEYBOARD SUPPORT ----------

    const isVisible = (el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        cs.display !== "none" &&
        cs.visibility !== "hidden"
      );
    };

    const setItemsTabbability = (open) => {
      menuItems.forEach((el) => {
        if (open) el.removeAttribute("tabindex");
        else el.setAttribute("tabindex", "-1");
      });
    };

    const openDropdown = () => {
      dropdown.style.display = "block";
      caretButton.setAttribute("aria-expanded", "true");
      setItemsTabbability(true);
    };

    const closeDropdown = () => {
      dropdown.style.display = "none";
      caretButton.setAttribute("aria-expanded", "false");
      setItemsTabbability(false);
    };

    const openAndFocusFirst = () => {
      openDropdown();
      const first = menuItems.find(isVisible);
      first?.focus();
    };

    // Hover behaviour (kept as-is)
    newNavItem.addEventListener("mouseenter", () => openDropdown());
    newNavItem.addEventListener("mouseleave", () => closeDropdown());

    // Caret: click toggles menu (and doesn't trigger the label link)
    caretButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = caretButton.getAttribute("aria-expanded") === "true";
      if (isOpen) closeDropdown();
      else openAndFocusFirst();
    });

    // Caret: keyboard — Enter/Space/ArrowDown open & focus first; Esc closes
    caretButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        openAndFocusFirst();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeDropdown();
        ceremonyLink.focus();
      }
    });

    // Menu keyboard: basic arrow navigation + Home/End + Esc
    dropdown.addEventListener("keydown", (e) => {
      const enabled = menuItems.filter(
        (el) => el.getAttribute("tabindex") !== "-1" && isVisible(el)
      );
      if (!enabled.length) return;

      const current = document.activeElement;
      const idx = enabled.indexOf(current);
      let next = idx;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          next = (idx + 1 + enabled.length) % enabled.length;
          enabled[next].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          next = (idx - 1 + enabled.length) % enabled.length;
          enabled[next].focus();
          break;
        case "Home":
          e.preventDefault();
          enabled[0].focus();
          break;
        case "End":
          e.preventDefault();
          enabled[enabled.length - 1].focus();
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          caretButton.focus();
          break;
        default:
          break;
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!newNavItem.contains(e.target)) {
        if (caretButton.getAttribute("aria-expanded") === "true") {
          closeDropdown();
        }
      }
    });

    // ---------- FLOATING BARS (IO + rect fallback + auto reobserve) ----------

    const FLOATING_IO_OPTIONS = {
      root: null,
      threshold: 0.05,
      // rootMargin: '8% 0px 8% 0px', // optional overlap
    };

    // If you have a sticky header, bias the "in view" check:
    const VIEW_TOP_OFFSET = 0; // e.g. 64 for a 64px sticky header
    const VIEW_BOTTOM_OFFSET = 0; // e.g. 0 or -40 for early hide

    function setupFloatingBarsByIntersection(items) {
      const DEBUG = true;

      const labelEl = (el) => {
        if (!el) return "<null>";
        const id = el.id ? `#${el.id}` : "";
        const pos =
          (el.className || "")
            .toString()
            .match(/Theme-Section-Position-\d+/)?.[0] || "";
        return `${el.tagName.toLowerCase()}${id}${pos ? ` [${pos}]` : ""}`;
      };

      const barsById = new Map();
      document.querySelectorAll(".floating-day-bar[data-id]").forEach((bar) => {
        const id = bar.getAttribute("data-id");
        if (id) {
          barsById.set(id, bar);
          if (DEBUG)
            console.log("%c[FLOATING] bar detected", "color:#9ece6a", id, bar);
        }
      });

      // Track counts from IO, but we will OR them with a rect check.
      const counts = Object.create(null);
      items.forEach((item) => (counts[item.scrollToId] = 0));

      // Cache of sections per ceremony id; we re-query when needed.
      const sectionsById = new Map(items.map((it) => [it.scrollToId, []]));
      const observedSet = new WeakSet(); // which nodes are already observed

      const ensureObserved = () => {
        items.forEach((item) => {
          const arr = Array.from(document.querySelectorAll(item.sections));
          sectionsById.set(item.scrollToId, arr);
          arr.forEach((section) => {
            // Tag & observe new sections
            if (!section.hasAttribute("data-item-id")) {
              section.setAttribute("data-item-id", item.scrollToId);
            }
            if (!observedSet.has(section)) {
              observedSet.add(section);
              io.observe(section);
              if (DEBUG)
                console.log(
                  "%c[FLOATING] observe ↳",
                  "color:#7aa2f7",
                  item.scrollToId,
                  labelEl(section)
                );
            }
          });
        });
      };

      const viewportIntersect = (rect) => {
        const top = rect.top;
        const bottom = rect.bottom;
        const vpTop = 0 + VIEW_TOP_OFFSET;
        const vpBottom = window.innerHeight + VIEW_BOTTOM_OFFSET;
        return bottom > vpTop && top < vpBottom; // simple overlap test
      };

      // Fallback: if any real section for the ceremony is onscreen, treat as visible
      const isVisibleByRects = (id) => {
        const list = sectionsById.get(id) || [];
        for (const el of list) {
          const rect = el.getBoundingClientRect();
          if (viewportIntersect(rect)) return true;
        }
        return false;
      };

      const showBar = (id) => {
        const bar = barsById.get(id);
        if (bar) bar.classList.add("visible");
      };
      const hideBar = (id) => {
        const bar = barsById.get(id);
        if (bar) bar.classList.remove("visible");
      };

      const updateForId = (id, reason = "") => {
        // IO count OR rect check — rect check covers expand/collapse & node swaps
        const visible = (counts[id] || 0) > 0 || isVisibleByRects(id);
        if (DEBUG) {
          console.log(
            `%c[FLOATING] update → ${id} ${visible ? "SHOW" : "HIDE"}`,
            `color:${visible ? "#9ece6a" : "#f7768e"}`,
            { reason, count: counts[id], rectVisible: isVisibleByRects(id) }
          );
        }
        if (visible) showBar(id);
        else hideBar(id);
      };

      // IntersectionObserver
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const itemId = el.getAttribute("data-item-id");
          if (!itemId) return;

          const before = counts[itemId] || 0;
          const delta = entry.isIntersecting ? +1 : -1;
          counts[itemId] = Math.max(0, before + delta);

          const label = entry.isIntersecting ? "ENTER" : "LEAVE";
          if (DEBUG) {
            console.groupCollapsed(
              `%c[FLOATING] ${label} ${itemId} ← ${labelEl(el)}`,
              `color:${entry.isIntersecting ? "#9ece6a" : "#f7768e"}`
            );
            console.log({
              ceremony: itemId,
              element: labelEl(el),
              ratio: Number(
                entry.intersectionRatio?.toFixed?.(3) ?? entry.intersectionRatio
              ),
              threshold: FLOATING_IO_OPTIONS.threshold,
              rootMargin: FLOATING_IO_OPTIONS.rootMargin ?? "0px",
              counts: { before, after: counts[itemId] },
            });
            console.groupEnd();
          }

          updateForId(itemId, `${label} ${labelEl(el)}`);
        });
      }, FLOATING_IO_OPTIONS);

      // Re-observe if the DOM swaps nodes (common when toggling large blocks)
      const mo = new MutationObserver((muts) => {
        let needsEnsure = false;
        for (const m of muts) {
          if (m.type === "childList") {
            // if any nodes added/removed under the page, re-check our section list
            if (m.addedNodes.length || m.removedNodes.length) {
              needsEnsure = true;
            }
          }
          if (needsEnsure) break;
        }
        if (needsEnsure) {
          if (DEBUG)
            console.log(
              "%c[FLOATING] Mutation observed → re-scan/observe sections",
              "color:#e0af68"
            );
          ensureObserved();
          // After a re-scan, recompute visibility via rects (covers the “stays hidden” case)
          items.forEach((it) => updateForId(it.scrollToId, "mutation-resync"));
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });

      // Also keep visibility correct on resize (expands, accordions, etc.)
      window.addEventListener(
        "resize",
        () => {
          items.forEach((it) => updateForId(it.scrollToId, "resize"));
        },
        { passive: true }
      );

      // Initial observe
      ensureObserved();

      return () => {
        io.disconnect();
        mo.disconnect();
      };
    }

    // Init
    setupFloatingBarsByIntersection(items);
  }

  createCeremonyGuideLink(); // Start the process
});
