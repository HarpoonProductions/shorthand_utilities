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

// Function to modify the href of .project-image-link within the li elements
function processListItem(li) {
  const highlightSpan = li.querySelector(".search-input-highlight");
  const link = li.querySelector(".project-image-link");
  if (highlightSpan && link) {
    const searchTerm = encodeURIComponent(highlightSpan.innerText);
    const url = new URL(link.href);
    url.searchParams.set("search_term", searchTerm);
    link.href = url.href;
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
  const matches = [];

  (function (d) {
    var qsa = "querySelectorAll";
    var buttons = d[qsa](".toggle-button");
    var sections = d[qsa](".sh-names");
    buttons.forEach((button, i) => {
      button.addEventListener("click", function () {
        sections[i].classList.toggle("show");
      });
    });
  })(document);

  function scrollToAndHighlightText(text) {
    const containers = document.querySelectorAll(".Theme-Section");
    if (!containers.length) {
      console.error("Containers not found.");
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
        if (textContent.includes(text)) {
          const frag = document.createDocumentFragment();
          const parts = textContent.split(text);
          const endIndex = parts.length - 1;

          parts.forEach((part, index) => {
            frag.appendChild(document.createTextNode(part));
            if (index !== endIndex) {
              const span = document.createElement("span");
              span.style.backgroundColor = "#ffffff1D";
              span.textContent = text;
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
        update.oldNode.parentNode.replaceChild(update.frag, update.oldNode);
        container.classList.add("show");
      });
    });

    if (matches.length > 0) {
      scrollToMatch(matches);
    }
  }

  function scrollToMatch(matches, yOffset = -100) {
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
          setTimeout(attemptScroll, 80); // Wait a bit more if page offset is still 0
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

  // Get the 'search_term' query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search_term");

  if (searchTerm) {
    // Decode URI component in case the name is encoded
    scrollToAndHighlightText(decodeURIComponent(searchTerm));
  }
});
