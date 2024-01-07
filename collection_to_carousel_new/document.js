document.addEventListener("DOMContentLoaded", () => {
  const maxAttempts = 50;
  let attempts = 0;

  const pollForElement = () => {
    const list = document.querySelectorAll(
      ".sh-issues .Layout.Theme-Layer-Gallery-List, .Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
    );
    if ((list && list.length === 2) || attempts >= maxAttempts) {
      clearInterval(pollingInterval);
      if (list && list.length === 2) {
        list.forEach(function (list) {
          initializeCarousel(list);
        });
      }
    }

    attempts++;
  };

  const initializeCarousel = (list) => {
    const gliderContain = document.createElement("div");
    gliderContain.classList.add("glider-contain");

    // Move the 'list' inside 'glider-contain'
    list.classList.add("glider");
    const parent = list.parentNode;
    parent.insertBefore(gliderContain, list);
    gliderContain.appendChild(list);

    // Create navigation buttons
    const prevArrow = document.createElement("button");
    prevArrow.setAttribute("aria-label", "Previous");
    prevArrow.classList.add("glider-prev");
    prevArrow.textContent = "«";

    const nextArrow = document.createElement("button");
    nextArrow.setAttribute("aria-label", "Next");
    nextArrow.classList.add("glider-next");
    nextArrow.textContent = "»";

    // Create the dots container
    const dots = document.createElement("div");
    dots.classList.add("dots");
    dots.setAttribute("role", "tablist");

    // Append arrows and dots to the 'glider-contain' container
    gliderContain.appendChild(prevArrow);
    gliderContain.appendChild(nextArrow);
    gliderContain.appendChild(dots);

    // Initialize Glider.js on the list
    const carousel = new Glider(list, {
      slidesToShow: "auto",
      type: "carousel",
      slidesToScroll: "auto",
      itemWidth: 250,
      draggable: true,
      arrows: {
        prev: prevArrow,
        next: nextArrow,
      },
      dots: dots,
      scrollLock: true,
      scrollLockDelay: 100,
      startAt: 0,
      gap: 92,
    });

    function checkDotsVisibility() {
      const dotsContainer = document.querySelector(".glider-dots");
      if (dotsContainer) {
        dotsContainer.style.display =
          dotsContainer.children.length <= 1 ? "none" : "";
      }
    }

    // Debouncer function
    function debounce(func, wait, immediate) {
      let timeout;
      return function () {
        const context = this,
          args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    // Wrapped checkDotsVisibility in a debouncer
    const debouncedCheckDotsVisibility = debounce(checkDotsVisibility, 250);

    // Event listener for window resize
    window.addEventListener("resize", debouncedCheckDotsVisibility);

    // Initial check
    checkDotsVisibility();
  };

  const pollingInterval = setInterval(pollForElement, 200);
});

(function () {
  function renderCustomNavigation(relatedStoryCarousel) {
    const navContainer = document.createElement("div");
    navContainer.classList.add("nav_container");
    const title = document.createElement("p");
    title.innerText = "Contents";
    title.classList.add("nav-title");
    navContainer.appendChild(title);

    document.body.appendChild(navContainer);

    // Add custom nav box
    const customMiniNavContainer = document.createElement("div");
    customMiniNavContainer.classList.add("custom-min-nav-container");

    customMiniNavContainer.appendChild(relatedStoryCarousel);
    navContainer.appendChild(customMiniNavContainer);

    navContainer.addEventListener("click", (event) => {
      // Check if the click is not within .Theme-RelatedStoriesSection
      if (!event.target.closest(".Theme-RelatedStories")) {
        document.body.classList.toggle("show-custom-mini-nav");
      }
    });

    // Handling click on the body
    document.body.addEventListener("click", function (event) {
      // Check if the click is outside the .nav_container
      if (!event.target.closest(".nav_container")) {
        document.body.classList.remove("show-custom-mini-nav");
      }
    });
  }

  function startPollingCarousel() {
    let poller = setInterval(() => {
      const relatedStoryCarousel = document.querySelector(
        '.Theme-RelatedStoriesSection ul[data-related-stories-list="true"]'
      );

      if (relatedStoryCarousel) {
        clearInterval(poller);
        renderCustomNavigation(
          document.querySelector(".Theme-RelatedStoriesSection")
        );
      }
    }, 250);

    setTimeout(() => {
      clearInterval(poller);
    }, 10000);
  }

  startPollingCarousel();
})();

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

let lastScrollTop = 0;
let isInitialScroll = true; // Flag to track the initial scroll event

/*
const handleScroll = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log(currentScrollTop)
    if (currentScrollTop === 0) {
        document.body.classList.add("custom-nav-top");
    } else {
        document.body.classList.remove("custom-nav-top");
    }

    if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        document.body.classList.remove("show-custom-mini-nav");
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    isInitialScroll = false; // Reset the flag after the first scroll
};

// Wrap your handler with the debounce function
const debouncedScrollHandler = debounce(handleScroll, 10, isInitialScroll);

window.addEventListener("scroll", () => {
    if (isInitialScroll) {
        // Fire immediately on the first scroll
        handleScroll();
    } else {
        // Use the debounced handler for subsequent scrolls
        debouncedScrollHandler();
    }
}, false);
*/

window.addEventListener(
  "scroll",
  () => {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop === 0) {
      document.body.classList.add("custom-nav-top");
    } else {
      document.body.classList.remove("custom-nav-top");
    }

    if (currentScrollTop > lastScrollTop) {
      // Scrolling down
      document.body.classList.remove("show-custom-mini-nav");
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  },
  false
);

const currentScrollTop =
  window.pageYOffset || document.documentElement.scrollTop;

if (currentScrollTop === 0) {
  document.body.classList.add("custom-nav-top");
} else {
  document.body.classList.remove("custom-nav-top");
}

document.addEventListener("click", (e) => console.log(e.target));
