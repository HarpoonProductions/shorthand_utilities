(function () {
  let currentPageIndex = null;
  let slides = null;
  let clonedSlides = null;
  let parent = null;

  const logoUrl =
    "https://edition-logos.s3.eu-west-2.amazonaws.com/oxfam%20_logo_only.png";
  const logoUrlInner =
    "https://edition-logos.s3.eu-west-2.amazonaws.com/oxfam_wide.png";

  // Promise-based element detection instead of polling
  function waitForElement(selector, maxAttempts = 50) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const check = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          reject(
            new Error(
              `Element ${selector} not found after ${maxAttempts} attempts`
            )
          );
          return;
        }

        requestAnimationFrame(check);
      };

      check();
    });
  }

  // Your existing extractLinks function remains the same
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

    return links.map((link, i) => {
      if (link.current) {
        console.log("current link is", link.href);
        currentPageIndex = i < links.length - 1 ? i : 0;
      }
      if (i !== 0) return link;
      return {
        href: link.href,
        label: link.label,
        current: link.current,
      };
    });
  }

  // Your existing fetchSrcset and createImageElement functions remain the same
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
    // const prevText = currentIndex > 0 ? "Previous" : null;

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
    navContainer.appendChild(middleLogoContainer);
    middleLogoContainer.addEventListener("click", () => {
      document.body.classList.add("show-custom-mini-nav");
      const miniNavCurrentLink = document.querySelector(
        ".show-custom-mini-nav .current-link"
      );
      if (miniNavCurrentLink) {
        miniNavCurrentLink.scrollIntoView({
          block: "start",
        });
      }

      document.body.classList.remove("scroll-up");
    });

    const nextUrl =
      currentIndex < links.length - 1 ? links[currentIndex + 1].href : null;
    const nextText =
      currentIndex < links.length - 1 ? links[currentIndex + 1].label : null;
    // const nextText = currentIndex < links.length - 1 ? "Next" : null;
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
        unmountCarousels();
      }
    });
  }

  // Replace startPollingExtractLinks with Promise-based approach
  async function initializeNavigation() {
    try {
      const navigationList = await waitForElement(
        ".Project-HeaderContainer .Layout.Navigation__itemList.Theme-Navigation-ItemList"
      );
      const links = extractLinks();
      if (links.length > 0) {
        renderCustomNavigation(links);
      }
    } catch (error) {
      console.error("Failed to initialize navigation:", error);
    }
  }

  function mountCarousels() {
    mountSplide(slides, parent);
    // mountGlider(clonedSlides, parent);
  }

  function mountSplide(slides, parent) {
    const slidesLi = slides.querySelectorAll("li");
    slidesLi.forEach((slide) => slide.classList.add("splide__slide"));

    const splideContainer = document.createElement("div");
    splideContainer.classList.add("splide");

    const track = document.createElement("div");
    track.classList.add("splide__track");

    slides.classList.add("splide__list");

    console.log(parent, splideContainer, slides);
    parent.insertBefore(splideContainer, slides);
    splideContainer.appendChild(track);
    track.appendChild(slides);

    splideInstance = new Splide(splideContainer, {
      type: "loop",
      perPage: 1,
      perMove: 1,
      gap: "1rem",
      pagination: true,
      arrows: true,
      start: currentPageIndex,
    }).mount();
  }

  function mountGlider(clonedSlides, parent) {
    const gliderContain = document.createElement("div");
    gliderContain.classList.add("glider-contain");

    clonedSlides.classList.add("glider");
    gliderContain.appendChild(clonedSlides);
    parent.appendChild(gliderContain);

    const prevArrow = document.createElement("button");
    prevArrow.setAttribute("aria-label", "Previous");
    prevArrow.classList.add("glider-prev");
    prevArrow.textContent = "«";

    const nextArrow = document.createElement("button");
    nextArrow.setAttribute("aria-label", "Next");
    nextArrow.classList.add("glider-next");
    nextArrow.textContent = "»";

    const dots = document.createElement("div");
    dots.classList.add("dots");
    dots.setAttribute("role", "tablist");

    gliderContain.appendChild(prevArrow);
    gliderContain.appendChild(nextArrow);
    gliderContain.appendChild(dots);

    const links = clonedSlides.querySelectorAll("li a");
    links.forEach((element, i) => element.setAttribute("tabindex", i + 4));

    gliderInstance = new Glider(clonedSlides, {
      slidesToShow: "auto",
      type: "carousel",
      slidesToScroll: 1,
      itemWidth: 250,
      draggable: true,
      arrows: {
        prev: prevArrow,
        next: nextArrow,
      },
      dots: dots,
      scrollLock: true,
      scrollLockDelay: 150,
      startAt: currentPageIndex,
      gap: 92,
      dragVelocity: 1,
      duration: 0.5,
    });

    setupDotsVisibility();
  }

  function unmountCarousels() {
    if (splideInstance) {
      splideInstance.destroy();
      splideInstance = null;
    }
    if (gliderInstance) {
      gliderInstance.destroy();
      gliderInstance = null;
    }
  }

  function setupDotsVisibility() {
    function checkDotsVisibility() {
      const dotsContainer = document.querySelector(".glider-dots");
      if (dotsContainer) {
        dotsContainer.style.display =
          dotsContainer.children.length <= 1 ? "none" : "";
      }
    }

    const debouncedCheckDotsVisibility = debounce(checkDotsVisibility, 250);
    window.addEventListener("resize", debouncedCheckDotsVisibility);
    checkDotsVisibility();
  }

  // Initialize everything
  document.addEventListener("DOMContentLoaded", async () => {
    // Initialize navigation
    await initializeNavigation();

    // Wait for related stories section
    try {
      const list = await waitForElement(
        '.Theme-RelatedStoriesSection ul[data-related-stories-list="true"]'
      );
      const p = list.parentNode;
      if (list && p && currentPageIndex !== null) {
        slides = list;
        clonedSlides = list.cloneNode(true);
        parent = p;
      }
    } catch (error) {
      console.error("Failed to initialize carousels:", error);
    }

    try {
      const relatedStoryCarousel = await waitForElement(
        '.Theme-RelatedStoriesSection ul[data-related-stories-list="true"]'
      );

      const navContainer = await waitForElement(".custom-min-nav-container");

      if (relatedStoryCarousel && relatedStoryCarousel.length && navContainer) {
        const relatedStoryCarousel2 = document.querySelectorAll(
          ".Theme-RelatedStoriesSection"
        );

        navContainer.appendChild(
          relatedStoryCarousel2[relatedStoryCarousel2.length - 1]
        );
      }
    } catch (error) {
      console.log("failed to append related stories", error);
    }
  });

  // Keep your existing scroll handler
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
          mountCarousels();
        }
      } else {
        document.body.classList.remove("custom-nav-hidden");
        document.body.classList.add("scroll-up");
        unmountCarousels();
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    },
    { passive: true }
  );

  // Your existing accessibility code
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      setTimeout(() => {
        if (document.activeElement.closest(".custom-min-nav-container")) {
          document.body.classList.add("tab_options");
          document.body.classList.remove("tab_container");
        } else if (
          document.activeElement.classList.contains("button_container")
        ) {
          document.body.classList.add("tab_container");
          document.body.classList.remove("tab_options");
        } else {
          document.body.classList.remove("tab_container", "tab_options");
        }
      }, 0);
    }
  });

  // Utility function for debouncing
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
})();
