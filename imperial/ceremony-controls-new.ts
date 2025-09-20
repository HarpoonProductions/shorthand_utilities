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
      ceremonyLink.setAttribute("tabindex", "0");

      // Use the link as a button-like trigger (don’t navigate)
      ceremonyLink.addEventListener("click", (e) => e.preventDefault());

      firstNavItem.parentNode.insertBefore(parentLi, firstNavItem.nextSibling);
      parentLi.appendChild(ceremonyLink);
    } else {
      parentLi = ceremonyLink.closest("li");
      if (!parentLi) return false;
      parentLi.style.position = "relative";
      parentLi.classList.add("hasMenu");
    }

    if (parentLi.querySelector(".custom-dropdown")) return true;

    const triggerId = "ceremony-trigger-" + Math.random().toString(36).slice(2);
    ceremonyLink.id = ceremonyLink.id || triggerId;
    ceremonyLink.setAttribute("aria-haspopup", "true");
    ceremonyLink.setAttribute("aria-expanded", "false");

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
    caretButton.style.pointerEvents = "";
    caretButton.tabIndex = 0;

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

    const menuId = "ceremony-menu-" + Math.random().toString(36).slice(2);
    dropdown.id = menuId;
    dropdown.setAttribute("role", "menu");
    dropdown.setAttribute("aria-labelledby", ceremonyLink.id);
    ceremonyLink.setAttribute("aria-controls", menuId);
    caretButton.setAttribute("aria-controls", menuId);

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
      item.tabIndex = -1;
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

      item.addEventListener("click", (e) => e.stopPropagation());

      dropdown.appendChild(item);
    });

    parentLi.appendChild(dropdown);

    const getItems = () =>
      Array.from(dropdown.querySelectorAll('a[role="menuitem"]'));

    function setOnlyTabbable(el) {
      const items = getItems();
      items.forEach((n) => (n.tabIndex = -1));
      if (el) el.tabIndex = 0;
    }

    function openMenu(focusFirst = true) {
      dropdown.style.display = "block";
      ceremonyLink.setAttribute("aria-expanded", "true");
      caretButton.setAttribute("aria-expanded", "true");

      const items = getItems();
      if (!items.length) return;

      if (focusFirst) {
        setOnlyTabbable(items[0]);
        items[0].focus();
      } else {
        // keep items not in tab order until user moves focus in
        items.forEach((el) => (el.tabIndex = -1));
      }
    }

    function closeMenu(refocusTrigger = false) {
      dropdown.style.display = "none";
      ceremonyLink.setAttribute("aria-expanded", "false");
      caretButton.setAttribute("aria-expanded", "false");
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

    // Mouse open/close
    parentLi.addEventListener("mouseenter", () => openMenu(false));
    parentLi.addEventListener("mouseleave", () => closeMenu(false));

    // Clicks on triggers
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

    // Keyboard: triggers (Enter/Space/Arrows as before + Tab-to-enter when open)
    function triggerKeydown(e) {
      const key = e.key;

      // NEW: If menu is open and user presses Tab on the trigger, move into menu
      if (key === "Tab" && isOpen() && !e.shiftKey) {
        const items = getItems();
        if (items.length) {
          e.preventDefault();
          setOnlyTabbable(items[0]);
          items[0].focus();
          return;
        }
      }

      if (key === "Enter" || key === " ") {
        e.preventDefault();
        openMenu(true);
      } else if (key === "ArrowDown") {
        e.preventDefault();
        openMenu(true);
      } else if (key === "ArrowUp") {
        e.preventDefault();
        openMenu(false);
        const items = getItems();
        if (items.length) {
          setOnlyTabbable(items[items.length - 1]);
          items[items.length - 1].focus();
        }
      } else if (key === "Escape") {
        closeMenu(true);
      }
    }
    ceremonyLink.addEventListener("keydown", triggerKeydown);
    caretButton.addEventListener("keydown", triggerKeydown);

    // Keyboard: within menu (added Tab/Shift+Tab handling)
    dropdown.addEventListener("keydown", (e) => {
      const items = getItems();
      if (!items.length) return;

      const current = document.activeElement;
      const currentIndex = items.indexOf(current);
      const key = e.key;

      if (key === "Escape") {
        e.preventDefault();
        closeMenu(true);
        return;
      }

      if (key === "Home") {
        e.preventDefault();
        setOnlyTabbable(items[0]);
        items[0].focus();
        return;
      }

      if (key === "End") {
        e.preventDefault();
        setOnlyTabbable(items[items.length - 1]);
        items[items.length - 1].focus();
        return;
      }

      if (key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIndex + 1) % items.length;
        setOnlyTabbable(items[next]);
        items[next].focus();
        return;
      }

      if (key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        setOnlyTabbable(items[prev]);
        items[prev].focus();
        return;
      }

      // NEW: Tab behavior inside the menu
      if (key === "Tab") {
        // Shift+Tab: go backwards within menu unless we're on the first item
        if (e.shiftKey) {
          if (currentIndex > 0) {
            e.preventDefault();
            const prev = currentIndex - 1;
            setOnlyTabbable(items[prev]);
            items[prev].focus();
          } else {
            // allow default so focus moves out (focusout will close)
          }
        } else {
          // Forward Tab: go forwards within menu unless we're on the last item
          if (currentIndex < items.length - 1) {
            e.preventDefault();
            const next = currentIndex + 1;
            setOnlyTabbable(items[next]);
            items[next].focus();
          } else {
            // last item: allow default so focus moves to next outside focusable
            // menu will close via focusout below
          }
        }
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!parentLi.contains(e.target)) closeMenu(false);
    });

    // Close when focus leaves the whole li (covers Tab out from last item)
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
