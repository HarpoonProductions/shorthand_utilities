var ce = "createElement",
  qs = "querySelector";

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
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let elem = entry.target;
        console.log(entry.intersectionRatio);
        if (
          entry.intersectionRatio > 0.15 &&
          !elem.classList.contains("appear")
        ) {
          elem.classList.add("appear");
        }
      }
    });
  },
  {
    root: null,
    rootMargin: "290px 0px 0px 0px",
    threshold: buildThresholdList(),
  }
);

(function (d) {
  var textChunks = d[qs + "All"](
    ".Theme-Layer-BodyText--inner p, .Theme-Layer-BodyText--inner h5, .Theme-Layer-BodyText--inner h4, .Theme-Layer-BodyText--inner h3, .Theme-Layer-BodyText--inner h2, .Theme-Layer-BodyText--inner h1"
  );

  textChunks.forEach(function (textChunk) {
    observer.observe(textChunk);
  });
})(document);
