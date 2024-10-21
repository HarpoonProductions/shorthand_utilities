var ce = "createElement",
  qs = "querySelector",
  supportPageOffset = void 0 !== window.pageXOffset,
  isCSS1Compat = "CSS1Compat" === (document.compatMode || "");

var currentTarget, innerScroll, viewportHeight, divider, maxScroll;

function getHeight(e) {
  return window.getComputedStyle
    ? getComputedStyle(e, null).height
    : getPixelValue(e, e.currentStyle.height);
}

function getWidth(e) {
  return window.getComputedStyle
    ? getComputedStyle(e, null).width
    : getPixelValue(e, e.currentStyle.width);
}

function getHeightOrWidth(e, t) {
  return +(t ? getHeight(e) : getWidth(e)).replace("px", "");
}

function getOffset(e) {
  if (!e.getClientRects().length)
    return {
      top: 0,
      left: 0,
    };
  let t = e.getBoundingClientRect(),
    o = e.ownerDocument.defaultView;
  return {
    top: t.top + o.pageYOffset,
    left: t.left + o.pageXOffset,
  };
}

// For throttling the scroll handler
var waiting = false;

function scrollFunction() {
  console.log("scroll");
  var viewportTopX = supportPageOffset
    ? window.pageYOffset
    : isCSS1Compat
    ? document.documentElement.scrollTop
    : document.body.scrollTop;
  var viewportBottomX = viewportTopX + viewportHeight;
  var elementHeight = getHeightOrWidth(currentTarget, true);
  var elementTopX = getOffset(currentTarget).top;
  var elementBottomX = elementTopX + elementHeight;
  var rawPercentage =
    (viewportBottomX - elementTopX) /
      ((viewportHeight + elementHeight) / divider) -
    50;

  var percentage =
    rawPercentage < 0
      ? 0
      : rawPercentage < maxScroll
      ? rawPercentage
      : maxScroll;

  if (!waiting) {
    console.log("update");
    innerScroll.style.transform = "translateX(-" + percentage + "%)";
    waiting = true;
    setTimeout(function () {
      waiting = false;
    }, 10);
  }
}

var observer = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(function (entry) {
      var target = entry.target;

      if (entry.isIntersecting) {
        currentTarget = target;
        innerScroll = target[qs](".horizontal-scroll__inner");
        divider = innerScroll.childElementCount * 100;
        maxScroll = divider - 100;
        viewportHeight = window.innerHeight;
        document.addEventListener("scroll", scrollFunction);
      } else {
        document.removeEventListener("scroll", scrollFunction);
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);

(function (d) {
  var horizontalStarts = d[qs + "All"](".sh-horizontal-start");

  horizontalStarts.forEach(function (section, index) {
    var container = d[ce]("div");
    var scrollContainer = d[ce]("div");
    var innerContainer = d[ce]("div");
    container.classList.add("horizontal-scroll");
    container.classList.add("horizontal-scroll__" + index);
    scrollContainer.classList.add("horizontal-scroll__container");
    innerContainer.classList.add("horizontal-scroll__inner");

    scrollContainer.appendChild(innerContainer);
    container.appendChild(scrollContainer);
    section.parentNode.insertBefore(container, section);

    let temp = section;
    let childCount = 0;

    do {
      s = temp;
      s.classList.add("horizontal-scroll__item");
      temp = s.nextElementSibling;
      innerContainer.appendChild(s);
      childCount++;
    } while (!s.classList.contains("sh-horizontal-end"));

    if (childCount === 2) {
      innerContainer
        .querySelector(".sh-horizontal-start")
        .classList.add("horizontal_align_right");
      innerContainer
        .querySelector(".sh-horizontal-end")
        .classList.add("horizontal_align_left");
    }

    container.style.height = childCount * 140 + "vh";
    observer.observe(container);
  });
})(document);
