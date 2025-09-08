document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery-container');
  if (!gallery) return;

  const slider = gallery.querySelector('.gallery-slider');
  const prevButton = gallery.querySelector('.gallery-nav.prev');
  const nextButton = gallery.querySelector('.gallery-nav.next');

  if (!slider || !prevButton || !nextButton) return;

  const updateArrowStates = () => {
    const scrollLeft = slider.scrollLeft;
    const scrollWidth = slider.scrollWidth;
    const clientWidth = slider.clientWidth;

    prevButton.disabled = scrollLeft <= 0;
    nextButton.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
  };

  slider.addEventListener('scroll', updateArrowStates, { passive: true });

  nextButton.addEventListener('click', () => {
    const first = slider.querySelector('.gallery-item');
    if (!first) return;
    slider.scrollLeft += first.clientWidth;
  });

  prevButton.addEventListener('click', () => {
    const first = slider.querySelector('.gallery-item');
    if (!first) return;
    slider.scrollLeft -= first.clientWidth;
  });

  // Initial check
  updateArrowStates();

  // ✅ Update only when the window resizes
  window.addEventListener('resize', updateArrowStates, { passive: true });
});
