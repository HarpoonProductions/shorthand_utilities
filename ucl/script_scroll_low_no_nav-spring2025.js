/* Re-use of this code on stories not produced by Harpoon Productions is not permitted */

function pollForCards(list, minCount = 2, timeout = 5000, interval = 100) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkCards = () => {
      const cards = list.querySelectorAll(
        ".Theme-RelatedStoriesSection:not(.sh-more) .related-story-card"
      );

      if (cards.length > minCount) {
        resolve(cards);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for related story cards"));
      } else {
        setTimeout(checkCards, interval);
      }
    };

    checkCards();
  });
}

(function () {
  let currentPageIndex = null;

  var logoUrl =
    "https://harpn.s3.eu-west-2.amazonaws.com/ucl/ucl_icon.jpg";
  var logoUrlInner =
    "https://harpn.s3.eu-west-2.amazonaws.com/ucl/ucl-logo-purple.png";

  async function extractLinks(list) {
    const links = [];
    const currentUrl = window.location.href;

    await pollForCards(list);

    function getLink(node) {
      if (node.tagName !== "A") return;

      const href = node.getAttribute("href");
      const label = node.textContent.trim();
      let isCurrent = false;

      if (/preview\.shorthand\.com/.test(currentUrl)) {
        isCurrent = href === currentUrl;
      } else if (
        window.location.href.split("/").length === 5 &&
        href === "index.html"
      ) {
        isCurrent = true;
      } else {
        const page = window.location.href.split("/")[4];
        isCurrent = href === "../../" + page + "/index.html";
      }

      if (!isCurrent) {
        const pathname = window.location.pathname;
        const clean = pathname.replace("/issue-32", "");
        const check = new RegExp(clean, "gi");
        isCurrent = clean !== "/index.html" && check.test(href);
      }

      if (
        !isCurrent &&
        href === "index.html" &&
        (window.location.pathname === "/" ||
          window.location.pathname === "/index.html")
      ) {
        isCurrent = true;
      }

      links.push({ href, label, current: isCurrent });
    }

    const cards = list.querySelectorAll(
      ".Theme-RelatedStoriesSection:not(.sh-more) .related-story-card"
    );

    cards.forEach(getLink);

    links.forEach((link, i) => {
      if (link.current) {
        currentPageIndex = i < links.length - 1 ? i : 0;
      }
    });

    return links;
  }

  /* ---------- UI helpers unchanged ---------- */

  const createSpinner = () => {
    const div = document.createElement("div");
    div.className = "spinnerSVG";
    div.style.cssText =
      "width:100%;height:100%;display:flex;justify-content:center;align-items:center;";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "40");
    svg.setAttribute("height", "40");
    svg.setAttribute("viewBox", "0 0 50 50");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "25");
    circle.setAttribute("cy", "25");
    circle.setAttribute("r", "20");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#3498db");
    circle.setAttribute("stroke-width", "5");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-dasharray", "80,200");

    const anim = document.createElementNS(svgNS, "animateTransform");
    anim.setAttribute("attributeName", "transform");
    anim.setAttribute("type", "rotate");
    anim.setAttribute("from", "0 25 25");
    anim.setAttribute("to", "360 25 25");
    anim.setAttribute("dur", "1s");
    anim.setAttribute("repeatCount", "indefinite");

    circle.appendChild(anim);
    svg.appendChild(circle);
    div.appendChild(svg);

    return div;
  };

  /* ---------- Navigation rendering unchanged ---------- */

  function renderCustomNavigation(links) {
    const currentIndex = links.findIndex((l) => l.current);
    document.body.classList.add("custom-nav-hidden");

    const nav = document.createElement("div");
    nav.classList.add("nav_container");

    const prev = currentIndex > 0 ? links[currentIndex - 1].href : null;
    const next =
      currentIndex < links.length - 1 ? links[currentIndex + 1].href : null;

    nav.appendChild(
      createButtonWithImage("Previous", prev, true, currentIndex <= 0)
    );

    const mid = document.createElement("div");
    mid.className = "button_container contents";
    mid.innerHTML = `<img class="edition-logo" src="${logoUrl}"><p class="contents-label">Contents</p>`;
    nav.appendChild(mid);

    nav.appendChild(
      createButtonWithImage("Next", next, false, currentIndex === links.length - 1)
    );

    document.body.appendChild(nav);

    const mini = document.createElement("div");
    mini.className = "custom-min-nav-container";
    mini.innerHTML = `
      <a href="${links[0].href}">
        <div class="inner-logo-container">
          <img class="edition-logo-inner" src="${logoUrlInner}">
        </div>
      </a>
    `;
    mini.appendChild(createSpinner());
    document.body.appendChild(mini);
  }

  /* ---------- DOM bootstrap ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    let attempts = 0;
    const maxAttempts = 50;

    const pollForElement = async () => {
      const lists = document.querySelectorAll(
        ".Theme-RelatedStoriesSection:not(.sh-more) ul[data-related-stories-list='true']"
      );

      if (lists.length || attempts >= maxAttempts) {
        clearInterval(interval);

        if (!lists.length) return;

        const list = lists[lists.length - 1];
        const links = await extractLinks(list);

        renderCustomNavigation(links);
        initializeCarousel(list);

        startMiniNavCarouselPolling();
      }

      attempts++;
    };

    const interval = setInterval(pollForElement, 200);
  });

  /* ---------- Carousel logic unchanged except gating ---------- */

  function startMiniNavCarouselPolling() {
    const poller = setInterval(() => {
      const slides = document.querySelectorAll(
        '.Theme-RelatedStoriesSection:not(.sh-more) ul[data-related-stories-list="true"] li'
      );
      const nav = document.querySelector(".custom-min-nav-container");

      if (slides.length > 3 && nav) {
        clearInterval(poller);
        nav.querySelector(".spinnerSVG")?.remove();

        const blocks = document.querySelectorAll(
          ".Theme-RelatedStoriesSection:not(.sh-more)"
        );
        nav.appendChild(blocks[blocks.length - 1]);
      }
    }, 150);

    setTimeout(() => clearInterval(poller), 10000);
  }
})();
