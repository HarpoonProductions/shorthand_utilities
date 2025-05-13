// Function to add share buttons
function addShareButtons() {
  // Select all p tags within the specified structure
  const paragraphs = document.querySelectorAll(
    ".sh-names .Theme-Layer-BodyText--inner p, .sh-prizewinnernames .Theme-Layer-BodyText--inner p"
  );

  const names = {};

  paragraphs.forEach((p) => {
    const studentName = p.textContent.trim();

    if (names[studentName]) {
      console.log(studentName, "exists");
      names[studentName]++;
    } else {
      console.log(studentName, "doesnt exist");
      names[studentName] = 1;
    }

    // Create the share button
    const shareButton = document.createElement("button");
    const index = names[studentName];
    shareButton.className = "share-button";
    shareButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
        `;

    shareButton.addEventListener("click", () => {
      const currentURL = window.location.href.split("?")[0]; // Remove any existing query params
      const shareURL = `${currentURL}?student_name=${encodeURIComponent(
        studentName
      )}&name_index=${encodeURIComponent(index - 1)}`;

      if (navigator.share) {
        let hasResponded = false;
        let sharePromise = navigator.share({
          title: "Student Information",
          text: `Check out information for ${studentName}`,
          url: shareURL,
        });
      } else {
        fallbackShare();
      }

      function fallbackShare() {
        // Fallback for browsers that don't support the Web Share API
        // or when sharing fails
        prompt("Copy this link to share:", shareURL);
      }
    });

    // Append the button to the paragraph
    p.appendChild(shareButton);
  });
}

// Function to add share buttons
function addShareAwardeeButtons() {
  // Select all p tags within the specified structure
  const awardees = document.querySelectorAll(
    ".sh-awardee h2.Theme-Layer-BodyText-Heading-Large.Theme-Title.Theme-TextSize-xsmall, " +
      ".sh-awardee p.Theme-TextSize-default.h-align-center"
  );

  // 2) for each one, split on the line-break and take the *last* non-empty line
  const paragraphs = Array.from(awardees).map((el) => {
    // innerText preserves that <br> as a '\n'
    const lines = el.innerText
      .split("\n") // ["HONORARY DEGREE", "The Hon. Julia Gillard AC"]
      .map((s) => s.trim()) // strip any stray spaces
      .filter(Boolean); // drop any empty strings
    // if for some reason there's only one line, fallback to it
    return lines.length > 1 ? lines[lines.length - 1] : lines[0];
  });

  const names = {};

  awardees.forEach((p, i) => {
    const awardeeName = paragraphs[i];

    if (names[awardeeName]) {
      console.log(awardeeName, "exists");
      names[awardeeName]++;
    } else {
      console.log(awardeeName, "doesnt exist");
      names[awardeeName] = 1;
    }

    // Create the share button
    const shareButton = document.createElement("button");
    const index = names[awardeeName];
    shareButton.className = "share-button";
    shareButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
        `;

    const encodedAwardee = encodeURIComponent(awardeeName);

    const encodedIndex = encodeURIComponent(index - 1);

    p.setAttribute("id", encodedAwardee + encodedIndex);

    shareButton.addEventListener("click", () => {
      const currentURL = window.location.href.split("?")[0]; // Remove any existing query params
      const shareURL = `${currentURL}?awardee=${encodedAwardee}&name_index=${encodedIndex}`;

      if (navigator.share) {
        let hasResponded = false;
        let sharePromise = navigator.share({
          title: "Awardee Information",
          text: `Check out information for ${awardeeName}`,
          url: shareURL,
        });
      } else {
        fallbackShare();
      }

      function fallbackShare() {
        // Fallback for browsers that don't support the Web Share API
        // or when sharing fails
        prompt("Copy this link to share:", shareURL);
      }
    });

    // Append the button to the paragraph
    p.appendChild(shareButton);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const awardee = urlParams.get("awardee");
  const nameIndex = urlParams.get("name_index");

  // If either parameter is missing, do nothing
  if (!awardee || !nameIndex) {
    console.log("missing");
    return;
  }

  // Form the ID by concatenating the parameters
  const encodedAwardee = encodeURIComponent(awardee);

  const encodedIndex = encodeURIComponent(nameIndex);

  const elementId = encodedAwardee + encodedIndex;
  console.log(elementId);

  // Look for the element with that ID
  const element = document.getElementById(elementId);

  // If element exists, smooth scroll to it with padding
  if (element) {
    let padding = 120; // Default for screens > 900px
    if (window.innerWidth < 620) {
      padding = 460; // For screens <= 900px
    } else if (window.innerWidth < 900) {
      padding = 350;
    }

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - padding;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// Add some basic styles
let styleShare = document.createElement("style");
styleShare.textContent = `
    .share-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
        vertical-align: middle;
    }
    .share-button svg {
        width: 16px;
        height: 16px;
        vertical-align: middle;
    }
`;
document.head.appendChild(styleShare);

// Run the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  addShareButtons();
  addShareAwardeeButtons();
});
