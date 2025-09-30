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

    ceremonyLink.addEventListener("click", () => {
      const menu = document.querySelector(
        'button.Navigation__hamburger[aria-expanded="true"]'
      );
      if (menu) menu.click();
    });

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
    const labelWrap = document.createElement("span");
    labelWrap.style.display = "inline-flex";
    labelWrap.style.alignItems = "center";
    labelWrap.style.gap = "6px";
    labelWrap.style.width = "100%";
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

    // ---- items: add 'key' (identity) and keep 'scrollToId' (anchor) ----
    const items = [
      {
        key: "ceremony-1",
        label: "10.00 Faculty of Medicine",
        scrollToId: "ceremony-1",
        sections:
          ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8, .Theme-Section-Position-9",
      },
      {
        key: "ceremony-2",
        label: "13.15 Faculty of Natural Sciences",
        scrollToId: "ceremony-2",
        sections:
          ".Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-14",
      },
      {
        key: "ceremony-3",
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
        const menu = document.querySelector(
          'button.Navigation__hamburger[aria-expanded="true"]'
        );
        if (menu) menu.click();
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
        allSections.forEach((section) => {
          section.classList.remove("showing");
          section.classList.remove("show");
        });

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

    function updateFloatingBars() {
      const bars = document.querySelectorAll(".floating-day-bar");
      bars.forEach((bar) => {
        const section = bar.closest("section");
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && section.classList.contains("showing")) {
          bar.classList.add("visible");
        } else {
          bar.classList.remove("visible");
        }
      });
    }
    window.addEventListener("scroll", updateFloatingBars, { passive: true });
    updateFloatingBars();
  }

  createCeremonyGuideLink(); // Start the process
});
