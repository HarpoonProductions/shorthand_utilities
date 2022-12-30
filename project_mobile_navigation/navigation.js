(function (d) {
  var qs = "querySelector";
  var navBar = d[qs](".Project-Navigation");
  var navToggles = d[qs + "All"](".Theme-NavigationBarItem.hasMenu");
  navToggles.forEach(function (navItem, i) {
    navItem.classList.add("submenu_" + i);
    navItem.addEventListener("click", function () {
      var width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      if (width <= 600) {
        navToggles.forEach(function (navItem) {
          if (!navItem.classList.contains("submenu_" + i))
            navItem.classList.remove("isOpenMobile");
        });
        if (this.classList.contains("isOpenMobile")) {
          this.classList.remove("isOpenMobile");
          navBar.classList.remove("mobileSubmenu");
        } else {
          this.classList.add("isOpenMobile");
          navBar.classList.add("mobileSubmenu");
          this.scrollIntoView();
        }
      }
    });
  });
})(document);
