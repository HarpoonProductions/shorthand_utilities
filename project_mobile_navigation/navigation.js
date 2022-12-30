(function (d) {
  var qs = "querySelector";
  var ce = "createElement";
  var closeMenu = d[ce]("div");
  closeMenu.classList.add("closeMobileMenu");
  var navBar = d[qs](".Project-Navigation");
  navBar.after(closeMenu);
  var navToggles = d[qs + "All"](".Theme-NavigationBarItem.hasMenu");
  navToggles.forEach(function (navItem) {
    navItem.addEventListener("click", function () {
      if (!this.classList.contains("isOpenMobile")) {
        this.classList.add("isOpenMobile");
        this.scrollIntoView();
      } else {
        this.classList.add("isOpenMobile");
      }
      if (!navBar.classList.contains("mobileSubmenu")) {
        navBar.classList.remove("mobileSubmenu");
      }
    });
  });
  closeMenu.addEventListener("click", function () {
    navBar.classList.remove("mobileSubmenu");
    navToggles.forEach(function (navItem) {
      navItem.classList.remove("isOpenMobile");
    });
  });
})(document);
