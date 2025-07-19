document.addEventListener('DOMContentLoaded', function() {
  const ctaLink = document.querySelector('.cta-link');
  const shopPage = document.querySelector('body[data-kind="page"][data-slug="shop"]');

  if (ctaLink) {
    const heroSection = document.querySelector('.hero');

    function handleScroll() {
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;

        if (heroBottom <= 0) {
          ctaLink.classList.add('scrolling');
        } else {
          ctaLink.classList.remove('scrolling');
        }
      }

      if (shopPage) {
        const shopTop = shopPage.getBoundingClientRect().top;
        if (shopTop <= window.innerHeight) {
          ctaLink.style.display = 'none';
        } else {
          ctaLink.style.display = 'block';
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
  }
});