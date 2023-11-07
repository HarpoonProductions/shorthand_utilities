document.addEventListener("DOMContentLoaded", () => {
  const maxAttempts = 25;
  let attempts = 0;

  const pollForElement = () => {
    const list = document.querySelector(".Layout.Theme-Layer-Gallery-List");

    if (list || attempts >= maxAttempts) {
      clearInterval(pollingInterval);
      if (list) initializeCarousel(list);
    }

    attempts++;
  };

  const initializeCarousel = (list) => {
    list.classList.add("swiper-wrapper");
    list.querySelectorAll("li").forEach((item) => {
      item.classList.add("swiper-slide");
    });

    const swiper = document.createElement("div");
    swiper.classList.add("swiper");

    const parent = list.parentNode;
    parent.insertBefore(swiper, list);
    swiper.appendChild(list);

    const carousel = new Swiper(".swiper", {
      loop: true,
      freeMode: true,
      // Default parameters
      slidesPerView: 1,
      spaceBetween: 10,
      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      },
    });

    carousel.mount();
  };

  const pollingInterval = setInterval(pollForElement, 200);
});
