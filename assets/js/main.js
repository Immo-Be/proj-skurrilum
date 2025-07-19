document.addEventListener('DOMContentLoaded', function() {
  // Video logic
  const heroVideo = document.getElementById('hero-video');

  if (heroVideo) {
    const videos = {
      small: 'webtrailer_lowq.webm',
      medium: 'webtrailer_midq.webm',
      large: 'webtrailer.webm',
    };

    function setVideoSource() {
      const screenWidth = window.innerWidth;
      let videoSource;

      if (screenWidth < 768) {
        videoSource = videos.small;
      } else if (screenWidth < 1200) {
        videoSource = videos.medium;
      } else {
        videoSource = videos.large;
      }

      heroVideo.src = `/videos/${videoSource}`;
    }

    setVideoSource();
    window.addEventListener('resize', setVideoSource);
  }

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

  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
      if (window.innerWidth < 768) {
        e.preventDefault();
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.classList.toggle('is-open');
      }
    });
  });
});
