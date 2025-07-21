document.addEventListener('DOMContentLoaded', function() {
  // Original menu logic
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const dropdowns = document.querySelectorAll('.has-dropdown > a');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('is-active'); // Toggle active class on the button
      mainNav.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
    });

    document.addEventListener('click', function(event) {
      if (
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active'); // Remove active class from the button
        mainNav.classList.remove('is-open');
        document.body.classList.remove('no-scroll'); // Allow scrolling again
      }
    });
  }

  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const dropdownMenu = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      dropdownMenu.classList.toggle('is-open');
    });
  });
});
