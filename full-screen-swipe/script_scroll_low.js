(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const maxAttempts = 50;
    let attempts = 0;

    const pollForElement = () => {
      const list = document.querySelectorAll(
        ".Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
      );
      const parent = document.querySelector(".full-screen-carousel");
      if ((list && list.length && parent) || attempts >= maxAttempts) {
        clearInterval(pollingInterval);
        initializeCarousel(list[list.length - 1], parent);
      }

      attempts++;
    };

    const initializeCarousel = (list, parent) => {
      const slides = list.querySelectorAll("li");
      slides.forEach(function (slide) {
        slide.classList.add("splide__slide");
      });

      const splideContainer = document.createElement("div");
      splideContainer.classList.add("splide");

      const track = document.createElement("div");
      track.classList.add("splide__track");

      list.classList.add("splide__list");

      parent.appendChild(splideContainer);
      splideContainer.appendChild(track);
      track.appendChild(list);

      new Splide(splideContainer, {
        type: "loop",
        perPage: 1,
        perMove: 1,
        gap: "1rem",
        pagination: true,
        arrows: true,
        start: 0,
      }).mount();
    };

    const pollingInterval = setInterval(pollForElement, 200);
  });
})();
