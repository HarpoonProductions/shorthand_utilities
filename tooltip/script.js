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
        // All tooltips shown, remove overlay and re-enable scrolling
        overlay.remove();
        document.body.style.overflow = "";
        return;
      }

      const { element, message } = tooltips[index];
      const tooltip = document.createElement("div");
      tooltip.className = "custom-tooltip";
      tooltip.innerHTML = `
                <div class="tooltip-content">
                    ${message}
                    <button class="tooltip-close">×</button>
                </div>
                <div class="tooltip-caret"></div>
            `;
      document.body.appendChild(tooltip);

      // Positioning logic
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const caret = tooltip.querySelector(".tooltip-caret");

      let top, left, caretTop, caretLeft, caretClass;

      // 3a and 3b: Position above or below based on available space
      if (rect.top >= tooltipRect.height + 10) {
        // Enough space above
        top = rect.top + window.scrollY - tooltipRect.height - 10;
        caretClass = "caret-bottom";
        caretTop = tooltipRect.height + "px";
      } else {
        // Position below
        top = rect.bottom + window.scrollY + 10;
        caretClass = "caret-top";
        caretTop = "-6px";
      }

      left =
        rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;

      // 5a and 5b: Adjust horizontal position if overflowing
      if (left + tooltipRect.width > window.innerWidth - 10) {
        // Overflowing right
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (left < 10) {
        // Overflowing left
        left = 10;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;

      caret.style.top = caretTop;

      // 6: Place caret horizontally based on available space
      const elementCenter = rect.left + rect.width / 2;
      const tooltipCenter = left + tooltipRect.width / 2;
      const caretShift = Math.min(
        Math.max(elementCenter - tooltipCenter, -tooltipRect.width / 2 + 15),
        tooltipRect.width / 2 - 15
      );
      caret.style.left = `${tooltipRect.width / 2 + caretShift - 5}px`;
      caret.classList.add(caretClass);

      // Close button logic
      const closeButton = tooltip.querySelector(".tooltip-close");
      tooltip.addEventListener("click", () => {
        tooltip.classList.add("fade-out");
        setTimeout(() => {
          tooltip.remove();
          showTooltip(index + 1);
        }, 300); // Match with CSS transition duration
      });
    }

    // Start the tooltip sequence
    setTimeout(() => showTooltip(currentIndex), 200);
  }

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
    {
      element: document.querySelector(".Theme-Byline"),
      message: "Made by this person",
    },
  ];

  showTooltips(tooltips);
});
