document.addEventListener('DOMContentLoaded', function () {
  const ctaLink = document.querySelector('.cta-link');

  if (ctaLink) {
    const heroSection = document.querySelector('.hero');
    const footerSection = document.querySelector('.site-footer');

    function handleScroll() {
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;

        if (heroBottom <= 250) {
          ctaLink.classList.add('scrolling');
        } else {
          ctaLink.classList.remove('scrolling');
        }
      }
      if (footerSection) {
        const footerTop = footerSection.getBoundingClientRect().top;

        if (footerTop < window.innerHeight) {
          ctaLink.classList.remove('scrolling');
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
  }
});
