(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const maxAttempts = 50;
    let attempts = 0;

    const pollForElement = () => {
      const list = document.querySelectorAll(
        ".Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
      );
      const parent = document.querySelector(".full-screen-carousel");
      console.log("polling", attempts, parent);
      if ((list && list.length && parent) || attempts >= maxAttempts) {
        clearInterval(pollingInterval);
        initializeCarousel(list[list.length - 1], parent);

        const slides = document.querySelectorAll(
          ".full-screen-carousel .related-story-card"
        );

        slides.forEach((slide) => {
          // Create new wrapper div
          const wrapperDiv = document.createElement("div");
          wrapperDiv.className = "slide-wrapper-new";

          // Get all direct div children of the slide
          const innerDivs = [...slide.children];

          // Move inner divs into the wrapper
          innerDivs.forEach((div) => wrapperDiv.appendChild(div));

          // Add wrapper to slide
          slide.appendChild(wrapperDiv);
        });
      }

      attempts++;
    };

    const initializeCarousel = (list, parent) => {
      const slides = list.querySelectorAll("li");
      slides.forEach(function (slide) {
        slide.classList.add("glide__slide");
      });

      const glideContainer = document.createElement("div");
      glideContainer.classList.add("glide");

      const track = document.createElement("div");
      track.classList.add("glide__track");
      track.setAttribute("data-glide-el", "track");

      list.classList.add("glide__slides");

      parent.appendChild(glideContainer);
      glideContainer.appendChild(track);
      track.appendChild(list);

      new Glide(".glide", {
        type: "carousel",
        perView: 1.5,
        swipeThreshold: 50,
      }).mount();
    };

    const pollingInterval = setInterval(pollForElement, 200);
  });
})();
