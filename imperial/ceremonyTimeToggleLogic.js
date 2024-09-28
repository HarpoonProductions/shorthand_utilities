(function (d) {
  var qs = "querySelector";
  var explore = d[qs](".sh-more");

  var timeToggles = d[qs + "All"](".time-toggle");
  var sectionSets = [
    d[qs + "All"](
      ".Theme-Section-Position-8, .Theme-Section-Position-9, .Theme-Section-Position-10, .Theme-Section-Position-11, .Theme-Section-Position-12, .Theme-Section-Position-13, .Theme-Section-Position-26"
    ),
    d[qs + "All"](
      ".Theme-Section-Position-14, .Theme-Section-Position-15, .Theme-Section-Position-16, .Theme-Section-Position-17, .Theme-Section-Position-18, .Theme-Section-Position-19, .Theme-Section-Position-26"
    ),
    d[qs + "All"](
      ".Theme-Section-Position-20, .Theme-Section-Position-21, .Theme-Section-Position-22, .Theme-Section-Position-23, .Theme-Section-Position-24, .Theme-Section-Position-25, .Theme-Section-Position-26"
    ),
  ];
  timeToggles.forEach((timeToggle, i) => {
    timeToggle.addEventListener("click", () => {
      sectionSets.forEach((sectionSet, j) => {
        if (i !== j) {
          sectionSet.forEach((section, k) => {
            if (k !== sectionSet.length - 1)
              section.classList.remove("showing");
          });
        } else {
          sectionSet.forEach((section, k) => {
            section.classList.toggle("showing");
            if (k === 0) {
              section.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              });
            }
          });
        }
      });
    });
  });

  explore.addEventListener("click", (e) => {
    if (!explore.classList.contains("view")) {
      explore.classList.add("view");
      explore.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else if (e.target.nodeName === "H2") {
      explore.classList.remove("view");
    }
  });
})(document);
