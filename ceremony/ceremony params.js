function checkQueryParamsAndScroll() {
  const ceremonyConfig = {
    "monday-11": {
      label: "Business School: Management, Specialised, Doctoral",
      sections:
        ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8, .Theme-Section-Position-9",
    },
    "monday-14-30": {
      label: "Business School: MBA, Finance",
      sections:
        ".Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-14",
    },
    "tuesday-10-30": {
      label: "Medicine, CHERS, CLCC",
      sections:
        ".Theme-Section-Position-15, .Theme-Section-Position-16, .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19",
    },
    "tuesday-13-45": {
      label: "Natural Sciences",
      sections:
        ".Theme-Section-Position-20, .Theme-Section-Position-21, .Theme-Section-Position-22, .Theme-Section-Position-23, .Theme-Section-Position-24",
    },
    "tuesday-16-45": {
      label: "Engineering",
      sections:
        ".Theme-Section-Position-25, .Theme-Section-Position-26, .Theme-Section-Position-27, .Theme-Section-Position-28, .Theme-Section-Position-29",
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
  // Hide all ceremony sections first
  const allSections = document.querySelectorAll(`
    .Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, 
    .Theme-Section-Position-8, .Theme-Section-Position-9, .Theme-Section-Position-10, 
    .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, 
    .Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16, 
    .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19, 
    .Theme-Section-Position-20, .Theme-Section-Position-21, .Theme-Section-Position-22, 
    .Theme-Section-Position-23, .Theme-Section-Position-24, .Theme-Section-Position-25, 
    .Theme-Section-Position-26, .Theme-Section-Position-27, .Theme-Section-Position-28, 
    .Theme-Section-Position-29
  `);

  allSections.forEach((section) => section.classList.remove("showing"));

  // Show the selected sections
  const sectionsToShow = document.querySelectorAll(sectionSelectors);
  sectionsToShow.forEach((section) => {
    section.classList.add("showing");
  });

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
// You can add this to your existing DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit to ensure all elements are loaded
  setTimeout(() => {
    checkQueryParamsAndScroll();
  }, 500);
});
