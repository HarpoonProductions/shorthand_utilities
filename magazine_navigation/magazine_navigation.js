(function () {
  var logoUrl =
    "https://edition-logos.s3.eu-west-2.amazonaws.com/90+percent+tablet-harpoon+(1).png";
  var logoUrlInner =
    "https://edition-logos.s3.eu-west-2.amazonaws.com/Harpoon+(1).png";

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
          const hrefTest = "../" + page + "/index.html";
          isCurrent = href === hrefTest;
        }

        links.push({ href, label, current: isCurrent });
      }

      Array.from(node.children).forEach((child) => dfs(child));
    }

    const rootUl = document.querySelector(
      ".Layout.Navigation__itemList.Theme-Navigation-ItemList"
    );
    dfs(rootUl);

    return links.map((link, i) => {
      if (i !== 0) return link;
      return {
        href: link.href,
        label: "Cover",
        isCurrent: link.isCurrent,
      };
    });
  }

  function fetchSrcset(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imageElement = doc.querySelector(
          ".Theme-TitleSection .Theme-BackgroundImage .Theme-Item-InstantImage source"
        );
        const srcset = imageElement
          ? imageElement.getAttribute("srcset")
          : null;
        console.log(srcset);
        return srcset;
      })
      .catch((error) => {
        console.error("Error fetching srcset:", error);
        return null;
      });
  }

  function createImageElement(srcset) {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("image_div");

    const img = new Image();
    img.srcset = srcset;

    img.onload = () => {
      imgDiv.style.opacity = "1";
    };

    imgDiv.appendChild(img);
    return imgDiv;
  }

  function createButtonWithImage(text, url, isPrevious, hide) {
    const buttonContainer = document.createElement("div");
    const button = document.createElement("div");
    const arrow = document.createElement("div");
    buttonContainer.classList.add("button_container");
    if (hide) buttonContainer.classList.add("hide");
    button.classList.add("button");
    arrow.classList.add("arrow");
    arrow.innerHTML = isPrevious ? "&#8592;" : "&#8594;";
    button.textContent =
      text &&
      text.replace(/\b(\w)(\w*)/g, function (_, firstLetter, restOfString) {
        return firstLetter.toUpperCase() + restOfString.toLowerCase();
      });

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(arrow);

    buttonContainer.addEventListener("click", () => {
      if (url) window.location.href = url;
    });

    if (url) {
      fetchSrcset(url).then((srcset) => {
        if (srcset) {
          const imgDiv = createImageElement(srcset);
          buttonContainer.appendChild(imgDiv);
        }
      });
    }

    return buttonContainer;
  }

  function renderCustomNavigation(links) {
    const currentIndex = links.findIndex((link) => link.current);

    const navContainer = document.createElement("div");
    navContainer.classList.add("nav_container");

    const prevUrl = currentIndex > 0 ? links[currentIndex - 1].href : null;
    const prevText = currentIndex > 0 ? links[currentIndex - 1].label : null;

    const prevButton = createButtonWithImage(
      prevText,
      prevUrl,
      true,
      currentIndex === 0
    );
    navContainer.appendChild(prevButton);

    const middleLogoContainer = document.createElement("div");
    const middleLogo = document.createElement("img");
    middleLogo.setAttribute("src", logoUrl);
    middleLogo.classList.add("edition-logo");
    middleLogoContainer.classList.add("button_container");
    middleLogoContainer.appendChild(middleLogo);
    navContainer.appendChild(middleLogoContainer);
    middleLogoContainer.addEventListener("click", () => {
      document.body.classList.toggle("show-custom-mini-nav");
      const miniNavCurrentLink = document.querySelector(
        ".show-custom-mini-nav .current-link"
      );
      if (miniNavCurrentLink) {
        miniNavCurrentLink.scrollIntoView({ block: "start" });
      }

      document.body.classList.remove("scroll-up");
    });

    const nextUrl =
      currentIndex < links.length - 1 ? links[currentIndex + 1].href : null;
    const nextText =
      currentIndex < links.length - 1 ? links[currentIndex + 1].label : null;

    console.log(currentIndex, links.length, links.length - 1);
    const nextButton = createButtonWithImage(
      nextText,
      nextUrl,
      false,
      currentIndex === links.length - 1
    );
    navContainer.appendChild(nextButton);

    document.body.appendChild(navContainer);

    // Add custom nav box
    const customMiniNavContainer = document.createElement("div");
    customMiniNavContainer.classList.add("custom-min-nav-container");

    // top logo
    const innerLogoAnchor = document.createElement("a");
    innerLogoAnchor.setAttribute("href", links[0].href);
    const innerLogoContainer = document.createElement("div");
    const innerLogo = document.createElement("img");
    innerLogo.setAttribute("src", logoUrlInner);
    innerLogo.classList.add("edition-logo-inner");
    innerLogoContainer.classList.add("inner-logo-container");
    innerLogoContainer.appendChild(innerLogo);
    innerLogoAnchor.appendChild(innerLogoContainer);
    customMiniNavContainer.appendChild(innerLogoAnchor);

    const customNavInner = document.createElement("div");
    customNavInner.classList.add("custom-min-nav-container-inner");
    links.forEach((link, i) => {
      const linkAnchor = document.createElement("a");
      const linkContainer = document.createElement("div");
      const linkText = document.createElement("p");
      const pageNumber = document.createElement("p");

      linkAnchor.classList.add("linkAnchor");
      linkContainer.classList.add("linkContainer");
      linkText.classList.add("linkText");
      pageNumber.classList.add("pageNumber");

      linkAnchor.setAttribute("href", link.href);
      linkText.innerHTML =
        link.label &&
        link.label.replace(
          /\b(\w)(\w*)/g,
          function (_, firstLetter, restOfString) {
            return firstLetter.toUpperCase() + restOfString.toLowerCase();
          }
        );
      pageNumber.innerHTML = "Page " + (i + 1);

      if (link.current) {
        linkAnchor.classList.add("current-link");
      }

      linkContainer.appendChild(linkText);
      linkContainer.appendChild(pageNumber);
      linkAnchor.appendChild(linkContainer);
      customNavInner.appendChild(linkAnchor);
    });
    customMiniNavContainer.addEventListener("click", () => {
      document.body.classList.toggle("show-custom-mini-nav");
      document.body.classList.remove("scroll-up");
    });

    customMiniNavContainer.appendChild(customNavInner);
    document.body.appendChild(customMiniNavContainer);

    document.body.addEventListener("click", function (event) {
      // Function to check if the clicked element or any of its parents have a specific class
      function hasClassInParents(element, className) {
        while (element) {
          if (element.classList && element.classList.contains(className)) {
            return true;
          }
          element = element.parentElement;
        }
        return false;
      }

      // Check if the clicked element or its parents have the specified classes
      const isCustomNavContainer = hasClassInParents(
        event.target,
        "custom-min-nav-container"
      );
      const isButtonContainer = hasClassInParents(
        event.target,
        "button_container"
      );

      // If the clicked element is not part of custom nav container or button container, remove the class
      if (!isCustomNavContainer && !isButtonContainer) {
        document.body.classList.remove("show-custom-mini-nav");
      }
    });
  }

  function startPollingExtractLinks() {
    let poller = setInterval(() => {
      const links = extractLinks();

      if (links.length > 0) {
        clearInterval(poller);
        renderCustomNavigation(links);
      }
    }, 500); // Poll every 1000 milliseconds (1 second)

    setTimeout(() => {
      clearInterval(poller); // Stop polling after 30 seconds
    }, 30000); // 30 seconds timeout
  }

  startPollingExtractLinks();
})();

let lastScrollTop = 0;
window.addEventListener(
  "scroll",
  () => {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
      // Scrolling down
      document.body.classList.add("custom-nav-hidden");
      document.body.classList.remove("show-custom-mini-nav");
    } else {
      // Scrolling up
      document.body.classList.remove("custom-nav-hidden");
      document.body.classList.add("scroll-up");
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  },
  false
);
