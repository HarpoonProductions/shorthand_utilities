/* (function () {
  const origTo = window.scrollTo;
  const origInto = Element.prototype.scrollIntoView;

  window.scrollTo = function (...args) {
    console.warn("[trace] window.scrollTo", args);
    console.trace();
    return origTo.apply(this, args);
  };

  Element.prototype.scrollIntoView = function (...args) {
    console.warn("[trace] scrollIntoView on", this, args);
    console.trace();
    return origInto.apply(this, args);
  };
})();
*/

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
  const highlightSpan = li.querySelector(".search-input-highlight");
  const link = li.querySelector(".project-image-link");
  if (highlightSpan && link) {
    const result = document.querySelectorAll(
      ".project-search-results, .search-results-found-list, .project-search-results-container"
    );
    result.forEach((result) => (result.style.display = "none"));
    if (
      link.href ===
        "https://graduation-programmes.imperial.ac.uk/graduation-days-2025/index.html" ||
      link.href ===
        "https://graduation-programmes.imperial.ac.uk/7f547269-7abd-44bc-94bd-c0cae69b796e/index.html" ||
      link.href ===
        "https://graduation-programmes.imperial.ac.uk/commemoration-day-2025/index.html" ||
      link.href ===
        "https://graduation-programmes.imperial.ac.uk/316491d8-9b0f-4025-a292-7530a553ec3a/index.html" ||
      link.href ===
        "https://graduation-programmes.imperial.ac.uk/commemoration-day-2026/index.html" ||
      link.href === "index.html"
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
        if (
          node.nodeType === 1 &&
          (node.matches(".project-search-results") ||
            node.matches(".search-results-found-list"))
        ) {
          const listItems = node.querySelectorAll(".project-story-list-item");
          listItems.forEach(processListItem);
        }
      }
    }
  }
};

// Optionally, disconnect the observer at some point using observer.disconnect();

document.addEventListener("DOMContentLoaded", function () {
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
    console.error(
      "The target element `.project-search-sideBar` was not found."
    );
  }

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
  if (projectInput) projectInput.setAttribute("placeholder", "Search name");

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
    const targetElement =
      document.getElementById("section-tVbkG6IJAz") ||
      document.getElementById("section-OcWb6x3SxS") ||
      document.getElementById("section-de8T3FMcx4") ||
      document.getElementById("section-ZvbXBHs5lv");

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
    "section-1630",
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
            entry.isIntersecting && entry.target.id === "section-actX6a4Fex"
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

            // Extract the prefix from the onclick function
            const onclickAttr = newLink.getAttribute("onclick");
            let ceremonyPrefix = "default";

            if (onclickAttr) {
              // Extract the ID from scrollToElementWithOffset('1430dept1course1', 250)
              const match = onclickAttr.match(
                /scrollToElementWithOffset\('(\d+)/
              );
              if (match && match[1]) {
                ceremonyPrefix = match[1]; // e.g., "1430"
              }
            }

            // Add class to associate link with its ceremony section
            const sectionClass = `ceremony-${ceremonyPrefix}`;
            newLink.classList.add("ceremony-link", sectionClass);

            // Initially hide all links
            newLink.style.display = "none";

            dropdownContent.appendChild(newLink);
          });
        }
      });

      // Always show the dropdown when there are open accordions
      consolidatedDropdown.style.display = "flex";
      consolidatedDropdown.style.opacity = "1";
      consolidatedDropdown.style.pointerEvents = "auto";

      // Initialize the observer after the dropdown is shown
      setupDropdownVisibilityObserver();
    } else {
      consolidatedDropdown.style.display = "none";
    }
  }

  function setupDropdownVisibilityObserver() {
    // Get all sections on the page
    const sections = document.querySelectorAll(".Theme-Section");

    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the fade-out section is in view first
        const fadeOutSection = Array.from(sections).find((section) => {
          if (section.id === "section-aIviY23ApG") {
            const rect = section.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          }
          return false;
        });

        if (fadeOutSection) {
          // Hide entire dropdown when fade-out section is in view
          console.log(`🔴 Dropdown hidden by fade-out section`);
          consolidatedDropdown.style.opacity = "0";
          consolidatedDropdown.style.pointerEvents = "none";
          return;
        }

        // Check ALL sections currently in viewport for each prefix
        const visiblePrefixes = new Set();

        // For each allowed prefix, check if ANY section with that prefix is visible
        allowedSectionPrefixes.forEach((prefix) => {
          const hasVisibleSection = Array.from(sections).some((section) => {
            if (
              !section.id ||
              !section.id.startsWith(prefix) ||
              section.id.includes("Imperial")
            ) {
              return false;
            }

            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            return isVisible;
          });

          if (hasVisibleSection) {
            visiblePrefixes.add(prefix);
          }
        });

        // Hide all ceremony links first
        const ceremonyLinks =
          consolidatedDropdown.querySelectorAll(".ceremony-link");
        ceremonyLinks.forEach((link) => {
          link.style.display = "none";
        });

        if (visiblePrefixes.size > 0) {
          // Show dropdown and relevant links
          consolidatedDropdown.style.opacity = "1";
          consolidatedDropdown.style.pointerEvents = "auto";

          // Show links for visible section prefixes
          visiblePrefixes.forEach((sectionPrefix) => {
            const sectionClass = `ceremony-${sectionPrefix.replace(
              "section-",
              ""
            )}`;
            const relevantLinks = consolidatedDropdown.querySelectorAll(
              `.${sectionClass}`
            );
            relevantLinks.forEach((link) => {
              link.style.display = "block";
            });
          });

          console.log(
            `🟢 Dropdown showing links for sections: ${Array.from(
              visiblePrefixes
            ).join(", ")}`
          );
        } else {
          // Hide dropdown when not over any allowed section
          consolidatedDropdown.style.opacity = "0";
          consolidatedDropdown.style.pointerEvents = "none";
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
    const text = toTitleCase(t);
    const BLACKLIST = [
      "#section-1000-Faculty-of-Medicine-RAAfL6Gb9C",
      "#section-1000-Awardees-ZDXuQCf04I",
      "#section-1000-Prizewinners-mVj59WimUb",
      "#section-1315-Faculty-of-Natural-Sciences-3Ki3t5HiWP",
      "#section-1315-Awardees-5eRgt7aaSQ",
      "#section-1315-Prizewinners-Zw6UNxD2G8",
      "#section-1630-Faculty-of-Engineering-aZ7BhfnHLG",
      "#section-1630-Awardees-QJ186VyFCA",
      "#section-1630-Prizewinners-KzYozJGfQ8",
    ];

    const blacklistSelector = BLACKLIST.join(",");

    const containers = [
      ...document.querySelectorAll(".sh-names, .sh-prizewinnernames"),
    ].filter((el) => !el.closest(blacklistSelector));

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
        console.log("ID CHECK", id);
        const day = id.match(/^[^-]+-\d{4}/);
        console.log("DAY CHECK", day);
        if (day && day[0]) {
          const daySection = document.querySelectorAll("[id^=" + day + "]");
          console.log("DAY SECTION CHECK", daySection);
          if (daySection && daySection.length) {
            daySection.forEach((section) => {
              console.log("SECTION CHECK", section);
              section.classList.add("showing");
            });

            daySection.forEach((section) => {
              const sec = section.querySelector(
                'section[class^="Theme-Section-Position"]'
              );
              if (sec) {
                console.log("SECTION 2 CHECK", section);
                sec.classList.add("showing");
              }
            });

            const dayBar = daySection[0].querySelector(".floating-day-bar");
          }
        }
      });
    });

    if (accordions.length > 0) {
      updateConsolidatedDropdown();
    }

    if (matches.length > 0) {
      scrollToMatch(matches);
    }
  }

  function scrollToMatch(matches, yOffset = -300) {
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

function scrollToElementWithOffset(id) {
  const element = document.getElementById(id);

  if (!element) {
    console.error("Element not found:", id);
    return;
  }

  // Find the closest panel ancestor
  const panel = element.closest(".panel");
  if (panel) {
    // Check if the panel is hidden and show it if needed
    if (panel.style.display !== "inline") {
      console.log("Panel was hidden, showing it:", panel.id);
      panel.style.display = "inline";
    }
  }

  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  // Determine the offset based on screen width
  let offset;
  const screenWidth = window.innerWidth;
  if (screenWidth <= 899) {
    offset = 200;
  } else if (screenWidth >= 900 && screenWidth <= 1099) {
    offset = 200;
  } else {
    offset = 250;
  }
  console.log("Screen width:", screenWidth, "Offset:", offset);
  const offsetPosition = elementPosition - offset;
  console.log("Offset position:", offsetPosition);
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

setTimeout(() => {
  window.scrollToElementWithOffset = scrollToElementWithOffset;
}, 500);

(function () {
  const SELECTOR = '[data-project-search-sidebar="true"]';
  const ACTIVE_CLASS = "project-search--isActive";
  const POLL_INTERVAL_MS = 200;
  const TIMEOUT_MS = 30000;

  function applyInert(el) {
    if (el.classList.contains(ACTIVE_CLASS)) {
      el.removeAttribute("inert");
    } else {
      el.setAttribute("inert", "");
    }
  }

  function init(el) {
    // Set initial state
    applyInert(el);

    // Watch for class changes
    const observer = new MutationObserver(() => applyInert(el));
    observer.observe(el, { attributeFilter: ["class"] });
  }

  // Poll for element existence
  const start = performance.now();
  const interval = setInterval(() => {
    const el = document.querySelector(SELECTOR);
    if (el) {
      clearInterval(interval);
      init(el);
      return;
    }
    if (performance.now() - start >= TIMEOUT_MS) {
      clearInterval(interval);
      console.warn("[search-inert] Timed out waiting for", SELECTOR);
    }
  }, POLL_INTERVAL_MS);
})();

(function () {
  "use strict";

  // Get the elements
  const input = document.querySelector(
    ".Theme-ProjectInput.project-search-input"
  );
  const button = document.querySelector(".project-search-delete-btn");
  const statusText = document.getElementById("status-text");

  if (!input || !button) {
    console.error("Required elements not found");
    if (statusText) statusText.textContent = "Error: Elements not found";
    return;
  }

  // Function to update button visibility
  function updateButtonVisibility() {
    if (input.value.trim() === "") {
      button.classList.add("force-hide");
      if (statusText) statusText.textContent = "Input empty - button hidden";
    } else {
      button.classList.remove("force-hide");
      if (statusText)
        statusText.textContent = "Input has content - button visible";
    }
  }

  // Set initial state
  updateButtonVisibility();

  // Create MutationObserver to watch for attribute changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "value"
      ) {
        updateButtonVisibility();
        console.log("Value attribute changed via mutation");
      }
    });
  });

  // Configure and start observing
  observer.observe(input, {
    attributes: true,
    attributeFilter: ["value"],
  });

  // Listen for input events (handles user typing)
  input.addEventListener("input", () => {
    updateButtonVisibility();
    console.log("Input event fired");
  });

  // Listen for change events (handles some programmatic changes)
  input.addEventListener("change", () => {
    updateButtonVisibility();
    console.log("Change event fired");
  });

  // Watch for programmatic value changes using a different approach
  // Store the original descriptor
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  const originalSet = descriptor.set;

  // Only override if we haven't already
  if (originalSet && !input.hasAttribute("data-observer-attached")) {
    input.setAttribute("data-observer-attached", "true");

    // Create a new setter that calls our update function
    Object.defineProperty(input, "value", {
      get: descriptor.get,
      set: function (newValue) {
        // Call the original setter with the input element as context
        originalSet.call(this, newValue);
        // Then update visibility
        updateButtonVisibility();
        console.log("Value set programmatically:", newValue);
      },
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
    });
  }

  // Clear button functionality
  button.addEventListener("click", () => {
    input.value = "";
    updateButtonVisibility();
    input.focus();
  });

  console.log("MutationObserver script initialized successfully");
})();

class TabOrderManager {
  constructor() {
    this.refreshTimer = null;
    this.bodyObserver = null;
    this.DEBUG = true; // ← flip to false to silence logging
    this.init();
  }

  // ─── Logging ──────────────────────────────────────────────────────────────

  log(msg, ...args) {
    if (this.DEBUG) console.log(`[TAB] ${msg}`, ...args);
  }
  warn(msg, ...args) {
    if (this.DEBUG) console.warn(`[TAB] ${msg}`, ...args);
  }
  group(label) {
    if (this.DEBUG) console.groupCollapsed(`[TAB] ${label}`);
  }
  groupEnd() {
    if (this.DEBUG) console.groupEnd();
  }

  /** Compact description of an element for logs */
  describe(el) {
    if (!el) return "(null)";
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const cls =
      el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
        : "";
    const text = el.textContent?.trim().slice(0, 30) || "";
    return `<${tag}${id}${cls}> "${text}"`;
  }

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  init() {
    this.addFocusStyles();
    this.addFocusTracker(); // ← monitors every focus change
    this.waitForNav(() => {
      this.updateTabOrder();
      this.attachObservers();
    });
  }

  /**
   * Global focus tracker — logs every focus/blur event so you can see
   * exactly what gains focus and when.
   */
  addFocusTracker() {
    document.addEventListener(
      "focusin",
      (e) => {
        const ti = e.target.getAttribute("tabindex");
        const tag = this.describe(e.target);
        const nativelyFocusable = /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/i.test(
          e.target.tagName
        );
        this.log(
          `FOCUS → ${tag}  tabindex=${ti}  nativelyFocusable=${nativelyFocusable}`
        );

        // Flag the trap: if tabindex is -1 but element got focus anyway
        if (ti === "-1") {
          this.warn(
            `⚠️  FOCUS LANDED ON tabindex="-1" element! This means something ` +
              `is programmatically calling .focus() or the element is natively ` +
              `focusable and the browser is ignoring tabindex for click/autofocus.`,
            e.target
          );
          console.trace("[TAB] Stack trace for unexpected focus:");
        }
      },
      true
    );

    document.addEventListener(
      "focusout",
      (e) => {
        this.log(`BLUR  ← ${this.describe(e.target)}`);
      },
      true
    );

    // Catch Tab key presses to log what the browser is about to do
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Tab") {
          const current = document.activeElement;
          const ti = current?.getAttribute("tabindex");
          this.log(
            `TAB pressed (shift=${e.shiftKey}) while on ${this.describe(
              current
            )} tabindex=${ti}`
          );
        }
      },
      true
    );
  }

  waitForNav(cb, attempts = 0) {
    const nav = document.querySelector("#navigation, nav");
    if (nav || attempts > 30) {
      cb();
    } else {
      setTimeout(() => this.waitForNav(cb, attempts + 1), 150);
    }
  }

  attachObservers() {
    this.bodyObserver = new MutationObserver(() => this.scheduleRefresh(400));
    this.bodyObserver.observe(document.body, {
      childList: true,
      subtree: false,
    });

    const nav = document.querySelector("#navigation");
    if (nav) {
      new MutationObserver(() => this.scheduleRefresh(200)).observe(nav, {
        attributes: true,
        subtree: true,
        attributeFilter: ["aria-expanded", "style", "class"],
      });
    }

    document.addEventListener("click", (e) => {
      if (
        e.target.closest(
          ".time-toggle, .accordion, .Navigation__button, .custom-dropdown, .project-search-button, .project-search-close-button"
        )
      ) {
        this.scheduleRefresh(350);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.closest(
          ".Navigation__button, .time-toggle button, .project-search-button"
        )
      ) {
        this.scheduleRefresh(350);
      }
    });
  }

  scheduleRefresh(delay = 150) {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.updateTabOrder(), delay);
  }

  // ─── Visibility helpers ────────────────────────────────────────────────────

  isVisible(el) {
    if (!el) return false;
    let node = el;
    while (node && node !== document.documentElement) {
      const s = window.getComputedStyle(node);
      if (
        s.display === "none" ||
        s.visibility === "hidden" ||
        s.opacity === "0"
      )
        return false;
      node = node.parentElement;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // ─── Core tab-order builder ────────────────────────────────────────────────

  updateTabOrder() {
    this.group("updateTabOrder()");
    const t0 = performance.now();

    // 1. Reset everything to -1
    const allFocusable = document.querySelectorAll(
      "a[href], button, input, select, textarea, [tabindex]"
    );
    this.log(`Resetting ${allFocusable.length} elements to tabindex="-1"`);
    allFocusable.forEach((el) => el.setAttribute("tabindex", "-1"));

    // Track assignments for the summary table
    const assignments = [];

    let idx = 1;
    const assign = (el, label) => {
      if (el && this.isVisible(el)) {
        el.setAttribute("tabindex", String(idx));
        assignments.push({
          order: idx,
          label: label || "",
          element: this.describe(el),
          tabindex: idx,
        });
        idx++;
        return true;
      } else if (el) {
        this.log(`  SKIPPED (not visible): ${this.describe(el)} [${label}]`);
      }
      return false;
    };

    // ── (1) Logo ─────────────────────────────────────────────────────────────
    assign(
      document.querySelector(".Project-Header--left .Theme-Logo a"),
      "1: Logo"
    );

    // ── (2)–(5) Navigation items in DOM order ────────────────────────────────
    const navItems = document.querySelectorAll(
      "#navigation > .Navigation__itemList > .Navigation__item"
    );
    this.log(`Found ${navItems.length} top-level nav <li> items`);

    navItems.forEach((li, i) => {
      const link = li.querySelector(":scope > a.Theme-NavigationLink");
      const button = li.querySelector(":scope > button.Theme-NavigationLink");

      this.log(
        `  Nav item ${i}: link=${this.describe(link)}, button=${this.describe(
          button
        )}`
      );

      if (link && this.isVisible(link)) {
        assign(link, `Nav link ${i}`);
      } else if (button && this.isVisible(button)) {
        assign(button, `Nav button ${i}`);

        const isExpanded = button.getAttribute("aria-expanded") === "true";
        this.log(`    aria-expanded=${isExpanded}`);

        if (isExpanded) {
          const dropdown =
            li.querySelector(".custom-dropdown") ||
            li.querySelector(".Navigation__subMenu");

          this.log(
            `    Dropdown: ${this.describe(dropdown)}, visible=${
              dropdown ? this.isVisible(dropdown) : "N/A"
            }`
          );

          if (dropdown && this.isVisible(dropdown)) {
            dropdown.querySelectorAll("a[href], button").forEach((child) => {
              assign(child, `Nav dropdown child`);
            });
          }
        }
      } else {
        this.warn(`  Nav item ${i}: NO visible link or button found in <li>`);
      }
    });

    // ── (6) Search icon button ───────────────────────────────────────────────
    assign(document.querySelector(".project-search-button"), "6: Search icon");

    // ── (6a) Search panel ────────────────────────────────────────────────────
    const searchSidebar = document.querySelector(
      "[data-project-search-sidebar]"
    );
    const sidebarInert = searchSidebar?.hasAttribute("inert");
    this.log(
      `Search sidebar: exists=${!!searchSidebar}, inert=${sidebarInert}`
    );

    if (searchSidebar && !sidebarInert) {
      assign(
        searchSidebar.querySelector(".project-search-input"),
        "6a: Sidebar search input"
      );
      const deleteBtn = searchSidebar.querySelector(
        ".project-search-delete-btn"
      );
      if (deleteBtn && !deleteBtn.classList.contains("force-hide")) {
        assign(deleteBtn, "6a: Sidebar delete btn");
      }
      assign(
        searchSidebar.querySelector(".project-search-enter-btn"),
        "6a: Sidebar enter btn"
      );
      assign(
        searchSidebar.querySelector(".project-search-close-button"),
        "6a: Sidebar close btn"
      );
    }

    // ── (7) On-page search input ─────────────────────────────────────────────
    const pageSearchInput = null;
    this.log(
      `Page search input (#inputField1): exists=${!!pageSearchInput}, visible=${
        pageSearchInput ? this.isVisible(pageSearchInput) : "N/A"
      }`
    );
    if (pageSearchInput) {
      assign(pageSearchInput, "7: Page search input");
    }

    // ── (8) Ceremony toggle buttons ──────────────────────────────────────────
    const ceremonyButtons = document.querySelectorAll(".time-toggle button");
    this.log(`Found ${ceremonyButtons.length} ceremony toggle buttons`);
    ceremonyButtons.forEach((btn, i) => {
      assign(btn, `8: Ceremony btn ${i}`);
    });

    // ── (8a) Open ceremony contents ──────────────────────────────────────────
    const openCeremony = document.querySelector(
      ".showing, [data-ceremony].open, .ceremony-section.active"
    );
    this.log(
      `Open ceremony section: ${
        openCeremony ? this.describe(openCeremony) : "NONE"
      }`
    );

    if (openCeremony) {
      const innerEls = openCeremony.querySelectorAll(
        "a[href], button, input, select, textarea"
      );
      this.log(
        `  Found ${innerEls.length} focusable elements inside open ceremony`
      );
      innerEls.forEach((el) => {
        if (el.getAttribute("tabindex") !== "-1") {
          this.log(
            `  SKIPPED (already assigned): ${this.describe(
              el
            )} tabindex=${el.getAttribute("tabindex")}`
          );
          return;
        }
        assign(el, "8a: Ceremony content");
      });
    }

    // ── Summary ──────────────────────────────────────────────────────────────
    const elapsed = (performance.now() - t0).toFixed(1);
    this.log(`Assigned ${idx - 1} elements in ${elapsed}ms`);

    if (this.DEBUG && assignments.length > 0) {
      console.table(assignments);
    }

    // ── Sanity checks ────────────────────────────────────────────────────────
    this.runSanityChecks();

    this.groupEnd();
  }

  /**
   * Post-update checks to flag common problems.
   */
  runSanityChecks() {
    this.group("Sanity checks");

    // Check 1: Visible natively-focusable elements left at tabindex=-1
    const unmanaged = [];
    document
      .querySelectorAll("a[href], button, input, select, textarea")
      .forEach((el) => {
        const ti = el.getAttribute("tabindex");
        if (ti === "-1" && this.isVisible(el)) {
          unmanaged.push(el);
        }
      });

    if (unmanaged.length > 0) {
      this.warn(
        `${unmanaged.length} visible natively-focusable element(s) have tabindex="-1". ` +
          `These WON'T be in tab order but CAN still be focused by click or .focus() calls.`
      );
      if (unmanaged.length <= 20) {
        unmanaged.forEach((el) => {
          this.log(`  Unmanaged: ${this.describe(el)}`);
        });
      }
    } else {
      this.log("✓ No visible natively-focusable elements left unmanaged.");
    }

    // Check 2: autofocus attributes
    const autofocused = document.querySelectorAll("[autofocus]");
    if (autofocused.length > 0) {
      this.warn(
        `⚠️  Found ${autofocused.length} element(s) with 'autofocus' attribute!`
      );
      autofocused.forEach((el) =>
        this.log(`  Autofocus: ${this.describe(el)}`)
      );
    }

    // Check 3: Is anything currently focused that shouldn't be?
    const active = document.activeElement;
    if (
      active &&
      active !== document.body &&
      active !== document.documentElement
    ) {
      const ti = active.getAttribute("tabindex");
      this.log(`Currently focused: ${this.describe(active)} tabindex=${ti}`);
      if (ti === "-1") {
        this.warn(
          `⚠️  Active element has tabindex="-1" — focus is on an element outside the tab order!`
        );
      }
    }

    // Check 4: Duplicate tabindex values
    const seen = new Map();
    document
      .querySelectorAll('[tabindex]:not([tabindex="-1"])')
      .forEach((el) => {
        const val = el.getAttribute("tabindex");
        if (seen.has(val)) {
          this.warn(
            `Duplicate tabindex="${val}": ${this.describe(
              seen.get(val)
            )} AND ${this.describe(el)}`
          );
        }
        seen.set(val, el);
      });

    // Check 5: Look for scripts or event listeners that might call .focus()
    // We can't detect listeners, but we CAN check for inline onfocus/autofocus
    document.querySelectorAll("[onfocus]").forEach((el) => {
      this.warn(`⚠️  Element has inline onfocus handler: ${this.describe(el)}`);
    });

    this.groupEnd();
  }

  // ─── Focus styles ─────────────────────────────────────────────────────────

  addFocusStyles() {
    if (document.getElementById("tab-manager-styles")) return;
    const style = document.createElement("style");
    style.id = "tab-manager-styles";
    style.textContent = `
      *:focus                       { outline: none !important; }
      *:focus-visible               { box-shadow: 0 0 0 4px #b90072 inset !important;
                                      outline: none !important; border-radius: 4px; }
      a:focus-visible, button:focus-visible,
      input:focus-visible, select:focus-visible,
      textarea:focus-visible, [tabindex]:focus-visible
                                    { box-shadow: 0 0 0 4px #b90072 inset !important;
                                      outline: none !important; }
    `;
    document.head.appendChild(style);
  }
}

// ─── Initialise ─────────────────────────────────────────────────────────────

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.tabOrderManager = new TabOrderManager();
  });
} else {
  window.tabOrderManager = new TabOrderManager();
}

// ─── Public helpers ─────────────────────────────────────────────────────────

window.refreshTabOrder = () => window.tabOrderManager?.updateTabOrder();

window.testFocus = () => {
  const els = document.querySelectorAll('[tabindex]:not([tabindex="-1"])');
  console.table(
    Array.from(els).map((el) => ({
      tabindex: el.getAttribute("tabindex"),
      tag: el.tagName,
      id: el.id || "",
      classes:
        el.className?.toString().trim().split(/\s+/).slice(0, 3).join(" ") ||
        "",
      text: el.textContent?.trim().slice(0, 40) || "",
      visible: window.tabOrderManager?.isVisible(el),
    }))
  );
};

/**
 * Simulate tabbing through the entire order without moving focus.
 * Call window.simulateTabOrder() in the console.
 */
window.simulateTabOrder = () => {
  const els = Array.from(
    document.querySelectorAll('[tabindex]:not([tabindex="-1"])')
  ).sort(
    (a, b) =>
      parseInt(a.getAttribute("tabindex")) -
      parseInt(b.getAttribute("tabindex"))
  );
  console.log(`[TAB] Simulated tab order (${els.length} stops):`);
  els.forEach((el, i) => {
    const ti = el.getAttribute("tabindex");
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const text = el.textContent?.trim().slice(0, 50) || "";
    console.log(`  ${i + 1}. [tabindex=${ti}] <${tag}${id}> "${text}"`);
  });
};
