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

  const indicator = gallery.querySelector('.gallery-indicator');
  if (indicator) {
    const dots = indicator.querySelectorAll('.indicator-dot');
    const items = slider.querySelectorAll('.gallery-item');

    const updateIndicator = () => {
      const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
      let closestIndex = -1;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.clientWidth / 2;
        const distance = Math.abs(sliderCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        if (index === closestIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    slider.addEventListener('scroll', updateIndicator, { passive: true });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        items[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
      });
    });

    // Initial check
    updateIndicator();
    // Also update on resize
    window.addEventListener('resize', updateIndicator, { passive: true });
  }
});
