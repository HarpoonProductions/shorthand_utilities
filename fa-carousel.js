document.querySelectorAll(".carousel-wrapper").forEach((wrapper) => {
  const track = wrapper.querySelector(".carousel-track");
  const dots = wrapper.querySelectorAll(".dot");
  const totalCards = dots.length;
  let index = 0;

  /* =========================== DYNAMIC STEP SIZE =========================== */
  function getStep() {
    const card = track.querySelector(".card");
    const cardWidth = card.offsetWidth; // actual width (500px desktop, 90vw mobile)
    const gap = 40; // your fixed gap in CSS
    return cardWidth + gap;
  }

  /* =========================== CAROUSEL UPDATE =========================== */
  function updateCarousel() {
    const step = getStep();
    track.style.transform = `translateX(${-index * step}px)`;
    updateDots();
  }

  /* =========================== DOT NAVIGATION =========================== */
  function updateDots() {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      index = parseInt(dot.dataset.index, 10);
      updateCarousel();
    });
  });

  /* =========================== SWIPE / DRAG SUPPORT =========================== */
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  track.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    track.style.transition = "none";
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const delta = startX - currentX;
    const step = getStep();
    track.style.transform = `translateX(${-(index * step) - delta}px)`;
  });

  track.addEventListener("pointerup", () => {
    if (!isDragging) return;

    const delta = startX - currentX;

    // swipe threshold
    if (delta > 50 && index < totalCards - 1) index++;
    if (delta < -50 && index > 0) index--;

    isDragging = false;
    track.style.transition = "transform 0.3s ease";
    updateCarousel();
  });

  track.addEventListener("pointerleave", () => {
    if (isDragging) track.dispatchEvent(new PointerEvent("pointerup"));
  });

  /* =========================== HANDLE RESIZE =========================== */
  window.addEventListener("resize", updateCarousel);

  // initialize position
  updateCarousel();

  const leftControl = wrapper.querySelector(".carousel-custom-control-left");

  const rightControl = wrapper.querySelector(".carousel-custom-control-right");

  console.log(leftControl, rightControl);

  if (leftControl && rightControl) {
    leftControl.addEventListener("click", () => {
      console.log("clicked left");
      if (index > 0) {
        index--;
        updateCarousel();
      }
    });

    rightControl.addEventListener("click", () => {
      console.log("clicked right");
      if (index < totalCards - 1) {
        index++;
        updateCarousel();
      }
    });
  }
});
