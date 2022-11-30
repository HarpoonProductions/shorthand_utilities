var ce = "createElement",
  qs = "querySelector";

var b = document.body;
var colours = ["colour_1", "colour_2", "colour_3", "colour_4", "colour_5"];

function buildThresholdList() {
  let thresholds = [];
  let numSteps = 20;

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

var observer = new IntersectionObserver(
  function intersectionCallback(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var elem = entry.target;
        var classes = [].slice.apply(elem.classList);
        var rawColour = classes.find(function (c) {
          return /^sh-/.test(c);
        });
        var colour = rawColour && rawColour.replace("sh-", "");
        if (entry.intersectionRatio > 0) {
          if (!b.classList.contains(colour)) {
            b.classList.add(colour);
            var toRemove = colours.filter(function (c) {
              return c !== colour;
            });
            toRemove.forEach(function (c) {
              b.classList.remove(c);
            });
          }
        }
      }
    });
  },
  {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: buildThresholdList(),
  }
);

function observeColourSection(n) {
  var colourSectionHeadings = document[qs + "All"](".sh-colour_" + n + " h2");

  colourSectionHeadings.forEach(function (heading) {
    heading.classList.add("sh-" + colours[n - 1]);
    observer.observe(heading);
  });
}

(function () {
  [1, 2, 3, 4, 5].forEach(observeColourSection);
})();
