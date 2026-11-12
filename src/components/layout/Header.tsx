import { useState } from 'react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { Chip } from '../common/Chip';

export interface HeaderProps {
  progressPercent: number;
  completedTopicsCount: number;
  totalTopics: number;
  correctQuizzesCount: number;
  totalQuizzes: number;
  onReset: () => void;
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export function Header({
  progressPercent,
  completedTopicsCount,
  totalTopics,
  correctQuizzesCount,
  totalQuizzes,
  onReset,
  onToggleMobileNav,
  isMobileNavOpen,
}: HeaderProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setShowConfirmReset(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.86)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--smg-gray-200)',
      }}
    >
      <div
        className="smg-header-inner"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '14px 32px',
          minHeight: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="#hero"
            aria-label="Soft Media Group — на главную"
            style={{ display: 'inline-flex', textDecoration: 'none' }}
          >
            <Logo height={32} />
          </a>
          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'var(--smg-gray-200)',
              display: 'none',
            }}
            className="smg-header-divider"
          />
          <span
            style={{
              fontFamily: 'var(--smg-font-body)',
              fontWeight: 600,
              fontSize: '14px',
              color: 'var(--smg-ink)',
              letterSpacing: '-0.01em',
            }}
            className="smg-header-title"
          >
            Курс: Как работать с AI осознанно
          </span>
        </div>

        {/* Center: Progress Bar (Desktop & Tablet) */}
        <div
          className="smg-progress-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flex: '1',
            maxWidth: '440px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#4A4A4A',
              }}
            >
              <span>Прогресс курса</span>
              <span
                style={{
                  color: 'var(--smg-violet)',
                  fontWeight: 700,
                  fontFamily: 'var(--smg-font-word)',
                  letterSpacing: '-0.02em',
                }}
              >
                {progressPercent}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Общий прогресс прохождения курса"
              style={{
                height: '8px',
                borderRadius: 'var(--smg-radius-pill)',
                background: 'var(--smg-gray-200)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background:
                    progressPercent === 100
                      ? 'var(--smg-success)'
                      : 'linear-gradient(90deg, var(--smg-violet), var(--smg-violet-500))',
                  borderRadius: 'var(--smg-radius-pill)',
                  transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Chip
              variant="tint"
              tone={completedTopicsCount === totalTopics ? 'success' : 'violet'}
              title="Изучено тем"
            >
              {completedTopicsCount}/{totalTopics} тем
            </Chip>
            <Chip
              variant="tint"
              tone={correctQuizzesCount === totalQuizzes ? 'success' : 'violet'}
              title="Решено кейсов"
            >
              {correctQuizzesCount}/{totalQuizzes} кейсов
            </Chip>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showConfirmReset ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--smg-violet-50)',
                padding: '4px 10px',
                borderRadius: 'var(--smg-radius-pill)',
                border: '1px solid var(--smg-violet-100)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--smg-ink)' }}>
                Сбросить всё?
              </span>
              <Button
                size="sm"
                tone="danger"
                variant="solid"
                onClick={handleConfirmReset}
                style={{ minHeight: '28px', padding: '0 12px', fontSize: '12px' }}
              >
                Да
              </Button>
              <Button
                size="sm"
                tone="dark"
                variant="outline"
                onClick={() => setShowConfirmReset(false)}
                style={{
                  minHeight: '28px',
                  padding: '0 12px',
                  fontSize: '12px',
                  backgroundColor: 'var(--smg-white)',
                  color: 'var(--smg-ink)',
                  borderColor: 'var(--smg-border)',
                }}
              >
                Нет
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              tone="dark"
              onClick={() => setShowConfirmReset(true)}
              title="Начать курс заново и очистить сохраненный прогресс"
              aria-label="Начать заново и сбросить прогресс"
            >
              Начать заново
            </Button>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={onToggleMobileNav}
            aria-label={isMobileNavOpen ? 'Закрыть меню курса' : 'Открыть меню курса'}
            className="smg-mobile-nav-toggle"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: 'var(--smg-radius-pill)',
              border: '1px solid var(--smg-border)',
              background: 'var(--smg-white)',
              cursor: 'pointer',
              color: 'var(--smg-ink)',
            }}
          >
            {isMobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
