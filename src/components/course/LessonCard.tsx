import type { LessonTopic } from '../../types/course';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

export interface LessonCardProps {
  topic: LessonTopic;
  isCompleted: boolean;
  onToggleComplete: (topicId: string) => void;
}

export function LessonCard({ topic, isCompleted, onToggleComplete }: LessonCardProps) {
  return (
    <article
      id={topic.id}
      aria-labelledby={`heading-${topic.id}`}
      style={{
        scrollMarginTop: '96px',
        marginBottom: '32px',
      }}
    >
      <Card
        tone="surface"
        radius={24}
        padding="36px"
        style={{
          border: isCompleted
            ? '1px solid rgba(16, 185, 129, 0.4)'
            : '1px solid var(--smg-gray-200)',
          position: 'relative',
        }}
      >
        {/* Card Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip variant="solid" tone="violet">
              Тема {topic.topicNumber}
            </Chip>
            <Chip
              variant="tint"
              tone="dark"
              icon={<Icon name="Clock" size={13} style={{ display: 'inline-flex' }} />}
            >
              {topic.readingTimeMin} мин чтения
            </Chip>
            {isCompleted && (
              <Chip variant="solid" tone="success">
                Изучено ✓
              </Chip>
            )}
          </div>

          <Button
            size="sm"
            variant={isCompleted ? 'solid' : 'outline'}
            tone={isCompleted ? 'success' : 'violet'}
            onClick={() => onToggleComplete(topic.id)}
            aria-pressed={isCompleted}
            aria-label={`${isCompleted ? 'Снять отметку' : 'Отметить как изученное'}: Тема ${topic.topicNumber}`}
          >
            {isCompleted ? 'Изучено ✓' : 'Отметить как изученное'}
          </Button>
        </div>

        {/* Title & Tagline with SMG Editorial Scale */}
        <h3
          id={`heading-${topic.id}`}
          style={{
            fontFamily: 'var(--smg-font-display)',
            fontSize: 'clamp(24px, 2.4vw, 32px)',
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--smg-ink)',
            margin: '0 0 8px 0',
          }}
        >
          {topic.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--smg-font-body)',
            fontSize: 'var(--smg-web-fs-body-md, 16px)',
            color: '#4A4A4A',
            margin: '0 0 28px 0',
            lineHeight: 1.5,
          }}
        >
          {topic.tagline}
        </p>

        {/* Key Concepts Grid (Surface-first, clean airy cards without nested borders) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {topic.concepts.map((concept, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--smg-gray-100)',
                borderRadius: '20px',
                padding: '24px',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--smg-font-body)',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: 'var(--smg-violet)',
                  letterSpacing: '-0.01em',
                }}
              >
                {concept.term}
              </span>
              <p
                className="smg-lesson-concept-desc"
                style={{
                  fontSize: '15px',
                  lineHeight: 1.45,
                  color: 'var(--smg-ink)',
                  margin: 0,
                }}
              >
                {concept.definition}
              </p>
              <div
                className="smg-lesson-concept-analogy"
                style={{
                  fontSize: 'var(--smg-web-fs-label-sm, 14px)',
                  lineHeight: 1.45,
                  background: 'var(--smg-white)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  padding: '12px 14px',
                  marginTop: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Icon
                    name="Award03"
                    size={16}
                    style={{ color: 'var(--smg-violet)', flexShrink: 0, marginTop: '2px' }}
                  />
                  <div style={{ color: 'var(--smg-ink)' }}>
                    <strong style={{ color: 'var(--smg-violet)', fontWeight: 700 }}>
                      Аналогия:{' '}
                    </strong>
                    <span>{concept.workAnalogy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Best Practice (Airy Soft Violet Surface) */}
        <div
          className="smg-lesson-good-practice"
          style={{
            background: 'var(--smg-violet-50)',
            border: 'none',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--smg-violet)',
              marginBottom: '10px',
            }}
          >
            <Icon
              name="CheckVerified02"
              size={18}
              style={{ color: 'var(--smg-violet)', flexShrink: 0 }}
            />
            <span>Как делать правильно:</span>
            <span>{topic.bestPractice.title}</span>
          </div>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.5,
              color: 'var(--smg-ink)',
              margin: '0 0 14px 0',
            }}
          >
            {topic.bestPractice.description}
          </p>
          <div
            style={{
              background: 'var(--smg-white)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(98, 40, 255, 0.05)',
              borderRadius: '14px',
              padding: '16px 18px',
              fontSize: '14px',
              lineHeight: 1.5,
              fontFamily: 'var(--smg-font-body)',
              color: 'var(--smg-ink)',
            }}
          >
            <strong style={{ color: 'var(--smg-violet)' }}>Рабочий пример: </strong>
            {topic.bestPractice.example}
          </div>
        </div>

        {/* Pitfall to Avoid (Soft Danger Surface, Clean White Card Inside) */}
        <div
          style={{
            background: 'var(--smg-danger-soft)',
            border: 'none',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '15px',
              color: '#B91C1C',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#B91C1C',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              !
            </span>
            <span>Чего избегать:</span>
            <span>{topic.pitfallToAvoid.title}</span>
          </div>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.5,
              color: 'var(--smg-ink)',
              margin: '0 0 14px 0',
            }}
          >
            {topic.pitfallToAvoid.description}
          </p>
          <div
            style={{
              background: 'var(--smg-white)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.05)',
              borderRadius: '14px',
              padding: '16px 18px',
              fontSize: '14px',
              lineHeight: 1.5,
              color: '#7F1D1D',
            }}
          >
            <strong>Типичная ошибка: </strong>
            {topic.pitfallToAvoid.badExample}
          </div>
        </div>

        {/* Key Takeaway Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 22px',
            background: 'var(--smg-gray-100)',
            borderRadius: '16px',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--smg-ink)',
          }}
        >
          <Icon
            name="Award03"
            size={20}
            style={{ color: 'var(--smg-violet)', flexShrink: 0 }}
          />
          <span>
            <strong>Главный вывод:</strong> {topic.keyTakeaway}
          </span>
        </div>
      </Card>
    </article>
  );
}

export default LessonCard;
