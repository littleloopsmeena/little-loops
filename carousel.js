document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".product-media-track");
  const prev = carousel.querySelector(".media-nav.prev");
  const next = carousel.querySelector(".media-nav.next");

  if (!track || !prev || !next) {
    return;
  }

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    prev.hidden = track.scrollLeft <= 4;
    next.hidden = track.scrollLeft >= maxScroll;
  };

  const slideBy = (direction) => {
    track.scrollBy({
      left: track.clientWidth * direction,
      behavior: "smooth"
    });
  };

  prev.addEventListener("click", () => slideBy(-1));
  next.addEventListener("click", () => slideBy(1));
  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
});
