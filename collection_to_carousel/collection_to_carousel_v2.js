(function () {
  "use strict";

  /* ==========================================
     RELATED STORIES — SWIPER CAROUSEL
     PERFORMANCE OPTIMISED
     ========================================== */

  // Prevent duplicate script initialisation
  if (window.__relatedStoriesSwiperStarted) return;
  window.__relatedStoriesSwiperStarted = true;

  const selectors = [
    ".sh-issues .Layout.Theme-Layer-Gallery-List",
    ".Theme-RelatedStoriesSection .related-stories-list ul"
  ];

  const instances = new WeakMap();

  /* ==========================================
     GET SLIDES
     ========================================== */

  function getSlides(list) {
    return Array.from(list.children).filter(
      (item) => item.tagName === "LI"
    );
  }

  /* ==========================================
     INITIALISE CAROUSEL
     ========================================== */

  function initializeCarousel(list) {
    if (typeof Swiper === "undefined") return;
    if (instances.has(list)) return;
    if (list.dataset.carouselInitialized === "true") return;

    const slides = getSlides(list);

    if (!slides.length) return;

    // Only initialise valid Related Stories lists
    if (
      list.closest(".Theme-RelatedStoriesSection") &&
      !list.querySelector(":scope > li > .related-story-card")
    ) {
      return;
    }

    list.dataset.carouselInitialized = "true";

    list.classList.add("swiper-wrapper");

    slides.forEach((item) => {
      item.classList.add("swiper-slide");
    });

    /* ==========================================
       CREATE SWIPER CONTAINER
       ========================================== */

    let container = list.parentElement;

    if (!container.classList.contains("swiper")) {
      container = document.createElement("div");
      container.classList.add("swiper");

      list.parentNode.insertBefore(container, list);
      container.appendChild(list);
    }

    /* ==========================================
       INITIALISE SWIPER
       ========================================== */

    try {
      const carousel = new Swiper(container, {
        loop: slides.length > 4,
        freeMode: true,

        slidesPerView: 1,
        spaceBetween: 10,

        // Disable mutation-based updates
        observer: false,
        observeParents: false,
        observeSlideChildren: false,

        // Let Swiper handle resizing
        resizeObserver: true,
        updateOnWindowResize: true,

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

      instances.set(list, {
        carousel: carousel,
        slides: new Set(slides)
      });

    } catch (error) {
      delete list.dataset.carouselInitialized;

      console.warn(
        "Related Stories carousel initialisation failed:",
        error
      );
    }
  }

  /* ==========================================
     FIND AND UPDATE CAROUSELS
     ========================================== */

  function findCarousels() {
    if (typeof Swiper === "undefined") return;

    const lists = document.querySelectorAll(
      selectors.join(", ")
    );

    lists.forEach((list) => {
      const existing = instances.get(list);

      if (!existing) {
        initializeCarousel(list);
        return;
      }

      // Only update if genuinely new cards exist
      const slides = getSlides(list);

      const newSlides = slides.filter(
        (slide) => !existing.slides.has(slide)
      );

      if (!newSlides.length) return;

      newSlides.forEach((slide) => {
        slide.classList.add("swiper-slide");
        existing.slides.add(slide);
      });

      existing.carousel.update();
    });
  }

  /* ==========================================
     WAIT FOR SHORTHAND CONTENT
     ========================================== */

  function start() {
    findCarousels();

    // Limited checks for asynchronously loaded content
    const delays = [
      250,
      500,
      1000,
      2000,
      4000,
      8000,
      12000
    ];

    delays.forEach((delay) => {
      window.setTimeout(findCarousels, delay);
    });

    // Final check when page resources have loaded
    if (document.readyState !== "complete") {
      window.addEventListener(
        "load",
        findCarousels,
        { once: true }
      );
    }
  }

  /* ==========================================
     SAFE STARTUP
     ========================================== */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }

})();
