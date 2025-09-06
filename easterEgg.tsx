import React, { useRef, useEffect } from 'react';

interface EasterEggProps {
  onAnimationEnd: () => void;
}

const GhostWithSign: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="125"
    height="100"
    viewBox="0 0 40 32"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g
      fill="currentColor"
      className="transition-transform duration-300 ease-in-out group-hover:-translate-y-1 group-hover:rotate-[-3deg]"
    >
      <path d="M16 2c-6.627 0-12 5.373-12 12v11c0 2.052 2.238 3.327 3.625 2.457l1.013-.633c.835-.522 1.861-.318 2.48.435l1.83 2.196c.67.804 1.948.804 2.618 0l1.83-2.196c.619-.753 1.645-.957 2.48-.435l1.013.633c1.387.87 3.625-.405 3.625-2.457V14c0-6.627-5.373-12-12-12zm-5 14c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm10 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
      <path
        d="M24,19 C25,18 26,18 27,19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
    <g className="transition-all duration-300 group-hover:[filter:drop-shadow(0_0_4px_#e2b44d)]">
      <rect
        x="26"
        y="15"
        width="13"
        height="9"
        rx="1"
        fill="#e2b44d"
        stroke="#a48037"
        strokeWidth="0.5"
      />
      <text
        x="32.5"
        y="17.5"
        fontFamily="Bebas Neue, sans-serif"
        fontSize="3.5"
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        BOOK
      </text>
      <text
        x="32.5"
        y="21.5"
        fontFamily="Bebas Neue, sans-serif"
        fontSize="3.5"
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        NOW
      </text>
    </g>
  </svg>
);

const GhostShape: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg
    width="125"
    height="100"
    viewBox="0 0 40 32"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <g fill="currentColor">
      <path d="M16 2c-6.627 0-12 5.373-12 12v11c0 2.052 2.238 3.327 3.625 2.457l1.013-.633c.835-.522 1.861-.318 2.48.435l1.83 2.196c.67.804 1.948.804 2.618 0l1.83-2.196c.619-.753 1.645-.957 2.48-.435l1.013.633c1.387.87 3.625-.405 3.625-2.457V14c0-6.627-5.373-12-12-12zm-5 14c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm10 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
      <path
        d="M24,19 C25,18 26,18 27,19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

const EasterEgg: React.FC<EasterEggProps> = ({ onAnimationEnd }) => {
  const mainGhostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ghostElement = mainGhostRef.current;
    const handleAnimationEnd = () => {
      onAnimationEnd();
    };

    if (ghostElement) {
      ghostElement.addEventListener('animationend', handleAnimationEnd, { once: true });
    }

    // Fallback timer just in case animationend event doesn't fire
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 6500); // Slightly longer than 6s animation

    return () => {
      if (ghostElement) {
        ghostElement.removeEventListener('animationend', handleAnimationEnd);
      }
      clearTimeout(timer);
    };
  }, [onAnimationEnd]);

  const trailCount = 4;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {/* Trail Ghosts */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-ghost-fly opacity-0"
          style={{ animationDelay: `${(i + 1) * 75}ms` }}
          aria-hidden="true"
        >
          <GhostShape
            className={`text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
            style={{ opacity: 0.4 - i * 0.1 }}
          />
        </div>
      ))}

      {/* Main Ghost */}
      <div
        ref={mainGhostRef}
        className="absolute animate-ghost-fly opacity-0 group pointer-events-auto cursor-pointer"
      >
        <GhostWithSign className="text-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  );
};

export default EasterEgg;
