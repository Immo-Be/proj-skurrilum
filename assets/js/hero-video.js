document.addEventListener('DOMContentLoaded', function() {
  const heroVideo = document.getElementById('hero-video');

  if (heroVideo) {
    const videos = {
      small: 'video_portrait_864x1536_hevc_480k_2pass.mp4',
      medium: 'webtrailer_midq.webm',
      large: 'webtrailer.webm',
    };

    let lastWidth = 0;

    function setVideoSource() {
      const screenWidth = window.innerWidth;
      if (screenWidth === lastWidth) {
        return; // Do nothing if width hasn't changed
      }
      lastWidth = screenWidth;

      let newSource;
      if (screenWidth < 768) {
        newSource = videos.small;
      } else if (screenWidth < 1200) {
        newSource = videos.medium;
      } else {
        newSource = videos.large;
      }

      const currentSource = heroVideo.src.split('/').pop();
      if (newSource !== currentSource) {
        heroVideo.src = `/videos/${newSource}`;
      }
    }

    // Set the initial video source
    setVideoSource();

    // Add the event listener for resize
    window.addEventListener('resize', setVideoSource);
  }
});
