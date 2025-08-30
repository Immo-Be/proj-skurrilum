document.addEventListener('DOMContentLoaded', function() {
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
});