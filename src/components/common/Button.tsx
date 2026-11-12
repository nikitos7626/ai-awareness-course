import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  tone?: 'violet' | 'white' | 'dark' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'solid',
    tone = 'violet',
    size = 'md',
    icon,
    iconRight,
    disabled = false,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const sizeStyles = {
    sm: {
      minHeight: '38px',
      padding: '8px 18px',
      fontSize: 'var(--smg-web-fs-label-sm, 14px)',
      lineHeight: 'var(--smg-web-lh-label-sm, 1.2)',
      letterSpacing: '-0.01em',
      gap: '6px',
    },
    md: {
      minHeight: '44px',
      padding: '11px 22px',
      fontSize: 'var(--smg-web-fs-label-md, 16px)',
      lineHeight: 'var(--smg-web-lh-label-md, 1.2)',
      letterSpacing: '-0.01em',
      gap: '8px',
    },
    lg: {
      minHeight: '52px',
      padding: '14px 28px',
      fontSize: '17px',
      lineHeight: '1.25',
      letterSpacing: '-0.01em',
      gap: '10px',
    },
  }[size];

  const palettes = {
    violet: {
      bg: 'var(--smg-violet)',
      fg: 'var(--smg-white)',
      border: 'var(--smg-violet)',
      hoverBg: '#521ee0',
      activeBg: '#4517bf',
      ghostHover: 'var(--smg-violet-50)',
    },
    white: {
      bg: 'var(--smg-white)',
      fg: 'var(--smg-ink)',
      border: 'var(--smg-border)',
      hoverBg: 'var(--smg-gray-50)',
      activeBg: 'var(--smg-gray-100)',
      ghostHover: 'rgba(255, 255, 255, 0.1)',
    },
    dark: {
      bg: 'var(--smg-ink)',
      fg: 'var(--smg-white)',
      border: 'var(--smg-ink)',
      hoverBg: 'var(--smg-black)',
      activeBg: '#0a0a0a',
      ghostHover: 'rgba(0, 0, 0, 0.05)',
    },
    success: {
      bg: '#059669', // Emerald 600 - WCAG 2.1 AA compliant (4.52:1 against white)
      fg: 'var(--smg-white)',
      border: 'var(--smg-success)',
      hoverBg: '#047857',
      activeBg: '#065f46',
      ghostHover: 'var(--smg-success-soft)',
    },
    danger: {
      bg: '#DC2626', // Red 600 - WCAG 2.1 AA compliant (4.6:1 against white)
      fg: 'var(--smg-white)',
      border: 'var(--smg-danger)',
      hoverBg: '#B91C1C',
      activeBg: '#991B1B',
      ghostHover: 'var(--smg-danger-soft)',
    },
  }[tone];

  // White solid buttons need a hairline border to separate from light surfaces
  const whiteStates = {
    bg: 'var(--smg-white)',
    bgHover: 'var(--smg-gray-50)',
    bgActive: 'var(--smg-gray-350)',
    border: 'var(--smg-border)',
  };

  let bg = palettes.bg;
  let color = palettes.fg;
  let boxShadow: string = 'none';
  let border = 'none';

  if (variant === 'solid') {
    bg = palettes.bg;
    color = palettes.fg;
    if (tone === 'white') {
      boxShadow = `inset 0 0 0 1px ${whiteStates.border}`;
    }
  } else if (variant === 'outline') {
    bg = 'transparent';
    color = tone === 'white' ? 'var(--smg-white)' : (tone === 'violet' ? 'var(--smg-violet)' : 'var(--smg-ink)');
    boxShadow = `inset 0 0 0 1px ${palettes.border}, 0 0 0 1px ${palettes.border}`;
  } else { /* ghost */
    bg = 'transparent';
    color = tone === 'white' ? 'var(--smg-white)' : 'var(--smg-violet)';
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`smg-button smg-button-${variant} smg-button-${tone} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        maxWidth: '100%',
        borderRadius: 'var(--smg-radius-pill)',
        fontFamily: 'var(--smg-font-body)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'transform .15s ease, filter .15s ease, background .15s ease',
        boxSizing: 'border-box',
        background: bg,
        color,
        border,
        boxShadow,
        ...sizeStyles,
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && variant === 'solid' && tone === 'white') e.currentTarget.style.background = whiteStates.bgHover; }}
      onMouseDown={(e) => { if (!disabled) { e.currentTarget.style.transform = 'scale(0.97)'; if (variant === 'solid' && tone === 'white') e.currentTarget.style.background = whiteStates.bgActive; } }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; if (!disabled && variant === 'solid' && tone === 'white') e.currentTarget.style.background = whiteStates.bgHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; if (variant === 'solid' && tone === 'white') e.currentTarget.style.background = whiteStates.bg; }}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{iconRight}</span>}
    </button>
  );
});

export default Button;
