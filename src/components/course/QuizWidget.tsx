import type { QuizCase } from '../../types/course';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

export interface QuizWidgetProps {
  quizCase: QuizCase;
  savedAnswer?: {
    selectedOptionId: string;
    isCorrect: boolean;
  };
  onSubmitAnswer: (caseId: string, optionId: string, isCorrect: boolean) => void;
  onRetry: (caseId: string) => void;
}

export function QuizWidget({
  quizCase,
  savedAnswer,
  onSubmitAnswer,
  onRetry,
}: QuizWidgetProps) {
  const selectedOptionId = savedAnswer?.selectedOptionId;
  const isAnswered = Boolean(selectedOptionId);
  const selectedOption = quizCase.options.find((o) => o.id === selectedOptionId);
  const isCorrect = savedAnswer?.isCorrect ?? false;

  const handleSelect = (optionId: string) => {
    if (isAnswered) return; // Locked until retry
    const opt = quizCase.options.find((o) => o.id === optionId);
    if (!opt) return;
    onSubmitAnswer(quizCase.id, optionId, opt.isCorrect);
  };

  return (
    <section
      id={quizCase.id}
      aria-labelledby={`quiz-title-${quizCase.id}`}
      style={{
        scrollMarginTop: '96px',
        marginBottom: '48px',
      }}
    >
      <Card
        tone="surface"
        radius={24}
        padding="36px"
        className="smg-quiz-card"
        style={{
          border: isCorrect
            ? '2px solid var(--smg-success)'
            : isAnswered
            ? '2px solid var(--smg-danger)'
            : '2px solid var(--smg-violet)',
          background: isCorrect
            ? 'var(--smg-success-soft)'
            : isAnswered
            ? 'var(--smg-danger-soft)'
            : 'var(--smg-white)',
          transition: 'all 200ms ease',
        }}
      >
        {/* Header / Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip variant="solid" tone="violet">
              Интерактивный кейс
            </Chip>
            <Chip variant="tint" tone="dark">
              {quizCase.badge}
            </Chip>
          </div>

          {isAnswered && (
            <Chip
              variant="solid"
              tone={isCorrect ? 'success' : 'danger'}
              style={{ fontWeight: 700 }}
            >
              {isCorrect ? 'Решено верно ✓' : 'Есть ошибка ✕'}
            </Chip>
          )}
        </div>

        {/* Title & Scenario */}
        <h3
          id={`quiz-title-${quizCase.id}`}
          style={{
            fontFamily: 'var(--smg-font-display)',
            fontSize: 'clamp(22px, 2.2vw, 28px)',
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--smg-ink)',
            margin: '0 0 16px 0',
          }}
        >
          {quizCase.title}
        </h3>

        {/* Scenario description (Soft Surface, No Heavy Nested Borders) */}
        <div
          style={{
            background: 'var(--smg-gray-100)',
            borderRadius: '18px',
            padding: '20px 24px',
            fontSize: 'var(--smg-web-fs-body-md, 16px)',
            lineHeight: 1.55,
            color: 'var(--smg-ink)',
            marginBottom: '24px',
          }}
        >
          <strong style={{ color: 'var(--smg-violet)' }}>Ситуация: </strong>
          {quizCase.scenario}
        </div>

        {/* Question */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--smg-violet-50)',
              color: 'var(--smg-violet)',
              fontWeight: 700,
              fontSize: '14px',
              flexShrink: 0,
              marginTop: '1px',
            }}
          >
            ?
          </span>
          <p
            style={{
              fontWeight: 700,
              fontSize: '17px',
              color: 'var(--smg-ink)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {quizCase.question}
          </p>
        </div>

        {/* Options (Accessible Radio/Buttons) */}
        <div
          role="radiogroup"
          aria-label={quizCase.question}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {quizCase.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const letter = String.fromCharCode(65 + idx); // A, B, C

            let optBorder = '1px solid var(--smg-gray-300)';
            let optBg = 'var(--smg-white)';
            let optColor = 'var(--smg-ink)';

            if (isSelected) {
              if (opt.isCorrect) {
                optBorder = '2px solid var(--smg-success)';
                optBg = '#D1FAE5';
                optColor = '#065F46';
              } else {
                optBorder = '2px solid var(--smg-danger)';
                optBg = '#FEE2E2';
                optColor = '#991B1B';
              }
            } else if (isAnswered && opt.isCorrect) {
              // Highlight the correct answer if user got it wrong
              optBorder = '2px dashed var(--smg-success)';
              optBg = 'var(--smg-success-soft)';
            }

            return (
              <button
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                disabled={isAnswered}
                onClick={() => handleSelect(opt.id)}
                className="smg-quiz-option-button"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: optBg,
                  color: optColor,
                  border: optBorder,
                  cursor: isAnswered ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--smg-font-body)',
                  fontSize: 'var(--smg-web-fs-body-md, 16px)',
                  lineHeight: 1.45,
                  transition: 'all 150ms ease-out',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isSelected
                      ? opt.isCorrect
                        ? 'var(--smg-success)'
                        : 'var(--smg-danger)'
                      : 'var(--smg-gray-200)',
                    color: isSelected ? 'var(--smg-white)' : 'var(--smg-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {isSelected ? (opt.isCorrect ? '✓' : '✕') : letter}
                </span>
                <span style={{ flex: 1 }}>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Live Feedback / Explainer Block */}
        {isAnswered && selectedOption && (
          <div
            aria-live="polite"
            style={{
              borderRadius: '16px',
              padding: '20px',
              background: isCorrect ? '#ECFDF5' : '#FFF1F2',
              border: `1px solid ${isCorrect ? 'var(--smg-success)' : 'var(--smg-danger)'}`,
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '15px',
                color: isCorrect ? '#065F46' : '#991B1B',
                marginBottom: '8px',
              }}
            >
              <Icon
                name={isCorrect ? 'ThumbsUp' : 'Award03'}
                size={18}
                style={{ color: isCorrect ? '#065F46' : '#991B1B', flexShrink: 0 }}
              />
              <span>{isCorrect ? 'Отличное решение!' : 'Разбор ответа:'}</span>
            </div>

            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.5,
                color: isCorrect ? '#065F46' : '#7F1D1D',
                margin: '0 0 12px 0',
              }}
            >
              {selectedOption.explanation}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: isCorrect ? '#047857' : '#991B1B',
                borderTop: `1px dashed ${isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 100, 100, 0.4)'}`,
                paddingTop: '8px',
              }}
            >
              <Icon
                name="CheckVerified02"
                size={16}
                style={{
                  color: isCorrect ? '#047857' : '#991B1B',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              />
              <span>
                <strong>Практический вывод:</strong> {quizCase.practicalTakeaway}
              </span>
            </div>

            {/* Retry button if wrong */}
            {!isCorrect && (
              <div style={{ marginTop: '16px' }}>
                <Button
                  size="sm"
                  tone="danger"
                  variant="solid"
                  onClick={() => onRetry(quizCase.id)}
                  aria-label="Попробовать ответить заново"
                >
                  ↺ Попробовать снова
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

export default QuizWidget;
