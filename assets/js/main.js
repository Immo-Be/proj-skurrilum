document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainMenu = document.querySelector('#main-menu');
  const dropdowns = document.querySelectorAll('.has-dropdown > a');

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('is-active'); // Toggle active class on the button
      mainMenu.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
    });
  }

  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function (e) {
      if (window.innerWidth < 768) {
        e.preventDefault();
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.classList.toggle('is-open');
      }
    });
  });
});
