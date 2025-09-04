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

    // Create the link element
    const ceremonyLink = document.createElement("a");
    ceremonyLink.className = "Theme-NavigationLink";
    ceremonyLink.href = "#";
    ceremonyLink.textContent = "Ceremony Guides";
    ceremonyLink.setAttribute("tabindex", "2");
    ceremonyLink.style.cursor = "pointer";

    // Prevent default link behavior
    ceremonyLink.addEventListener("click", (e) => {
      e.preventDefault();
    });

    // Append link to the new nav item
    newNavItem.appendChild(ceremonyLink);

    // Insert the new nav item after the first one
    firstNavItem.parentNode.insertBefore(newNavItem, firstNavItem.nextSibling);

    // DROPDOWN + TOGGLE LOGIC BELOW WILL RUN AFTER LINK IS CREATED

    const dropdown = document.createElement("div");
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

    const items = [
      {
        label: "1100 Faculty of Medicine",
        scrollToId: "ceremony-1",
        sections:
          ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8",
      },
      {
        label: "1430 Faculty of Natural Science",
        scrollToId: "ceremony-2",
        sections:
          ".Theme-Section-Position-9, .Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12",
      },
      {
        label: "1730 Faculty of Engineering",
        scrollToId: "ceremony-3",
        sections:
          ".Theme-Section-Position-13, .Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16",
      },
    ];

    items.forEach((item) => {
      const link = document.createElement("div");
      link.textContent = item.label;
      link.style.display = "block";
      link.style.padding = "8px";
      link.style.textDecoration = "none";
      link.style.color = "#fff";
      link.style.cursor = "pointer";

      // Hover styling (matches your earlier request)
      link.addEventListener("mouseenter", () => {
        link.style.backgroundColor = "#40E0D04D";
        link.style.color = "white";
      });
      link.addEventListener("mouseleave", () => {
        link.style.backgroundColor = "transparent";
        link.style.color = "#fff";
      });

      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Hide all sections (positions 5-16 for the 3 groups)
        const allSections = document.querySelectorAll(`
          .Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, 
          .Theme-Section-Position-8, .Theme-Section-Position-9, .Theme-Section-Position-10, 
          .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, 
          .Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16
        `);
        allSections.forEach((section) => section.classList.remove("showing"));

        // Clear any saved state to prevent conflicts with restoration logic
        try {
          sessionStorage.removeItem("lastActiveToggle");
          sessionStorage.removeItem("lastScrollY");
        } catch (e) {}

        // Show the selected sections
        const sections = document.querySelectorAll(item.sections);
        sections.forEach((section) => {
          section.classList.add("showing");
        });

        // Update button states if time toggles exist
        const timeToggles = document.querySelectorAll(".time-toggle button");
        if (timeToggles.length > 0) {
          // Remove active class from all buttons
          timeToggles.forEach((btn) => btn.classList.remove("active"));

          // Determine which toggle should be active based on sections
          let toggleIndex = -1;
          if (item.scrollToId === "section-1") {
            toggleIndex = 0; // First toggle group
          } else if (item.scrollToId === "section-2") {
            toggleIndex = 1; // Second toggle group
          } else if (item.scrollToId === "section-3") {
            toggleIndex = 2; // Third toggle group
          }

          // Set the corresponding toggle as active
          if (toggleIndex >= 0 && timeToggles[toggleIndex]) {
            timeToggles[toggleIndex].classList.add("active");
            // Save the active toggle to session storage
            sessionStorage.setItem("lastActiveToggle", String(toggleIndex));
          }
        }

        // Scroll to the target element
        const target = document.getElementById(item.scrollToId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        dropdown.style.display = "none";
      });

      dropdown.appendChild(link);
    });

    // Append dropdown directly to the new nav item
    newNavItem.appendChild(dropdown);

    // Add hover events to show/hide dropdown
    newNavItem.addEventListener("mouseenter", () => {
      dropdown.style.display = "block";
    });
    newNavItem.addEventListener("mouseleave", () => {
      dropdown.style.display = "none";
    });

    function updateFloatingBars() {
      const bars = document.querySelectorAll(".floating-day-bar");

      bars.forEach((bar) => {
        const section = bar.closest("section");
        if (!section) return;

        const rect = section.getBoundingClientRect();

        // Check if the section is below the top of the viewport
        if (rect.top <= 0 && section.classList.contains("showing")) {
          bar.classList.add("visible"); // Show bar when section is in view
        } else {
          bar.classList.remove("visible"); // Hide bar if above or not showing
        }
      });
    }

    window.addEventListener("scroll", updateFloatingBars);
    updateFloatingBars();
  }

  createCeremonyGuideLink(); // Start the process
});
