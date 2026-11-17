
document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     RELATED STORIES — SWIPER CAROUSEL
     Supports old and new Shorthand markup
     ========================================== */

  const selectors = [
    ".sh-issues .Layout.Theme-Layer-Gallery-List",
    ".Theme-RelatedStoriesSection .related-stories-list ul"
  ];

  const instances = new Map();

  /* ==========================================
     INITIALISE CAROUSEL
     ========================================== */

  const initializeCarousel = (list) => {
    if (
      list.dataset.carouselInitialized === "true" ||
      typeof Swiper === "undefined"
    ) {
      return;
    }

    const slides = Array.from(list.children).filter(
      (item) => item.tagName === "LI"
    );

    if (!slides.length) return;

    list.dataset.carouselInitialized = "true";

    // Add Swiper classes
    list.classList.add("swiper-wrapper");

    slides.forEach((item) => {
      item.classList.add("swiper-slide");
    });

    // Create Swiper container
    let swiper = list.parentElement;

    if (!swiper.classList.contains("swiper")) {
      swiper = document.createElement("div");
      swiper.classList.add("swiper");

      list.parentNode.insertBefore(swiper, list);
      swiper.appendChild(list);
    }

    // Initialise Swiper on this specific container
    const carousel = new Swiper(swiper, {
      loop: slides.length > 4,
      freeMode: true,

      slidesPerView: 1,
      spaceBetween: 10,

      observer: true,
      observeParents: true,

      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 40
        }
      }
    });

    instances.set(list, carousel);
  };

  /* ==========================================
     FIND RELATED STORIES LISTS
     ========================================== */

  const findCarousels = () => {
    if (typeof Swiper === "undefined") return;

    const lists = document.querySelectorAll(
      selectors.join(", ")
    );

    lists.forEach((list) => {
      // For new Related Stories markup, only
      // initialise lists containing story cards.
      if (
        list.closest(".Theme-RelatedStoriesSection") &&
        !list.querySelector(":scope > li > .related-story-card")
      ) {
        return;
      }

      if (list.dataset.carouselInitialized === "true") {
        // Update Swiper when more cards are added
        const carousel = instances.get(list);

        if (carousel) {
          const slides = Array.from(list.children).filter(
            (item) => item.tagName === "LI"
          );

          slides.forEach((item) => {
            item.classList.add("swiper-slide");
          });

          carousel.update();
        }

        return;
      }

      initializeCarousel(list);
    });
  };

  /* ==========================================
     WAIT FOR SHORTHAND TO RENDER CONTENT
     ========================================== */

  // Check immediately
  findCarousels();

  // Watch for asynchronously rendered stories
  const observer = new MutationObserver(() => {
    findCarousels();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Check again once all page resources load
  window.addEventListener("load", findCarousels);

  // Update carousel on resize
  window.addEventListener("resize", () => {
    instances.forEach((carousel) => {
      carousel.update();
    });
  });
});
