document.addEventListener("DOMContentLoaded", () => {
  const navs = document.querySelectorAll('[role="navigation"]');
  navs.forEach((nav, i) => {
    if (i === 0) nav.setAttribute("aria-label", "Main navigation");
    else if (i === 1) {
      nav.setAttribute("id", "project-navigation");
      nav.setAttribute("aria-label", "Project navigation");
    } else nav.setAttribute("aria-label", "nav-" + i);
  });
});
