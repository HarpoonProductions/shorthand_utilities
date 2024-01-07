document.addEventListener("DOMContentLoaded", () => {
  const checkAndInitializeCarousels = () => {
    const lists = document.querySelectorAll(
      ".sh-issues .Layout.Theme-Layer-Gallery-List, .Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
    );
    if (lists && lists.length === 2) {
      lists.forEach(initializeCarousel);
    }
  };

  // Create a MutationObserver to observe DOM changes
  const observer = new MutationObserver((mutations, obs) => {
    // Check if the carousel elements are present
    if (
      document.querySelectorAll(
        ".sh-issues .Layout.Theme-Layer-Gallery-List, .Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
      ).length === 2
    ) {
      checkAndInitializeCarousels();
      obs.disconnect(); // Stop observing once we have initialized the carousels
    }
  });

  // Options for the observer (which parts of the DOM to monitor)
  const config = { childList: true, subtree: true };

  // Start observing the body for DOM changes
  observer.observe(document.body, config);

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
