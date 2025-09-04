document.addEventListener("DOMContentLoaded", function () {
  function waitForCeremonyLink(attempts = 0) {
    const ceremonyLink = Array.from(
      document.querySelectorAll(".Theme-NavigationLink")
    ).find((link) => link.textContent.trim() === "Ceremony guides");

    if (!ceremonyLink) {
      if (attempts > 20) {
        console.warn("Ceremony guides link not found after multiple attempts.");
        return;
      }
      setTimeout(() => waitForCeremonyLink(attempts + 1), 250); // retry in 250ms
      return;
    }

    // DROPDOWN + TOGGLE LOGIC BELOW WILL RUN ONLY ONCE LINK EXISTS

    const dropdown = document.createElement("div");
    dropdown.className = "custom-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";
    dropdown.style.background = "rgb(35, 35, 51)";
    dropdown.style.border = "none";
    dropdown.style.display = "none";
    dropdown.style.minWidth = "150%";
    dropdown.style.textAlign = "left";
    dropdown.style.zIndex = "1000";
    dropdown.style.padding = "8px";

    const items = [
      {
        label: "Business School: Management, Specialised, Doctoral",
        scrollToId: "monday-11",
        sections:
          ".Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8, .Theme-Section-Position-9",
      },
      {
        label: "Business School: MBA, Finance",
        scrollToId: "monday-14-30",
        sections:
          ".Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-14",
      },
      {
        label: "Medicine, CHERS, CLCC",
        scrollToId: "tuesday-10-30",
        sections:
          ".Theme-Section-Position-15, .Theme-Section-Position-16, .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19",
      },
      {
        label: "Natural Sciences",
        scrollToId: "tuesday-13-45",
        sections:
          ".Theme-Section-Position-20, .Theme-Section-Position-21, .Theme-Section-Position-22, .Theme-Section-Position-23, .Theme-Section-Position-24",
      },
      {
        label: "Engineering",
        scrollToId: "tuesday-16-45",
        sections:
          ".Theme-Section-Position-25, .Theme-Section-Position-26, .Theme-Section-Position-27, .Theme-Section-Position-28, .Theme-Section-Position-29",
      },
    ];

    items.forEach((item) => {
      const link = document.createElement("div");
      link.textContent = item.label;
      link.style.display = "block";
      link.style.padding = "8px";
      link.style.textDecoration = "none";
      link.style.color = "#fff";
      link.style.cursor = "pointer";

      // Hover styling (matches your earlier request)
      link.addEventListener("mouseenter", () => {
        link.style.backgroundColor = "#40E0D04D";
        link.style.color = "white";
      });
      link.addEventListener("mouseleave", () => {
        link.style.backgroundColor = "transparent";
        link.style.color = "#fff";
      });

      link.addEventListener("click", function (e) {
        e.preventDefault();

        const allSections = document.querySelectorAll(`
          .Theme-Section-Position-5, .Theme-Section-Position-6, .Theme-Section-Position-7, .Theme-Section-Position-8, .Theme-Section-Position-9, .Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16, .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19, .Theme-Section-Position-20, .Theme-Section-Position-21, .Theme-Section-Position-22, .Theme-Section-Position-23, .Theme-Section-Position-24, .Theme-Section-Position-25, .Theme-Section-Position-26, .Theme-Section-Position-27, .Theme-Section-Position-28, .Theme-Section-Position-29
        `);
        allSections.forEach((section) => section.classList.remove("showing"));

        const sections = document.querySelectorAll(item.sections);
        sections.forEach((section) => {
          section.classList.add("showing");
        });

        const target = document.getElementById(item.scrollToId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        dropdown.style.display = "none";
      });

      dropdown.appendChild(link);
    });

    const parentItem = ceremonyLink.closest(".Theme-NavigationBarItem");
    if (parentItem) {
      parentItem.style.position = "relative";
      parentItem.appendChild(dropdown);

      parentItem.addEventListener("mouseenter", () => {
        dropdown.style.display = "block";
      });
      parentItem.addEventListener("mouseleave", () => {
        dropdown.style.display = "none";
      });
    }

    function updateFloatingBars() {
      const bars = document.querySelectorAll(".floating-day-bar");

      bars.forEach((bar) => {
        const section = bar.closest("section");
        if (!section) return;

        const rect = section.getBoundingClientRect();

        // Check if the section is below the top of the viewport
        if (rect.top <= 0 && section.classList.contains("showing")) {
          bar.classList.add("visible"); // Show bar when section is in view
        } else {
          bar.classList.remove("visible"); // Hide bar if above or not showing
        }
      });
    }

    window.addEventListener("scroll", updateFloatingBars);
    updateFloatingBars();
  }

  waitForCeremonyLink(); // Start checking
});
