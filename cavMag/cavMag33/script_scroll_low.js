function extractLinks() {
  const links = [];
  const currentUrl = window.location.href;

  function dfs(node) {
    if (node.tagName === "A") {
      const href = node.getAttribute("href");
      const label = node.textContent.trim();
      let isCurrent;

      if (/preview\.shorthand\.com/.test(currentUrl)) {
        isCurrent = href === currentUrl;
      } else if (
        window.location.href.split("/").length === 5 &&
        href === "index.html"
      ) {
        isCurrent = true;
      } else {
        const page = window.location.href.split("/")[4];
        const hrefTest = "../../" + page + "/index.html";
        isCurrent = href === hrefTest;
      }

      if (!isCurrent) {
        const pathname = window.location.pathname;
        const clean = pathname.replace("/issue-32", "");
        const check = new RegExp(clean, "gi");
        isCurrent = clean !== "/index.html" && check.test(href);
      }

      links.push({
        href,
        label,
        current: isCurrent,
      });
    }

    Array.from(node.children).forEach((child) => dfs(child));
  }

  const rootUl = document.querySelector(
    ".Project-HeaderContainer .Layout.Navigation__itemList.Theme-Navigation-ItemList"
  );
  dfs(rootUl);

  // FIX: Set currentPageIndex after the links array is fully built
  const currentIndex = links.findIndex((link) => link.current);
  if (currentIndex !== -1) {
    console.log("current link is", links[currentIndex].href);
    currentPageIndex = currentIndex;
  }

  return links.map((link, i) => {
    // Remove the problematic currentPageIndex assignment from here
    if (i !== 0) return link;
    return {
      href: link.href,
      label: link.label,
      current: link.current,
    };
  });
}
