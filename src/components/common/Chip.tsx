import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline' | 'tint';
  tone?: 'violet' | 'dark' | 'white' | 'success' | 'danger' | 'gray';
  icon?: React.ReactNode;
}

export function Chip({
  children,
  variant = 'tint',
  tone = 'violet',
  icon,
  className = '',
  style,
  ...rest
}: ChipProps) {
  const tones = {
    violet: {
      fg: 'var(--smg-violet)',
      bg: 'var(--smg-violet-50)',
      border: 'var(--smg-violet)',
      solidBg: 'var(--smg-violet)',
      solidFg: 'var(--smg-white)',
    },
    dark: {
      fg: 'var(--smg-ink)',
      bg: 'var(--smg-gray-100)',
      border: 'var(--smg-ink)',
      solidBg: 'var(--smg-ink)',
      solidFg: 'var(--smg-white)',
    },
    white: {
      fg: 'var(--smg-white)',
      bg: 'rgba(255, 255, 255, 0.14)',
      border: 'rgba(255, 255, 255, 0.3)',
      solidBg: 'var(--smg-white)',
      solidFg: 'var(--smg-ink)',
    },
    success: {
      fg: '#047857',
      bg: 'var(--smg-success-soft)',
      border: 'var(--smg-success)',
      solidBg: '#059669', // Emerald 600 - WCAG AA compliant with white text
      solidFg: 'var(--smg-white)',
    },
    danger: {
      fg: '#B91C1C',
      bg: 'var(--smg-danger-soft)',
      border: 'var(--smg-danger)',
      solidBg: '#DC2626', // Red 600 - WCAG AA compliant with white text
      solidFg: 'var(--smg-white)',
    },
    gray: {
      fg: '#4A4A4A',
      bg: 'var(--smg-gray-100)',
      border: 'var(--smg-gray-300)',
      solidBg: '#4A4A4A',
      solidFg: 'var(--smg-white)',
    },
  }[tone];

  let color = tones.fg;
  let bg = tones.bg;
  let border = 'none';
  let boxShadow = 'none';

  if (variant === 'solid') {
    bg = tones.solidBg;
    color = tones.solidFg;
  } else if (variant === 'outline') {
    bg = 'transparent';
    boxShadow = `inset 0 0 0 1px ${tones.border}`;
  }

  return (
    <span
      className={`smg-chip ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: 'var(--smg-radius-pill)',
        fontFamily: 'var(--smg-font-body)',
        fontWeight: 500,
        fontSize: 'var(--smg-web-fs-label-sm, 14px)',
        lineHeight: 'var(--smg-web-lh-label-sm, 1.2)',
        letterSpacing: '-0.01em',
        color,
        background: bg,
        border,
        boxShadow,
        maxWidth: '100%',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>}
      {children}
    </span>
  );
}

export default Chip;
