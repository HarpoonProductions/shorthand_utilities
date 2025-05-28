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
  console.log("🚀 DOM Content Loaded - Starting script initialization");

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

  // Add CSS for .dropbtn
  var dropbtnStyle = document.createElement("style");
  dropbtnStyle.id = "dropbtnStyles";
  dropbtnStyle.textContent = `
    .inner-dropdown .dropbtn {
      width: 100% !important;
      padding: 11px 21px !important;
      top: 111px !important;
    }
    
    .inner-dropdown .dropdown-content {
      top: 147px !important;
    }
    
    @media (max-width: 1099px) {
      .inner-dropdown .dropbtn {
        top: 85px !important;
      }
      
      .inner-dropdown .dropdown-content {
        top: 130px !important;
      }
    }
  `;

  if (!document.getElementById("dropbtnStyles")) {
    document.head.appendChild(dropbtnStyle);
  }

  // Update Search Placeholder
  const projectInput = document.querySelector(".Theme-ProjectInput");
  if (projectInput) {
    projectInput.setAttribute("placeholder", "Search Name");
    console.log("✅ Search placeholder updated");
  } else {
    console.warn("⚠️ Project input not found");
  }

  // accordion logic
  const accordions = document.querySelectorAll(".accordion");
  console.log(`📋 Found ${accordions.length} accordions`);

  accordions.forEach((accordion, index) => {
    accordion.classList.add("step-" + index);
    accordion.style.scrollMarginTop = "150px";
  });

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

      console.log("✅ Sentry section created and inserted");
    } else {
      console.warn("⚠️ Target element section-tVbkG6IJAz not found");
    }
  }

  // Call this function to create the sentry section
  createSentrySection();

  // Define ceremony time mappings - you'll need to adjust these based on your actual section IDs
  const ceremonyMappings = [
    {
      dropdownIndex: 0,
      allowedPrefixes: ["section-1100"],
      fadeOutSections: ["section-aIviY23ApG"],
    },
    {
      dropdownIndex: 1,
      allowedPrefixes: ["section-1430"],
      fadeOutSections: ["section-aIviY23ApG"],
    },
    {
      dropdownIndex: 2,
      allowedPrefixes: ["section-1030"],
      fadeOutSections: ["section-aIviY23ApG"], // Add specific fade-out sections if needed
    },
    {
      dropdownIndex: 3,
      allowedPrefixes: ["section-1345"],
      fadeOutSections: ["section-aIviY23ApG"],
    },
    {
      dropdownIndex: 4,
      allowedPrefixes: ["section-1645"],
      fadeOutSections: ["section-aIviY23ApG"],
    },
  ];

  console.log("🎯 Ceremony mappings configured:", ceremonyMappings);

  // FIXED: Setup individual intersection observers for each inner dropdown
  function setupIndividualDropdownObservers() {
    console.log("🔧 Setting up dropdown observers...");

    // Wait a bit for all elements to be in the DOM
    setTimeout(() => {
      const innerDropdowns = document.querySelectorAll(".inner-dropdown");
      const sections = document.querySelectorAll(".Theme-Section");

      console.log(
        `📊 Found ${innerDropdowns.length} dropdowns and ${sections.length} sections`
      );

      // Debug: log all dropdown elements
      innerDropdowns.forEach((dropdown, index) => {
        console.log(`🔻 Dropdown ${index}:`, dropdown);
      });

      if (innerDropdowns.length < 5) {
        console.error(
          `❌ Expected 5 dropdowns, found ${innerDropdowns.length}`
        );
        // Let's debug what dropdowns we have
        console.log(
          "🔍 All elements with 'dropdown' in class:",
          document.querySelectorAll('[class*="dropdown"]')
        );
        return;
      }

      // Style all dropdowns initially
      innerDropdowns.forEach((dropdown, index) => {
        dropdown.style.position = "fixed";
        dropdown.style.top = "20px";
        dropdown.style.right = "20px";
        dropdown.style.zIndex = "1000";
        dropdown.style.transition =
          "opacity 0.3s ease, pointer-events 0.3s ease";
        dropdown.style.opacity = "0";
        dropdown.style.pointerEvents = "none";
        dropdown.style.display = "flex";
        console.log(`✅ Styled dropdown ${index}`);
      });

      // Create a single observer that handles all dropdowns
      const observer = new IntersectionObserver(
        (entries) => {
          // Get all currently intersecting sections
          const intersectingSections = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target.id)
            .filter((id) => id); // Remove empty IDs

          if (intersectingSections.length > 0) {
            console.log("👁️ Intersecting sections:", intersectingSections);
          }

          // Update each dropdown based on current intersecting sections
          ceremonyMappings.forEach((ceremony) => {
            const dropdown = innerDropdowns[ceremony.dropdownIndex];
            if (!dropdown) {
              console.warn(`⚠️ Dropdown ${ceremony.dropdownIndex} not found`);
              return;
            }

            // Check if fade-out section is visible
            const shouldFadeOut = intersectingSections.some((sectionId) =>
              ceremony.fadeOutSections.includes(sectionId)
            );

            if (shouldFadeOut) {
              console.log(
                `🔴 Dropdown ${ceremony.dropdownIndex} hidden by fade-out section`
              );
              dropdown.style.opacity = "0";
              dropdown.style.pointerEvents = "none";
              return;
            }

            // Check if any allowed section is visible
            const shouldShow = intersectingSections.some((sectionId) =>
              ceremony.allowedPrefixes.some((prefix) =>
                sectionId.startsWith(prefix)
              )
            );

            if (shouldShow) {
              const triggeringSection = intersectingSections.find((sectionId) =>
                ceremony.allowedPrefixes.some((prefix) =>
                  sectionId.startsWith(prefix)
                )
              );
              console.log(
                `🟢 Dropdown ${ceremony.dropdownIndex} triggered by section: ${triggeringSection}`
              );
              dropdown.style.opacity = "1";
              dropdown.style.pointerEvents = "auto";
            } else {
              // If no allowed sections are intersecting, hide dropdown
              dropdown.style.opacity = "0";
              dropdown.style.pointerEvents = "none";
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "-100px 0px -50px 0px",
        }
      );

      // Observe all sections with the single observer
      sections.forEach((section) => {
        observer.observe(section);
      });

      console.log("✅ Dropdown observers setup complete");
    }, 500); // Wait 500ms for DOM to settle
  }

  // Alternative: If the timing issue persists, you can also try this more robust approach:
  function setupDropdownObserversWithRetry() {
    console.log("🔄 Starting dropdown observer setup with retry mechanism");
    let attempts = 0;
    const maxAttempts = 10;

    function trySetup() {
      const innerDropdowns = document.querySelectorAll(".inner-dropdown");

      console.log(
        `🔍 Attempt ${attempts + 1}: Found ${innerDropdowns.length} dropdowns`
      );

      if (innerDropdowns.length >= 5) {
        console.log("✅ All dropdowns found, setting up observers");
        setupIndividualDropdownObservers();
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(
          `⏳ Only found ${innerDropdowns.length} dropdowns, retrying in 200ms...`
        );
        setTimeout(trySetup, 200);
      } else {
        console.error("❌ Failed to find all dropdowns after maximum attempts");
        console.log(
          "🔍 Available dropdowns:",
          document.querySelectorAll('[class*="dropdown"]')
        );
      }
    }

    trySetup();
  }

  // Debug: Let's see what dropdowns are available right now
  setTimeout(() => {
    const allDropdowns = document.querySelectorAll('[class*="dropdown"]');
    const innerDropdowns = document.querySelectorAll(".inner-dropdown");
    console.log("🔍 DEBUG - All dropdown elements:", allDropdowns);
    console.log("🔍 DEBUG - Inner dropdown elements:", innerDropdowns);
    allDropdowns.forEach((el, i) =>
      console.log(`🔍 Dropdown ${i} classes:`, el.className)
    );
  }, 100);

  // Initialize dropdown observers with retry mechanism
  setupDropdownObserversWithRetry();

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
    console.log("🔍 Searching for:", t);
    const text = toTitleCase(t);
    console.log("🔍 Converted to title case:", text);
    const containers = document.querySelectorAll(
      ".sh-names, .sh-prizewinnernames"
    );
    if (!containers.length) {
      console.error("❌ Container .sh-names not found.");
      return;
    }

    console.log(`📋 Found ${containers.length} containers to search`);
    let matches = [];

    containers.forEach((container, containerIndex) => {
      console.log(`🔍 Searching container ${containerIndex}:`, container);
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
          console.log("✅ Found match in text:", textContent);
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

      console.log("📝 Updates for container:", updates.length);

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

        console.log("🗓️ Processing day section:", id, day);

        if (day && day[0]) {
          const daySection = document.querySelectorAll("[id^=" + day + "]");
          console.log("📅 Found day sections:", daySection.length);
          if (daySection && daySection.length) {
            daySection.forEach((section) => section.classList.add("showing"));

            daySection.forEach((section) => {
              const sec = section.querySelector(
                'section[class^="Theme-Section-Position"]'
              );
              if (sec) sec.classList.add("showing");
            });

            const dayBar = daySection[0].querySelector(".floating-day-bar");
            console.log("📊 Day bar found:", !!dayBar);
          }
        }
      });
    });

    console.log(`🎯 Total matches found: ${matches.length}`);
    if (matches.length > 0) {
      scrollToMatch(matches);
    }
  }

  function scrollToMatch(matches, yOffset = -300) {
    console.log("📜 Starting scroll to matches:", matches.length);
    let current = 0;

    const scroll = () => {
      const attemptScroll = () => {
        const yPosition =
          matches[current].getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        if (window.pageYOffset > 0 || yPosition > 0) {
          // Check if the page has likely scrolled or can scroll
          console.log(
            `📜 Scrolling to match ${current + 1} of ${matches.length}`
          );
          window.scrollTo({ top: yPosition, behavior: "smooth" });
          current = (current + 1) % matches.length;
          matches.length > 1 &&
            updateResultButtonText(current || matches.length, matches.length);
        } else {
          console.log("⏳ Waiting for page to be ready for scroll...");
          setTimeout(attemptScroll, 120); // Wait a bit more if page offset is still 0
        }
      };

      if (matches[current]) {
        setTimeout(attemptScroll, 100); // Initial delay before first attempt
      }
    };

    if (matches.length > 1) {
      console.log("🔘 Creating result button for multiple matches");
      createResultButton(1, matches.length, scroll); // Start from 1 for user clarity
    } else {
      console.log("✅ Only one match found, no need for result button.");

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
    console.log("🎯 Student name found in URL:", studentName);
    // Decode URI component in case the name is encoded
    scrollToAndHighlightText(decodeURIComponent(studentName));
  } else {
    console.log("ℹ️ No student name in URL parameters");
  }

  console.log("🎉 Script initialization complete");
});

// -------- above

function scrollToElementWithOffset(id) {
  console.log("scrolling");
  const element = document.getElementById(id);
  console.log(element);

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

// Simplified Tab Order Manager - Let browser handle tabbing
class TabOrderManager {
  constructor() {
    this.init();
  }

  init() {
    // Add Imperial focus styles
    this.addFocusStyles();

    // Initial tab order setup
    setTimeout(() => this.updateTabOrder(), 100);

    // Refresh when ceremony sections are toggled
    document.addEventListener("click", (e) => {
      if (e.target.closest(".time-toggle")) {
        setTimeout(() => this.updateTabOrder(), 350);
      }
    });

    // Log tab events for debugging
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        console.log("Tab pressed. Current focus:", document.activeElement);
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
        box-shadow: 0 0 0 4px #b90072 inset !important;
        outline: none !important;
        border-radius: 4px;
      }
      
      /* More specific selectors to ensure our styles win */
      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      [tabindex]:focus-visible {
        box-shadow: 0 0 0 4px #b90072 inset !important;
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  updateTabOrder() {
    console.log("=== Updating tab order ===");

    // Remove all tabindex attributes (except -1)
    document
      .querySelectorAll('[tabindex]:not([tabindex="-1"])')
      .forEach((el) => {
        el.removeAttribute("tabindex");
      });

    let tabIndex = 1; // Start at 1 instead of 0

    // 1. Imperial Logo
    const logo = document.querySelector(".Theme-Logo a");
    if (logo) {
      logo.setAttribute("tabindex", String(tabIndex++));
      console.log("Logo set to tabindex: 1");
    }

    // 2. Try to find ALL navigation links directly
    const allNavLinks = document.querySelectorAll(
      "#navigation a.Theme-NavigationLink, nav a.Theme-NavigationLink"
    );

    const newNavs = [];

    let memory;

    allNavLinks.forEach((link) => {
      if (
        !link.getAttribute("href").includes("memories-of-graduation-days-2025")
      ) {
        newNavs.push(link);
      } else {
        memory = link;
      }
    });

    newNavs.forEach((link) => {
      link.setAttribute("tabindex", String(tabIndex++));
      console.log(
        `Nav link "${link.textContent.trim()}" - tabindex ${tabIndex - 1}`
      );
    });

    // 3. Find Explore more span separately
    const exploreSpan = document.querySelector(
      "#navigation span.Theme-NavigationLink, nav span.Theme-NavigationLink"
    );
    if (exploreSpan && exploreSpan.textContent.trim() === "Explore more") {
      exploreSpan.setAttribute("tabindex", String(tabIndex++));
      console.log(`Explore more span - tabindex ${tabIndex - 1}`);

      // And its button
      const exploreBtn = exploreSpan.nextElementSibling;
      if (exploreBtn && exploreBtn.classList.contains("Navigation__button")) {
        exploreBtn.setAttribute("tabindex", String(tabIndex++));
        console.log(`Explore more button - tabindex ${tabIndex - 1}`);
      }
    }

    memory.setAttribute("tabindex", String(tabIndex++));

    // 4. Ceremony buttons
    const ceremonyButtons = document.querySelectorAll(".time-toggle button");
    console.log(`Found ${ceremonyButtons.length} ceremony buttons`);
    ceremonyButtons.forEach((button, i) => {
      button.setAttribute("tabindex", String(tabIndex++));
      console.log(`Ceremony button ${i} - tabindex ${tabIndex - 1}`);
    });

    // 5. Content in expanded ceremony sections
    const showingSections = document.querySelectorAll(".showing");
    showingSections.forEach((section) => {
      const links = section.querySelectorAll("a[href]");
      const buttons = section.querySelectorAll("button");
      const inputs = section.querySelectorAll("input, select, textarea");

      [...links, ...buttons, ...inputs].forEach((el) => {
        if (this.isVisible(el) && !el.hasAttribute("tabindex")) {
          el.setAttribute("tabindex", String(tabIndex++));
        }
      });
    });

    // Log all elements with tabindex
    const allTabbable = document.querySelectorAll(
      '[tabindex]:not([tabindex="-1"])'
    );
    console.log(`Total tabbable elements: ${allTabbable.length}`);

    // Log first 10 for debugging
    console.log("Tabbable elements:");
    allTabbable.forEach((el, i) => {
      if (i < 10) {
        const text =
          el.textContent?.trim().substring(0, 30) ||
          el.getAttribute("aria-label") ||
          el.tagName;
        console.log(
          `  ${el.getAttribute("tabindex")}: ${el.tagName} - "${text}"`
        );
      }
    });
  }

  isVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.tabOrderManager = new TabOrderManager();
  });
} else {
  window.tabOrderManager = new TabOrderManager();
}

// Manual refresh
window.refreshTabOrder = function () {
  if (window.tabOrderManager) {
    window.tabOrderManager.updateTabOrder();
  }
};

// Test function to check what's focusable
window.testFocus = function () {
  const elements = document.querySelectorAll('[tabindex="2"]');
  console.log('Elements with tabindex="2":', elements.length);
  if (elements.length > 0) {
    console.log('First element with tabindex="2":', elements[0]);
    console.log("Can it be focused?");
    elements[0].focus();
    console.log("Active element after focus:", document.activeElement);
  }
};
