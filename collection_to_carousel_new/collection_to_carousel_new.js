document.addEventListener("DOMContentLoaded", () => {
  const maxAttempts = 25;
  let attempts = 0;

  const pollForElement = () => {
    const list = document.querySelector(
      ".sh-issues .Layout.Theme-Layer-Gallery-List"
    );
    console.log(list);
    if (list || attempts >= maxAttempts) {
      clearInterval(pollingInterval);
      if (list) initializeCarousel(list);
    }

    attempts++;
  };

  const initializeCarousel = (list) => {
    // Create the 'glider-contain' wrapper
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
      slidesToShow: 1,
      type: "carousel",
      slidesToScroll: 1,
      draggable: true,
      arrows: {
        prev: prevArrow,
        next: nextArrow,
      },
      dots: dots,
      scrollLock: true,
      rewind: true,
      responsive: [
        {
          breakpoint: 320,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            itemWidth: 125,
            duration: 0.25,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            itemWidth: 125,
            duration: 0.25,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            itemWidth: 125,
            duration: 0.25,
          },
        },
      ],
    });
  };

  const pollingInterval = setInterval(pollForElement, 200);
});
