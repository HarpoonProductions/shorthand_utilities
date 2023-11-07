(function (d) {
  var qs = "querySelector";
  var titleSection = d[qs](".Theme-TitleSection");
  var secondSection = d[qs](".Theme-TitleSection + .Theme-Section");
  titleSection.addEventListener("click", function () {
    secondSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });
})(document);
