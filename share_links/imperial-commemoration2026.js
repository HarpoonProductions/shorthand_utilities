// ── Plausible tracking helper ───────────────────────────────────────────────
// EDITION tags every event so ceremonies can be compared like-for-like.
// Change this one value for each new event (and keep it the same in the
// search script).
window.IMP_EDITION = window.IMP_EDITION || "commemoration-2026";

window.impTrack =
  window.impTrack ||
  function (name, props) {
    try {
      if (typeof window.plausible === "function") {
        window.plausible(name, {
          props: Object.assign({ edition: window.IMP_EDITION }, props || {}),
        });
      }
    } catch (e) {
      // Analytics must never break the guide.
    }
  };

// Merged version for Oct 26 taking pre April code and  plausible
//
// // Shared helper for Web Share + fallback
async function shareLink({ title, text, url }) {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });
    } else {
      fallbackShare(url);
    }
  } catch (err) {
    fallbackShare(url);
  }
}

function fallbackShare(url) {
  prompt("Copy this link to share:", url);
}

// Add share buttons for student names
function addShareButtons() {
  const paragraphs = document.querySelectorAll(
    ".sh-names .Theme-Layer-BodyText--inner p, .sh-prizewinnernames .Theme-Layer-BodyText--inner p",
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
        studentName,
      )}&name_index=${encodeURIComponent(index)}`;

      impTrack("Share Initiated", { type: "student" });

      await shareLink({
        title: "Imperial Commemoration Day",
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
      ".sh-awardee p.Theme-TextSize-default.h-align-center",
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

      impTrack("Share Initiated", { type: "awardee" });

      await shareLink({
        title: "Imperial Commemoration Day",
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
    nameIndex,
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

// Inbound shared link detection
function trackSharedLinkArrival() {
  const urlParams = new URLSearchParams(window.location.search);

  // Share links always carry name_index. Name searches also land on
  // ?student_name=... (without name_index), so they are not counted here.
  if (urlParams.has("student_name") && urlParams.has("name_index")) {
    impTrack("Shared Link Opened", { type: "student" });
  }

  if (urlParams.has("awardee")) {
    impTrack("Shared Link Opened", { type: "awardee" });
  }
}

// Accordion / ceremony section tracking
function initAccordionTracking() {
  document.querySelectorAll(".toggle-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = (this.getAttribute("aria-label") || "").replace(
        "Toggle Open Close ",
        "",
      );
      var isOpening = this.getAttribute("aria-expanded") === "false";
      impTrack("Accordion Toggled", {
        ceremony: label,
        action: isOpening ? "opened" : "closed",
      });
    });
  });
}

// Heartbeat — session duration accuracy
// Once a minute, only while the page is visible, and capped at 20 minutes,
// so thousands of phones in one venue send far fewer requests than before.
function initHeartbeat() {
  var heartbeatCount = 0;
  setInterval(function () {
    if (document.visibilityState !== "visible") return;
    if (heartbeatCount >= 20) return;
    heartbeatCount++;
    impTrack("Heartbeat", { minutes: String(heartbeatCount) });
  }, 60000);
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
  trackSharedLinkArrival();
  initAccordionTracking();
  initHeartbeat();
});
