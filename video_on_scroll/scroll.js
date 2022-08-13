var videoFrom = 0,
  videoTo = null,
  scrollSpeed = 0.22,
  sized = false,
  element = document.querySelector(".sh-video-section .Layer--one"),
  secVideo = document.querySelector(".sh-video-section"),
  video = document.querySelector(".navigation-video-container video"),
  afterVideoSec = secVideo.nextElementSibling,
  textBlocks = document.querySelectorAll(".text-block"),
  supportPageOffset = void 0 !== window.pageXOffset,
  isCSS1Compat = "CSS1Compat" === (document.compatMode || "");

function getRanges(textBlocks) {
  var ranges = [];
  textBlocks.forEach(function (textBlock) {
    var time = textBlock.className.match(/\d{0,3}$/)[0];
    if (time) {
      time = +time;
      ranges.push([time - 1.3, time - 0.7, time + 0.7, time + 1.3]);
    } else {
      ranges.push([]);
    }
  });
  return ranges;
}

var ranges = getRanges(textBlocks);
var src = video.currentSrc || video.src;

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

function throttle(e, t) {
  var o = !1;
  return function () {
    o ||
      (e.apply(this, arguments),
      (o = !0),
      setTimeout(function () {
        o = !1;
      }, t));
  };
}

function updateSize() {
  video.readyState &&
    ((element.style.height = window.innerHeight + "px;"),
    getHeightOrWidth(element) / getHeightOrWidth(element, !0) >
    video.videoWidth / video.videoHeight
      ? (video.style = "height: auto; width: 100%;")
      : (video.style = "height: 100%; width: auto;"));
}

function updatePosition(e, t) {
  var o = getOffset(afterVideoSec),
    i = window.innerHeight,
    n = Math.ceil(t.top),
    d = Math.floor(o.top),
    l = Math.floor(getHeightOrWidth(element, !0));
  if (e > n)
    if (e > d - l) {
      element.setAttribute(
        "style",
        "height: " + i + "px; position: absolute; inset: auto 0px 0px;"
      );
      textBlocks.forEach(function (e, t) {
        e.style.transform = "translate(-50%, -10vh)";
      });
    } else {
      t.left;
      element.setAttribute(
        "style",
        "position: fixed; height: " + i + "px; inset: 0px 0px auto;"
      );
    }
  else {
    element.setAttribute(
      "style",
      "position: relative; height: " + i + "px; inset: auto;"
    );
    textBlocks.forEach(function (e, t) {
      e.style.transform = "translate(-50%, -150vh)";
    });
  }
}

function convertRange(OldValue, OldMin, OldMax, NewMin, NewMax) {
  return ((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin) + NewMin;
}

function playVideo(e, t) {
  if (video.readyState) {
    var o = video.duration,
      i = e - t.top;
    if (i > 0) {
      var n =
        videoFrom +
        (i / (secVideo.clientHeight - element.clientHeight)) *
          (videoTo ? videoTo - videoFrom : o);
      if (n > videoTo || n < videoFrom) return;

      video.currentTime = n;

      textBlocks.length &&
        textBlocks.forEach(function (textBox, i) {
          var range = ranges[+i],
            val;

          if (range.length == 0 || range[0] > n) {
            val = 0;
          } else if (range[3] < n) {
            val = 150;
          } else if (range[1] > n) {
            val = convertRange(n, range[0], range[1], 0, 74);
          } else if (range[2] < n) {
            val = convertRange(n, range[2], range[3], 86, 140);
          } else {
            val = convertRange(n, range[1], range[2], 75, 85);
          }

          textBox.style.transform =
            "translate(-50%, -" + Math.floor(val) + "vh)";
        });
    }
  }
}

function callbackA() {
  var e = supportPageOffset
      ? window.pageYOffset
      : isCSS1Compat
      ? document.documentElement.scrollTop
      : document.body.scrollTop,
    t = getOffset(secVideo);
  updatePosition(e, t), playVideo(e, t);
}

function callbackB() {
  if (!sized) {
    updateSize();
    sized = true;
  }
  var e = supportPageOffset
      ? window.pageYOffset
      : isCSS1Compat
      ? document.documentElement.scrollTop
      : document.body.scrollTop,
    t = getOffset(secVideo);
  updatePosition(e, t), playVideo(e, t);
}

function videoReady() {
  !video.currentTime && videoFrom > 0 && (video.currentTime = videoFrom),
    videoTo || (videoTo = video.duration),
    video.pause(),
    updateSize();
}

(secVideo.style = "height: " + 2e3 / scrollSpeed + "px;"),
  video.readyState > 0 ? videoReady() : (video.oncanplay = videoReady),
  document.addEventListener("DOMContentLoaded", function () {
    callbackA();
    setTimeout(function () {
      if (window["fetch"]) {
        fetch(src)
          .then((response) => response.blob())
          .then((response) => {
            var blobURL = URL.createObjectURL(response);

            var t = video.currentTime;

            video.setAttribute("src", blobURL);
            video.currentTime = t + 0.01;
            video.pause();
            updateSize();
          });
      }
    }, 1000);
    video.pause();
  }),
  window.addEventListener("scroll", throttle(callbackB, 18)),
  window.addEventListener("resize", throttle(updateSize, 100));
