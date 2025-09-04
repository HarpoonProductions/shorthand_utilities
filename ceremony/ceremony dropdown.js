document.addEventListener("DOMContentLoaded", function () {
  function injectCeremonyDropdown() {
    // 1) Get the navigation list element
    const navList = document.querySelector(
      ".Layout.Navigation__itemList.Theme-Navigation-ItemList"
    );

    if (!navList) {
      console.warn("Navigation list not found");
      return false;
    }

    // 2) Find and store the href from "Graduation Days 2025" link
    const graduationLink = Array.from(navList.querySelectorAll("a")).find(
      (link) => link.textContent.trim() === "Graduation Days 2025"
    );

    if (!graduationLink) {
      console.warn("Graduation Days 2025 link not found");
      return false;
    }

    const baseHref = graduationLink.href;
    console.log("Base href found:", baseHref);

    // 3) Find the "Ceremony guides" link
    const ceremonyLink = Array.from(navList.querySelectorAll("a")).find(
      (link) => link.textContent.trim() === "Ceremony guides"
    );

    if (!ceremonyLink) {
      console.warn("Ceremony guides link not found");
      return false;
    }

    // Get the parent li element and ensure it has relative positioning
    const parentLi = ceremonyLink.closest("li");
    if (!parentLi) {
      console.warn("Parent li element not found");
      return;
    }

    // Check if dropdown already exists to prevent duplicates
    if (parentLi.querySelector(".custom-dropdown")) {
      console.log("Custom dropdown already exists, skipping injection");
      return true; // Return true since it's already there
    }

    parentLi.style.position = "relative";

    // Add the hasMenu class to indicate this item has a dropdown
    parentLi.classList.add("hasMenu");

    // Create and insert the menu caret button (only if it doesn't exist)
    if (!parentLi.querySelector(".Navigation__button")) {
      const caretButton = document.createElement("button");
      caretButton.className = "Navigation__button";
      caretButton.setAttribute(
        "aria-label",
        "show submenu for Ceremony guides"
      );
      caretButton.setAttribute("aria-expanded", "false");
      caretButton.style.pointerEvents = "none"; // Make it non-interactive since hover handles the dropdown

      const caretSpan = document.createElement("span");
      caretSpan.className = "menuCaret";
      caretButton.appendChild(caretSpan);

      // Insert the caret button after the ceremony link
      ceremonyLink.parentNode.insertBefore(
        caretButton,
        ceremonyLink.nextSibling
      );
    }

    // 4) Create the dropdown
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

    // Define ceremony items with their IDs
    const ceremonies = [
      {
        label: "Business School: Management, Specialised, Doctoral",
        id: "monday-11",
      },
      {
        label: "Business School: MBA, Finance",
        id: "monday-14-30",
      },
      {
        label: "Medicine, CHERS, CLCC",
        id: "tuesday-10-30",
      },
      {
        label: "Natural Sciences",
        id: "tuesday-13-45",
      },
      {
        label: "Engineering",
        id: "tuesday-16-45",
      },
    ];

    // Create dropdown items
    ceremonies.forEach((ceremony) => {
      const item = document.createElement("div");
      item.style.display = "block";
      item.style.padding = "8px";
      item.style.textDecoration = "none";
      item.style.color = "rgb(255, 255, 255)";
      item.style.cursor = "pointer";
      item.textContent = ceremony.label;

      // Add hover effects
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "rgba(64, 224, 208, 0.3)";
      });

      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "transparent";
      });

      // Add click handler to navigate to the ceremony
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Build the URL with query parameter
        const url = new URL(baseHref);
        url.searchParams.set("ceremony", ceremony.id);

        // Navigate to the URL
        window.location.href = url.toString();
      });

      dropdown.appendChild(item);
    });

    // Append dropdown to the parent li element
    parentLi.appendChild(dropdown);

    // Add hover functionality to show/hide dropdown
    parentLi.addEventListener("mouseenter", () => {
      dropdown.style.display = "block";
      const caret = parentLi.querySelector(".Navigation__button");
      if (caret) caret.setAttribute("aria-expanded", "true");
    });

    parentLi.addEventListener("mouseleave", () => {
      dropdown.style.display = "none";
      const caret = parentLi.querySelector(".Navigation__button");
      if (caret) caret.setAttribute("aria-expanded", "false");
    });

    console.log("Ceremony dropdown successfully injected");
    return true;
  }

  // Try immediately first
  const success = injectCeremonyDropdown();

  // If it didn't work, try again after a delay
  if (!success) {
    setTimeout(injectCeremonyDropdown, 500);
  }
});
