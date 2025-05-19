function updateResultButtonText(current, total) {
  var button = document.getElementById("resultButton");
  if (button) {
    // Check if the button exists
    button.textContent = `Result ${current} of ${total}`; // Update the button text
  } else {
    console.error("Result button not found.");
  }
}

function createResultButton(current, total, callback) {
  var button = document.createElement("button");
  button.id = "resultButton"; // Added an ID for easy targeting
  button.textContent = `Result ${current} of ${total}`;
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "1000";
  button.style.padding = "10px 20px";
  button.style.borderRadius = "5px";
  button.style.border = "none";
  button.style.backgroundColor = "#007BFF";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

  button.addEventListener("click", function () {
    if (typeof callback === "function") {
      callback();
    }
  });

  document.body.appendChild(button);
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
  // Update Search Placeholder
  const projectInput = document.querySelector(".Theme-ProjectInput");
  if (projectInput) projectInput.setAttribute("placeholder", "Search Name");

  const togglePanel = document.querySelector(".sh-chapter + .sh-toggle");

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
  document.body.appendChild(consolidatedDropdown);

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

            const section = daySection.forEach((section) =>
              section
                .querySelector('section[class^="Theme-Section-Position"]')
                .classList.add("showing")
            );

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
