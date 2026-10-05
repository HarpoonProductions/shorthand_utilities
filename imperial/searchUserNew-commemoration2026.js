<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>searchUserNew-graduation2026.js</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      background: #fff;
      color: #111;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      tab-size: 2;
    }
  </style>
</head>
<body>
<pre>```
/* (function () {
  const origTo = window.scrollTo;
  const origInto = Element.prototype.scrollIntoView;

  window.scrollTo = function (...args) {
    console.warn(&quot;[trace] window.scrollTo&quot;, args);
    console.trace();
    return origTo.apply(this, args);
  };

  Element.prototype.scrollIntoView = function (...args) {
    console.warn(&quot;[trace] scrollIntoView on&quot;, this, args);
    console.trace();
    return origInto.apply(this, args);
  };
})();
*/

function updateResultButtonText(current, total) {
  var button = document.getElementById(&quot;result-inner&quot;);
  if (button) {
    // Check if the button exists
    button.textContent = `Result ${current} of ${total}`; // Update the button text
  } else {
    console.error(&quot;Result button not found.&quot;);
  }
}

function createResultButton(current, total, callback) {
  // Create and append CSS styles
  var style = document.createElement(&quot;style&quot;);
  style.id = &quot;resultButtonStyles&quot;;
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

  // Only append if styles don&#x27;t already exist
  if (!document.getElementById(&quot;resultButtonStyles&quot;)) {
    document.head.appendChild(style);
  }
  // Create container div to hold both buttons
  var container = document.createElement(&quot;div&quot;);
  container.id = &quot;resultButtonContainer&quot;;
  container.style.position = &quot;fixed&quot;;
  container.style.bottom = &quot;20px&quot;;
  container.style.right = &quot;20px&quot;;
  container.style.zIndex = &quot;1000&quot;;
  container.style.display = &quot;flex&quot;;
  container.style.flexDirection = &quot;column&quot;;
  container.style.alignItems = &quot;flex-end&quot;;
  container.style.gap = &quot;5px&quot;;

  // Create close button
  var closeButton = document.createElement(&quot;button&quot;);
  closeButton.id = &quot;closeResultButton&quot;;
  closeButton.innerHTML = `
    &lt;svg width=&quot;16&quot; height=&quot;16&quot; viewBox=&quot;0 0 16 16&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;&gt;
      &lt;path d=&quot;M12 4L4 12M4 4L12 12&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/&gt;
    &lt;/svg&gt;
  `;
  closeButton.style.width = &quot;30px&quot;;
  closeButton.style.height = &quot;30px&quot;;
  closeButton.style.borderRadius = &quot;50%&quot;;
  closeButton.style.border = &quot;none&quot;;
  closeButton.style.backgroundColor = &quot;#dc3545&quot;;
  closeButton.style.color = &quot;white&quot;;
  closeButton.style.cursor = &quot;pointer&quot;;
  closeButton.style.fontSize = &quot;18px&quot;;
  closeButton.style.fontWeight = &quot;bold&quot;;
  closeButton.style.display = &quot;flex&quot;;
  closeButton.style.alignItems = &quot;center&quot;;
  closeButton.style.justifyContent = &quot;center&quot;;
  closeButton.style.boxShadow = &quot;0 2px 5px rgba(0, 0, 0, 0.2)&quot;;

  // Add click event to close button
  closeButton.addEventListener(&quot;click&quot;, function () {
    document.body.classList.add(&quot;close-results&quot;);
  });

  // Create main result button
  var button = document.createElement(&quot;button&quot;);
  button.id = &quot;resultButton&quot;;
  button.innerHTML = `
    &lt;span id=&quot;result-inner&quot;&gt;Result ${current} of ${total}&lt;/span&gt;
    &lt;svg width=&quot;16&quot; height=&quot;16&quot; viewBox=&quot;0 0 16 16&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; style=&quot;margin-left: 8px;&quot;&gt;
      &lt;path d=&quot;M4 6L8 10L12 6&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/&gt;
    &lt;/svg&gt;
  `;
  button.style.padding = &quot;10px 7px&quot;;
  button.style.borderRadius = &quot;5px&quot;;
  button.style.border = &quot;none&quot;;
  button.style.backgroundColor = &quot;#007BFF&quot;;
  button.style.color = &quot;white&quot;;
  button.style.cursor = &quot;pointer&quot;;
  button.style.boxShadow = &quot;0 2px 5px rgba(0, 0, 0, 0.2)&quot;;
  button.style.display = &quot;flex&quot;;
  button.style.alignItems = &quot;center&quot;;
  button.style.justifyContent = &quot;center&quot;;

  button.addEventListener(&quot;click&quot;, function () {
    if (typeof callback === &quot;function&quot;) {
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
  const escaped = matchString.replace(/[.*+?^${}()|[\]\\]/g, &quot;\\$&amp;&quot;);

  // Create case-insensitive regex with word boundaries
  const regex = new RegExp(`\\b${escaped}\\b`, &quot;i&quot;);

  // Find and return the match (preserving original case from base string)
  const match = baseString.match(regex);
  return match ? match[0] : &quot;&quot;;
}

// Function to modify the href of .project-image-link within the li elements
function processListItem(li) {
  const highlightSpan = li.querySelector(&quot;.search-input-highlight&quot;);
  const link = li.querySelector(&quot;.project-image-link&quot;);
  if (highlightSpan &amp;&amp; link) {
    const result = document.querySelectorAll(
      &quot;.project-search-results, .search-results-found-list, .project-search-results-container&quot;,
    );
    result.forEach((result) =&gt; (result.style.display = &quot;none&quot;));
    if (
      link.href ===
        &quot;https://graduation-programmes.imperial.ac.uk/graduation-days-2025/index.html&quot; ||
      link.href ===
        &quot;https://graduation-programmes.imperial.ac.uk/7f547269-7abd-44bc-94bd-c0cae69b796e/index.html&quot; ||
      link.href ===
        &quot;https://graduation-programmes.imperial.ac.uk/commemoration-day-2025/index.html&quot; ||
      link.href ===
      &quot;https://graduation-programmes.imperial.ac.uk/graduation-days-2026/index.html&quot; ||
      link.href ===
      &quot;https://graduation-programmes.imperial.ac.uk/8e35fcf0-b0e7-4d37-a6d3-2ccb74b7801e/index.html&quot; ||
      link.href ===
        &quot;https://graduation-programmes.imperial.ac.uk/commemoration-day-2026/index.html&quot; ||
      link.href === &quot;index.html&quot;
    ) {
      const input = document.querySelector(&quot;.project-search-input&quot;);
      const name = input ? input.value : &quot;&quot;;
      const studentName = encodeURIComponent(name);
      const url = new URL(link.href);
      url.searchParams.set(&quot;student_name&quot;, studentName);
      window.location.replace(url.href);
    }
  }
}

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === &quot;childList&quot;) {
      for (const node of mutation.addedNodes) {
        // Check if the added node is a ul with class &#x27;.project-search-results&#x27;
        if (
          node.nodeType === 1 &amp;&amp;
          (node.matches(&quot;.project-search-results&quot;) ||
            node.matches(&quot;.search-results-found-list&quot;))
        ) {
          const listItems = node.querySelectorAll(&quot;.project-story-list-item&quot;);
          listItems.forEach(processListItem);
        }
      }
    }
  }
};

// Optionally, disconnect the observer at some point using observer.disconnect();

document.addEventListener(&quot;DOMContentLoaded&quot;, function () {
  // Create a MutationObserver instance
  const observer = new MutationObserver(callback);

  // Configuration of the observer
  const config = { childList: true, subtree: true };

  // Select the target node (the div with class .project-search-sideBar)
  const targetNode = document.querySelector(&quot;.project-search-sideBar&quot;);

  // Check if targetNode exists to avoid errors
  if (targetNode) {
    observer.observe(targetNode, config);
  } else {
    console.error(
      &quot;The target element `.project-search-sideBar` was not found.&quot;,
    );
  }

  var style = document.createElement(&quot;style&quot;);
  style.id = &quot;searchTitle&quot;;
  style.textContent = `
    @media (min-width: 900px) {
      .project-search-button::after {
          content: &quot;Search name:&quot; !important;
      }
    }
  `;

  if (!document.getElementById(&quot;searchTitle&quot;)) {
    document.head.appendChild(style);
  }

  // Update Search Placeholder
  const projectInput = document.querySelector(&quot;.Theme-ProjectInput&quot;);
  if (projectInput) projectInput.setAttribute(&quot;placeholder&quot;, &quot;Search name&quot;);

  // accordion logic
  const accordions = document.querySelectorAll(&quot;.accordion&quot;);
  accordions.forEach((accordion, index) =&gt; {
    accordion.classList.add(&quot;step-&quot; + index);
    accordion.style.scrollMarginTop = &quot;150px&quot;;
  });
  const innerDropdowns = document.querySelectorAll(&quot;.inner-dropdown&quot;);

  const consolidatedDropdown = document.createElement(&quot;div&quot;);
  consolidatedDropdown.className = &quot;consolidated-dropdown&quot;;
  consolidatedDropdown.style.display = &quot;none&quot;;
  consolidatedDropdown.style.transition =
    &quot;opacity 0.3s ease, pointer-events 0.3s ease&quot;;
  consolidatedDropdown.style.opacity = &quot;1&quot;;
  consolidatedDropdown.style.pointerEvents = &quot;auto&quot;;
  document.body.appendChild(consolidatedDropdown);

  // Create and insert sentry section before the target element
  function createSentrySection() {
    const targetElement =
      document.getElementById(&quot;section-tVbkG6IJAz&quot;) ||
      document.getElementById(&quot;section-OcWb6x3SxS&quot;) ||
      document.getElementById(&quot;section-de8T3FMcx4&quot;) ||
      document.getElementById(&quot;section-ZvbXBHs5lv&quot;);

    if (targetElement) {
      const sentrySection = document.createElement(&quot;div&quot;);
      sentrySection.id = &quot;section-1430-sentry&quot;; // Uses allowed prefix
      sentrySection.className = &quot;Theme-Section&quot;; // Matches observer selector
      sentrySection.style.height = &quot;0px&quot;;
      sentrySection.style.width = &quot;0px&quot;;
      sentrySection.style.overflow = &quot;hidden&quot;;
      sentrySection.style.visibility = &quot;hidden&quot;; // Completely invisible
      sentrySection.style.position = &quot;relative&quot;; // Doesn&#x27;t affect layout

      // Insert before the target element
      targetElement.parentNode.insertBefore(sentrySection, targetElement);

      console.log(&quot;Sentry section created and inserted&quot;);
    } else {
      console.warn(&quot;Target element section-tVbkG6IJAz not found&quot;);
    }
  }

  // Call this function to create the sentry section
  createSentrySection();

  // Intersection Observer for dropdown visibility
  const allowedSectionPrefixes = [
    &quot;section-1430&quot;,
    &quot;section-1100&quot;,
    &quot;section-1030&quot;,
    &quot;section-1345&quot;,
    &quot;section-1630&quot;,
    &quot;section-1645&quot;,
  ];

  function setupDropdownVisibilityObserver() {
    // Get all sections on the page
    const sections = document.querySelectorAll(&quot;.Theme-Section&quot;);

    const observer = new IntersectionObserver(
      (entries) =&gt; {
        // Check if the fade-out section is in view
        const fadeOutSection = entries.find(
          (entry) =&gt;
            entry.isIntersecting &amp;&amp; entry.target.id === &quot;section-actX6a4Fex&quot;,
        );

        if (fadeOutSection) {
          // Hide dropdown - fade-out section is in view
          console.log(
            `🔴 Dropdown hidden by section: ${fadeOutSection.target.id}`,
          );
          consolidatedDropdown.style.opacity = &quot;0&quot;;
          consolidatedDropdown.style.pointerEvents = &quot;none&quot;;
          return; // Exit early, don&#x27;t check for allowed sections
        }

        // Check if any currently intersecting section has an allowed ID prefix
        let triggeringSection = null;
        const hasAllowedSection = entries.some((entry) =&gt; {
          if (entry.isIntersecting &amp;&amp; entry.target.id) {
            const isAllowed = allowedSectionPrefixes.some(
              (prefix) =&gt;
                entry.target.id.startsWith(prefix) &amp;&amp;
                !entry.target.id.includes(&quot;Imperial&quot;),
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
          consolidatedDropdown.style.opacity = &quot;1&quot;;
          consolidatedDropdown.style.pointerEvents = &quot;auto&quot;;
        } else {
          // Check if any allowed sections are currently in viewport
          const allowedSectionsInView = Array.from(sections).some((section) =&gt; {
            if (!section.id) return false;
            const hasAllowedId = allowedSectionPrefixes.some((prefix) =&gt;
              section.id.startsWith(prefix),
            );
            if (!hasAllowedId) return false;

            const rect = section.getBoundingClientRect();
            return rect.top &lt; window.innerHeight &amp;&amp; rect.bottom &gt; 0;
          });

          if (!allowedSectionsInView) {
            // Hide dropdown - not over any allowed section
            consolidatedDropdown.style.opacity = &quot;0&quot;;
            consolidatedDropdown.style.pointerEvents = &quot;none&quot;;
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: &quot;-100px 0px -50px 0px&quot;,
      },
    );

    // Observe all sections (including the new sentry section)
    sections.forEach((section) =&gt; {
      observer.observe(section);
    });
  }

  function updateConsolidatedDropdown() {
    const openAccordions = Array.from(accordions).filter(
      (accordion) =&gt; accordion.nextElementSibling.style.display === &quot;inline&quot;,
    );

    if (openAccordions.length &gt; 0) {
      consolidatedDropdown.innerHTML = `
        &lt;button class=&quot;dropbtn&quot;&gt;Find a course:&lt;/button&gt;
        &lt;div class=&quot;dropdown-content&quot;&gt;&lt;/div&gt;
      `;
      const dropdownContent =
        consolidatedDropdown.querySelector(&quot;.dropdown-content&quot;);

      openAccordions.forEach((accordion, index) =&gt; {
        const step = accordion.className.replace(/[^\d]/g, &quot;&quot;);
        const associatedDropdown = innerDropdowns[step];

        if (associatedDropdown) {
          const links = associatedDropdown.querySelectorAll(&quot;a&quot;);
          links.forEach((link) =&gt; {
            const newLink = link.cloneNode(true);

            // Extract the prefix from the onclick function
            const onclickAttr = newLink.getAttribute(&quot;onclick&quot;);
            let ceremonyPrefix = &quot;default&quot;;

            if (onclickAttr) {
              // Extract the ID from scrollToElementWithOffset(&#x27;1430dept1course1&#x27;, 250)
              const match = onclickAttr.match(
                /scrollToElementWithOffset\(&#x27;(\d+)/,
              );
              if (match &amp;&amp; match[1]) {
                ceremonyPrefix = match[1]; // e.g., &quot;1430&quot;
              }
            }

            // Add class to associate link with its ceremony section
            const sectionClass = `ceremony-${ceremonyPrefix}`;
            newLink.classList.add(&quot;ceremony-link&quot;, sectionClass);

            // Initially hide all links
            newLink.style.display = &quot;none&quot;;

            dropdownContent.appendChild(newLink);
          });
        }
      });

      // Always show the dropdown when there are open accordions
      consolidatedDropdown.style.display = &quot;flex&quot;;
      consolidatedDropdown.style.opacity = &quot;1&quot;;
      consolidatedDropdown.style.pointerEvents = &quot;auto&quot;;

      // Initialize the observer after the dropdown is shown
      setupDropdownVisibilityObserver();
    } else {
      consolidatedDropdown.style.display = &quot;none&quot;;
    }
  }

  function setupDropdownVisibilityObserver() {
    // Get all sections on the page
    const sections = document.querySelectorAll(&quot;.Theme-Section&quot;);

    const observer = new IntersectionObserver(
      (entries) =&gt; {
        // Check if the fade-out section is in view first
        const fadeOutSection = Array.from(sections).find((section) =&gt; {
          if (section.id === &quot;section-aIviY23ApG&quot;) {
            const rect = section.getBoundingClientRect();
            return rect.top &lt; window.innerHeight &amp;&amp; rect.bottom &gt; 0;
          }
          return false;
        });

        if (fadeOutSection) {
          // Hide entire dropdown when fade-out section is in view
          console.log(`🔴 Dropdown hidden by fade-out section`);
          consolidatedDropdown.style.opacity = &quot;0&quot;;
          consolidatedDropdown.style.pointerEvents = &quot;none&quot;;
          return;
        }

        // Check ALL sections currently in viewport for each prefix
        const visiblePrefixes = new Set();

        // For each allowed prefix, check if ANY section with that prefix is visible
        allowedSectionPrefixes.forEach((prefix) =&gt; {
          const hasVisibleSection = Array.from(sections).some((section) =&gt; {
            if (
              !section.id ||
              !section.id.startsWith(prefix) ||
              section.id.includes(&quot;Imperial&quot;)
            ) {
              return false;
            }

            const rect = section.getBoundingClientRect();
            const isVisible = rect.top &lt; window.innerHeight &amp;&amp; rect.bottom &gt; 0;

            return isVisible;
          });

          if (hasVisibleSection) {
            visiblePrefixes.add(prefix);
          }
        });

        // Hide all ceremony links first
        const ceremonyLinks =
          consolidatedDropdown.querySelectorAll(&quot;.ceremony-link&quot;);
        ceremonyLinks.forEach((link) =&gt; {
          link.style.display = &quot;none&quot;;
        });

        if (visiblePrefixes.size &gt; 0) {
          // Show dropdown and relevant links
          consolidatedDropdown.style.opacity = &quot;1&quot;;
          consolidatedDropdown.style.pointerEvents = &quot;auto&quot;;

          // Show links for visible section prefixes
          visiblePrefixes.forEach((sectionPrefix) =&gt; {
            const sectionClass = `ceremony-${sectionPrefix.replace(
              &quot;section-&quot;,
              &quot;&quot;,
            )}`;
            const relevantLinks = consolidatedDropdown.querySelectorAll(
              `.${sectionClass}`,
            );
            relevantLinks.forEach((link) =&gt; {
              link.style.display = &quot;block&quot;;
            });
          });

          console.log(
            `🟢 Dropdown showing links for sections: ${Array.from(
              visiblePrefixes,
            ).join(&quot;, &quot;)}`,
          );
        } else {
          // Hide dropdown when not over any allowed section
          consolidatedDropdown.style.opacity = &quot;0&quot;;
          consolidatedDropdown.style.pointerEvents = &quot;none&quot;;
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: &quot;-100px 0px -50px 0px&quot;,
      },
    );

    // Observe all sections (including the new sentry section)
    sections.forEach((section) =&gt; {
      observer.observe(section);
    });
  }

  function toggleAccordion(clickedAccordion) {
    const content = clickedAccordion.nextElementSibling;
    if (content.style.display === &quot;none&quot; || content.style.display === &quot;&quot;) {
      content.style.display = &quot;inline&quot;;
    } else {
      content.style.display = &quot;none&quot;;
      clickedAccordion.scrollIntoView({
        behavior: &quot;smooth&quot;,
        block: &quot;nearest&quot;,
        inline: &quot;start&quot;,
      });
    }
    updateConsolidatedDropdown();
  }

  accordions.forEach((accordion) =&gt; {
    accordion.addEventListener(&quot;click&quot;, function () {
      toggleAccordion(this);
    });
  });

  // search user
  const searchedAccordions = [];

  const toTitleCase = (phrase) =&gt; {
    return phrase
      .toLowerCase()
      .split(&quot; &quot;)
      .map((word) =&gt; word.charAt(0).toUpperCase() + word.slice(1))
      .join(&quot; &quot;);
  };

  function scrollToAndHighlightText(t) {
    const text = toTitleCase(t);
    const BLACKLIST = [
      &quot;#section-1030-Faculty-of-Engineering-Ceremony-1-WrcFIYzqK1&quot;,
      &quot;#section-1330-Faculty-of-Engineering-Ceremony-2-9j7l1TdaZz&quot;,
      &quot;#section-1630-Faculty-of-Medicine-Centre-for-Languages-Culture-and-Communication-and-Centre-for-Higher-Education-Research-and-Scholarship-z1h9a7lTHe&quot;,
      &quot;#section-1030-Faculty-of-Natural-Sciences-uT2608HY0e&quot;,
      &quot;#section-1345-Imperial-Business-School-Ceremony-1-cLHwJu8Bsp&quot;,
      &quot;#section-1645-Imperial-Business-School-Ceremony-2-txtPpMMyld&quot;,
    ];

    const blacklistSelector = BLACKLIST.join(&quot;,&quot;);

    const containers = [
      ...document.querySelectorAll(&quot;.sh-names, .sh-prizewinnernames&quot;),
    ].filter((el) =&gt; !el.closest(blacklistSelector));

    if (!containers.length) {
      console.error(&quot;Container .sh-names not found.&quot;);
      return;
    }

    let matches = [];

    containers.forEach((container) =&gt; {
      let updates = []; // To store updates for later application
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

          parts.forEach((part, index) =&gt; {
            frag.appendChild(document.createTextNode(part));
            if (index !== endIndex) {
              const span = document.createElement(&quot;span&quot;);
              span.style.backgroundColor = &quot;#ffffff1d&quot;;
              span.classList.add(&quot;found-text-piece&quot;);
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
      updates.forEach((update) =&gt; {
        let currentElement = update.oldNode.parentElement;
        while (currentElement &amp;&amp; !currentElement.classList.contains(&quot;panel&quot;)) {
          if (
            currentElement.classList.contains(&quot;order-tab-content&quot;) &amp;&amp;
            !currentElement.classList.contains(&quot;active&quot;)
          ) {
            currentElement.classList.add(&quot;active&quot;);
          }
          currentElement = currentElement.parentElement;
        }
        update.oldNode.parentNode.replaceChild(update.frag, update.oldNode);

        // Find the nearest ancestor with class &#x27;panel&#x27; and set its display to inline
        if (currentElement) {
          currentElement.style.display = &quot;inline&quot;;
          const parent = currentElement.parentElement;
          const accordion = parent.querySelector(&quot;.accordion&quot;);
          if (accordion) {
            searchedAccordions.push(accordion);
          }
        }

        container.classList.add(&quot;show&quot;);
        const id = container.getAttribute(&quot;id&quot;);
        console.log(&quot;ID CHECK&quot;, id);
        const day = id.match(/^[^-]+-\d{4}/);
        console.log(&quot;DAY CHECK&quot;, day);
        if (day &amp;&amp; day[0]) {
          const daySection = document.querySelectorAll(&quot;[id^=&quot; + day + &quot;]&quot;);
          console.log(&quot;DAY SECTION CHECK&quot;, daySection);
          if (daySection &amp;&amp; daySection.length) {
            daySection.forEach((section) =&gt; {
              console.log(&quot;SECTION CHECK&quot;, section);
              section.classList.add(&quot;showing&quot;);
            });

            daySection.forEach((section) =&gt; {
              const sec = section.querySelector(
                &#x27;section[class^=&quot;Theme-Section-Position&quot;]&#x27;,
              );
              if (sec) {
                console.log(&quot;SECTION 2 CHECK&quot;, section);
                sec.classList.add(&quot;showing&quot;);
              }
            });

            const dayBar = daySection[0].querySelector(&quot;.floating-day-bar&quot;);
          }
        }
      });
    });

    if (accordions.length &gt; 0) {
      updateConsolidatedDropdown();
    }

    if (matches.length &gt; 0) {
      scrollToMatch(matches);
    }
  }

  function scrollToMatch(matches, yOffset = -400) {
    let current = 0;

    const scroll = () =&gt; {
      const attemptScroll = () =&gt; {
        const match = matches[current];

        if (!match) return;

        const yPosition =
          match.getBoundingClientRect().top + window.pageYOffset + yOffset;

        if (window.pageYOffset &gt; 0 || yPosition &gt; 0) {
          window.scrollTo({
            top: Math.max(0, yPosition),
            behavior: &quot;smooth&quot;,
          });

          setTimeout(() =&gt; {
            const rect = match.getBoundingClientRect();

            const targetTop = Math.abs(yOffset);
            const tolerance = 30;

            const tooHigh = rect.top &lt; targetTop - tolerance;
            const tooLow = rect.top &gt; targetTop + tolerance;

            if (tooLow || tooHigh) {
              const correctedYPosition =
                match.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;

              window.scrollTo({
                top: Math.max(0, correctedYPosition),
                behavior: &quot;auto&quot;,
              });
            }
          }, 700);

          current = (current + 1) % matches.length;

          matches.length &gt; 1 &amp;&amp;
            updateResultButtonText(current || matches.length, matches.length);
        } else {
          setTimeout(attemptScroll, 120);
        }
      };

      if (matches[current]) {
        requestAnimationFrame(() =&gt; {
          requestAnimationFrame(() =&gt; {
            setTimeout(attemptScroll, 100);
          });
        });
      }
    };

    if (matches.length &gt; 1) {
      createResultButton(1, matches.length, scroll);
    } else {
      console.log(&quot;Only one match found, no need for result button.&quot;);

      var style = document.createElement(&quot;style&quot;);
      style.id = &quot;closeResults&quot;;
      style.textContent = `
      body.close-results .found-text-piece {
        background-color: transparent !important;
      }
    `;

      if (!document.getElementById(&quot;closeResults&quot;)) {
        document.head.appendChild(style);
      }

      document.addEventListener(&quot;click&quot;, function () {
        document.body.classList.add(&quot;close-results&quot;);
      });
    }

    scroll();
  }

  // Get the &#x27;student_name&#x27; query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const studentName = urlParams.get(&quot;student_name&quot;);

  if (studentName) {
    // Decode URI component in case the name is encoded
    scrollToAndHighlightText(decodeURIComponent(studentName));
  }
});

function scrollToElementWithOffset(id) {
  const element = document.getElementById(id);

  if (!element) {
    console.error(&quot;Element not found:&quot;, id);
    return;
  }

  // Find the closest panel ancestor
  const panel = element.closest(&quot;.panel&quot;);
  if (panel) {
    // Check if the panel is hidden and show it if needed
    if (panel.style.display !== &quot;inline&quot;) {
      console.log(&quot;Panel was hidden, showing it:&quot;, panel.id);
      panel.style.display = &quot;inline&quot;;
    }
  }

  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  // Determine the offset based on screen width
  let offset;
  const screenWidth = window.innerWidth;
  if (screenWidth &lt;= 899) {
    offset = 200;
  } else if (screenWidth &gt;= 900 &amp;&amp; screenWidth &lt;= 1099) {
    offset = 200;
  } else {
    offset = 250;
  }
  console.log(&quot;Screen width:&quot;, screenWidth, &quot;Offset:&quot;, offset);
  const offsetPosition = elementPosition - offset;
  console.log(&quot;Offset position:&quot;, offsetPosition);
  window.scrollTo({
    top: offsetPosition,
    behavior: &quot;smooth&quot;,
  });
}

setTimeout(() =&gt; {
  window.scrollToElementWithOffset = scrollToElementWithOffset;
}, 500);

(function () {
  const SELECTOR = &#x27;[data-project-search-sidebar=&quot;true&quot;]&#x27;;
  const ACTIVE_CLASS = &quot;project-search--isActive&quot;;
  const POLL_INTERVAL_MS = 200;
  const TIMEOUT_MS = 30000;

  function applyInert(el) {
    if (el.classList.contains(ACTIVE_CLASS)) {
      el.removeAttribute(&quot;inert&quot;);
    } else {
      el.setAttribute(&quot;inert&quot;, &quot;&quot;);
    }
  }

  function init(el) {
    // Set initial state
    applyInert(el);

    // Watch for class changes
    const observer = new MutationObserver(() =&gt; applyInert(el));
    observer.observe(el, { attributeFilter: [&quot;class&quot;] });
  }

  // Poll for element existence
  const start = performance.now();
  const interval = setInterval(() =&gt; {
    const el = document.querySelector(SELECTOR);
    if (el) {
      clearInterval(interval);
      init(el);
      return;
    }
    if (performance.now() - start &gt;= TIMEOUT_MS) {
      clearInterval(interval);
      console.warn(&quot;[search-inert] Timed out waiting for&quot;, SELECTOR);
    }
  }, POLL_INTERVAL_MS);
})();

(function () {
  &quot;use strict&quot;;

  // Get the elements
  const input = document.querySelector(
    &quot;.Theme-ProjectInput.project-search-input&quot;,
  );
  const button = document.querySelector(&quot;.project-search-delete-btn&quot;);
  const statusText = document.getElementById(&quot;status-text&quot;);

  if (!input || !button) {
    console.error(&quot;Required elements not found&quot;);
    if (statusText) statusText.textContent = &quot;Error: Elements not found&quot;;
    return;
  }

  // Function to update button visibility
  function updateButtonVisibility() {
    if (input.value.trim() === &quot;&quot;) {
      button.classList.add(&quot;force-hide&quot;);
      if (statusText) statusText.textContent = &quot;Input empty - button hidden&quot;;
    } else {
      button.classList.remove(&quot;force-hide&quot;);
      if (statusText)
        statusText.textContent = &quot;Input has content - button visible&quot;;
    }
  }

  // Set initial state
  updateButtonVisibility();

  // Create MutationObserver to watch for attribute changes
  const observer = new MutationObserver((mutations) =&gt; {
    mutations.forEach((mutation) =&gt; {
      if (
        mutation.type === &quot;attributes&quot; &amp;&amp;
        mutation.attributeName === &quot;value&quot;
      ) {
        updateButtonVisibility();
        console.log(&quot;Value attribute changed via mutation&quot;);
      }
    });
  });

  // Configure and start observing
  observer.observe(input, {
    attributes: true,
    attributeFilter: [&quot;value&quot;],
  });

  // Listen for input events (handles user typing)
  input.addEventListener(&quot;input&quot;, () =&gt; {
    updateButtonVisibility();
    console.log(&quot;Input event fired&quot;);
  });

  // Listen for change events (handles some programmatic changes)
  input.addEventListener(&quot;change&quot;, () =&gt; {
    updateButtonVisibility();
    console.log(&quot;Change event fired&quot;);
  });

  // Watch for programmatic value changes using a different approach
  // Store the original descriptor
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    &quot;value&quot;,
  );
  const originalSet = descriptor.set;

  // Only override if we haven&#x27;t already
  if (originalSet &amp;&amp; !input.hasAttribute(&quot;data-observer-attached&quot;)) {
    input.setAttribute(&quot;data-observer-attached&quot;, &quot;true&quot;);

    // Create a new setter that calls our update function
    Object.defineProperty(input, &quot;value&quot;, {
      get: descriptor.get,
      set: function (newValue) {
        // Call the original setter with the input element as context
        originalSet.call(this, newValue);
        // Then update visibility
        updateButtonVisibility();
        console.log(&quot;Value set programmatically:&quot;, newValue);
      },
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
    });
  }

  // Clear button functionality
  button.addEventListener(&quot;click&quot;, () =&gt; {
    input.value = &quot;&quot;;
    updateButtonVisibility();
    input.focus();
  });

  console.log(&quot;MutationObserver script initialized successfully&quot;);
})();
class TabOrderManager {
  constructor() {
    this.refreshTimer = null;
    this.bodyObserver = null;
    this.init();
  }

  init() {
    this.addFocusStyles();
    this.waitForHeader(() =&gt; {
      this.updateTabOrder();
      this.attachObservers();
    });
  }

  /**
   * Wait until the nav has rendered with actual links before running.
   * Prevents the partial first-run that puts the input at tabindex=1.
   */
  waitForHeader(cb, attempts = 0) {
    const navLink = document.querySelector(&quot;#navigation .Theme-NavigationLink&quot;);
    if (navLink &amp;&amp; navLink.getBoundingClientRect().width &gt; 0) {
      cb();
    } else if (attempts &gt; 60) {
      // 60 × 200ms = 12s — give up and run anyway
      console.warn(&quot;[TabOrderManager] Header never appeared, running anyway.&quot;);
      cb();
    } else {
      setTimeout(() =&gt; this.waitForHeader(cb, attempts + 1), 200);
    }
  }

  attachObservers() {
    this.bodyObserver = new MutationObserver(() =&gt; this.scheduleRefresh(400));
    this.bodyObserver.observe(document.body, {
      childList: true,
      subtree: false,
    });

    const nav = document.querySelector(&quot;#navigation&quot;);
    if (nav) {
      new MutationObserver(() =&gt; this.scheduleRefresh(200)).observe(nav, {
        attributes: true,
        subtree: true,
        attributeFilter: [&quot;aria-expanded&quot;, &quot;style&quot;, &quot;class&quot;],
      });
    }

    document.addEventListener(&quot;click&quot;, (e) =&gt; {
      if (
        e.target.closest(
          &quot;.time-toggle, .accordion, .Navigation__button, .custom-dropdown, .project-search-button, .project-search-close-button&quot;,
        )
      ) {
        this.scheduleRefresh(350);
      }
    });

    document.addEventListener(&quot;keydown&quot;, (e) =&gt; {
      if (
        (e.key === &quot;Enter&quot; || e.key === &quot; &quot;) &amp;&amp;
        e.target.closest(
          &quot;.Navigation__button, .time-toggle button, .project-search-button&quot;,
        )
      ) {
        this.scheduleRefresh(350);
      }
    });
  }

  scheduleRefresh(delay = 150) {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() =&gt; this.updateTabOrder(), delay);
  }

  isVisible(el) {
    if (!el) return false;
    let node = el;
    while (node &amp;&amp; node !== document.documentElement) {
      const s = window.getComputedStyle(node);
      if (
        s.display === &quot;none&quot; ||
        s.visibility === &quot;hidden&quot; ||
        s.opacity === &quot;0&quot;
      )
        return false;
      node = node.parentElement;
    }
    const r = el.getBoundingClientRect();
    return r.width &gt; 0 &amp;&amp; r.height &gt; 0;
  }

  updateTabOrder() {
    document
      .querySelectorAll(
        &quot;a[href], button, input, select, textarea, [tabindex], .popup-close&quot;,
      )
      .forEach((el) =&gt; el.setAttribute(&quot;tabindex&quot;, &quot;-1&quot;));

    const assignments = [];
    let idx = 1;

    const assign = (el, label) =&gt; {
      if (el &amp;&amp; this.isVisible(el)) {
        // el.setAttribute(&quot;tabindex&quot;, String(idx));
        el.setAttribute(&quot;tabindex&quot;, String(0));
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : &quot;&quot;;
        const text = el.textContent?.trim().slice(0, 40) || &quot;&quot;;
        assignments.push({
          // order: idx,
          order: 0,
          label,
          element: `&lt;${tag}${id}&gt; &quot;${text}&quot;`,
        });
        idx++;
        return true;
      }
      return false;
    };

    // (1) Logo
    assign(
      document.querySelector(&quot;.Project-Header--left .Theme-Logo a&quot;),
      &quot;Logo&quot;,
    );

    // (2)–(5) Navigation
    const navItems = document.querySelectorAll(
      &quot;#navigation &gt; .Navigation__itemList &gt; .Navigation__item&quot;,
    );

    navItems.forEach((li) =&gt; {
      const link = li.querySelector(&quot;:scope &gt; a.Theme-NavigationLink&quot;);
      const button = li.querySelector(&quot;:scope &gt; button.Theme-NavigationLink&quot;);

      if (link &amp;&amp; this.isVisible(link)) {
        assign(link, `Nav: ${link.textContent.trim().slice(0, 30)}`);
      } else if (button &amp;&amp; this.isVisible(button)) {
        assign(button, `Nav: ${button.textContent.trim().slice(0, 30)}`);

        if (button.getAttribute(&quot;aria-expanded&quot;) === &quot;true&quot;) {
          const dropdown =
            li.querySelector(&quot;.custom-dropdown&quot;) ||
            li.querySelector(&quot;.Navigation__subMenu&quot;);
          if (dropdown &amp;&amp; this.isVisible(dropdown)) {
            dropdown
              .querySelectorAll(&quot;a[href], button&quot;)
              .forEach((child) =&gt;
                assign(
                  child,
                  `Dropdown: ${child.textContent.trim().slice(0, 30)}`,
                ),
              );
          }
        }
      }
    });

    // (6) Search icon
    assign(document.querySelector(&quot;.project-search-button&quot;), &quot;Search icon&quot;);

    // (6a) Search panel (if open)
    const searchSidebar = document.querySelector(
      &quot;[data-project-search-sidebar]&quot;,
    );
    if (searchSidebar &amp;&amp; !searchSidebar.hasAttribute(&quot;inert&quot;)) {
      assign(
        searchSidebar.querySelector(&quot;.project-search-input&quot;),
        &quot;Sidebar: input&quot;,
      );
      const deleteBtn = searchSidebar.querySelector(
        &quot;.project-search-delete-btn&quot;,
      );
      if (deleteBtn &amp;&amp; !deleteBtn.classList.contains(&quot;force-hide&quot;)) {
        assign(deleteBtn, &quot;Sidebar: clear&quot;);
      }
      assign(
        searchSidebar.querySelector(&quot;.project-search-enter-btn&quot;),
        &quot;Sidebar: submit&quot;,
      );
      assign(
        searchSidebar.querySelector(&quot;.project-search-close-button&quot;),
        &quot;Sidebar: close&quot;,
      );
    }

    // (7) On-page search input
    const pageSearchInput = document.querySelector(&quot;#inputField1&quot;);
    if (pageSearchInput) {
      assign(pageSearchInput, &quot;Page search input&quot;);
    }
    // (7a) On-page search input button
    const pageSearchInputButton = document.querySelector(&quot;#submitButton&quot;);
    if (pageSearchInputButton) {
      assign(pageSearchInputButton, &quot;Page search input&quot;);
    }

    // (8) Ceremony toggle buttons
    document.querySelectorAll(&quot;.time-toggle button&quot;).forEach((btn) =&gt; {
      assign(btn, `Ceremony btn: ${btn.textContent.trim().slice(0, 20)}`);
    });

    // (8a) Open ceremony contents
    const openCeremony = document.querySelectorAll(&quot;[id^=section].showing&quot;);
    if (openCeremony &amp;&amp; openCeremony.length) {
      openCeremony.forEach((ceremony) =&gt; {
        ceremony
          .querySelectorAll(
            &quot;a[href], button, input, select, textarea, [tabindex], .popup-close&quot;,
          )
          .forEach((el) =&gt; {
            if (el.classList.contains(&quot;popup-close&quot;))
              el.setAttribute(&quot;tabindex&quot;, String(0));
            console.log(
              &quot;logging&quot;,
              el,
              el.getAttribute(&quot;tabindex&quot;),
              el.getAttribute(&quot;tabindex&quot;) !== &quot;-1&quot;,
            );
            if (el.getAttribute(&quot;tabindex&quot;) !== &quot;-1&quot;) return;
            const text =
              el.textContent?.trim().slice(0, 30) || el.tagName.toLowerCase();
            assign(el, `Ceremony: ${text}`);
          });
      });
    }

    const endingTabs = document.querySelectorAll(
      &quot;#section-ZvbXBHs5lv a, #section-5DMRaIUUJC a, #section-CfGYjfkAcl a&quot;,
    );

    endingTabs.forEach((el) =&gt; {
      if (el.getAttribute(&quot;tabindex&quot;) !== &quot;-1&quot;) return;
      const text =
        el.textContent?.trim().slice(0, 30) || el.tagName.toLowerCase();
      assign(el, `${text}`);
    });

    console.table(assignments);
  }

  addFocusStyles() {
    if (document.getElementById(&quot;tab-manager-styles&quot;)) return;
    const style = document.createElement(&quot;style&quot;);
    style.id = &quot;tab-manager-styles&quot;;
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

function hasPageMarker(expected) {
  const el = document.querySelector(&#x27;meta[name=&quot;app-page&quot;]&#x27;);
  return !!el &amp;&amp; el.content === expected;
}

if (hasPageMarker(&quot;ceremony-order&quot;)) {
  if (document.readyState === &quot;loading&quot;) {
    document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {
      window.tabOrderManager = new TabOrderManager();
    });
  } else {
    window.tabOrderManager = new TabOrderManager();
  }

  window.refreshTabOrder = () =&gt; window.tabOrderManager?.updateTabOrder();
}
```</pre>
</body>
</html>
