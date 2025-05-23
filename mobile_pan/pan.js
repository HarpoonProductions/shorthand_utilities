(function (d) {
  var qs = "querySelector";
  var ce = "createElement";
  var animatedTextOverMedias = d[qs + "All"](
    ".sh-pan-mobile, .sh-pan-mobile-right"
  );

  animatedTextOverMedias.forEach(function (section) {
    var isRight = section.classList.contains("sh-pan-mobile-right");

    var pictureContainer = section[qs](
      ".Theme-BackgroundImage > div > .FullSize:not(.Lazyload__loading)"
    );
    var picture = pictureContainer[qs](".Theme-Item-Picture");
    var image = picture[qs]("img");

    var src = image.getAttribute("src") || image.getAttribute("data-src");

    var duplicatePicture = d[ce]("img");
    var duplicatePicture2 = d[ce]("img");

    duplicatePicture.setAttribute("src", src);
    duplicatePicture2.setAttribute("src", src);

    if (d[qs]("html").classList.contains("DeviceDetect--isiOS")) {
      var duplicateContainer = d[ce]("div");

      duplicatePicture.classList.add("image-settings");
      duplicatePicture2.classList.add("image-settings");
      duplicateContainer.classList.add("settings-container");

      duplicateContainer.appendChild(duplicatePicture);
      duplicateContainer.appendChild(duplicatePicture2);
      pictureContainer.appendChild(duplicateContainer);

      setTimeout(function () {
        var imageWidth = duplicatePicture.width;

        console.log(imageWidth, window.innerWidth);

        var keyframes1 = [{ left: 0 }, { left: "-" + imageWidth + "px" }];

        var keyframes2 = [
          { right: imageWidth * 2 - window.innerWidth + "px" },
          { right: imageWidth - window.innerWidth + "px" },
        ];

        duplicateContainer.animate(!isRight ? keyframes1 : keyframes2, {
          duration: 20000,
          iterations: Infinity,
        });
      }, 2000);
    } else {
      var animateClass1 = isRight ? "animate-image-1-right" : "animate-image-1";
      var animateClass2 = isRight ? "animate-image-2-right" : "animate-image-2";

      duplicatePicture.classList.add("animate-image");
      duplicatePicture2.classList.add("animate-image");
      duplicatePicture.style.maxWidth = "none";
      duplicatePicture2.style.maxWidth = "none";

      duplicatePicture.classList.add(animateClass1);
      duplicatePicture2.classList.add(animateClass2);

      pictureContainer.appendChild(duplicatePicture);
      pictureContainer.appendChild(duplicatePicture2);
    }
  });

  // setTimeout(() => {
  //   var animated = d[qs](".animate-image");
  //   var styles = getComputedStyle(animated);
  //   alert(
  //     `width: ${styles.width} maxWidth: ${styles.maxWidth} height: ${styles.height}`
  //   );
  // }, 4000);
})(document);

(function () {
  console.log("running hack");
  const href = window.location.href;
  const button = document.querySelector(".reveal-button-multiple > button");
  const check = new RegExp("everything-you-need-to-know-2025", "gi");

  if (button && check.test(href)) {
    console.log(button);
    button.setAttribute("onclick", "toggleSections(13, 14, 15, 16, 17)");
  }
})();
