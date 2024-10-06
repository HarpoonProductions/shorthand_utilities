// JavaScript to handle multiple accordions

document.addEventListener("DOMContentLoaded", function () {
  const accordions = document.querySelectorAll(".accordion");

  function toggleAccordion(clickedAccordion) {
    accordions.forEach((accordion) => {
      const content = accordion.nextElementSibling;
      const dropdown =
        document.querySelectorAll(".inner-dropdown")[
          Array.from(accordions).indexOf(accordion)
        ];

      if (accordion === clickedAccordion) {
        // Toggle the clicked accordion
        if (content.style.display === "none" || content.style.display === "") {
          content.style.display = "inline";
          if (dropdown) {
            dropdown.style.display = "flex";
          }
        } else {
          content.style.display = "none";
          if (dropdown) {
            dropdown.style.display = "none";
          }
        }
      } else {
        // Close other accordions and dropdowns
        content.style.display = "none";
        if (dropdown) {
          dropdown.style.display = "none";
        }
      }
    });
  }

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      toggleAccordion(this);
    });
  });
});
