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
    const studentName = encodeURIComponent(highlightSpan.innerText);
    const url = new URL(link.href);
    url.searchParams.set("student_name", studentName);
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
    const containers = document.querySelectorAll(".sh-names");
    if (!containers || !containers.length) {
      console.error("Container .sh-names not found.");
      return;
    }

    containers.forEach((container, i) => {
      // Find all text nodes within the container
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue.includes(text)) {
          node.parentNode.closest(".sh-names").classList.add("show");

          const span = document.createElement("span");
          span.style.backgroundColor = "yellow"; // Change color as needed
          const textContent = node.nodeValue;
          const startIndex = textContent.indexOf(text);
          const endIndex = startIndex + text.length;

          // Before the match
          node.nodeValue = textContent.substring(0, startIndex);
          // The match
          span.textContent = textContent.substring(startIndex, endIndex);
          // After the match
          const afterText = document.createTextNode(
            textContent.substring(endIndex)
          );

          // Insert the new nodes
          node.parentNode.insertBefore(span, node.nextSibling);
          node.parentNode.insertBefore(afterText, span.nextSibling);

          matches.push(span);

          return;
        }
      }
    });

    const yOffset = -100;
    let current = 1;

    if (matches.length > 1) {
      createResultButton(current, matches.length, () => {
        const index = current === matches.length ? 0 : current;
        const yPosition =
          matches[index].getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: yPosition, behavior: "smooth" });
        current = index + 1;
        updateResultButtonText(index + 1, matches.length);
      });
    }

    const yPosition =
      matches[0].getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: yPosition, behavior: "smooth" });
  }

  // Get the 'student_name' query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const studentName = urlParams.get("student_name");

  if (studentName) {
    // Decode URI component in case the name is encoded
    scrollToAndHighlightText(decodeURIComponent(studentName));
  }
});