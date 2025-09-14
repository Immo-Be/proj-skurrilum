document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('room-video');
  if (!el || !el.dataset.video) return;

  const debug = el.dataset.debug === '1';
  const log = (...a) => debug && console.log('[room-video]', ...a);

  const base = el.dataset.video.trim();
  const mobileDir = el.dataset.mobilePath || '';
  const hdDir = el.dataset.hdPath || '';

  const nameFor = (w, codec) => {
    const widthPart = w ? `_w${w}` : '';
    if (codec === 'av1') return `${base}${widthPart}_av1.webm`;
    if (codec === 'hevc') return `${base}${widthPart}_hevc.mp4`;
    return `${base}${widthPart}_h264.mp4`;
  };

  const canPlay = (type) => {
    try {
      return !!el.canPlayType && el.canPlayType(type).replace('no', '');
    } catch {
      return '';
    }
  };

  const supportsAV1 = !!(
    canPlay('video/webm; codecs="av01.0.08M.10"') || canPlay('video/webm; codecs="av01.0.05M.08"')
  );
  const supportsHEVC = !!(
    canPlay('video/mp4; codecs="hvc1"') || canPlay('video/mp4; codecs="hev1"')
  );

  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const constrained =
    !!conn && (conn.saveData === true || /^(2g|slow-2g|3g)$/.test(conn.effectiveType || ''));

  const forced = (el.dataset.forceTier || '').toLowerCase();
  const pickTier = () => {
    if (forced === 'mobile' || forced === 'hd') return forced;
    const isPortrait = window.matchMedia && matchMedia('(orientation: portrait)').matches;
    const cssShort = Math.min(innerWidth, innerHeight);
    if (constrained) return 'mobile';
    if (isPortrait && cssShort <= 800) return 'mobile';
    return 'hd';
  };

  let lastKey = '';

  const apply = () => {
    const tier = pickTier();
    const dir = tier === 'mobile' ? mobileDir : hdDir;
    
    let src, type, key;
    if (supportsAV1) {
      src = `/videos/${dir}` + nameFor(null, 'av1');
      type = 'video/webm';
      key = `${tier}|av1`;
    } else if (supportsHEVC) {
      src = `/videos/${dir}` + nameFor(null, 'hevc');
      type = 'video/mp4';
      key = `${tier}|hevc`;
    } else {
      src = `/videos/${dir}` + nameFor(null, 'h264');
      type = 'video/mp4';
      key = `${tier}|h264`;
    }

    if (key === lastKey) return;

    log(
      'tier:',
      tier,
      'dir:',
      dir,
      'file:',
      src.split('/').pop(),
      'av1:',
      supportsAV1,
      'hevc:',
      supportsHEVC
    );
    el.pause();
    while (el.firstChild) el.removeChild(el.firstChild);
    const s = document.createElement('source');
    s.src = src;
    s.type = type;
    el.appendChild(s);
    el.load();
    if (el.autoplay && el.muted) el.play().catch(() => {});
    lastKey = key;
  };

  setTimeout(apply, 0);
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 150);
  };
  addEventListener('resize', schedule);
  addEventListener('orientationchange', schedule);
  if (conn && typeof conn.addEventListener === 'function') {
    conn.addEventListener('change', () => {
      lastKey = '';
      apply();
    });
  }
});
