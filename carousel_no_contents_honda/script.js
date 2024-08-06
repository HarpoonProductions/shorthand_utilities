(function () {
  let currentPageIndex = null;
  var logoUrl =
    "https://harpn.s3.eu-west-2.amazonaws.com/imperial/imperial_logo.png";
  var logoUrlInner =
    "https://harpn.s3.eu-west-2.amazonaws.com/imperial/Imperial_college_full_logo.png";

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

    return links;
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
          ".Theme-TitleSection .Theme-BackgroundMedia .Theme-Item-InstantImage source"
        );
        const srcset = imageElement
          ? imageElement.getAttribute("srcset")
          : null;
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
    const buttonContainer = document.createElement("a");
    const button = document.createElement("div");
    const arrow = document.createElement("div");

    buttonContainer.classList.add("button_container");

    if (isPrevious) {
      buttonContainer.classList.add("prev");
      buttonContainer.setAttribute("tabindex", "1");
      if (!hide)
        buttonContainer.setAttribute("aria-label", "Link To Previous Story");

      if (url) {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;
        const minSwipeDistance = 75; // Minimum pixels to be considered a swipe
        const maxVerticalDistance = 100; // Maximum vertical distance to still consider it a horizontal swipe

        document.body.addEventListener("touchstart", (e) => {
          touchstartX = e.changedTouches[0].screenX;
          touchstartY = e.changedTouches[0].screenY;
        });

        document.body.addEventListener("touchend", (e) => {
          touchendX = e.changedTouches[0].screenX;
          touchendY = e.changedTouches[0].screenY;
          let horizontalDistance = touchendX - touchstartX;
          let verticalDistance = Math.abs(touchendY - touchstartY); // Absolute value to handle both up and down swipes

          if (
            !e.target.closest(".Theme-RelatedStories") &&
            horizontalDistance > minSwipeDistance &&
            verticalDistance < maxVerticalDistance
          ) {
            window.location.href = url; // Navigate if swipe is valid and predominantly horizontal
          }
          // Always reset the touch coordinates to start fresh for the next swipe
          touchstartX = 0;
          touchstartY = 0;
          touchendX = 0;
          touchendY = 0;
        });
      }
    } else {
      buttonContainer.classList.add("next");
      buttonContainer.setAttribute("tabindex", "2");
      if (!hide)
        buttonContainer.setAttribute("aria-label", "Link To Next Story");

      if (url) {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;
        const minSwipeDistance = 75; // Minimum pixels to be considered a swipe
        const maxVerticalDistance = 100; // Maximum vertical distance to still consider it a horizontal swipe

        document.body.addEventListener("touchstart", (e) => {
          touchstartX = e.changedTouches[0].screenX;
          touchstartY = e.changedTouches[0].screenY;
        });

        document.body.addEventListener("touchend", (e) => {
          touchendX = e.changedTouches[0].screenX;
          touchendY = e.changedTouches[0].screenY;
          let horizontalDistance = touchstartX - touchendX;
          let verticalDistance = Math.abs(touchendY - touchstartY); // Absolute value to handle both up and down swipes

          if (
            !e.target.closest(".Theme-RelatedStories") &&
            horizontalDistance > minSwipeDistance &&
            verticalDistance < maxVerticalDistance
          ) {
            window.location.href = url; // Navigate if swipe is valid and predominantly horizontal
          }
          // Always reset the touch coordinates to start fresh for the next swipe
          touchstartX = 0;
          touchstartY = 0;
          touchendX = 0;
          touchendY = 0;
        });
      }
    }

    if (hide) {
      buttonContainer.classList.add("hide");
      buttonContainer.setAttribute("tabindex", "-1");
    }
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

    if (url) buttonContainer.setAttribute("href", url);

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
    console.log("completed list", links);
    const currentIndex = links.findIndex((link) => link.current);
    document.body.classList.add("custom-nav-hidden");

    const navContainer = document.createElement("div");
    navContainer.classList.add("nav_container");

    const prevUrl = currentIndex > 0 ? links[currentIndex - 1].href : null;
    const prevText = currentIndex > 0 ? links[currentIndex - 1].label : null;

    const prevButton = createButtonWithImage(
      prevText,
      prevUrl,
      true,
      currentIndex <= 0
    );
    navContainer.appendChild(prevButton);

    const middleLogoContainer = document.createElement("div");
    const middleLogo = document.createElement("img");
    const contentsLabel = document.createElement("p");
    contentsLabel.classList.add("contents-label");
    contentsLabel.innerText = "Contents";
    middleLogo.setAttribute("src", logoUrl);
    middleLogo.classList.add("edition-logo");
    middleLogoContainer.classList.add("button_container");
    middleLogoContainer.classList.add("contents");
    middleLogoContainer.appendChild(middleLogo);
    middleLogoContainer.appendChild(contentsLabel);

    const nextUrl =
      currentIndex < links.length - 1 ? links[currentIndex + 1].href : null;
    const nextText =
      currentIndex < links.length - 1 ? links[currentIndex + 1].label : null;

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

    customMiniNavContainer.addEventListener("click", () => {
      document.body.classList.remove("scroll-up");
    });

    document.body.appendChild(customMiniNavContainer);

    document.body.addEventListener("click", function (event) {
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
      if (
        !isCustomNavContainer &&
        !isButtonContainer &&
        !event.target.closest(".Theme-RelatedStories")
      ) {
        document.body.classList.remove("show-custom-mini-nav");
        document.body.classList.remove("tab_container");
        document.body.classList.remove("tab_options");
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

  document.addEventListener("DOMContentLoaded", () => {
    let lastPosition = 1; // Track the last observed position

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(entry.target.className);

            const currentPosition = parseInt(
              entry.target.className.match(/Theme-Section-Position-(\d+)/)[1],
              10
            );

            if (currentPageIndex === 0 && currentPosition === 1) {
              document.body.classList.add("custom-nav-hidden");
              document.body.classList.remove("show-custom-mini-nav");
              document.body.classList.remove("tab_container");
              document.body.classList.remove("tab_options");
            } else if (/Final-ABCDEFGHI/.test(entry.target.className)) {
              document.body.classList.remove("custom-nav-hidden");
              document.body.classList.add("scroll-up");
            } else if (currentPosition > lastPosition) {
              // Scrolling down
              document.body.classList.add("custom-nav-hidden");
              document.body.classList.remove("show-custom-mini-nav");
              document.body.classList.remove("tab_container");
              document.body.classList.remove("tab_options");
            } else if (currentPosition <= lastPosition) {
              // Scrolling up
              document.body.classList.remove("custom-nav-hidden");
              document.body.classList.add("scroll-up");
            }

            // Update lastPosition for the next intersection
            lastPosition = currentPosition;

            if (/Final-ABCDEFGHI/.test(entry.target.className)) {
              document.body.classList.remove("custom-nav-hidden");
              document.body.classList.add("scroll-up");
            }
          }
        });
      },
      {
        root: null, // observing intersections relative to the viewport
        rootMargin: "-50px 0px -50px 0px",
        threshold: 0.1, // Trigger when 50% of the element is in the viewport
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll(
      ".Theme-Section:not(.Theme-RelatedStoriesSection), .Project-FooterContainer"
    );
    sections.forEach((section, i) => {
      if (i === sections.length - 1) {
        section.classList.add("Theme-Section-Position-" + (i + 1));
        section.classList.add("Final-ABCDEFGHI");
      }
      observer.observe(section);
    });
  });
})();
