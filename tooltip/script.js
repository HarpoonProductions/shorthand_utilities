document.addEventListener("DOMContentLoaded", () => {
  function showTooltips(tooltips) {
    let currentIndex = 0;

    // Create and add the overlay
    const overlay = document.createElement("div");
    overlay.className = "tooltip-overlay";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    function showTooltip(index) {
      // Poll for current element here
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

      if (rect.top >= tooltipRect.height + 10) {
        top = rect.top + window.scrollY - tooltipRect.height - 10;
        caretClass = "caret-bottom";
        caretTop = tooltipRect.height + "px";
      } else {
        top = rect.bottom + window.scrollY + 10;
        caretClass = "caret-top";
        caretTop = "-6px";
      }

      left =
        rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;

      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (left < 10) {
        left = 10;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;

      caret.style.top = caretTop;

      const elementCenter = rect.left + rect.width / 2;
      const tooltipCenter = left + tooltipRect.width / 2;
      const caretShift = Math.min(
        Math.max(elementCenter - tooltipCenter, -tooltipRect.width / 2 + 15),
        tooltipRect.width / 2 - 15
      );
      caret.style.left = `${tooltipRect.width / 2 + caretShift - 5}px`;
      caret.classList.add(caretClass);

      tooltip.addEventListener("click", () => {
        tooltip.classList.add("fade-out");
        setTimeout(() => {
          tooltip.remove();
          showTooltip(index + 1);
        }, 300);
      });
    }

    showTooltip(currentIndex);
  }

  const tooltips = [
    {
      element: ".project-search-button",
      message: "Click here to search for a student",
    },
    {
      element: ".Theme-Logos",
      message: "Click here to go back to the home page",
    },
    {
      element: ".Navigation__itemList",
      message: "Navigate to other stories here",
    },
    {
      element: ".Theme-Byline",
      message: "Made by this person",
    },
  ];

  showTooltips(tooltips);
});
