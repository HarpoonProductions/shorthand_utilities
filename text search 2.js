function processListItem(li) {
  const highlightSpan = li.querySelector(".search-input-highlight");
  const link = li.querySelector(".project-image-link");

  if (highlightSpan && link) {
    const nodes = Array.from(highlightSpan.parentNode.childNodes);
    const spanIndex = nodes.indexOf(highlightSpan);
    let beforeText = "",
      afterText = "";

    // Check for previous text node
    if (spanIndex > 0 && nodes[spanIndex - 1].nodeType === Node.TEXT_NODE) {
      // Extract and process the previous text node's content
      const prevText = nodes[spanIndex - 1].textContent
        .trim()
        .replace(/\n/g, " ")
        .split(" ");
      if (prevText.length > 0) {
        beforeText = prevText[prevText.length - 1]; // Last word before the highlighted span
      }
    }

    // Check for next text node
    if (
      spanIndex + 1 < nodes.length &&
      nodes[spanIndex + 1].nodeType === Node.TEXT_NODE
    ) {
      // Extract and process the next text node's content
      const nextText = nodes[spanIndex + 1].textContent
        .trim()
        .replace(/\n/g, " ")
        .split(" ");
      if (nextText.length > 0) {
        afterText = nextText[0]; // First word after the highlighted span
      }
    }

    const studentName = encodeURIComponent(highlightSpan.textContent);
    const before = encodeURIComponent(beforeText);
    const after = encodeURIComponent(afterText);
    const url = new URL(link.href);

    // Set the search parameters
    url.searchParams.set("student_name", studentName);
    url.searchParams.set("before", before);
    url.searchParams.set("after", after);
    link.href = url.href;
  }
}

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
  function scrollToAndHighlightText(mainText, beforeText, afterText) {
    const container = document.querySelector(".sh-names");
    if (!container) {
      console.error("Container .sh-names not found.");
      return;
    }

    let previousNode = null;
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes(mainText)) {
        const nextNode = walker.nextNode(); // Move to next to check the after text
        if (
          (previousNode && previousNode.nodeValue.includes(beforeText)) ||
          (nextNode && nextNode.nodeValue.includes(afterText))
        ) {
          const span = document.createElement("span");
          span.style.backgroundColor = "yellow"; // Change color as needed
          const textContent = node.nodeValue;
          const startIndex = textContent.indexOf(mainText);
          const endIndex = startIndex + mainText.length;

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

          const yOffset = -100;
          const yPosition =
            span.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: yPosition, behavior: "smooth" });
          return;
        }
        walker.previousNode(); // Move back to current if not matching
      }
      previousNode = node;
    }
    console.log("Text not found with the given context.");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const mainText = decodeURIComponent(urlParams.get("student_name"));
  const beforeText = decodeURIComponent(urlParams.get("before"));
  const afterText = decodeURIComponent(urlParams.get("after"));

  if (mainText) {
    scrollToAndHighlightText(mainText, beforeText, afterText);
  }
});
