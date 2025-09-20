var lastScrollY = sessionStorage.getItem("lastScrollY");
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
