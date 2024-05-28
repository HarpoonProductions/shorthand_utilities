document.addEventListener("DOMContentLoaded", () => {
  function showTooltips(tooltips) {
    let currentIndex = 0;

    // Create and add the overlay
    const overlay = document.createElement("div");
    overlay.className = "tooltip-overlay";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden"; // Disable scrolling

    function showTooltip(index) {
      if (index >= tooltips.length) {
        overlay.remove();
        document.body.style.overflow = "";
        return;
      }

      const { element, message } = tooltips[index];
      const tooltip = document.createElement("div");
      tooltip.className = "custom-tooltip";
      tooltip.innerHTML = `
           <div class="tooltip-content">
                <button class="tooltip-close">×</button>
                   ${message}
                  
               </div>
               <div class="tooltip-caret"></div>
           `;
      document.body.appendChild(tooltip);

      // Positioning logic
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const caret = tooltip.querySelector(".tooltip-caret");

      let top, left, caretTop, caretLeft, caretClass;

      if (rect.bottom + tooltipRect.height + 10 <= window.innerHeight) {
        // Below
        top = rect.bottom + window.scrollY + 10;
        left = Math.min(
          rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2,
          window.innerWidth - tooltipRect.width - 10
        );
        caretTop = "-6px";
        caretLeft =
          Math.min(tooltipRect.width / 2 - 5, tooltipRect.width - 15) + "px";
        caretClass = "caret-top";
      } else if (rect.top - tooltipRect.height - 10 >= 0) {
        // Above
        top = rect.top + window.scrollY - tooltipRect.height - 10;
        left = Math.min(
          rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2,
          window.innerWidth - tooltipRect.width - 10
        );
        caretTop = tooltipRect.height + "px";
        caretLeft =
          Math.min(tooltipRect.width / 2 - 5, tooltipRect.width - 15) + "px";
        caretClass = "caret-bottom";
      } else if (rect.left + tooltipRect.width + 10 <= window.innerWidth) {
        // Right
        top =
          rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + window.scrollX + 10;
        caretTop = tooltipRect.height / 2 - 5 + "px";
        caretLeft = "-6px";
        caretClass = "caret-left";
      } else {
        // Left
        top =
          rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left + window.scrollX - tooltipRect.width - 10;
        caretTop = tooltipRect.height / 2 - 5 + "px";
        caretLeft = tooltipRect.width + "px";
        caretClass = "caret-right";
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      caret.style.top = caretTop;
      caret.style.left = caretLeft;
      caret.classList.add(caretClass);

      // Close button logic
      const closeButton = tooltip.querySelector(".tooltip-close");
      closeButton.addEventListener("click", () => {
        tooltip.classList.add("fade-out");
        setTimeout(() => {
          tooltip.remove();
          showTooltip(index + 1);
        }, 300); // Match with CSS transition duration
      });
    }

    // Start the tooltip sequence
    showTooltip(currentIndex);
  }

  // Example usage
  const tooltips = [
    {
      element: document.querySelector(".project-search-button"),
      message: "Click here to search for a student",
    },
    {
      element: document.querySelector(".Theme-Logos"),
      message: "Click here to go back to the home page",
    },
    {
      element: document.querySelector(".Navigation__itemList"),
      message: "Navigate to other stories here",
    },
  ];

  showTooltips(tooltips);
});
