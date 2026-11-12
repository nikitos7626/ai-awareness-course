import type { OfficialSource } from '../../types/course';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Icon } from '../common/Icon';

export interface SourcesSectionProps {
  sources: OfficialSource[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  return (
    <section
      id="sources"
      aria-labelledby="sources-heading"
      style={{
        scrollMarginTop: '96px',
        marginTop: '64px',
        marginBottom: '64px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Chip variant="solid" tone="violet" style={{ marginBottom: '10px' }}>
          Достоверность и первоисточники
        </Chip>
        <h2
          id="sources-heading"
          style={{
            fontFamily: 'var(--smg-font-display)',
            fontSize: 'clamp(28px, 3.2vw, 40px)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: 'var(--smg-ink)',
            margin: '0 0 10px 0',
          }}
        >
          Официальная документация и проверенные источники
        </h2>
        <p
          style={{
            fontSize: 'var(--smg-web-fs-body-md, 16px)',
            color: '#4A4A4A',
            maxWidth: '720px',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Все утверждения курса проверены по актуальной технической документации разработчиков моделей
          и независимых исследовательских лабораторий (ноябрь 2026).
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {sources.map((src) => (
          <Card
            key={src.id}
            tone="surface"
            radius={24}
            padding="24px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              border: '1px solid var(--smg-gray-200)',
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--smg-violet)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {src.organization}
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--smg-font-body)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--smg-ink)',
                  margin: '0 0 10px 0',
                  lineHeight: 1.35,
                }}
              >
                {src.title}
              </h4>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.5,
                  color: 'var(--smg-ink)',
                  margin: 0,
                }}
              >
                {src.summary}
              </p>
            </div>

            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--smg-violet)',
                textDecoration: 'none',
                marginTop: '8px',
              }}
              className="smg-source-link"
            >
              <span>Перейти к первоисточнику</span>
              <Icon name="ArrowNarrowRight" size={14} style={{ color: 'var(--smg-violet)', flexShrink: 0 }} />
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default SourcesSection;
