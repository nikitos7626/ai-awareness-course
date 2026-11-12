import React from 'react';

const BRACE_D =
  'M 13.006 18.247 C 13.006 8.17 21.175 0 31.253 0 L 39.018 0 L 39.018 13.006 L 31.253 13.006 C 28.359 13.006 26.012 15.353 26.012 18.247 C 26.012 25.144 23.014 31.436 18.159 35.767 C 23.014 40.098 26.012 46.39 26.012 53.287 C 26.012 56.181 28.359 58.528 31.253 58.528 L 39.018 58.528 L 39.018 71.534 L 31.253 71.534 C 21.175 71.534 13.006 63.364 13.006 53.287 C 13.006 48.201 9.348 43.852 4.338 42.981 L 0 42.226 L 0 29.308 L 4.338 28.553 C 9.348 27.682 13.006 23.333 13.006 18.247 Z';

export interface LogoProps {
  variant?: 'color' | 'dark' | 'light' | 'mark-dark';
  wordmark?: boolean;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({
  variant = 'color',
  wordmark = true,
  height = 36,
  className,
  style,
}: LogoProps) {
  const themes = {
    color: {
      squircle: 'var(--smg-violet)',
      mark: 'var(--smg-white)',
      word: 'var(--smg-ink)',
    },
    dark: {
      squircle: 'transparent',
      mark: 'var(--smg-ink)',
      word: 'var(--smg-ink)',
    },
    light: {
      squircle: 'transparent',
      mark: 'var(--smg-white)',
      word: 'var(--smg-white)',
    },
    'mark-dark': {
      squircle: 'var(--smg-white)',
      mark: 'var(--smg-ink)',
      word: 'var(--smg-ink)',
    },
  };

  const t = themes[variant] || themes.color;
  const box = height;

  const mark = (
    <svg
      width={box}
      height={box}
      viewBox="0 0 136.565 136.565"
      className="smg-logo-mark"
      style={{ flexShrink: 0, display: 'block' }}
      aria-label="Soft Media Group"
      role="img"
    >
      {t.squircle !== 'transparent' && (
        <rect x="0" y="0" width="136.565" height="136.565" rx="39.018" fill={t.squircle} />
      )}
      <g transform="translate(45.521, 32.515)">
        <path d={BRACE_D} fill={t.mark} fillRule="evenodd" />
      </g>
    </svg>
  );

  if (!wordmark) {
    return (
      <span className={className} style={{ display: 'inline-flex', ...style }}>
        {mark}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(height * 0.28),
        textDecoration: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {mark}
      <span
        className="smg-logo-text"
        style={{
          fontFamily: 'var(--smg-font-word)',
          fontWeight: 500,
          fontSize: Math.round(height * 1.02),
          lineHeight: 0.76,
          letterSpacing: '-0.02em',
          color: t.word,
        }}
      >
        smg
      </span>
    </span>
  );
}

export default Logo;
