// Shared helper for Web Share + graceful fallback
async function shareLink({ title, text, url }) {
  if (!navigator.share) {
    return;
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });
  } catch (err) {
    // User dismissed/cancelled the native share sheet.
    // Do nothing so we don't show the copy prompt afterwards.
    if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) {
      return;
    }

    // Ignore other share errors too, to avoid showing the prompt.
    console.error("Share failed:", err);
  }
}

// Add share buttons for student names
function addShareButtons() {
  const paragraphs = document.querySelectorAll(
    ".sh-names .Theme-Layer-BodyText--inner p, .sh-prizewinnernames .Theme-Layer-BodyText--inner p"
  );

  const names = {};

  paragraphs.forEach((p) => {
    const studentName = p.textContent.trim();

    names[studentName] = (names[studentName] || 0) + 1;
    const index = names[studentName] - 1;

    const shareButton = document.createElement("button");
    shareButton.className = "share-button";
    shareButton.type = "button";
    shareButton.setAttribute("aria-label", `Share ${studentName}`);
    shareButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    `;

    shareButton.addEventListener("click", async () => {
      const currentURL = window.location.href.split("?")[0];
      const shareURL = `${currentURL}?student_name=${encodeURIComponent(
        studentName
      )}&name_index=${encodeURIComponent(index)}`;

      await shareLink({
        title: "Imperial Graduation Days",
        text: `See information for ${studentName}`,
        url: shareURL,
      });
    });

    p.appendChild(shareButton);
  });
}

// Add share buttons for awardees
function addShareAwardeeButtons() {
  const awardeeElements = document.querySelectorAll(
    ".sh-awardee h2.Theme-Layer-BodyText-Heading-Large.Theme-Title.Theme-TextSize-xsmall, " +
      ".sh-awardee p.Theme-TextSize-default.h-align-center"
  );

  const awardeeNames = Array.from(awardeeElements).map((el) => {
    const lines = el.innerText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    return lines.length > 1 ? lines[lines.length - 1] : lines[0];
  });

  const names = {};

  awardeeElements.forEach((el, i) => {
    const awardeeName = awardeeNames[i];

    names[awardeeName] = (names[awardeeName] || 0) + 1;
    const index = names[awardeeName] - 1;

    const encodedAwardee = encodeURIComponent(awardeeName);
    const encodedIndex = encodeURIComponent(index);

    el.setAttribute("id", `${encodedAwardee}${encodedIndex}`);

    const shareButton = document.createElement("button");
    shareButton.className = "share-button";
    shareButton.type = "button";
    shareButton.setAttribute("aria-label", `Share ${awardeeName}`);
    shareButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    `;

    shareButton.addEventListener("click", async () => {
      const currentURL = window.location.href.split("?")[0];
      const shareURL = `${currentURL}?awardee=${encodedAwardee}&name_index=${encodedIndex}`;

      await shareLink({
        title: "Imperial Graduation Days",
        text: `See information for ${awardeeName}`,
        url: shareURL,
      });
    });

    el.appendChild(shareButton);
  });

  scrollToAwardeeFromURL();
}

// Scroll to shared awardee from URL params
function scrollToAwardeeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const awardee = urlParams.get("awardee");
  const nameIndex = urlParams.get("name_index");

  if (!awardee || nameIndex === null) return;

  const elementId = `${encodeURIComponent(awardee)}${encodeURIComponent(
    nameIndex
  )}`;
  const element = document.getElementById(elementId);

  if (!element) return;

  let padding = 120;

  if (window.innerWidth < 620) {
    padding = 720 + (window.innerWidth - 620);
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

// Add styles
const styleShare = document.createElement("style");
styleShare.textContent = `
  .share-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: 10px;
    vertical-align: middle;
  }

  .share-button:hover {
    cursor: pointer;
  }

  .share-button svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
`;
document.head.appendChild(styleShare);

// Init
document.addEventListener("DOMContentLoaded", () => {
  addShareButtons();
  addShareAwardeeButtons();
});