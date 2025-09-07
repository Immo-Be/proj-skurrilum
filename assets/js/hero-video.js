document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById('hero-video');
  if (!heroVideo) return;

  // Read sources from data attributes
  const BASE = heroVideo.dataset.basePath || '/videos/';
  const sources = {
    portrait: {
      av1: heroVideo.dataset.portraitAv1,
      hevc: heroVideo.dataset.portraitHevc,
      h264: heroVideo.dataset.portraitH264,
    },
    landscape1080: {
      av1: heroVideo.dataset.landscape1080Av1,
      hevc: heroVideo.dataset.landscape1080Hevc,
      h264: heroVideo.dataset.landscape1080H264,
    },
    landscape4k: {
      av1: heroVideo.dataset.landscape4kAv1,
      hevc: heroVideo.dataset.landscape4kHevc,
      h264: heroVideo.dataset.landscape4kH264,
    },
  };

  // ---- Capability probes ---------------------------------------------------
  const canPlay = (type) => {
    try {
      return !!heroVideo.canPlayType && heroVideo.canPlayType(type).replace('no', '') !== '';
    } catch {
      return false;
    }
  };

  // Try a couple of common AV1 profiles (8/10-bit). Browsers return "maybe"/"probably"/"".
  const supportsAV1WebM =
    canPlay('video/webm; codecs="av01.0.08M.10"') || // 10-bit 4:2:0
    canPlay('video/webm; codecs="av01.0.05M.08"'); // 8-bit  4:2:0

  // HEVC in MP4 (Safari prefers hvc1; some envs report hev1)
  const supportsHEVC = canPlay('video/mp4; codecs="hvc1"') || canPlay('video/mp4; codecs="hev1"');

  // H.264 is broadly supported, but we check for a common profile.
  const supportsH264 = canPlay('video/mp4; codecs="avc1.42E01E"');

  // Network heuristics (optional downgrade on poor network / data saver)
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const isConstrainedNet =
    !!conn && (conn.saveData === true || /^(2g|slow-2g|3g)$/.test(conn.effectiveType || ''));

  // ---- Selection logic -----------------------------------------------------
  let lastKey = ''; // remember what we loaded to avoid churn

  function wantsPortrait() {
    // Prefer CSS orientation if available; fallback to aspect check
    if (window.matchMedia && window.matchMedia('(orientation: portrait)').matches) return true;
    return window.innerHeight > window.innerWidth * 1.05;
  }

  function wants4K() {
    // Use CSS pixels * DPR to gauge real density; require a big canvas for "high"
    const logical = Math.max(window.innerWidth, window.innerHeight);
    const effective = logical * (window.devicePixelRatio || 1);
    // Tweak threshold if you like; ~3000px effective width looks good for 4K
    return effective >= 3000 && !isConstrainedNet;
  }

  function chooseVariant() {
    const portrait = wantsPortrait();

    // Which tier?
    const tier = portrait ? 'portrait' : wants4K() ? 'landscape4k' : 'landscape1080';

    // Which codec? Prefer AV1 WebM when supported; otherwise HEVC MP4.
    let filename = '';
    let type = '';

    if (supportsAV1WebM && sources[tier].av1) {
      filename = sources[tier].av1;
      type = 'video/webm';
    } else if (supportsHEVC && sources[tier].hevc) {
      filename = sources[tier].hevc;
      type = 'video/mp4';
    } else if (supportsH264 && sources[tier].h264) {
      filename = sources[tier].h264;
      type = 'video/mp4';
    } else {
      // No suitable format found
      return null;
    }

    const key = `${tier}|${filename}`;
    return { src: BASE + filename, type, key };
  }

  // ---- Apply selection -----------------------------------------------------
  let resizeTimer = null;

  function setVideoSource() {
    const choice = chooseVariant();
    if (!choice) return;

    if (choice.key === lastKey) return; // already using the right one

    // Swap source robustly
    const wasPaused = heroVideo.paused;
    heroVideo.pause();
    heroVideo.removeAttribute('src'); // helps some browsers fully drop previous resource
    heroVideo.src = choice.src;
    heroVideo.load();

    // Autoplay if allowed; otherwise leave paused state as-is
    const shouldAutoplay = heroVideo.hasAttribute('autoplay') && heroVideo.muted;
    if (shouldAutoplay && wasPaused === false) {
      heroVideo.play().catch(() => {
        /* ignore autoplay block */
      });
    }

    lastKey = choice.key;
  }

  // Initial pick (after a tick so CSS/layout settles)
  setTimeout(setVideoSource, 0);

  // Debounced resize + orientation changes
  const onChange = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setVideoSource, 150);
  };
  window.addEventListener('resize', onChange);
  window.addEventListener('orientationchange', onChange);

  // Optional: react to connection changes (data saver / network type)
  if (conn && typeof conn.addEventListener === 'function') {
    conn.addEventListener('change', () => {
      lastKey = ''; // force reconsideration
      setVideoSource();
    });
  }
});