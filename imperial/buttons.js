(function (d) {
  var qsa = "querySelectorAll";
  var qs = "querySelector";
  var timeToggles = d[qsa](".time-toggle button");
  var sectionSets = [
    d[qsa](
      ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8, .Theme-Section-Position-9"
    ),
    d[qsa](
      ".Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-14"
    ),
    d[qsa](
      ".Theme-Section-Position-15, .Theme-Section-Position-16, .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19"
    ),
  ];

  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (e) {}

  function toggleOtherToggleTabIndex(currentIndex) {
    timeToggles.forEach((toggle, index) => {
      if (index !== currentIndex) {
        if (toggle.getAttribute("tabindex") === "-1")
          toggle.removeAttribute("tabindex");
        else toggle.setAttribute("tabindex", "-1");
      }
    });
  }

  function setTabIndexForActive(currentIndex) {
    timeToggles.forEach((toggle, index) => {
      if (index === currentIndex) toggle.removeAttribute("tabindex");
      else toggle.setAttribute("tabindex", "-1");
    });
  }

  function resetAllToggleTabIndex() {
    timeToggles.forEach((toggle) => toggle.removeAttribute("tabindex"));
  }

  // Handle click / keyboard on toggles
  timeToggles.forEach((timeToggle, i) => {
    timeToggle.addEventListener("click", (event) => {
      if (
        event.type === "click" ||
        (event.type === "keydown" && event.key === "Enter")
      ) {
        // --- Section toggling logic ---
        sectionSets.forEach((sectionSet, j) => {
          sectionSet.forEach((section, k) => {
            if (i === j) {
              section.classList.toggle("showing");
              if (k === 0) {
                section.style.scrollMarginTop = "120px";
                section.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                });
              }
            } else {
              section.classList.remove("showing");
            }

            if (section.classList.contains("Theme-Section-Position-35")) {
              sectionSet.forEach((otherSection) => {
                if (
                  otherSection !== section &&
                  otherSection.classList.contains("Theme-Section-Position-35")
                ) {
                  otherSection.classList.remove("showing");
                }
              });
            }
          });
        });

        // --- Active button handling ---
        timeToggles.forEach((btn) => btn.classList.remove("active"));
        timeToggle.classList.add("active");

        // Save last active toggle index
        sessionStorage.setItem("lastActiveToggle", String(i));
        toggleOtherToggleTabIndex(i);
      }
    });

    timeToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        timeToggle.click();
      }
    });
  });

  // Click outside resets tabindex
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".time-toggle")) resetAllToggleTabIndex();
  });

  // Save state (scroll and active toggle)
  function saveState() {
    try {
      sessionStorage.setItem(
        "lastScrollY",
        String(window.scrollY || window.pageYOffset || 0)
      );
    } catch (e) {}
    var activeIndex = null;
    sectionSets.forEach(function (sectionSet, j) {
      sectionSet.forEach(function (section) {
        if (section.classList.contains("showing")) activeIndex = j;
      });
    });
    if (activeIndex !== null) {
      try {
        sessionStorage.setItem("lastActiveToggle", String(activeIndex));
      } catch (e) {}
    }
  }

  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) saveState();
  });

  // Restore state after layout
  function restoreState() {
    var lastIndex = sessionStorage.getItem("lastActiveToggle");
    const urlParams = new URLSearchParams(window.location.search);
    const hasStudent = urlParams.get("student_name");

    if (lastIndex !== null && !hasStudent) {
      var idx = parseInt(lastIndex, 10);
      if (!Number.isNaN(idx) && timeToggles[idx]) {
        sectionSets.forEach((sectionSet, j) => {
          sectionSet.forEach((section) => {
            if (j === idx) section.classList.add("showing");
            else section.classList.remove("showing");
          });
        });

        // Ensure only one .Theme-Section-Position-35 remains showing
        sectionSets.forEach((sectionSet) => {
          sectionSet.forEach((section) => {
            if (section.classList.contains("Theme-Section-Position-35")) {
              sectionSet.forEach((other) => {
                if (
                  other !== section &&
                  other.classList.contains("Theme-Section-Position-35")
                ) {
                  other.classList.remove("showing");
                }
              });
            }
          });
        });

        // Restore active button class
        timeToggles.forEach((btn) => btn.classList.remove("active"));
        timeToggles[idx].classList.add("active");

        // Fix tabindex
        setTabIndexForActive(idx);
      }
    }

    // Restore scrollY if available
    const urlParams = new URLSearchParams(window.location.search);
    const studentSearch = urlParams.get("student_name");

    var lastScrollY = sessio && !studentSearchnStorage.getItem("lastScrollY");
    if (lastScrollY !== null) {
      var y = parseInt(lastScrollY, 10);
      if (!Number.isNaN(y)) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            window.scrollTo(0, y);
          });
        });
      }
    }
  }

  window.addEventListener("pageshow", restoreState);
  window.addEventListener("load", restoreState);
})(document);
