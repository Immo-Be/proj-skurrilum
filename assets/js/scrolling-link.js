document.addEventListener('DOMContentLoaded', function () {
  const ctaLink = document.querySelector('.cta-link');

  if (ctaLink) {
    const heroSection = document.querySelector('.hero');
    const footerSection = document.querySelector('.site-footer');
    const shopAnchor = document.querySelector('#shop-anchor');

    function handleScroll() {
      let show = false;

      // Condition 1: Show after hero
      if (heroSection) {
        if (heroSection.getBoundingClientRect().bottom <= 800) {
          show = true;
        }
      } else {
        // If no hero, show by default (can be overridden by other conditions)
        show = true;
      }

      // Condition 2: Hide if footer is visible
      if (footerSection) {
        if (footerSection.getBoundingClientRect().top < window.innerHeight) {
          show = false;
        }
      }

      // Condition 3: Hide if shop anchor is visible
      if (shopAnchor) {
        const rect = shopAnchor.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          show = false;
        }
      }

      // Apply the result
      if (show) {
        ctaLink.classList.add('scrolling');
      } else {
        ctaLink.classList.remove('scrolling');
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
  }
});
