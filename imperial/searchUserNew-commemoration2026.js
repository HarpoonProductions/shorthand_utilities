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

// ── Plausible tracking ──────────────────────────────────────────────────────
// EDITION tags every event so ceremonies can be compared like-for-like.
// Change this one value for each new event (and keep it the same in the
// share-tracking script).
window.IMP_EDITION = window.IMP_EDITION || "commemoration-2026";

window.impTrack =
  window.impTrack ||
  function (name, props) {
    try {
      if (typeof window.plausible === "function") {
        window.plausible(name, {
          props: Object.assign({ edition: window.IMP_EDITION }, props || {}),
        });
      }
    } catch (e) {
      // Analytics must never break the guide.
    }
  };

// ── Search tracking ─────────────────────────────────────────────────────────
// "Search Used"          a name search was run
// "Search No Results"    nothing found (where = sidebar | page)
// "Search Result Opened" name found on the ceremony page (matches = 1 | 2-5 | 6+)
// The searched name is never sent.
var impPendingSearch = null;
var impLastSearchAt = 0;
var impFiredAt = {};
var IMP_NO_RESULT_WAIT_MS = 6000;

function impThrottle(key, ms) {
  var now = Date.now();
  if (impFiredAt[key] && now - impFiredAt[key] < ms) return false;
  impFiredAt[key] = now;
  return true;
}

function impBucket(n) {
  return n <= 1 ? "1" : n <= 5 ? "2-5" : "6+";
}

function impHasSearchTerm() {
  return [".project-search-input", "#inputField1"].some(function (sel) {
    var el = document.querySelector(sel);
    return !!(el && el.value && el.value.trim().length > 0);
  });
}

function impSearchSubmitted() {
  if (!impHasSearchTerm()) return;
  // Enter key and button click can both fire for one search.
  if (!impThrottle("Search Used", 1500)) return;
  impLastSearchAt = Date.now();
  window.impTrack("Search Used");
  clearTimeout(impPendingSearch);
  // If no results list ever appears, count it as a search with no results.
  impPendingSearch = setTimeout(function () {
    impPendingSearch = null;
    if (impThrottle("Search No Results", 1500)) {
      window.impTrack("Search No Results", { where: "sidebar" });
    }
  }, IMP_NO_RESULT_WAIT_MS);
}

function impSearchResultsShown(node) {
  var count = node.querySelectorAll(".project-story-list-item").length;
  if (count > 0) {
    clearTimeout(impPendingSearch);
    impPendingSearch = null;
    // Safety net: if the submit hooks never saw this search, count it here.
    if (impLastSearchAt === 0 && impThrottle("Search Used", 1500)) {
      impLastSearchAt = Date.now();
      window.impTrack("Search Used");
    }
    return;
  }
  // Empty list: give Shorthand a moment to fill it before calling it a miss.
  setTimeout(function () {
    if (node.querySelectorAll(".project-story-list-item").length === 0) {
      clearTimeout(impPendingSearch);
      impPendingSearch = null;
      if (impThrottle("Search No Results", 1500)) {
        window.impTrack("Search No Results", { where: "sidebar" });
      }
    }
  }, 1000);
}

// Arrival on a ceremony page via search (shared links carry name_index and
// are counted by the share-tracking script instead).
function impTrackSearchArrival(found) {
  var params = new URLSearchParams(window.location.search);
  if (params.has("name_index")) return;
  if (found > 0) {
    window.impTrack("Search Result Opened", { matches: impBucket(found) });
  } else {
    window.impTrack("Search No Results", { where: "page" });
  }
}

document.addEventListener(
  "click",
  function (e) {
    if (
      e.target &&
      e.target.closest &&
      e.target.closest(".project-search-enter-btn, #submitButton")
    ) {
      impSearchSubmitted();
    }
  },
  true,
);

document.addEventListener(
  "keydown",
  function (e) {
    if (
      e.key === "Enter" &&
      e.target &&
      e.target.matches &&
      e.target.matches(".project-search-input, #inputField1")
    ) {
      impSearchSubmitted();
    }
  },
  true,
);

function updateResultButtonText(current, total) {
  var button = document.getElementById("result-inner");
  if (button) {
    button.textContent = `Result ${current} of ${total}`;
  } else {
    console.error("Result button not found.");
  }
}

function createResultButton(current, total, callback) {
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

  if (!document.getElementById("resultButtonStyles")) {
    document.head.appendChild(style);
  }

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

  closeButton.addEventListener("click", function () {
    document.body.classList.add("close-results");
  });

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

  container.appendChild(closeButton);
  container.appendChild(button);
  document.body.appendChild(container);
}

function extractMatch(baseString, matchString) {
  const escaped = matchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "i");
  const match = baseString.match(regex);
  return match ? match[0] : "";
}

function processListItem(li) {
  const highlightSpan = li.querySelector(".search-input-highlight");
  const link = li.querySelector(".project-image-link");

  if (highlightSpan && link) {
    const result = document.querySelectorAll(
      ".project-search-results, .search-results-found-list, .project-search-results-container",
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
        "https://graduation-programmes.imperial.ac.uk/graduation-days-2026/index.html" ||
      link.href ===
        "https://graduation-programmes.imperial.ac.uk/8e35fcf0-b0e7-4d37-a6d3-2ccb74b7801e/index.html" ||
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

const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        if (
          node.nodeType === 1 &&
          (node.matches(".project-search-results") ||
            node.matches(".search-results-found-list"))
        ) {
          const listItems = node.querySelectorAll(".project-story-list-item");

          impSearchResultsShown(node);

          listItems.forEach(processListItem);
        }
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver(callback);

  const config = { childList: true, subtree: true };

  const targetNode = document.querySelector(".project-search-sideBar");

  if (targetNode) {
    observer.observe(targetNode, config);
  } else {
    console.error(
      "The target element `.project-search-sideBar` was not found.",
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

  const projectInput = document.querySelector(".Theme-ProjectInput");

  if (projectInput) {
    projectInput.setAttribute("placeholder", "Search name");
  }

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

  function createSentrySection() {
    const targetElement =
      document.getElementById("section-tVbkG6IJAz") ||
      document.getElementById("section-OcWb6x3SxS") ||
      document.getElementById("section-de8T3FMcx4") ||
      document.getElementById("section-ZvbXBHs5lv");

    if (targetElement) {
      const sentrySection = document.createElement("div");
      sentrySection.id = "section-1430-sentry";
      sentrySection.className = "Theme-Section";
      sentrySection.style.height = "0px";
      sentrySection.style.width = "0px";
      sentrySection.style.overflow = "hidden";
      sentrySection.style.visibility = "hidden";
      sentrySection.style.position = "relative";

      targetElement.parentNode.insertBefore(sentrySection, targetElement);

      console.log("Sentry section created and inserted");
    } else {
      console.warn("Target element section-tVbkG6IJAz not found");
    }
  }

  createSentrySection();

  const allowedSectionPrefixes = [
    "section-1430",
    "section-1100",
    "section-1030",
    "section-1345",
    "section-1630",
    "section-1645",
  ];

  function setupDropdownVisibilityObserver() {
    const sections = document.querySelectorAll(".Theme-Section");

    const observer = new IntersectionObserver(
      (entries) => {
        const fadeOutSection = entries.find(
          (entry) =>
            entry.isIntersecting && entry.target.id === "section-actX6a4Fex",
        );

        if (fadeOutSection) {
          console.log(
            `🔴 Dropdown hidden by section: ${fadeOutSection.target.id}`,
          );

          consolidatedDropdown.style.opacity = "0";
          consolidatedDropdown.style.pointerEvents = "none";
          return;
        }

        let triggeringSection = null;

        const hasAllowedSection = entries.some((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const isAllowed = allowedSectionPrefixes.some(
              (prefix) =>
                entry.target.id.startsWith(prefix) &&
                !entry.target.id.includes("Imperial"),
            );

            if (isAllowed) {
              triggeringSection = entry.target.id;
            }

            return isAllowed;
          }

          return false;
        });

        if (hasAllowedSection) {
          console.log(`🟢 Dropdown triggered by section: ${triggeringSection}`);

          consolidatedDropdown.style.opacity = "1";
          consolidatedDropdown.style.pointerEvents = "auto";
        } else {
          const allowedSectionsInView = Array.from(sections).some((section) => {
            if (!section.id) return false;

            const hasAllowedId = allowedSectionPrefixes.some((prefix) =>
              section.id.startsWith(prefix),
            );

            if (!hasAllowedId) return false;

            const rect = section.getBoundingClientRect();

            return rect.top < window.innerHeight && rect.bottom > 0;
          });

          if (!allowedSectionsInView) {
            consolidatedDropdown.style.opacity = "0";
            consolidatedDropdown.style.pointerEvents = "none";
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px -50px 0px",
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  function updateConsolidatedDropdown() {
    const openAccordions = Array.from(accordions).filter(
      (accordion) => accordion.nextElementSibling.style.display === "inline",
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

            const onclickAttr = newLink.getAttribute("onclick");
            let ceremonyPrefix = "default";

            if (onclickAttr) {
              const match = onclickAttr.match(
                /scrollToElementWithOffset\('(\d+)/,
              );

              if (match && match[1]) {
                ceremonyPrefix = match[1];
              }
            }

            const sectionClass = `ceremony-${ceremonyPrefix}`;
            newLink.classList.add("ceremony-link", sectionClass);

            newLink.style.display = "none";

            dropdownContent.appendChild(newLink);
          });
        }
      });

      consolidatedDropdown.style.display = "flex";
      consolidatedDropdown.style.opacity = "1";
      consolidatedDropdown.style.pointerEvents = "auto";

      setupDropdownVisibilityObserver();
    } else {
      consolidatedDropdown.style.display = "none";
    }
  }

  function setupDropdownVisibilityObserver() {
    const sections = document.querySelectorAll(".Theme-Section");

    const observer = new IntersectionObserver(
      (entries) => {
        const fadeOutSection = Array.from(sections).find((section) => {
          if (section.id === "section-aIviY23ApG") {
            const rect = section.getBoundingClientRect();

            return rect.top < window.innerHeight && rect.bottom > 0;
          }

          return false;
        });

        if (fadeOutSection) {
          console.log(`🔴 Dropdown hidden by fade-out section`);

          consolidatedDropdown.style.opacity = "0";
          consolidatedDropdown.style.pointerEvents = "none";
          return;
        }

        const visiblePrefixes = new Set();

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

        const ceremonyLinks =
          consolidatedDropdown.querySelectorAll(".ceremony-link");

        ceremonyLinks.forEach((link) => {
          link.style.display = "none";
        });

        if (visiblePrefixes.size > 0) {
          consolidatedDropdown.style.opacity = "1";
          consolidatedDropdown.style.pointerEvents = "auto";

          visiblePrefixes.forEach((sectionPrefix) => {
            const sectionClass = `ceremony-${sectionPrefix.replace(
              "section-",
              "",
            )}`;

            const relevantLinks = consolidatedDropdown.querySelectorAll(
              `.${sectionClass}`,
            );

            relevantLinks.forEach((link) => {
              link.style.display = "block";
            });
          });

          console.log(
            `🟢 Dropdown showing links for sections: ${Array.from(
              visiblePrefixes,
            ).join(", ")}`,
          );
        } else {
          consolidatedDropdown.style.opacity = "0";
          consolidatedDropdown.style.pointerEvents = "none";
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px -50px 0px",
      },
    );

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
      "#section-1030-Faculty-of-Engineering-Ceremony-1-WrcFIYzqK1",
      "#section-1330-Faculty-of-Engineering-Ceremony-2-9j7l1TdaZz",
      "#section-1630-Faculty-of-Medicine-Centre-for-Languages-Culture-and-Communication-and-Centre-for-Higher-Education-Research-and-Scholarship-z1h9a7lTHe",
      "#section-1030-Faculty-of-Natural-Sciences-uT2608HY0e",
      "#section-1345-Imperial-Business-School-Ceremony-1-cLHwJu8Bsp",
      "#section-1645-Imperial-Business-School-Ceremony-2-txtPpMMyld",
"#section-1000-Faculty-of-Engineering-QHw5zoWKpT",
"#section-1345-Faculty-of-Medicine-HHMWJqG6Lv",
"#section-1700-Faculty-of-Natural-Sciences-and-Imperial-Business-School-yMJdxFIrHB",
    ];

    const blacklistSelector = BLACKLIST.join(",");

    const containers = [
      ...document.querySelectorAll(".sh-names, .sh-prizewinnernames"),
    ].filter((el) => !el.closest(blacklistSelector));

    if (!containers.length) {
      console.error("Container .sh-names not found.");
      return 0;
    }

    let matches = [];

    containers.forEach((container) => {
      let updates = [];

      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false,
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

          updates.push({ oldNode: node, frag });
        }
      }

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
                'section[class^="Theme-Section-Position"]',
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

    /*
     * Search results can cause several panels/accordions to open.
     * Wait for those layout changes to settle before calculating
     * where the first result actually sits on the page.
     */
    if (matches.length > 0) {
      waitForSearchLayoutToSettle(() => {
        scrollToMatch(matches);
      });
    }

    return matches.length;
  }

  /*
   * Wait until opening all matching search-result content
   * has stopped changing the height of the page.
   *
   * This prevents the scroll position being calculated while
   * other matching accordions are still expanding.
   */
  function waitForSearchLayoutToSettle(callback) {
    let lastHeight = document.documentElement.scrollHeight;
    let stableFor = 0;
    let elapsed = 0;

    const interval = 100;
    const requiredStableTime = 800;
    const maximumWait = 4000;

    const timer = setInterval(() => {
      const currentHeight = document.documentElement.scrollHeight;

      elapsed += interval;

      if (currentHeight === lastHeight) {
        stableFor += interval;
      } else {
        lastHeight = currentHeight;
        stableFor = 0;
      }

      if (
        stableFor >= requiredStableTime ||
        elapsed >= maximumWait
      ) {
        clearInterval(timer);

        /*
         * Give the browser two additional animation frames
         * to finish its final reflow before scrolling.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            callback();
          });
        });
      }
    }, interval);
  }

function scrollToMatch(matches, yOffset = -650) {    let current = 0;

    const scroll = () => {
      const attemptScroll = () => {
        const match = matches[current];

        if (!match) return;

        /*
         * Calculate this only after the layout has settled.
         */
        const yPosition =
          match.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        if (window.pageYOffset > 0 || yPosition > 0) {
          window.scrollTo({
            top: Math.max(0, yPosition),
            behavior: "smooth",
          });

          /*
           * Check the position again after the smooth scroll.
           *
           * With yOffset = -400, the matched name should end
           * up approximately 400px below the top of the viewport.
           *
           * If anything has shifted during the scroll, correct
           * the position using the element's current coordinates.
           */
          setTimeout(() => {
  const rect = match.getBoundingClientRect();

  const minimumTop = 450;

  // If the result has moved too high,
  // bring it back down into clear view.
  if (rect.top < minimumTop) {
    const correction =
      minimumTop - rect.top;

    window.scrollBy({
      top: -correction,
      behavior: "auto",
    });
  }
}, 700);

          current =
            (current + 1) % matches.length;

          matches.length > 1 &&
            updateResultButtonText(
              current || matches.length,
              matches.length,
            );
        } else {
          setTimeout(attemptScroll, 120);
        }
      };

      if (matches[current]) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(attemptScroll, 100);
          });
        });
      }
    };

    if (matches.length > 1) {
      createResultButton(
        1,
        matches.length,
        scroll,
      );
    } else {
      console.log(
        "Only one match found, no need for result button.",
      );

      var style =
        document.createElement("style");

      style.id = "closeResults";

      style.textContent = `
      body.close-results .found-text-piece {
        background-color: transparent !important;
      }
    `;

      if (
        !document.getElementById(
          "closeResults",
        )
      ) {
        document.head.appendChild(style);
      }

      document.addEventListener(
        "click",
        function () {
          document.body.classList.add(
            "close-results",
          );
        },
      );
    }

    scroll();
  }

  // Get the 'student_name' query parameter
  const urlParams =
    new URLSearchParams(
      window.location.search,
    );

  const studentName =
    urlParams.get("student_name");

  if (studentName) {
    // Decode URI component in case the name is encoded
    const found =
      scrollToAndHighlightText(
        decodeURIComponent(studentName),
      );

    impTrackSearchArrival(found);
  }
});

function scrollToElementWithOffset(id) {
  const element =
    document.getElementById(id);

  if (!element) {
    console.error(
      "Element not found:",
      id,
    );

    return;
  }

  // Find the closest panel ancestor
  const panel =
    element.closest(".panel");

  if (panel) {
    // Check if the panel is hidden and show it if needed
    if (
      panel.style.display !== "inline"
    ) {
      console.log(
        "Panel was hidden, showing it:",
        panel.id,
      );

      panel.style.display = "inline";
    }
  }

  const elementPosition =
    element.getBoundingClientRect().top +
    window.pageYOffset;

  // Determine the offset based on screen width
  let offset;

  const screenWidth =
    window.innerWidth;

  if (screenWidth <= 899) {
    offset = 200;
  } else if (
    screenWidth >= 900 &&
    screenWidth <= 1099
  ) {
    offset = 200;
  } else {
    offset = 250;
  }

  console.log(
    "Screen width:",
    screenWidth,
    "Offset:",
    offset,
  );

  const offsetPosition =
    elementPosition - offset;

  console.log(
    "Offset position:",
    offsetPosition,
  );

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

setTimeout(() => {
  window.scrollToElementWithOffset =
    scrollToElementWithOffset;
}, 500);

(function () {
  const SELECTOR =
    '[data-project-search-sidebar="true"]';

  const ACTIVE_CLASS =
    "project-search--isActive";

  const POLL_INTERVAL_MS = 200;
  const TIMEOUT_MS = 30000;

  function applyInert(el) {
    if (
      el.classList.contains(
        ACTIVE_CLASS,
      )
    ) {
      el.removeAttribute("inert");
    } else {
      el.setAttribute("inert", "");
    }
  }

  function init(el) {
    // Set initial state
    applyInert(el);

    // Watch for class changes
    const observer =
      new MutationObserver(() =>
        applyInert(el),
      );

    observer.observe(el, {
      attributeFilter: ["class"],
    });
  }

  // Poll for element existence
  const start = performance.now();

  const interval =
    setInterval(() => {
      const el =
        document.querySelector(
          SELECTOR,
        );

      if (el) {
        clearInterval(interval);

        init(el);

        return;
      }

      if (
        performance.now() - start >=
        TIMEOUT_MS
      ) {
        clearInterval(interval);

        console.warn(
          "[search-inert] Timed out waiting for",
          SELECTOR,
        );
      }
    }, POLL_INTERVAL_MS);
})();

(function () {
  "use strict";

  // Get the elements
  const input =
    document.querySelector(
      ".Theme-ProjectInput.project-search-input",
    );

  const button =
    document.querySelector(
      ".project-search-delete-btn",
    );

  const statusText =
    document.getElementById(
      "status-text",
    );

  if (!input || !button) {
    console.error(
      "Required elements not found",
    );

    if (statusText) {
      statusText.textContent =
        "Error: Elements not found";
    }

    return;
  }

  // Function to update button visibility
  function updateButtonVisibility() {
    if (input.value.trim() === "") {
      button.classList.add(
        "force-hide",
      );

      if (statusText) {
        statusText.textContent =
          "Input empty - button hidden";
      }
    } else {
      button.classList.remove(
        "force-hide",
      );

      if (statusText) {
        statusText.textContent =
          "Input has content - button visible";
      }
    }
  }

  // Set initial state
  updateButtonVisibility();

  // Create MutationObserver to watch for attribute changes
  const observer =
    new MutationObserver(
      (mutations) => {
        mutations.forEach(
          (mutation) => {
            if (
              mutation.type ===
                "attributes" &&
              mutation.attributeName ===
                "value"
            ) {
              updateButtonVisibility();

              console.log(
                "Value attribute changed via mutation",
              );
            }
          },
        );
      },
    );

  // Configure and start observing
  observer.observe(input, {
    attributes: true,
    attributeFilter: ["value"],
  });

  // Listen for input events (handles user typing)
  input.addEventListener(
    "input",
    () => {
      updateButtonVisibility();

      console.log(
        "Input event fired",
      );
    },
  );

  // Listen for change events (handles some programmatic changes)
  input.addEventListener(
    "change",
    () => {
      updateButtonVisibility();

      console.log(
        "Change event fired",
      );
    },
  );

  // Watch for programmatic value changes using a different approach
  // Store the original descriptor
  const descriptor =
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    );

  const originalSet =
    descriptor.set;

  // Only override if we haven't already
  if (
    originalSet &&
    !input.hasAttribute(
      "data-observer-attached",
    )
  ) {
    input.setAttribute(
      "data-observer-attached",
      "true",
    );

    // Create a new setter that calls our update function
    Object.defineProperty(
      input,
      "value",
      {
        get: descriptor.get,

        set: function (newValue) {
          // Call the original setter with the input element as context
          originalSet.call(
            this,
            newValue,
          );

          // Then update visibility
          updateButtonVisibility();

          console.log(
            "Value set programmatically:",
            newValue,
          );
        },

        enumerable:
          descriptor.enumerable,

        configurable:
          descriptor.configurable,
      },
    );
  }

  // Clear button functionality
  button.addEventListener(
    "click",
    () => {
      input.value = "";

      updateButtonVisibility();

      input.focus();
    },
  );

  console.log(
    "MutationObserver script initialized successfully",
  );
})();

class TabOrderManager {
  constructor() {
    this.refreshTimer = null;
    this.bodyObserver = null;
    this.init();
  }

  init() {
    this.addFocusStyles();

    this.waitForHeader(() => {
      this.updateTabOrder();
      this.attachObservers();
    });
  }

  /**
   * Wait until the nav has rendered with actual links before running.
   * Prevents the partial first-run that puts the input at tabindex=1.
   */
  waitForHeader(cb, attempts = 0) {
    const navLink =
      document.querySelector(
        "#navigation .Theme-NavigationLink",
      );

    if (
      navLink &&
      navLink.getBoundingClientRect().width > 0
    ) {
      cb();
    } else if (attempts > 60) {
      // 60 × 200ms = 12s — give up and run anyway
      console.warn(
        "[TabOrderManager] Header never appeared, running anyway.",
      );

      cb();
    } else {
      setTimeout(
        () =>
          this.waitForHeader(
            cb,
            attempts + 1,
          ),
        200,
      );
    }
  }

  attachObservers() {
    this.bodyObserver =
      new MutationObserver(() =>
        this.scheduleRefresh(400),
      );

    this.bodyObserver.observe(
      document.body,
      {
        childList: true,
        subtree: false,
      },
    );

    const nav =
      document.querySelector(
        "#navigation",
      );

    if (nav) {
      new MutationObserver(() =>
        this.scheduleRefresh(200),
      ).observe(nav, {
        attributes: true,
        subtree: true,
        attributeFilter: [
          "aria-expanded",
          "style",
          "class",
        ],
      });
    }

    document.addEventListener(
      "click",
      (e) => {
        if (
          e.target.closest(
            ".time-toggle, .accordion, .Navigation__button, .custom-dropdown, .project-search-button, .project-search-close-button",
          )
        ) {
          this.scheduleRefresh(350);
        }
      },
    );

    document.addEventListener(
      "keydown",
      (e) => {
        if (
          (e.key === "Enter" ||
            e.key === " ") &&
          e.target.closest(
            ".Navigation__button, .time-toggle button, .project-search-button",
          )
        ) {
          this.scheduleRefresh(350);
        }
      },
    );
  }

  scheduleRefresh(delay = 150) {
    clearTimeout(
      this.refreshTimer,
    );

    this.refreshTimer =
      setTimeout(
        () =>
          this.updateTabOrder(),
        delay,
      );
  }

  isVisible(el) {
    if (!el) return false;

    let node = el;

    while (
      node &&
      node !==
        document.documentElement
    ) {
      const s =
        window.getComputedStyle(
          node,
        );

      if (
        s.display === "none" ||
        s.visibility === "hidden" ||
        s.opacity === "0"
      ) {
        return false;
      }

      node = node.parentElement;
    }

    const r =
      el.getBoundingClientRect();

    return (
      r.width > 0 &&
      r.height > 0
    );
  }

  updateTabOrder() {
    document
      .querySelectorAll(
        "a[href], button, input, select, textarea, [tabindex], .popup-close",
      )
      .forEach((el) =>
        el.setAttribute(
          "tabindex",
          "-1",
        ),
      );

    const assignments = [];
    let idx = 1;

    const assign = (
      el,
      label,
    ) => {
      if (
        el &&
        this.isVisible(el)
      ) {
        // el.setAttribute("tabindex", String(idx));
        el.setAttribute(
          "tabindex",
          String(0),
        );

        const tag =
          el.tagName.toLowerCase();

        const id = el.id
          ? `#${el.id}`
          : "";

        const text =
          el.textContent
            ?.trim()
            .slice(0, 40) || "";

        assignments.push({
          // order: idx,
          order: 0,
          label,
          element: `<${tag}${id}> "${text}"`,
        });

        idx++;

        return true;
      }

      return false;
    };

    // (1) Logo
    assign(
      document.querySelector(
        ".Project-Header--left .Theme-Logo a",
      ),
      "Logo",
    );

    // (2)–(5) Navigation
    const navItems =
      document.querySelectorAll(
        "#navigation > .Navigation__itemList > .Navigation__item",
      );

    navItems.forEach((li) => {
      const link =
        li.querySelector(
          ":scope > a.Theme-NavigationLink",
        );

      const button =
        li.querySelector(
          ":scope > button.Theme-NavigationLink",
        );

      if (
        link &&
        this.isVisible(link)
      ) {
        assign(
          link,
          `Nav: ${link.textContent
            .trim()
            .slice(0, 30)}`,
        );
      } else if (
        button &&
        this.isVisible(button)
      ) {
        assign(
          button,
          `Nav: ${button.textContent
            .trim()
            .slice(0, 30)}`,
        );

        if (
          button.getAttribute(
            "aria-expanded",
          ) === "true"
        ) {
          const dropdown =
            li.querySelector(
              ".custom-dropdown",
            ) ||
            li.querySelector(
              ".Navigation__subMenu",
            );

          if (
            dropdown &&
            this.isVisible(
              dropdown,
            )
          ) {
            dropdown
              .querySelectorAll(
                "a[href], button",
              )
              .forEach(
                (child) =>
                  assign(
                    child,
                    `Dropdown: ${child.textContent
                      .trim()
                      .slice(
                        0,
                        30,
                      )}`,
                  ),
              );
          }
        }
      }
    });

    // (6) Search icon
    assign(
      document.querySelector(
        ".project-search-button",
      ),
      "Search icon",
    );

    // (6a) Search panel (if open)
    const searchSidebar =
      document.querySelector(
        "[data-project-search-sidebar]",
      );

    if (
      searchSidebar &&
      !searchSidebar.hasAttribute(
        "inert",
      )
    ) {
      assign(
        searchSidebar.querySelector(
          ".project-search-input",
        ),
        "Sidebar: input",
      );

      const deleteBtn =
        searchSidebar.querySelector(
          ".project-search-delete-btn",
        );

      if (
        deleteBtn &&
        !deleteBtn.classList.contains(
          "force-hide",
        )
      ) {
        assign(
          deleteBtn,
          "Sidebar: clear",
        );
      }

      assign(
        searchSidebar.querySelector(
          ".project-search-enter-btn",
        ),
        "Sidebar: submit",
      );

      assign(
        searchSidebar.querySelector(
          ".project-search-close-button",
        ),
        "Sidebar: close",
      );
    }

    // (7) On-page search input
    const pageSearchInput =
      document.querySelector(
        "#inputField1",
      );

    if (pageSearchInput) {
      assign(
        pageSearchInput,
        "Page search input",
      );
    }

    // (7a) On-page search input button
    const pageSearchInputButton =
      document.querySelector(
        "#submitButton",
      );

    if (
      pageSearchInputButton
    ) {
      assign(
        pageSearchInputButton,
        "Page search input",
      );
    }

    // (8) Ceremony toggle buttons
    document
      .querySelectorAll(
        ".time-toggle button",
      )
      .forEach((btn) => {
        assign(
          btn,
          `Ceremony btn: ${btn.textContent
            .trim()
            .slice(0, 20)}`,
        );
      });

    // (8a) Open ceremony contents
    const openCeremony =
      document.querySelectorAll(
        "[id^=section].showing",
      );

    if (
      openCeremony &&
      openCeremony.length
    ) {
      openCeremony.forEach(
        (ceremony) => {
          ceremony
            .querySelectorAll(
              "a[href], button, input, select, textarea, [tabindex], .popup-close",
            )
            .forEach((el) => {
              if (
                el.classList.contains(
                  "popup-close",
                )
              ) {
                el.setAttribute(
                  "tabindex",
                  String(0),
                );
              }

              console.log(
                "logging",
                el,
                el.getAttribute(
                  "tabindex",
                ),
                el.getAttribute(
                  "tabindex",
                ) !== "-1",
              );

              if (
                el.getAttribute(
                  "tabindex",
                ) !== "-1"
              ) {
                return;
              }

              const text =
                el.textContent
                  ?.trim()
                  .slice(
                    0,
                    30,
                  ) ||
                el.tagName.toLowerCase();

              assign(
                el,
                `Ceremony: ${text}`,
              );
            });
        },
      );
    }

    const endingTabs =
      document.querySelectorAll(
        "#section-Dv3Qll5WJf a, #section-SA9tmPclR9 a, #section-TsKpPrdNAq a",
      );

    endingTabs.forEach(
      (el) => {
        if (
          el.getAttribute(
            "tabindex",
          ) !== "-1"
        ) {
          return;
        }

        const text =
          el.textContent
            ?.trim()
            .slice(0, 30) ||
          el.tagName.toLowerCase();

        assign(
          el,
          `${text}`,
        );
      },
    );

    console.table(
      assignments,
    );
  }

  addFocusStyles() {
    if (
      document.getElementById(
        "tab-manager-styles",
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style",
      );

    style.id =
      "tab-manager-styles";

    style.textContent = `
      *:focus {
        outline: none !important;
      }

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

    document.head.appendChild(
      style,
    );
  }
}

// ─── Initialise ─────────────────────────────────────────────────────────────

function hasPageMarker(
  expected,
) {
  const el =
    document.querySelector(
      'meta[name="app-page"]',
    );

  return (
    !!el &&
    el.content === expected
  );
}

if (
  hasPageMarker(
    "ceremony-order",
  )
) {
  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        window.tabOrderManager =
          new TabOrderManager();
      },
    );
  } else {
    window.tabOrderManager =
      new TabOrderManager();
  }

  window.refreshTabOrder =
    () =>
      window.tabOrderManager?.updateTabOrder();
}
