document.addEventListener('DOMContentLoaded', function() {
  // Original menu logic
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const langSwitcher = document.querySelector('.lang-switcher.has-lang-dropdown');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('is-active'); // Toggle active class on the button
      mainNav.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
    });
  }

  // Language switcher logic for touch devices
  if (langSwitcher) {
    const langToggle = langSwitcher.querySelector('.current-lang-toggle');
    langToggle.addEventListener('click', function(event) {
      event.preventDefault();
      langSwitcher.classList.toggle('is-open');
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', function(event) {
    // Close main nav
    if (mainNav && menuToggle && mainNav.classList.contains('is-open') && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('is-active');
      mainNav.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    // Close lang switcher
    if (langSwitcher && langSwitcher.classList.contains('is-open') && !langSwitcher.contains(event.target)) {
      langSwitcher.classList.remove('is-open');
    }
  });

  // Solid-on-scroll header logic
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) { // Adjust this value as needed
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  //
  // dropdownToggles.forEach(toggle => {
  //   toggle.addEventListener('click', function() {
  //     const dropdownMenu = this.nextElementSibling;
  //     const isExpanded = this.getAttribute('aria-expanded') === 'true';
  //     this.setAttribute('aria-expanded', !isExpanded);
  //     dropdownMenu.classList.toggle('is-open');
  //   });
  // });

  // initShop();
});
