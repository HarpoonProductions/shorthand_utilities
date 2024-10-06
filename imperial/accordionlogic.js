document.addEventListener("DOMContentLoaded", function () {
  // Get all accordion buttons
  const accordions = document.querySelectorAll(".accordion");

  // Loop through each accordion
  accordions.forEach(function (accordion) {
    accordion.addEventListener("click", function () {
      // Get the associated panel (next sibling element)
      const content = this.nextElementSibling;

      // Toggle display property between 'none' and 'inline'
      if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "inline";
      } else {
        content.style.display = "none";
      }
    });
  });
});

// Function to show the dropdown
function showDropdown(dropdown) {
  dropdown.style.display = "flex";
}

// Function to hide the dropdown
function hideDropdown(dropdown) {
  dropdown.style.display = "none";
}

// Event listener function to handle accordion clicks
function onAccordionClick(accordion, dropdown) {
  // If the dropdown is currently hidden, show it, otherwise hide it
  const isVisible = dropdown.style.display === "flex";

  if (isVisible) {
    hideDropdown(dropdown);
  } else {
    // Hide all other dropdowns
    document.querySelectorAll(".inner-dropdown").forEach((innerDropdown) => {
      hideDropdown(innerDropdown);
    });
    // Show the corresponding dropdown
    showDropdown(dropdown);
  }
}

// Attach event listeners to accordions
document.querySelectorAll(".accordion").forEach((accordion, index) => {
  // Assume each accordion controls a corresponding dropdown
  const dropdown = document.querySelectorAll(".inner-dropdown")[index];

  accordion.addEventListener("click", () => {
    onAccordionClick(accordion, dropdown);
  });
});
