document.addEventListener('DOMContentLoaded', function () {
  const trigger = document.getElementById('easter-egg-trigger');
  const container = document.getElementById('ghost-container');

  if (!trigger || !container) {
    return;
  }

  let isAnimating = false;

  const trailGhostSvg = `
  <svg
    width="125"
    height="100"
    viewBox="0 0 40 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <path d="M16 2c-6.627 0-12 5.373-12 12v11c0 2.052 2.238 3.327 3.625 2.457l1.013-.633c.835-.522 1.861-.318 2.48.435l1.83 2.196c.67.804 1.948.804 2.618 0l1.83-2.196c.619-.753 1.645-.957 2.48-.435l1.013.633c1.387.87 3.625-.405 3.625-2.457V14c0-6.627-5.373-12-12-12zm-5 14c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm10 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
      <path
        d="M24,19 C25,18 26,18 27,19"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
  </svg>`;

  trigger.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const lang = document.body.dataset.lang || 'en';
    const textLine1 = lang === 'de' ? 'JETZT' : 'BOOK';
    const textLine2 = lang === 'de' ? 'BUCHEN' : 'NOW';

    const mainGhostSvg = `
<svg
  width="125"
  height="100"
  viewBox="0 0 40 32"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Ghost flipped -->
  <g transform="translate(40,0) scale(-1,1)">
    <g fill="currentColor">
      <path
        d="M16 2c-6.627 0-12 5.373-12 12v11c0 2.052 2.238 3.327 3.625 2.457l1.013-.633c.835-.522 1.861-.318 2.48.435l1.83 2.196c.67.804 1.948.804 2.618 0l1.83-2.196c.619-.753 1.645-.957 2.48-.435l1.013.633c1.387.87 3.625-.405 3.625-2.457V14c0-6.627-5.373-12-12-12zm-5 14c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm10 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"
      ></path>
      <path
        d="M24,19 C25,18 26,18 27,19"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      ></path>
    </g>
  </g>

  <!-- Sign moved manually to the opposite side -->
  <g>
    <rect
      x="1"
      y="15"
      width="13"
      height="9"
      rx="1"
      fill="#e2b44d"
      stroke="#a48037"
      stroke-width="0.5"
    ></rect>
    <text
      x="7.5"
      y="17.5"
      font-family="'Bebas Neue', sans-serif"
      font-size="3.5"
      fill="black"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      ${textLine1}
    </text>
    <text
      x="7.5"
      y="21.5"
      font-family="'Bebas Neue', sans-serif"
      font-size="3.5"
      fill="black"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      ${textLine2}
    </text>
  </g>
</svg>`;

    container.innerHTML = ''; // Clear previous ghosts

    const trailCount = 4;
    for (let i = 0; i < trailCount; i++) {
      const trailGhost = document.createElement('div');
      trailGhost.className = 'ghost';
      trailGhost.innerHTML = trailGhostSvg;
      trailGhost.style.animationDelay = `${i * 100}ms`;
      trailGhost.style.color = 'gray';
      trailGhost.style.filter = 'drop-shadow(0 0 5px rgba(255,255,255,0.2))';
      trailGhost.style.opacity = 0.4 - i * 0.1;
      container.appendChild(trailGhost);
    }

    const mainGhost = document.createElement('div');
    mainGhost.className = 'ghost';
    mainGhost.innerHTML = mainGhostSvg;
    mainGhost.style.color = 'rgba(255,255,255,0.8)';
    mainGhost.style.filter = 'drop-shadow(0 0 5px rgba(255,255,255,0.2))';
    container.appendChild(mainGhost);

    requestAnimationFrame(() => {
      container.classList.add('animate');
    });

    const cleanup = () => {
      if (!isAnimating) return;
      container.innerHTML = '';
      isAnimating = false;
    };

    mainGhost.addEventListener('animationend', cleanup, { once: true });

    // Fallback timer
    setTimeout(cleanup, 13000); // animation is 12s, plus some buffer
  });
});
