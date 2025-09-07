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
    // Add a small tolerance for floating point inaccuracies
    nextButton.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
  };

  slider.addEventListener('scroll', updateArrowStates, { passive: true });

  nextButton.addEventListener('click', () => {
    const itemWidth = slider.querySelector('.gallery-item').clientWidth;
    slider.scrollLeft += itemWidth;
  });

  prevButton.addEventListener('click', () => {
    const itemWidth = slider.querySelector('.gallery-item').clientWidth;
    slider.scrollLeft -= itemWidth;
  });

  // Initial check in case the gallery starts in a scrolled state
  updateArrowStates();

  // A resize observer is more reliable for tracking size changes
  const resizeObserver = new ResizeObserver(updateArrowStates);
  resizeObserver.observe(slider);
});