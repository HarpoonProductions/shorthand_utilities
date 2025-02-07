(function () {
  const focusableSelectors =
    'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(
    document.querySelectorAll(focusableSelectors)
  );

  // Optionally filter out elements not visible or disabled
  const visibleElements = focusableElements.filter(
    (el) => !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0
  );

  // Set high tabindex for specific elements
  const lastIndex = visibleElements.length + 1;
  let currentPageIndex = null;
  var logoUrl =
    "https://harpn.s3.eu-west-2.amazonaws.com/imperial/imperial_logo_white.png";
  var logoUrlInner =
    "https://harpn.s3.eu-west-2.amazonaws.com/imperial/imperial_long.png";

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
        } else if (
          window.location.pathname === "/" ||
          window.location.pathname === "/index.html"
        ) {
          isCurrent = true;
        } else {
          const page = window.location.href.split("/")[5];
          const hrefTest = "../../graduation-2024/" + page + "/index.html";
          isCurrent = href === hrefTest;
        }

        if (!isCurrent) {
          const clean = window.location.pathname
            .replace("/harpoon-international/", "")
            .replace("/index.html", "");
          const check = new RegExp(clean, "gi");
          isCurrent = check.test(href);
        }

        console.log(`Current: ${window.location.href}, From nav: ${href}`);

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

    const rawLinks = links.filter((_, i) => i >= 1);

    return rawLinks.map((link, i) => {
      console.log(link, i);
      if (link.current) currentPageIndex = i < links.length - 1 ? i : 0;
      if (i !== 0) return link;
      return {
        href: link.href,
        label: link.label,
        current: link.current,
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
    console.log(
      "creating button to",
      isPrevious ? "previous" : "next",
      "with",
      url
    );
    const buttonContainer = document.createElement("a");
    const button = document.createElement("div");
    const arrow = document.createElement("div");

    buttonContainer.classList.add("button_container");

    if (isPrevious) {
      buttonContainer.classList.add("prev");
      // buttonContainer.setAttribute("tabindex", lastIndex);
      if (!hide)
        buttonContainer.setAttribute("aria-label", "Previous story: " + text);

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
      // buttonContainer.setAttribute("tabindex", lastIndex + 2);
      if (!hide)
        buttonContainer.setAttribute("aria-label", "Next story :" + text);

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
      text
        .replace(/\b(\w)(\w*)/g, function (_, firstLetter, restOfString) {
          return firstLetter.toUpperCase() + restOfString.toLowerCase();
        })
        .replace(" Of ", " of ");

    // buttonContainer.appendChild(button);
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
    if (currentIndex === -1) return null;
    if (links.filter((link) => link.current).length > 1) return null;

    const frontButton = document.createElement("a");
    frontButton.href =
      "https://harpoon.shorthandstories.com/harpoon-international/";
    frontButton.textContent = "Front";
    frontButton.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 8px 16px;
        background-color: transparent;
        color: white;
        text-decoration: none;
        font-family: 'Lato', sans-serif;
        font-size: 16px;
        cursor: pointer;
        z-index: 1000;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        transition: border-color 0.2s ease;
    `;

    // Add subtle hover effect
    frontButton.addEventListener("mouseenter", () => {
      frontButton.style.borderColor = "rgba(255, 255, 255, 0.8)";
    });

    frontButton.addEventListener("mouseleave", () => {
      frontButton.style.borderColor = "rgba(255, 255, 255, 0.3)";
    });

    document.body.appendChild(frontButton);

    const style = document.createElement("style");
    style.textContent = `
    @media (max-width: 600px) {
      .Theme-Story::after {
        content: "";
        background: url('https://harpn.s3.eu-west-2.amazonaws.com/harpoon/swipe-right.png') no-repeat;
        position: fixed;
        opacity: 1;
        width: 100%;
        height: 100%;
        background-size: 15%;
        z-index: 100 !important;
        top: 45%;
        left: 85%;
        transition: transform 0.8s ease-in-out;
        transform: translateX(0)
      }

      .custom-nav-hidden .Theme-Story::after {
        transform: translateX(25%)
      }
    }
    `;
    document.head.appendChild(style);

    document.body.classList.add("custom-nav-hidden");

    const navContainer = document.createElement("div");
    navContainer.classList.add("nav_container");

    const prevUrl =
      currentIndex > 0
        ? links[currentIndex - 1].href
        : links[links.length - 1].href;
    const prevText =
      currentIndex > 0
        ? links[currentIndex - 1].label
        : links[links.length - 1].href;

    console.log("prevURL", prevUrl);

    const prevButton = createButtonWithImage(prevText, prevUrl, true);
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
    // middleLogoContainer.appendChild(middleLogo);
    // middleLogoContainer.appendChild(contentsLabel);
    // navContainer.appendChild(middleLogoContainer);
    // middleLogoContainer.addEventListener("click", () => {
    //   document.body.classList.add("show-custom-mini-nav");
    //   const miniNavCurrentLink = document.querySelector(
    //     ".show-custom-mini-nav .current-link"
    //   );
    //   if (miniNavCurrentLink) {
    //     miniNavCurrentLink.scrollIntoView({
    //       block: "start",
    //     });
    //   }

    //   document.body.classList.remove("scroll-up");
    // });

    const nextUrl =
      currentIndex < links.length - 1
        ? links[currentIndex + 1].href
        : links[0].href;
    const nextText =
      currentIndex < links.length - 1
        ? links[currentIndex + 1].label
        : links[0].label;

    const nextButton = createButtonWithImage(nextText, nextUrl, false);

    console.log("nextURL", nextUrl);
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
    // innerLogoContainer.appendChild(innerLogo);
    // innerLogoAnchor.appendChild(innerLogoContainer);
    // customMiniNavContainer.appendChild(innerLogoAnchor);

    customMiniNavContainer.addEventListener("click", () => {
      document.body.classList.remove("scroll-up");
    });

    // document.body.appendChild(customMiniNavContainer);

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

  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        if (currentScrollTop > 150) {
          document.body.classList.add("custom-nav-hidden");
          document.body.classList.remove("show-custom-mini-nav");
          document.body.classList.remove("tab_container");
          document.body.classList.remove("tab_options");
        }
      } else {
        document.body.classList.remove("custom-nav-hidden");
        document.body.classList.add("scroll-up");
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    },
    false
  );

  // document.addEventListener("DOMContentLoaded", () => {
  //   const maxAttempts = 50;
  //   let attempts = 0;

  //   const pollForElement = () => {
  //     const list = document.querySelectorAll(
  //       ".Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
  //     );
  //     if (
  //       (list && list.length && currentPageIndex !== null) ||
  //       attempts >= maxAttempts
  //     ) {
  //       console.log("polling", attempts, list);
  //       clearInterval(pollingInterval);
  //       if (list && list.length) {
  //         //list.forEach(function (list) {
  //         initializeCarousel(list[list.length - 1]);
  //         // });
  //       }
  //     }

  //     attempts++;
  //   };

  // const initializeCarousel = (list) => {
  //   const clonedSlides = list.cloneNode(true);
  //   const parent = list.parentNode;
  //   initializeCarousel2(parent, clonedSlides);

  //   const slides = list.querySelectorAll("li");
  //   slides.forEach(function (slide) {
  //     slide.classList.add("splide__slide");
  //   });

  //   const splideContainer = document.createElement("div");
  //   splideContainer.classList.add("splide");

  //   const track = document.createElement("div");
  //   track.classList.add("splide__track");

  //   list.classList.add("splide__list");

  //   parent.insertBefore(splideContainer, list);
  //   splideContainer.appendChild(track);
  //   track.appendChild(list);

  //   console.log("Current Page Index", currentPageIndex);

  //   new Splide(splideContainer, {
  //     type: "loop",
  //     perPage: 1,
  //     perMove: 1,
  //     gap: "1rem",
  //     pagination: true,
  //     arrows: true,
  //     start: currentPageIndex,
  //   }).mount();
  // };

  // const initializeCarousel2 = (parent, list) => {
  //   const gliderContain = document.createElement("div");
  //   gliderContain.classList.add("glider-contain");

  //   // Move the 'list' inside 'glider-contain'
  //   list.classList.add("glider");
  //   gliderContain.appendChild(list);
  //   parent.appendChild(gliderContain);

  //   // Create navigation buttons
  //   const prevArrow = document.createElement("button");
  //   prevArrow.setAttribute("aria-label", "Previous");
  //   prevArrow.classList.add("glider-prev");
  //   prevArrow.textContent = "«";

  //   const nextArrow = document.createElement("button");
  //   nextArrow.setAttribute("aria-label", "Next");
  //   nextArrow.classList.add("glider-next");
  //   nextArrow.textContent = "»";

  //   // Create the dots container
  //   const dots = document.createElement("div");
  //   dots.classList.add("dots");
  //   dots.setAttribute("role", "tablist");

  //   // Append arrows and dots to the 'glider-contain' container
  //   gliderContain.appendChild(prevArrow);
  //   gliderContain.appendChild(nextArrow);
  //   gliderContain.appendChild(dots);

  //   const links = list.querySelectorAll("li a");
  //   // links.forEach((element, i) =>
  //   //   element.setAttribute("tabindex", i + 4 + lastIndex)
  //   // );

  //   // Initialize Glider.js on the list
  //   // new Glider(list, {
  //   //   slidesToShow: "auto",
  //   //   type: "carousel",
  //   //   slidesToScroll: 1, // Move one slide at a time
  //   //   itemWidth: 250,
  //   //   draggable: true, // Allow dragging/swiping
  //   //   arrows: {
  //   //     prev: prevArrow,
  //   //     next: nextArrow,
  //   //   },
  //   //   dots: dots,
  //   //   scrollLock: true, // Lock to a slide even if the swipe was not forceful
  //   //   scrollLockDelay: 150, // Slightly increase the delay to ensure scroll lock calculates correctly
  //   //   startAt: currentPageIndex,
  //   //   gap: 92,
  //   //   dragVelocity: 1, // Adjust velocity to control swipe sensitivity, might need fine-tuning
  //   //   duration: 0.5, // Reduce the animation duration to make transitions quicker
  //   // });

  //   // function checkDotsVisibility() {
  //   //   const dotsContainer = document.querySelector(".glider-dots");
  //   //   if (dotsContainer) {
  //   //     dotsContainer.style.display =
  //   //       dotsContainer.children.length <= 1 ? "none" : "";
  //   //   }
  //   // }

  //   // // Debouncer function
  //   // function debounce(func, wait, immediate) {
  //   //   let timeout;
  //   //   return function () {
  //   //     const context = this,
  //   //       args = arguments;
  //   //     const later = function () {
  //   //       timeout = null;
  //   //       if (!immediate) func.apply(context, args);
  //   //     };
  //   //     const callNow = immediate && !timeout;
  //   //     clearTimeout(timeout);
  //   //     timeout = setTimeout(later, wait);
  //   //     if (callNow) func.apply(context, args);
  //   //   };
  //   // }

  //   // // Wrapped checkDotsVisibility in a debouncer
  //   // const debouncedCheckDotsVisibility = debounce(checkDotsVisibility, 250);

  //   // // Event listener for window resize
  //   // window.addEventListener("resize", debouncedCheckDotsVisibility);

  //   // // Initial check
  //   // checkDotsVisibility();
  // };

  //   const pollingInterval = setInterval(pollForElement, 200);
  // });

  // (function () {
  //   function startPollingCarousel() {
  //     let poller = setInterval(() => {
  //       const relatedStoryCarousel = document.querySelectorAll(
  //         '.Theme-RelatedStoriesSection ul[data-related-stories-list="true"]'
  //       );

  //       const navContainer = document.querySelector(
  //         ".custom-min-nav-container"
  //       );

  //       if (
  //         relatedStoryCarousel &&
  //         relatedStoryCarousel.length &&
  //         navContainer
  //       ) {
  //         clearInterval(poller);
  //         const relatedStoryCarousel2 = document.querySelectorAll(
  //           ".Theme-RelatedStoriesSection"
  //         );

  //         navContainer.appendChild(
  //           relatedStoryCarousel2[relatedStoryCarousel2.length - 1]
  //         );
  //       }
  //     }, 250);

  //     setTimeout(() => {
  //       clearInterval(poller);
  //     }, 10000);
  //   }

  //   startPollingCarousel();

  //   // Accessibility

  //   // document.addEventListener("keydown", (e) => {
  //   //   if (e.key === "Tab") {
  //   //     // Introduce a delay to allow focus to update
  //   //     setTimeout(() => {
  //   //       console.log(
  //   //         "Tabbed",
  //   //         document.activeElement,
  //   //         document.activeElement.closest(".custom-min-nav-container")
  //   //       );
  //   //       // Check if the currently focused element is within '.custom-min-nav-container'
  //   //       if (document.activeElement.closest(".custom-min-nav-container")) {
  //   //         document.body.classList.add("tab_options");
  //   //         document.body.classList.remove("tab_container");
  //   //       }
  //   //       // Check if the currently focused element has the class 'button_container'
  //   //       else if (
  //   //         document.activeElement.classList.contains("button_container")
  //   //       ) {
  //   //         document.body.classList.add("tab_container");
  //   //         document.body.classList.remove("tab_options");
  //   //       }
  //   //       // If the focused element doesn't meet the above conditions
  //   //       else {
  //   //         document.body.classList.remove("tab_container", "tab_options");
  //   //       }
  //   //     }, 0); // A delay of 0 milliseconds effectively waits until the browser can process the focus shift
  //   //   }
  //   // });
  // })();
})();
