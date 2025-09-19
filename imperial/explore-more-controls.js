document.addEventListener("DOMContentLoaded", function () {
  function enhanceExploreCaret() {
    // Find the specific "Explore more" menu item
    const li = Array.from(
      document.querySelectorAll(
        "li.Navigation__item.Theme-NavigationBarItem.hasMenu"
      )
    ).find((node) => {
      const span = node.querySelector(
        'span.Theme-NavigationLink[data-story-nav-item="true"], span.Theme-NavigationLink'
      );
      return (
        span &&
        span.textContent.trim() === "Explore more" &&
        node.querySelector('ul[role="menu"]')
      );
    });

    if (!li || li.dataset.exploreCaretBound === "true") return !!li;

    const caret = li.querySelector("button.Navigation__button");
    const menu = li.querySelector('ul[role="menu"]');
    if (!caret || !menu) return false;

    const getItems = () =>
      Array.from(
        menu.querySelectorAll("a.Theme-NavigationLink, a[href]")
      ).filter((a) => a && a.offsetParent !== null);

    function focusFirstItem() {
      const items = getItems();
      if (items.length) items[0].focus();
    }

    // Enter/Space on caret -> focus first menu item (after site's own toggle)
    caret.addEventListener("keyup", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      setTimeout(() => {
        const expanded = caret.getAttribute("aria-expanded") === "true";
        const visible =
          menu.offsetParent !== null ||
          getComputedStyle(menu).display !== "none";
        if (expanded || visible) focusFirstItem();
      }, 0);
    });

    // Inside the menu: ArrowDown/ArrowUp cycle items + Tab behavior on edges
    menu.addEventListener("keydown", function (e) {
      const items = getItems();
      if (!items.length) return;

      const idx = items.indexOf(document.activeElement);

      // --- NEW: Tab handling on edges ---
      if (e.key === "Tab") {
        // Forward tab from last item: close menu, allow default to move focus onward
        if (!e.shiftKey && idx === items.length - 1) {
          // Close via existing toggle (no preventDefault so browser moves on)
          caret.click();
          return;
        }
        // OPTIONAL: Shift+Tab from first item: close menu, allow default to move focus backward
        if (e.shiftKey && idx === 0) {
          caret.click();
          return;
        }
        // Otherwise, let Tab behave normally inside the list
        return;
      }

      // Arrow nav
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = idx >= 0 ? (idx + 1) % items.length : 0;
        items[next].focus();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          idx >= 0 ? (idx - 1 + items.length) % items.length : items.length - 1;
        items[prev].focus();
        return;
      }
    });

    li.dataset.exploreCaretBound = "true";
    return true;
  }

  const ok = enhanceExploreCaret();
  if (!ok) setTimeout(enhanceExploreCaret, 500);
});
