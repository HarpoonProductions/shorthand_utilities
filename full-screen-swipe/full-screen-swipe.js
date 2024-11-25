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
          const wrapperDiv = document.createElement("div");
          wrapperDiv.className = "slide-wrapper-new";
          const innerDivs = [...slide.children];
          innerDivs.forEach((div) => wrapperDiv.appendChild(div));
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

      // Create navigation buttons container
      const navigationContainer = document.createElement("div");
      navigationContainer.classList.add("glide__arrows");
      navigationContainer.setAttribute("data-glide-el", "controls");

      // Create prev button with image
      const prevButton = document.createElement("button");
      prevButton.classList.add("glide__arrow", "glide__arrow--left");
      prevButton.setAttribute("data-glide-dir", "<");
      const prevImg = document.createElement("img");
      prevImg.src =
        "https://harpn.s3.eu-west-2.amazonaws.com/harpoon/noun-chevron-1746062-FFFFFF.png";
      prevImg.alt = "Previous";
      prevButton.appendChild(prevImg);

      // Create next button with image
      const nextButton = document.createElement("button");
      nextButton.classList.add("glide__arrow", "glide__arrow--right");
      nextButton.setAttribute("data-glide-dir", ">");
      const nextImg = document.createElement("img");
      nextImg.src =
        "https://harpn.s3.eu-west-2.amazonaws.com/harpoon/noun-chevron-right-1746094-FFFFFF.png";
      nextImg.alt = "Next";
      nextButton.appendChild(nextImg);

      // Add buttons to navigation container
      navigationContainer.appendChild(prevButton);
      navigationContainer.appendChild(nextButton);

      const track = document.createElement("div");
      track.classList.add("glide__track");
      track.setAttribute("data-glide-el", "track");

      list.classList.add("glide__slides");

      parent.appendChild(glideContainer);
      glideContainer.appendChild(track);
      track.appendChild(list);
      glideContainer.appendChild(navigationContainer);

      new Glide(".glide", {
        type: "carousel",
        perView: 1.5,
        swipeThreshold: 50,
      }).mount();
    };

    const pollingInterval = setInterval(pollForElement, 200);
  });
})();
