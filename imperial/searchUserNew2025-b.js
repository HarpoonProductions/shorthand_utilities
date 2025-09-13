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

// Simplified Tab Order Manager - Let browser handle tabbing
// Accessible Tab Order Manager for new nav structure (2 dropdowns)
class TabOrderManager {
  constructor() {
    this.nav = {
      ceremony: null,
      explore: null,
      logo: null,
    };
    this.boundOutsideClick = this.onDocumentClick.bind(this);
    this.init();
  }

  init() {
    // Focus styles
    this.addFocusStyles();

    // Setup nav accessibility & listeners
    this.setupNavAccessibility();

    // Initial tab order
    setTimeout(() => this.updateTabOrder(), 100);

    // Refresh when ceremony sections are toggled
    document.addEventListener("click", (e) => {
      if (e.target.closest(".time-toggle")) {
        setTimeout(() => this.updateTabOrder(), 350);
      }
    });

    // Log tab presses
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        console.log("Tab pressed. Current focus:", document.activeElement);
      }
    });
  }

  // ---------- NAV DISCOVERY & A11Y WIRING ----------

  setupNavAccessibility() {
    // Logo
    this.nav.logo = document.querySelector(".Theme-Logo a") || null;

    // Find the top-level nav list
    const topList = document.querySelector(".Theme-Navigation-ItemList");
    if (!topList) return;

    // Find the two dropdowns by their internal structures
    const hasMenus = Array.from(
      topList.querySelectorAll(":scope > li.Navigation__item.hasMenu")
    );

    // Ceremony dropdown = has .custom-dropdown
    const ceremonyLi =
      hasMenus.find((li) => li.querySelector(".custom-dropdown")) || null;
    if (ceremonyLi) {
      const trigger =
        ceremonyLi.querySelector(":scope > a.Theme-NavigationLink") || null; // anchor labelled "Ceremony guides"
      const button =
        ceremonyLi.querySelector(":scope > .Navigation__button") || null; // caret (has pointer-events: none in your DOM)
      const menu =
        ceremonyLi.querySelector(":scope > .custom-dropdown") || null; // custom <div> menu
      const items = menu
        ? Array.from(menu.querySelectorAll(":scope > div"))
        : [];

      this.nav.ceremony = {
        root: ceremonyLi,
        trigger,
        button,
        menu,
        items,
        type: "custom",
      };
      this.wireMenu(this.nav.ceremony);
    }

    // Explore dropdown = has <ul.Navigation__subMenu>
    const exploreLi =
      hasMenus.find((li) => li.querySelector(".Navigation__subMenu")) || null;
    if (exploreLi) {
      const trigger =
        exploreLi.querySelector(":scope > span.Theme-NavigationLink") || null; // span labelled "Explore more"
      const button =
        exploreLi.querySelector(":scope > .Navigation__button") || null;
      const menu =
        exploreLi.querySelector(":scope > .Navigation__subMenu") || null; // <ul>
      const items = menu
        ? Array.from(menu.querySelectorAll("a.Theme-NavigationLink"))
        : [];

      this.nav.explore = {
        root: exploreLi,
        trigger,
        button,
        menu,
        items,
        type: "ul",
      };
      this.wireMenu(this.nav.explore);
    }

    // Recalculate on resize (layout can hide/show menus responsively)
    window.addEventListener("resize", () => this.updateTabOrder(), {
      passive: true,
    });

    // Observe attribute changes like aria-expanded to keep tabindex in sync
    const observer = new MutationObserver(() => this.updateTabOrder());
    [this.nav.ceremony?.button, this.nav.explore?.button]
      .filter(Boolean)
      .forEach((btn) =>
        observer.observe(btn, {
          attributes: true,
          attributeFilter: ["aria-expanded"],
        })
      );
  }

  wireMenu(menuSpec) {
    const { trigger, button, menu, items, type } = menuSpec;
    if (!menu) return;

    // Menu roles
    if (type === "custom") {
      // custom <div> menu — make it behave like a menu
      menu.setAttribute("role", "menu");
      items.forEach((div) => {
        div.setAttribute("role", "menuitem");
        div.setAttribute("tabindex", "-1"); // only focusable when open
      });
    } else {
      // <ul> menu — ensure roles on container (items are links)
      menu.setAttribute("role", "menu");
      Array.from(menu.children).forEach((li) =>
        li.setAttribute("role", "none")
      );
      items.forEach((a) => a.setAttribute("role", "menuitem"));
    }

    // Trigger roles
    if (trigger) {
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute(
        "aria-expanded",
        this.isMenuOpen(menuSpec) ? "true" : "false"
      );
      trigger.setAttribute("role", "button");

      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMenu(menuSpec, !this.isMenuOpen(menuSpec));
      });

      trigger.addEventListener("keydown", (e) => {
        const openKeys = ["Enter", " ", "ArrowDown", "ArrowUp"];
        if (openKeys.includes(e.key)) {
          e.preventDefault();
          if (!this.isMenuOpen(menuSpec)) this.toggleMenu(menuSpec, true);
          // Focus first/last item based on key
          const targetItem =
            e.key === "ArrowUp"
              ? this.getLastItem(menuSpec)
              : this.getFirstItem(menuSpec);
          targetItem?.focus();
        }
        if (e.key === "Escape") {
          this.toggleMenu(menuSpec, false);
          trigger.focus();
        }
      });
    }

    // Some themes use the caret button; allow it if it’s clickable
    if (button) {
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute(
        "aria-expanded",
        this.isMenuOpen(menuSpec) ? "true" : "false"
      );
      button.addEventListener("click", (e) => {
        // Some markup had pointer-events: none; this will no-op if not clickable
        e.preventDefault();
        this.toggleMenu(menuSpec, !this.isMenuOpen(menuSpec));
      });
      button.addEventListener("keydown", (e) => {
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          this.toggleMenu(menuSpec, !this.isMenuOpen(menuSpec));
        }
      });
    }

    // Menu keyboard nav
    menu.addEventListener("keydown", (e) => {
      const enabledItems = this.getEnabledItems(menuSpec);
      if (!enabledItems.length) return;

      const currentIndex = enabledItems.indexOf(document.activeElement);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIndex =
            (currentIndex + 1 + enabledItems.length) % enabledItems.length;
          enabledItems[nextIndex].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIndex =
            (currentIndex - 1 + enabledItems.length) % enabledItems.length;
          enabledItems[nextIndex].focus();
          break;
        case "Home":
          e.preventDefault();
          enabledItems[0].focus();
          break;
        case "End":
          e.preventDefault();
          enabledItems[enabledItems.length - 1].focus();
          break;
        case "Escape":
          e.preventDefault();
          this.toggleMenu(menuSpec, false);
          (menuSpec.trigger || menuSpec.button)?.focus();
          break;
        case "Enter":
        case " ":
          // Activate item
          if (document.activeElement && menu.contains(document.activeElement)) {
            e.preventDefault();
            if (menuSpec.type === "custom") {
              // dispatch a click on the div menu item
              document.activeElement.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
              );
              this.toggleMenu(menuSpec, false);
              (menuSpec.trigger || menuSpec.button)?.focus();
            } else {
              // anchors just click through
              document.activeElement.click();
            }
          }
          break;
        default:
          break;
      }
    });

    // Close on outside click
    document.addEventListener("click", this.boundOutsideClick);
  }

  onDocumentClick(e) {
    // Close any open menu if clicking outside
    ["ceremony", "explore"].forEach((key) => {
      const spec = this.nav[key];
      if (!spec) return;
      const { root, menu, trigger, button } = spec;
      const target = e.target;
      if (this.isMenuOpen(spec) && root && !root.contains(target)) {
        this.toggleMenu(spec, false);
        // Do not steal focus here
      }
    });
  }

  isMenuOpen(menuSpec) {
    if (!menuSpec || !menuSpec.menu) return false;
    // Prefer aria-expanded if available
    const expandedFromBtn = menuSpec.button?.getAttribute("aria-expanded");
    const expandedFromTrigger = menuSpec.trigger?.getAttribute("aria-expanded");
    const aria = expandedFromBtn ?? expandedFromTrigger;
    if (aria != null) return aria === "true";

    // Fallback to display/style check for custom menu
    if (menuSpec.type === "custom") {
      const cs = window.getComputedStyle(menuSpec.menu);
      return cs.display !== "none" && cs.visibility !== "hidden";
    }

    // As a fallback assume closed
    return false;
  }

  toggleMenu(menuSpec, open) {
    if (!menuSpec || !menuSpec.menu) return;

    // Update visual state
    if (menuSpec.type === "custom") {
      // Explicitly control the custom <div> menu
      menuSpec.menu.style.display = open ? "block" : "none";
    }
    // Update ARIA
    if (menuSpec.button)
      menuSpec.button.setAttribute("aria-expanded", open ? "true" : "false");
    if (menuSpec.trigger)
      menuSpec.trigger.setAttribute("aria-expanded", open ? "true" : "false");

    // Update items' tabindex based on open state
    this.setMenuItemsTabbability(menuSpec, open);

    // Re-sequence numeric tabindexes so tab order remains sane
    setTimeout(() => this.updateTabOrder(), 0);
  }

  getEnabledItems(menuSpec) {
    if (!menuSpec?.items) return [];
    return menuSpec.items.filter(
      (el) => this.isVisible(el) && el.getAttribute("tabindex") !== "-1"
    );
  }

  getFirstItem(menuSpec) {
    const enabled = this.getEnabledItems(menuSpec);
    return enabled[0] || null;
  }

  getLastItem(menuSpec) {
    const enabled = this.getEnabledItems(menuSpec);
    return enabled[enabled.length - 1] || null;
  }

  setMenuItemsTabbability(menuSpec, open) {
    if (!menuSpec?.items) return;
    if (menuSpec.type === "custom") {
      menuSpec.items.forEach((div) =>
        div.setAttribute("tabindex", open ? "0" : "-1")
      );
    } else {
      // anchors: when closed, remove tabindex so they’re skipped; when open, allow sequential numbering later
      menuSpec.items.forEach((a) => {
        if (open) {
          a.removeAttribute("tabindex");
        } else {
          a.setAttribute("tabindex", "-1");
        }
      });
    }
  }

  // ---------- TAB ORDERING ----------

  updateTabOrder() {
    console.log("=== Updating tab order ===");

    // 0) Remove all positive tabindex (keep -1)
    document
      .querySelectorAll('[tabindex]:not([tabindex="-1"])')
      .forEach((el) => el.removeAttribute("tabindex"));

    let tabIndex = 1;

    // 1) Logo
    if (this.nav.logo) {
      this.nav.logo.setAttribute("tabindex", String(tabIndex++));
      console.log("Logo set to tabindex: 1");
    }

    // 2) Top-level items in DOM order
    const topList = document.querySelector(".Theme-Navigation-ItemList");
    if (topList) {
      const topLis = Array.from(
        topList.querySelectorAll(":scope > li.Navigation__item")
      );

      topLis.forEach((li) => {
        // a) Simple links: li > a
        const link = li.querySelector(":scope > a.Theme-NavigationLink");
        // b) Explore: li > span + button
        const explore = li === this.nav.explore?.root ? this.nav.explore : null;
        // c) Ceremony: li > a (trigger) + (non-clickable) button + custom menu
        const ceremony =
          li === this.nav.ceremony?.root ? this.nav.ceremony : null;

        if (ceremony) {
          // Ceremony trigger first
          if (ceremony.trigger) {
            ceremony.trigger.setAttribute("tabindex", String(tabIndex++));
            console.log(`Ceremony guides (trigger) - tabindex ${tabIndex - 1}`);
          }
          // Button next (if focusable)
          if (ceremony.button) {
            ceremony.button.setAttribute("tabindex", String(tabIndex++));
            console.log(`Ceremony guides (button) - tabindex ${tabIndex - 1}`);
          }
        } else if (explore) {
          // Explore label (span) first
          if (explore.trigger) {
            explore.trigger.setAttribute("tabindex", String(tabIndex++));
            console.log(`Explore more (label) - tabindex ${tabIndex - 1}`);
          }
          // Then the caret button
          if (explore.button) {
            explore.button.setAttribute("tabindex", String(tabIndex++));
            console.log(`Explore more (button) - tabindex ${tabIndex - 1}`);
          }
        } else if (link) {
          // Regular top-level link (e.g., "Commemoration Day 2025", "Memories…")
          // If you want to push "Memories…" last no matter what, you could skip here and set after; DOM already has it last.
          link.setAttribute("tabindex", String(tabIndex++));
          console.log(
            `Top link "${(link.textContent || "").trim()}" - tabindex ${
              tabIndex - 1
            }`
          );
        }
      });
    }

    // 3) Submenu items WHEN OPEN
    // Explore submenu (<ul> with <a>s)
    if (this.nav.explore && this.isMenuOpen(this.nav.explore)) {
      this.nav.explore.items.forEach((a) => {
        if (this.isVisible(a)) {
          a.setAttribute("tabindex", String(tabIndex++));
          console.log(
            `Explore item "${(a.textContent || "").trim()}" - tabindex ${
              tabIndex - 1
            }`
          );
        }
      });
    } else if (this.nav.explore) {
      // Ensure closed items are skipped
      this.nav.explore.items.forEach((a) => a.setAttribute("tabindex", "-1"));
    }

    // Ceremony custom dropdown (<div> items)
    if (this.nav.ceremony && this.isMenuOpen(this.nav.ceremony)) {
      this.nav.ceremony.items.forEach((div, i) => {
        if (this.isVisible(div)) {
          // Already 0 when open; assign numeric order to maintain your sequence
          div.setAttribute("tabindex", String(tabIndex++));
          console.log(
            `Ceremony item ${i} "${(
              div.textContent || ""
            ).trim()}" - tabindex ${tabIndex - 1}`
          );
        }
      });
    } else if (this.nav.ceremony) {
      this.nav.ceremony.items.forEach((div) =>
        div.setAttribute("tabindex", "-1")
      );
    }

    // 4) Ceremony buttons in the page content
    const ceremonyButtons = document.querySelectorAll(".time-toggle button");
    console.log(`Found ${ceremonyButtons.length} ceremony buttons`);
    ceremonyButtons.forEach((button, i) => {
      button.setAttribute("tabindex", String(tabIndex++));
      console.log(`Ceremony button ${i} - tabindex ${tabIndex - 1}`);
    });

    // 5) Focusable content in expanded sections
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

    // Diagnostics
    const allTabbable = document.querySelectorAll(
      '[tabindex]:not([tabindex="-1"])'
    );
    console.log(`Total tabbable elements: ${allTabbable.length}`);
    console.log("First 10 tabbable:");
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

  // ---------- UTILS ----------

  addFocusStyles() {
    const style = document.createElement("style");
    style.textContent = `
      *:focus { outline: none !important; }
      *:focus-visible {
        box-shadow: 0 0 0 4px #b90072 inset !important;
        outline: none !important;
        border-radius: 4px;
      }
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

// Test function to check a specific tabindex
window.testFocus = function (n = 2) {
  const elements = document.querySelectorAll(`[tabindex="${n}"]`);
  console.log(`Elements with tabindex="${n}":`, elements.length);
  if (elements.length > 0) {
    console.log(`First element with tabindex="${n}":`, elements[0]);
    elements[0].focus();
    console.log("Active element after focus:", document.activeElement);
  }
};
