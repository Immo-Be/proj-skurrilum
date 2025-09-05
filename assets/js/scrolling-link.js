document.addEventListener('DOMContentLoaded', function() {
  const ctaLink = document.querySelector('.cta-link');

  if (ctaLink) {
    const heroSection = document.querySelector('.hero');

    function handleScroll() {
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;

        if (heroBottom <= 250) {
          ctaLink.classList.add('scrolling');
        } else {
          ctaLink.classList.remove('scrolling');
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
  }
});
