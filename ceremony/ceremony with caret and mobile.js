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
    if (parentLi.querySelector(".custom-ceremony-dropdown")) {
      console.log("Custom dropdown already exists, skipping injection");
      return true; // Return true since it's already there
    }

    parentLi.style.position = "relative";

    // Add the hasMenu class to indicate this item has a dropdown
    parentLi.classList.add("hasMenu");

    // Create and insert the menu caret button (only if it doesn't exist)
    if (!parentLi.querySelector(".Navigation__button")) {
      const caretButton = document.createElement("button");
      caretButton.className = "Navigation__button ceremony-caret-button";
      caretButton.setAttribute(
        "aria-label",
        "show submenu for Ceremony guides"
      );
      // Set aria-expanded based on screen size
      caretButton.setAttribute(
        "aria-expanded",
        window.innerWidth < 768 ? "true" : "false"
      );
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

    // 4) Create the dropdown using ul/li structure to match existing navigation
    const dropdown = document.createElement("ul");
    dropdown.className =
      "Navigation__subMenu Theme-ProjectNavigation-subMenu custom-ceremony-dropdown";
    dropdown.setAttribute("role", "menu");
    dropdown.style.backgroundColor = "rgb(35, 35, 51)";

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

    // Create dropdown items using li/a structure
    ceremonies.forEach((ceremony) => {
      const listItem = document.createElement("li");
      listItem.className =
        "Navigation__item Theme-NavigationBarItem Theme-ProjectNavigation-subItem";
      listItem.setAttribute("role", "menuitem");

      const link = document.createElement("a");
      link.className = "Theme-NavigationLink";
      link.href = "#"; // Placeholder href
      link.textContent = ceremony.label;
      link.style.cursor = "pointer";

      // Add hover effects for desktop only
      if (window.innerWidth >= 768) {
        link.addEventListener("mouseenter", () => {
          link.style.backgroundColor = "rgba(64, 224, 208, 0.3)";
        });

        link.addEventListener("mouseleave", () => {
          link.style.backgroundColor = "transparent";
        });
      }

      // Add click handler to navigate to the ceremony
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Build the URL with query parameter
        const url = new URL(baseHref);
        url.searchParams.set("ceremony", ceremony.id);

        // Navigate to the URL
        window.location.href = url.toString();
      });

      listItem.appendChild(link);
      dropdown.appendChild(listItem);
    });

    // Append dropdown to the parent li element
    parentLi.appendChild(dropdown);

    // Add CSS for responsive behavior (only if not already added)
    if (!document.querySelector("#ceremony-dropdown-styles")) {
      const style = document.createElement("style");
      style.id = "ceremony-dropdown-styles";
      style.textContent = `
        /* Desktop styles - hidden by default, shown on hover */
        @media (min-width: 768px) {
          .custom-ceremony-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 150%;
            z-index: 1000;
            display: none;
          }
          
          .Navigation__item.hasMenu:hover .custom-ceremony-dropdown {
            display: block;
          }
        }
        
        /* Mobile styles - visible by default, nested in flow */
        @media (max-width: 767px) {
          .custom-ceremony-dropdown {
            position: static;
            display: block;
            margin-left: 20px; /* Indent for nesting */
          }
          
          /* Hide the caret button on mobile */
          .ceremony-caret-button {
            display: none;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Desktop-only hover functionality
    if (window.innerWidth >= 768) {
      parentLi.addEventListener("mouseenter", () => {
        const caret = parentLi.querySelector(".Navigation__button");
        if (caret) caret.setAttribute("aria-expanded", "true");
      });

      parentLi.addEventListener("mouseleave", () => {
        const caret = parentLi.querySelector(".Navigation__button");
        if (caret) caret.setAttribute("aria-expanded", "false");
      });
    }

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
