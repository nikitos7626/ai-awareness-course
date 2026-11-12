import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'surface' | 'muted' | 'tint' | 'brand' | 'dark' | 'success-soft' | 'danger-soft';
  radius?: 12 | 16 | 24 | 40;
  elevated?: boolean;
  padding?: string | number;
}

export function Card({
  children,
  tone = 'surface',
  radius = 24,
  elevated = false,
  padding,
  className = '',
  style,
  ...rest
}: CardProps) {
  const tones = {
    surface: {
      bg: 'var(--smg-surface)',
      fg: 'var(--smg-ink)',
      border: '1px solid var(--smg-gray-200)',
    },
    muted: {
      bg: 'var(--smg-gray-100)',
      fg: 'var(--smg-ink)',
      border: '1px solid var(--smg-gray-200)',
    },
    tint: {
      bg: 'var(--smg-violet-50)',
      fg: 'var(--smg-ink)',
      border: '1px solid var(--smg-violet-100)',
    },
    brand: {
      bg: 'var(--smg-violet)',
      fg: 'var(--smg-white)',
      border: 'none',
    },
    dark: {
      bg: 'var(--smg-black)',
      fg: 'var(--smg-white)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    },
    'success-soft': {
      bg: 'var(--smg-success-soft)',
      fg: 'var(--smg-ink)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    'danger-soft': {
      bg: 'var(--smg-danger-soft)',
      fg: 'var(--smg-ink)',
      border: '1px solid rgba(255, 100, 100, 0.3)',
    },
  }[tone];

  const defaultPadding = radius >= 40 ? '32px' : '24px';

  return (
    <div
      className={`smg-card ${className}`}
      style={{
        background: tones.bg,
        color: tones.fg,
        border: tones.border,
        borderRadius: radius,
        padding: padding ?? defaultPadding,
        boxShadow: elevated ? '0 10px 30px rgba(0, 0, 0, 0.06)' : 'none',
        boxSizing: 'border-box',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
