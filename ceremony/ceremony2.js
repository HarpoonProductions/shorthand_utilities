function checkQueryParamsAndScroll() {
  const ceremonyConfig = {
    "medicine-1100": {
      label: "1100 Faculty of Medicine",
      sections:
        ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8",
    },
    "natural-science-1430": {
      label: "1430 Faculty of Natural Science",
      sections:
        ".Theme-Section-Position-9, .Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12",
    },
    "engineering-1730": {
      label: "1730 Faculty of Engineering",
      sections:
        ".Theme-Section-Position-13, .Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16",
    },
  };

  const urlParams = new URLSearchParams(window.location.search);
  const ceremonyParam = urlParams.get("ceremony");

  if (ceremonyParam && ceremonyConfig[ceremonyParam]) {
    executeScrollAndReveal(
      ceremonyParam,
      ceremonyConfig[ceremonyParam].sections
    );
  }
}

function executeScrollAndReveal(scrollToId, sectionSelectors) {
  // First, close ALL sections (including any that might be open from session restoration)
  // This covers all possible sections that could be managed by the toggle system
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
  const sectionsToShow = document.querySelectorAll(sectionSelectors);
  sectionsToShow.forEach((section) => {
    section.classList.add("showing");
  });

  // Update button states if time toggles exist
  const timeToggles = document.querySelectorAll(".time-toggle button");
  if (timeToggles.length > 0) {
    // Remove active class from all buttons
    timeToggles.forEach((btn) => btn.classList.remove("active"));

    // Determine which toggle should be active based on sections
    let toggleIndex = -1;
    if (sectionSelectors.includes("Position-5")) {
      toggleIndex = 0; // First toggle group
    } else if (sectionSelectors.includes("Position-9")) {
      toggleIndex = 1; // Second toggle group
    } else if (sectionSelectors.includes("Position-13")) {
      toggleIndex = 2; // Third toggle group
    }

    // Set the corresponding toggle as active
    if (toggleIndex >= 0 && timeToggles[toggleIndex]) {
      timeToggles[toggleIndex].classList.add("active");
    }
  }

  // Scroll to the target element
  const target = document.getElementById(scrollToId);
  if (target) {
    // Use setTimeout to ensure DOM updates are complete before scrolling
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit to ensure all elements are loaded and any state restoration is complete
  setTimeout(() => {
    checkQueryParamsAndScroll();
  }, 500);
});
