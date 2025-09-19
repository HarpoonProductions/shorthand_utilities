document.addEventListener("DOMContentLoaded", function () {
  function injectCeremonyDropdown() {
    const navList = document.querySelector(
      ".Layout.Navigation__itemList.Theme-Navigation-ItemList"
    );
    if (!navList) return false;

    const graduationLink =
      Array.from(navList.querySelectorAll("a")).find(
        (link) => link.textContent.trim() === "Commemoration Day 2025"
      ) || navList.querySelector("a");
    if (!graduationLink) return false;

    const baseHref = graduationLink.href;

    let ceremonyLink = Array.from(navList.querySelectorAll("a")).find(
      (link) => link.textContent.trim() === "Ceremony guides"
    );

    let parentLi;
    if (!ceremonyLink) {
      const firstNavItem = navList.querySelector(
        ".Navigation__item, .Theme-NavigationBarItem, li"
      );
      if (!firstNavItem) return false;

      parentLi = document.createElement("li");
      parentLi.className =
        firstNavItem.className || "Navigation__item Theme-NavigationBarItem";
      parentLi.style.position = "relative";
      parentLi.classList.add("hasMenu");

      ceremonyLink = document.createElement("a");
      ceremonyLink.className = "Theme-NavigationLink";
      ceremonyLink.href =
        "https://graduation-programmes.imperial.ac.uk/commemoration-day-2025/index.html#ceremonies";
      ceremonyLink.textContent = "Ceremony guides";
      ceremonyLink.setAttribute("tabindex", "0"); // keyboard focusable

      // Use the link as a button-like trigger (don’t navigate)
      ceremonyLink.addEventListener("click", (e) => e.preventDefault());

      parentLi.appendChild(ceremonyLink);
      firstNavItem.parentNode.insertBefore(parentLi, firstNavItem.nextSibling);
    } else {
      parentLi = ceremonyLink.closest("li");
      if (!parentLi) return false;
      parentLi.style.position = "relative";
      parentLi.classList.add("hasMenu");
    }

    // Avoid duplicate dropdowns
    if (parentLi.querySelector(".custom-dropdown")) return true;

    // Ensure ceremonyLink is an accessible trigger
    const triggerId = "ceremony-trigger-" + Math.random().toString(36).slice(2);
    ceremonyLink.id = ceremonyLink.id || triggerId;
    ceremonyLink.setAttribute("aria-haspopup", "true");
    ceremonyLink.setAttribute("aria-expanded", "false");

    // Create / ensure caret button with same behavior
    let caretButton = parentLi.querySelector(".Navigation__button");
    if (!caretButton) {
      caretButton = document.createElement("button");
      caretButton.type = "button";
      caretButton.className = "Navigation__button";
      caretButton.setAttribute(
        "aria-label",
        "show submenu for Ceremony guides"
      );
      caretButton.setAttribute("aria-expanded", "false");

      const caretSpan = document.createElement("span");
      caretSpan.className = "menuCaret";
      caretButton.appendChild(caretSpan);

      ceremonyLink.parentNode.insertBefore(
        caretButton,
        ceremonyLink.nextSibling
      );
    }
    // Make sure caret is interactive
    caretButton.style.pointerEvents = ""; // allow clicks
    caretButton.tabIndex = 0;

    // Build dropdown
    const dropdown = document.createElement("div");
    dropdown.className = "custom-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.left = "0px";
    dropdown.style.background = "rgb(35, 35, 51)";
    dropdown.style.border = "none";
    dropdown.style.display = "none";
    dropdown.style.minWidth = "150%";
    dropdown.style.textAlign = "left";
    dropdown.style.zIndex = "1000";
    dropdown.style.padding = "8px";

    // ARIA
    const menuId = "ceremony-menu-" + Math.random().toString(36).slice(2);
    dropdown.id = menuId;
    dropdown.setAttribute("role", "menu");
    dropdown.setAttribute("aria-labelledby", ceremonyLink.id);
    ceremonyLink.setAttribute("aria-controls", menuId);
    caretButton.setAttribute("aria-controls", menuId);

    // Items
    const ceremonies = [
      { label: "10.00 Faculty of Medicine", id: "medicine-1000" },
      {
        label: "13.15 Faculty of Natural Sciences",
        id: "natural-science-1315",
      },
      { label: "16.30 Faculty of Engineering", id: "engineering-1630" },
    ];

    ceremonies.forEach((ceremony) => {
      const item = document.createElement("a");

      const url = new URL(baseHref, document.baseURI);
      url.searchParams.set("ceremony", ceremony.id);
      item.href = url.toString();

      item.setAttribute("role", "menuitem");
      item.tabIndex = -1; // managed when menu opens
      item.textContent = ceremony.label;

      item.style.display = "block";
      item.style.padding = "8px";
      item.style.textDecoration = "none";
      item.style.color = "rgb(255, 255, 255)";
      item.style.cursor = "pointer";

      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "rgba(64, 224, 208, 0.3)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "transparent";
      });

      // Let anchor navigate; stop propagation only
      item.addEventListener("click", (e) => e.stopPropagation());

      dropdown.appendChild(item);
    });

    parentLi.appendChild(dropdown);

    // ---- Open/close helpers ----
    const getItems = () =>
      Array.from(dropdown.querySelectorAll('a[role="menuitem"]'));

    function openMenu(focusFirst = true) {
      dropdown.style.display = "block";
      ceremonyLink.setAttribute("aria-expanded", "true");
      caretButton.setAttribute("aria-expanded", "true");

      const items = getItems();
      if (!items.length) return;

      // make items tabbable only when open
      items.forEach((el) => (el.tabIndex = -1));
      if (focusFirst) {
        items[0].tabIndex = 0;
        items[0].focus();
      }
    }

    function closeMenu(refocusTrigger = false) {
      dropdown.style.display = "none";
      ceremonyLink.setAttribute("aria-expanded", "false");
      caretButton.setAttribute("aria-expanded", "false");

      // remove temporary tabindexes
      getItems().forEach((el) => (el.tabIndex = -1));

      if (refocusTrigger) ceremonyLink.focus();
    }

    function isOpen() {
      return dropdown.style.display !== "none";
    }

    function toggleMenu(focusFirst = true) {
      if (isOpen()) closeMenu(true);
      else openMenu(focusFirst);
    }

    // ---- Mouse open/close (as before) ----
    parentLi.addEventListener("mouseenter", () => openMenu(false));
    parentLi.addEventListener("mouseleave", () => closeMenu(false));

    // ---- Clicks on triggers ----
    ceremonyLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(true);
    });
    caretButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(true);
    });

    // ---- Keyboard: triggers ----
    function triggerKeydown(e, onOpenTo) {
      const key = e.key;
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        openMenu(true);
      } else if (key === "ArrowDown") {
        e.preventDefault();
        openMenu(true); // focus first
      } else if (key === "ArrowUp") {
        e.preventDefault();
        openMenu(false);
        const items = getItems();
        if (items.length) {
          items[items.length - 1].tabIndex = 0;
          items[items.length - 1].focus();
        }
      } else if (key === "Escape") {
        closeMenu(true);
      }
    }
    ceremonyLink.addEventListener("keydown", triggerKeydown);
    caretButton.addEventListener("keydown", triggerKeydown);

    // ---- Keyboard: within menu ----
    dropdown.addEventListener("keydown", (e) => {
      const items = getItems();
      if (!items.length) return;

      const currentIndex = items.indexOf(document.activeElement);
      const key = e.key;

      if (key === "Escape") {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      if (key === "Home") {
        e.preventDefault();
        items.forEach((el) => (el.tabIndex = -1));
        items[0].tabIndex = 0;
        items[0].focus();
        return;
      }
      if (key === "End") {
        e.preventDefault();
        items.forEach((el) => (el.tabIndex = -1));
        items[items.length - 1].tabIndex = 0;
        items[items.length - 1].focus();
        return;
      }
      if (key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIndex + 1) % items.length;
        items.forEach((el) => (el.tabIndex = -1));
        items[next].tabIndex = 0;
        items[next].focus();
        return;
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        items.forEach((el) => (el.tabIndex = -1));
        items[prev].tabIndex = 0;
        items[prev].focus();
        return;
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!parentLi.contains(e.target)) closeMenu(false);
    });

    // Close when focus leaves the whole li (keyboard Tab away)
    parentLi.addEventListener("focusout", () => {
      setTimeout(() => {
        if (!parentLi.contains(document.activeElement)) closeMenu(false);
      }, 0);
    });

    return true;
  }

  const success = injectCeremonyDropdown();
  if (!success) setTimeout(injectCeremonyDropdown, 500);
});
