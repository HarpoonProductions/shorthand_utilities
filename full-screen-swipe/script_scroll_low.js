(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const maxAttempts = 50;
    let attempts = 0;

    const pollForElement = () => {
      const list = document.querySelectorAll(
        ".Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
      );
      const parent = document.querySelector(".full-screen-carousel");
      if ((list && list.length && page) || attempts >= maxAttempts) {
        clearInterval(pollingInterval);
        initializeCarousel(list[list.length - 1], parent);
      }

      attempts++;
    };

    const initializeCarousel = (list, parent) => {
      const gliderContain = document.createElement("div");
      gliderContain.classList.add("glider-contain");

      // Move the 'list' inside 'glider-contain'
      list.classList.add("glider");
      gliderContain.appendChild(list);
      parent.appendChild(gliderContain);

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
      new Glider(list, {
        slidesToShow: 1.5,
        type: "carousel",
        slidesToScroll: 1, // Move one slide at a time
        itemWidth: 250,
        draggable: true, // Allow dragging/swiping
        arrows: {
          prev: prevArrow,
          next: nextArrow,
        },
        dots: dots,
        scrollLock: true, // Lock to a slide even if the swipe was not forceful
        scrollLockDelay: 150, // Slightly increase the delay to ensure scroll lock calculates correctly
        startAt: currentPageIndex,
        gap: 92,
        dragVelocity: 1, // Adjust velocity to control swipe sensitivity, might need fine-tuning
        duration: 0.5, // Reduce the animation duration to make transitions quicker
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
})();
