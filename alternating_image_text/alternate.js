function setBackgroundClass(prevColour, length) {
  var oddness = length % 2 === 0 ? "even" : "odd";
  var char = prevColour.split("").pop();

  return {
    evenk: "light",
    event: "dark",
    oddk: "light-to-dark",
    oddt: "dark-to-light",
  }[oddness + char];
}

(function (d) {
  var qs = "querySelector";
  var ce = "createElement";
  var index = 1;
  var timelineSections = d[qs + "All"](".sh-timeline");
  var prevColour = "light";

  timelineSections.forEach(function (s, i) {
    var yearTextBlocks = s[qs + "All"](".InlineHTML");
    var innerBodyText = s[qs](".Theme-Layer-BodyText--inner");

    var timelineColour = setBackgroundClass(prevColour, yearTextBlocks.length);
    s.classList.add("sh-background-alternate-" + timelineColour);
    prevColour = timelineColour;

    yearTextBlocks.forEach(function (b) {
      var image = b.nextElementSibling;
      var container = d[ce]("div");
      var subcontainer = d[ce]("div");
      var alignment = index % 2 === 0 ? "left" : "right";

      container.classList.add("sh-year-container");
      container.classList.add("sh-year-image-" + alignment);
      container.appendChild(subcontainer);
      subcontainer.appendChild(b);
      subcontainer.appendChild(image);
      innerBodyText.appendChild(container);

      index++;
    });
  });
})(document);
