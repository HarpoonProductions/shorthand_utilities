document.addEventListener("DOMContentLoaded", function () {
  let storedInput = "";

  const input1 = document.getElementById("inputField1");
  const input2 = document.querySelector(
    ".Theme-ProjectInput.project-search-input"
  );
  const buttonInline = document.querySelector("#submitButton");
  const panelOpenButton = document.querySelector(".project-search-button");
  const panelEnterButton = document.querySelector(".project-search-enter-btn");

  // Check if all elements were correctly selected
  console.log("input1:", input1);
  console.log("input2:", input2);
  console.log("buttonInline:", buttonInline);
  console.log("panelOpenButton:", panelOpenButton);
  console.log("panelEnterButton:", panelEnterButton);

  // Update input2 whenever input1 changes
  input1.addEventListener("input", function () {
    storedInput = this.value;
    input2.value = this.value;
  });

  // Function to handle the button clicks and scrolling
  function handleSubmission() {
    console.log("Handling submission...");
    panelOpenButton.click(); // First click to open the panel
    setTimeout(() => {
      panelEnterButton.removeAttribute("disabled");
      panelEnterButton.click();
      if (input2.value !== storedInput) input2.value = storedInput;
      scrollToInputField(input2); // Smooth scroll to inputField2
    }, 300); // Delay might need adjustment based on actual panel behavior
  }

  // Add event listeners to both input1 and the inline button
  input1.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default form submission if it's in a form
      handleSubmission();
    }
  });

  // Ensure event is prevented and handled for button click
  buttonInline.addEventListener("click", function (event) {
    event.preventDefault(); // Stop the button from submitting a form
    handleSubmission();
  });

  // Function to smooth scroll to an element
  function scrollToInputField(element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
});
