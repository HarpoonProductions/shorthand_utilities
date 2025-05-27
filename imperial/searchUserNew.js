function updateResultButtonText(current, total) {
  var button = document.getElementById("result-inner");
  if (button) {
    // Check if the button exists
    button.textContent = `Result ${current} of ${total}`; // Update the button text
  } else {
    console.error("Result button not found.");
  }
}

function createResultButton(current, total, callback) {
  // Create and append CSS styles
  var style = document.createElement("style");
  style.id = "resultButtonStyles";
  style.textContent = `
    #closeResultButton:hover {
      background-color: #c82333;
    }

    #resultButton:hover {
      background-color: #0056b3;
    }

    body.close-results #resultButton,
    body.close-results #closeResultButton {
      display: none !important;
    }

    body.close-results .found-text-piece {
      background-color: transparent !important;
    }
  `;

  // Only append if styles don't already exist
  if (!document.getElementById("resultButtonStyles")) {
    document.head.appendChild(style);
  }
  // Create container div to hold both buttons
  var container = document.createElement("div");
  container.id = "resultButtonContainer";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "1000";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-end";
  container.style.gap = "5px";

  // Create close button
  var closeButton = document.createElement("button");
  closeButton.id = "closeResultButton";
  closeButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  closeButton.style.width = "30px";
  closeButton.style.height = "30px";
  closeButton.style.borderRadius = "50%";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "#dc3545";
  closeButton.style.color = "white";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "18px";
  closeButton.style.fontWeight = "bold";
  closeButton.style.display = "flex";
  closeButton.style.alignItems = "center";
  closeButton.style.justifyContent = "center";
  closeButton.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

  // Add click event to close button
  closeButton.addEventListener("click", function () {
    document.body.classList.add("close-results");
  });

  // Create main result button
  var button = document.createElement("button");
  button.id = "resultButton";
  button.innerHTML = `
    <span id="result-inner">Result ${current} of ${total}</span>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px;">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  button.style.padding = "10px 7px";
  button.style.borderRadius = "5px";
  button.style.border = "none";
  button.style.backgroundColor = "#007BFF";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";

  button.addEventListener("click", function () {
    if (typeof callback === "function") {
      callback();
    }
  });

  // Append buttons to container
  container.appendChild(closeButton);
  container.appendChild(button);

  // Append container to body
  document.body.appendChild(container);
}
function extractMatch(baseString, matchString) {
  // Escape special regex characters in the match string
  const escaped = matchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create case-insensitive regex with word boundaries
  const regex = new RegExp(`\\b${escaped}\\b`, "i");

  // Find and return the match (preserving original case from base string)
  const match = baseString.match(regex);
  return match ? match[0] : "";
}

// Function to modify the href of .project-image-link within the li elements
function processListItem(li) {
  console.log("NEW TEST", li);
  const highlightSpan = li.querySelector(".search-input-highlight");
  const link = li.querySelector(".project-image-link");
  if (highlightSpan && link) {
    const result = document.querySelector(".project-search-results");
    result.style.display = "none";
    if (
      link.href ===
      "https://graduation-programmes.imperial.ac.uk/graduation-days-2025/index.html"
    ) {
      const input = document.querySelector(".project-search-input");
      const name = input ? input.value : "";
      const studentName = encodeURIComponent(name);
      const url = new URL(link.href);
      url.searchParams.set("student_name", studentName);
      window.location.replace(url.href);
    }
  }
}

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        // Check if the added node is a ul with class '.project-search-results'
        if (node.nodeType === 1 && node.matches(".project-search-results")) {
          const listItems = node.querySelectorAll(".project-story-list-item");
          listItems.forEach(processListItem);
        }
      }
    }
  }
};

// Create a MutationObserver instance
const observer = new MutationObserver(callback);

// Configuration of the observer
const config = { childList: true, subtree: true };

// Select the target node (the div with class .project-search-sideBar)
const targetNode = document.querySelector(".project-search-sideBar");

// Check if targetNode exists to avoid errors
if (targetNode) {
  observer.observe(targetNode, config);
} else {
  console.error("The target element `.project-search-sideBar` was not found.");
}

// Optionally, disconnect the observer at some point using observer.disconnect();

document.addEventListener("DOMContentLoaded", function () {
  var style = document.createElement("style");
  style.id = "searchTitle";
  style.textContent = `
    @media (min-width: 900px) {
      .project-search-button::after {
          content: "Search name:" !important;
      }
    }
  `;

  if (!document.getElementById("searchTitle")) {
    document.head.appendChild(style);
  }

  // Update Search Placeholder
  const projectInput = document.querySelector(".Theme-ProjectInput");
  if (projectInput) projectInput.setAttribute("placeholder", "Search Name");

  // accordion logic
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((accordion, index) => {
    accordion.classList.add("step-" + index);
    accordion.style.scrollMarginTop = "150px";
  });
  const innerDropdowns = document.querySelectorAll(".inner-dropdown");

  const consolidatedDropdown = document.createElement("div");
  consolidatedDropdown.className = "consolidated-dropdown";
  consolidatedDropdown.style.display = "none";
  consolidatedDropdown.style.transition =
    "opacity 0.3s ease, pointer-events 0.3s ease";
  consolidatedDropdown.style.opacity = "1";
  consolidatedDropdown.style.pointerEvents = "auto";
  document.body.appendChild(consolidatedDropdown);

  // Create and insert sentry section before the target element
  function createSentrySection() {
    const targetElement = document.getElementById("section-tVbkG6IJAz");

    if (targetElement) {
      const sentrySection = document.createElement("div");
      sentrySection.id = "section-1430-sentry"; // Uses allowed prefix
      sentrySection.className = "Theme-Section"; // Matches observer selector
      sentrySection.style.height = "0px";
      sentrySection.style.width = "0px";
      sentrySection.style.overflow = "hidden";
      sentrySection.style.visibility = "hidden"; // Completely invisible
      sentrySection.style.position = "relative"; // Doesn't affect layout

      // Insert before the target element
      targetElement.parentNode.insertBefore(sentrySection, targetElement);

      console.log("Sentry section created and inserted");
    } else {
      console.warn("Target element section-tVbkG6IJAz not found");
    }
  }

  // Call this function to create the sentry section
  createSentrySection();

  // Intersection Observer for dropdown visibility
  const allowedSectionPrefixes = [
    "section-1430",
    "section-1100",
    "section-1030",
    "section-1345",
    "section-1645",
  ];

  function setupDropdownVisibilityObserver() {
    // Get all sections on the page
    const sections = document.querySelectorAll(".Theme-Section");

    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the fade-out section is in view
        const fadeOutSection = entries.find(
          (entry) =>
            entry.isIntersecting && entry.target.id === "section-aIviY23ApG"
        );

        if (fadeOutSection) {
          // Hide dropdown - fade-out section is in view
          console.log(
            `🔴 Dropdown hidden by section: ${fadeOutSection.target.id}`
          );
          consolidatedDropdown.style.opacity = "0";
          consolidatedDropdown.style.pointerEvents = "none";
          return; // Exit early, don't check for allowed sections
        }

        // Check if any currently intersecting section has an allowed ID prefix
        let triggeringSection = null;
        const hasAllowedSection = entries.some((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const isAllowed = allowedSectionPrefixes.some(
              (prefix) =>
                entry.target.id.startsWith(prefix) &&
                !entry.target.id.includes("Imperial")
            );
            if (isAllowed) {
              triggeringSection = entry.target.id;
            }
            return isAllowed;
          }
          return false;
        });

        // Update dropdown visibility based on current sections
        if (hasAllowedSection) {
          // Show dropdown - over an allowed section
          console.log(`🟢 Dropdown triggered by section: ${triggeringSection}`);
          consolidatedDropdown.style.opacity = "1";
          consolidatedDropdown.style.pointerEvents = "auto";
        } else {
          // Check if any allowed sections are currently in viewport
          const allowedSectionsInView = Array.from(sections).some((section) => {
            if (!section.id) return false;
            const hasAllowedId = allowedSectionPrefixes.some((prefix) =>
              section.id.startsWith(prefix)
            );
            if (!hasAllowedId) return false;

            const rect = section.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          });

          if (!allowedSectionsInView) {
            // Hide dropdown - not over any allowed section
            consolidatedDropdown.style.opacity = "0";
            consolidatedDropdown.style.pointerEvents = "none";
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: "-100px 0px -50px 0px",
      }
    );

    // Observe all sections (including the new sentry section)
    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  function updateConsolidatedDropdown() {
    const openAccordions = Array.from(accordions).filter(
      (accordion) => accordion.nextElementSibling.style.display === "inline"
    );

    if (openAccordions.length > 0) {
      consolidatedDropdown.innerHTML = `
        <button class="dropbtn">Find a course:</button>
        <div class="dropdown-content"></div>
      `;
      const dropdownContent =
        consolidatedDropdown.querySelector(".dropdown-content");

      openAccordions.forEach((accordion, index) => {
        const step = accordion.className.replace(/[^\d]/g, "");
        const associatedDropdown = innerDropdowns[step];
        if (associatedDropdown) {
          const links = associatedDropdown.querySelectorAll("a");
          links.forEach((link) => {
            const newLink = link.cloneNode(true);
            dropdownContent.appendChild(newLink);
          });
        }
      });

      consolidatedDropdown.style.display = "flex";

      // Initialize the observer after the dropdown is shown
      setupDropdownVisibilityObserver();
    } else {
      consolidatedDropdown.style.display = "none";
    }
  }

  function toggleAccordion(clickedAccordion) {
    const content = clickedAccordion.nextElementSibling;
    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "inline";
    } else {
      content.style.display = "none";
      clickedAccordion.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
    updateConsolidatedDropdown();
  }

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      toggleAccordion(this);
    });
  });

  // search user
  const searchedAccordions = [];

  const toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  function scrollToAndHighlightText(t) {
    console.log(t);
    const text = toTitleCase(t);
    console.log(text);
    const containers = document.querySelectorAll(
      ".sh-names, .sh-prizewinnernames"
    );
    if (!containers.length) {
      console.error("Container .sh-names not found.");
      return;
    }

    let matches = [];

    containers.forEach((container) => {
      let updates = []; // To store updates for later application
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while ((node = walker.nextNode())) {
        let textContent = node.nodeValue;
        if (textContent.toLowerCase().includes(text.toLowerCase())) {
          const frag = document.createDocumentFragment();
          const match = extractMatch(textContent, text);
          const parts = textContent.split(match.length ? match : text);

          const endIndex = parts.length - 1;

          parts.forEach((part, index) => {
            frag.appendChild(document.createTextNode(part));
            if (index !== endIndex) {
              const span = document.createElement("span");
              span.style.backgroundColor = "#ffffff1d";
              span.classList.add("found-text-piece");
              span.textContent = match.length ? match : text;
              frag.appendChild(span);
              matches.push(span);
            }
          });

          // Store the node and its replacement fragment for later updating
          updates.push({ oldNode: node, frag });
        }
      }

      console.log("TESTING UPDATES", updates);

      // Apply all collected updates
      updates.forEach((update) => {
        let currentElement = update.oldNode.parentElement;
        while (currentElement && !currentElement.classList.contains("panel")) {
          if (
            currentElement.classList.contains("order-tab-content") &&
            !currentElement.classList.contains("active")
          ) {
            currentElement.classList.add("active");
          }
          currentElement = currentElement.parentElement;
        }
        update.oldNode.parentNode.replaceChild(update.frag, update.oldNode);

        // Find the nearest ancestor with class 'panel' and set its display to inline
        if (currentElement) {
          currentElement.style.display = "inline";
          const parent = currentElement.parentElement;
          const accordion = parent.querySelector(".accordion");
          if (accordion) {
            searchedAccordions.push(accordion);
          }
        }

        container.classList.add("show");
        const id = container.getAttribute("id");
        const day = id.match(/^[^-]+-\d{4}/);

        console.log("testing new", id, day);

        if (day && day[0]) {
          const daySection = document.querySelectorAll("[id^=" + day + "]");
          console.log("testing new", day, day[0]);
          if (daySection && daySection.length) {
            daySection.forEach((section) => section.classList.add("showing"));
            console.log("testing new", daySection);

            daySection.forEach((section) => {
              const sec = section.querySelector(
                'section[class^="Theme-Section-Position"]'
              );
              if (sec) sec.classList.add("showing");
            });

            const dayBar = daySection[0].querySelector(".floating-day-bar");

            console.log("testing new", dayBar);
          }
        }
      });
    });

    if (accordions.length > 0) {
      console.log("multi");
      updateConsolidatedDropdown();
    }

    if (matches.length > 0) {
      scrollToMatch(matches);
    }
  }

  function scrollToMatch(matches, yOffset = -300) {
    console.log("scrolling", matches);
    let current = 0;

    const scroll = () => {
      const attemptScroll = () => {
        const yPosition =
          matches[current].getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        if (window.pageYOffset > 0 || yPosition > 0) {
          // Check if the page has likely scrolled or can scroll
          window.scrollTo({ top: yPosition, behavior: "smooth" });
          current = (current + 1) % matches.length;
          matches.length > 1 &&
            updateResultButtonText(current || matches.length, matches.length);
        } else {
          setTimeout(attemptScroll, 120); // Wait a bit more if page offset is still 0
        }
      };

      if (matches[current]) {
        setTimeout(attemptScroll, 100); // Initial delay before first attempt
      }
    };

    if (matches.length > 1) {
      createResultButton(1, matches.length, scroll); // Start from 1 for user clarity
    } else {
      console.log("Only one match found, no need for result button.");

      var style = document.createElement("style");
      style.id = "closeResults";
      style.textContent = `
        body.close-results .found-text-piece {
          background-color: transparent !important;
        }
      `;

      if (!document.getElementById("closeResults")) {
        document.head.appendChild(style);
      }

      document.addEventListener("click", function () {
        document.body.classList.add("close-results");
      });
    }

    // Initial scroll to the first match
    scroll();
  }

  // Get the 'student_name' query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const studentName = urlParams.get("student_name");

  if (studentName) {
    // Decode URI component in case the name is encoded
    scrollToAndHighlightText(decodeURIComponent(studentName));
  }
});

// Tab Order Manager for Imperial Graduation Page - Fixed Version
class TabOrderManager {
  constructor() {
    this.init();
  }

  init() {
    // Add Imperial focus styles
    this.addFocusStyles();

    // Set up custom tab handling
    document.addEventListener("keydown", this.handleTab.bind(this));

    // Initial tab order setup
    this.updateTabOrder();

    // Refresh when ceremony sections are toggled
    document.addEventListener("click", (e) => {
      if (e.target.closest(".time-toggle")) {
        setTimeout(() => this.updateTabOrder(), 350);
      }
    });
  }

  addFocusStyles() {
    const style = document.createElement("style");
    style.textContent = `
      *:focus {
        outline: none !important;
      }
       
      *:focus-visible {
        box-shadow: 0 0 0 2px #aedeff inset, 0 0 0 4px #0262B1 inset;
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  updateTabOrder() {
    console.log("=== Updating tab order ===");

    // Remove all tabindex attributes
    document.querySelectorAll("[tabindex]").forEach((el) => {
      el.removeAttribute("tabindex");
    });

    let tabIndex = 0;

    // 1. Imperial Logo
    const logo = document.querySelector(".Theme-Logo a");
    if (logo) {
      logo.setAttribute("tabindex", tabIndex++);
      console.log("Logo set to tabindex:", tabIndex - 1);
    }

    // 2. Navigation items - Fixed selector
    const navContainer = document.querySelector(".Navigation__itemList");
    if (navContainer) {
      // Get all direct navigation items
      const navItems = navContainer.querySelectorAll(
        ":scope > .Navigation__item"
      );

      navItems.forEach((item) => {
        // Get the main link or span
        const mainElement = item.querySelector(
          "a.Theme-NavigationLink, span.Theme-NavigationLink"
        );
        if (mainElement) {
          mainElement.setAttribute("tabindex", tabIndex++);
          console.log(
            `Nav item "${mainElement.textContent.trim()}" - tabindex ${
              tabIndex - 1
            }`
          );
        }

        // If it's the "Explore more" item with a button
        const menuButton = item.querySelector(".Navigation__button");
        if (menuButton) {
          menuButton.setAttribute("tabindex", tabIndex++);
          console.log("Explore more button - tabindex:", tabIndex - 1);
        }

        // Check for visible submenus
        const subMenu = item.querySelector(".Navigation__subMenu");
        if (subMenu && this.isVisible(subMenu)) {
          const subLinks = subMenu.querySelectorAll("a");
          subLinks.forEach((link) => {
            link.setAttribute("tabindex", tabIndex++);
            console.log(
              `  Submenu: "${link.textContent.trim()}" - tabindex ${
                tabIndex - 1
              }`
            );
          });
        }

        // Check for visible custom dropdown
        const customDropdown = item.querySelector(".custom-dropdown");
        if (customDropdown && this.isVisible(customDropdown)) {
          const dropdownDivs = customDropdown.querySelectorAll("div");
          dropdownDivs.forEach((div) => {
            div.setAttribute("tabindex", tabIndex++);
            console.log(
              `  Dropdown: "${div.textContent.trim()}" - tabindex ${
                tabIndex - 1
              }`
            );
          });
        }
      });
    }

    // 3. Ceremony buttons
    const ceremonyButtons = document.querySelectorAll(".time-toggle button");
    ceremonyButtons.forEach((button, i) => {
      button.setAttribute("tabindex", tabIndex++);
      console.log(`Ceremony button ${i} - tabindex ${tabIndex - 1}`);
    });

    // 4. Content in expanded ceremony sections
    const showingSections = document.querySelectorAll(".showing");
    showingSections.forEach((section) => {
      const interactiveElements = section.querySelectorAll(
        "a, button, input, select, textarea"
      );
      interactiveElements.forEach((el) => {
        if (this.isVisible(el) && !el.hasAttribute("tabindex")) {
          el.setAttribute("tabindex", tabIndex++);
          console.log(
            `Ceremony content: "${
              el.textContent?.trim() || el.type
            }" - tabindex ${tabIndex - 1}`
          );
        }
      });
    });

    const totalTabbable = document.querySelectorAll(
      '[tabindex]:not([tabindex="-1"])'
    ).length;
    console.log("Total tabbable elements:", totalTabbable);
  }

  isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  handleTab(e) {
    if (e.key !== "Tab") return;

    const tabbables = Array.from(
      document.querySelectorAll('[tabindex]:not([tabindex="-1"])')
    ).sort(
      (a, b) =>
        parseInt(a.getAttribute("tabindex")) -
        parseInt(b.getAttribute("tabindex"))
    );

    if (tabbables.length === 0) return;

    e.preventDefault();

    const currentFocus = document.activeElement;
    let currentIndex = tabbables.indexOf(currentFocus);

    // If nothing is focused, start at -1 so next will be 0
    if (currentIndex === -1 && !e.shiftKey) {
      currentIndex = -1;
    } else if (currentIndex === -1 && e.shiftKey) {
      currentIndex = tabbables.length;
    }

    // Calculate next index
    const nextIndex = e.shiftKey
      ? (currentIndex - 1 + tabbables.length) % tabbables.length
      : (currentIndex + 1) % tabbables.length;

    console.log(`Tab: current ${currentIndex} → next ${nextIndex}`);

    // Focus next element
    tabbables[nextIndex].focus();

    // Ensure it's visible
    tabbables[nextIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.tabOrderManager = new TabOrderManager();
  });
} else {
  window.tabOrderManager = new TabOrderManager();
}

// ESC key handling for dropdowns
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close custom dropdowns
    const customDropdowns = document.querySelectorAll(
      '.custom-dropdown[style*="display: block"]'
    );
    customDropdowns.forEach((dropdown) => {
      dropdown.style.display = "none";
      // Focus the parent link
      const parentLink = dropdown.previousElementSibling;
      if (parentLink) parentLink.focus();
    });

    // Close navigation submenus
    const openButtons = document.querySelectorAll(
      '.Navigation__button[aria-expanded="true"]'
    );
    openButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      const subMenu = button.nextElementSibling;
      if (subMenu) subMenu.style.display = "none";
      // Focus the span before the button
      const span = button.previousElementSibling;
      if (span) span.focus();
    });
  }
});
