document.addEventListener('DOMContentLoaded', function() {
  const heroVideo = document.getElementById('hero-video');

  // Fix safari compression later 
  if (heroVideo) {
    const videos = {
      small: 'webtrailer_midq.webm',
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
