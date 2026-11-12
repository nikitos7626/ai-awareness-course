import type { CourseModule } from '../../types/course';
import { Chip } from '../common/Chip';
import { Icon } from '../common/Icon';

export interface SidebarProps {
  modules: CourseModule[];
  completedTopics: string[];
  quizAnswers: Record<string, { selectedOptionId: string; isCorrect: boolean }>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  modules,
  completedTopics,
  quizAnswers,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 30, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside
        className={`smg-sidebar ${isOpenMobile ? 'smg-sidebar-open' : ''}`}
        aria-label="Оглавление курса"
        style={{
          width: '300px',
          flexShrink: 0,
          position: 'sticky',
          top: '72px',
          height: 'calc(100vh - 88px)',
          overflowY: 'auto',
          padding: '24px 16px',
          boxSizing: 'border-box',
          borderRight: '1px solid var(--smg-gray-200)',
          background: 'var(--smg-white)',
          zIndex: 45,
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--smg-violet)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Навигация по курсу
          </span>
          <h2
            style={{
              fontFamily: 'var(--smg-font-display)',
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
              color: 'var(--smg-ink)',
            }}
          >
            Программа обучения
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {modules.map((m) => {
            const moduleTopicsDone = m.topics.filter((t) =>
              completedTopics.includes(t.id)
            ).length;
            const quizState = quizAnswers[m.quizCase.id];
            const isQuizDone = quizState?.isCorrect;
            const isModuleComplete =
              moduleTopicsDone === m.topics.length && isQuizDone;

            return (
              <div
                key={m.id}
                style={{
                  border: isModuleComplete
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : 'none',
                  borderRadius: '18px',
                  padding: '16px',
                  background: isModuleComplete
                    ? 'var(--smg-success-soft)'
                    : 'var(--smg-gray-100)',
                  transition: 'all 200ms ease',
                }}
              >
                {/* Module Header Link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <a
                    href={`#${m.id}`}
                    onClick={onCloseMobile}
                    style={{
                      fontFamily: 'var(--smg-font-body)',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: 'var(--smg-ink)',
                      textDecoration: 'none',
                    }}
                  >
                    Модуль {m.moduleNumber}
                  </a>
                  <Chip
                    variant="solid"
                    tone={isModuleComplete ? 'success' : 'violet'}
                    style={{ fontSize: '11px', padding: '2px 8px', fontFamily: 'var(--smg-font-word)' }}
                  >
                    {isModuleComplete ? 'Пройден ✓' : `${moduleTopicsDone}/${m.topics.length}`}
                  </Chip>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#4A4A4A',
                    lineHeight: 1.35,
                    marginBottom: '10px',
                  }}
                >
                  {m.title}
                </div>

                {/* Topics List */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 10px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {m.topics.map((t) => {
                    const isDone = completedTopics.includes(t.id);
                    return (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          onClick={onCloseMobile}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '7px 8px',
                            minHeight: '34px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: isDone ? 'var(--smg-ink)' : '#4A4A4A',
                            textDecoration: 'none',
                            background: 'transparent',
                            transition: 'background 120ms ease, color 120ms ease',
                          }}
                          className="smg-sidebar-topic-link"
                        >
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              paddingRight: '6px',
                            }}
                          >
                            {t.topicNumber}. {t.title.split(':')[0]}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: isDone ? 'var(--smg-success)' : 'var(--smg-gray-300)',
                              flexShrink: 0,
                            }}
                          >
                            {isDone ? '✓' : '○'}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>

                {/* Module Quiz Link */}
                <a
                  href={`#${m.quizCase.id}`}
                  onClick={onCloseMobile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--smg-radius-pill)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: isQuizDone
                      ? 'var(--smg-success)'
                      : 'var(--smg-violet)',
                    color: 'var(--smg-white)',
                    transition: 'opacity 150ms ease',
                  }}
                >
                  <span>Практический кейс {m.moduleNumber}</span>
                  <span>{isQuizDone ? 'Решен ✓' : 'Пройти →'}</span>
                </a>
              </div>
            );
          })}

          {/* Quick link to Sources */}
          <a
            href="#sources"
            onClick={onCloseMobile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--smg-gray-100)',
              color: 'var(--smg-ink)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              marginTop: '4px',
            }}
          >
            <Icon name="File05" size={16} style={{ color: 'var(--smg-ink)', flexShrink: 0 }} />
            <span>Официальные источники & доки</span>
          </a>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
