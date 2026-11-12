import { useState } from 'react';
import { COURSE_MODULES, OFFICIAL_SOURCES } from './data/courseData';
import { useCourseProgress } from './hooks/useCourseProgress';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LessonCard } from './components/course/LessonCard';
import { QuizWidget } from './components/course/QuizWidget';
import { SourcesSection } from './components/course/SourcesSection';
import { Chip } from './components/common/Chip';
import { Button } from './components/common/Button';
import { Logo } from './components/common/Logo';

export function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const {
    progress,
    totalTopics,
    totalQuizzes,
    completedTopicsCount,
    correctQuizzesCount,
    progressPercent,
    toggleTopicCompletion,
    submitQuizAnswer,
    resetQuizCase,
    resetAllProgress,
  } = useCourseProgress();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* A11y Skip link */}
      <a href="#main-content" className="skip-to-content-link">
        Перейти к учебным материалам
      </a>

      {/* Sticky Header */}
      <Header
        progressPercent={progressPercent}
        completedTopicsCount={completedTopicsCount}
        totalTopics={totalTopics}
        correctQuizzesCount={correctQuizzesCount}
        totalQuizzes={totalQuizzes}
        onReset={resetAllProgress}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        isMobileNavOpen={isMobileNavOpen}
      />

      {/* Hero Section */}
      <section
        id="hero"
        style={{
          position: 'relative',
          background: '#0b0620 url("/assets/img/bg-violet-1.png") center/cover no-repeat',
          color: '#ffffff',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="smg-hero-wrap"
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '88px 24px 80px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Chip variant="solid" tone="violet">
              Осознанный AI
            </Chip>
            <Chip variant="outline" tone="white">Для сотрудников без технического бэкграунда</Chip>
            <Chip variant="outline" tone="white">Практика · 8 тем · 3 кейса</Chip>
          </div>

          <h1
            className="smg-hero-title"
            style={{
              fontFamily: 'var(--smg-font-display)',
              fontWeight: 500, // TT Norms Pro Medium per design.md
              fontSize: 'clamp(44px, 5vw, 72px)',
              lineHeight: '1.0',
              letterSpacing: '-0.03em',
              margin: 0,
              maxWidth: '920px',
            }}
          >
            Как работать с AI осознанно: от чата к бизнес-результату
          </h1>

          <p
            style={{
              fontFamily: 'var(--smg-font-body)',
              fontSize: '18px',
              lineHeight: 1.55,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              maxWidth: '760px',
            }}
          >
            Курс учит переходить от слепого общения в чате к надежному решению рабочих задач:
            грамотно готовить рабочий контекст, обоснованно выбирать модели, безопасно подключать
            инструменты через MCP и проверять результат независимым двухмодельным методом.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
            <a href="#module-1">
              <Button size="lg" tone="violet" variant="solid">
                Начать курс →
              </Button>
            </a>
            <a href="#sources">
              <Button size="lg" tone="white" variant="outline">
                Официальные источники
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout (Sidebar + Content) */}
      <div
        className="smg-layout-container"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flex: 1,
        }}
      >
        {/* Navigation Sidebar */}
        <Sidebar
          modules={COURSE_MODULES}
          completedTopics={progress.completedTopics}
          quizAnswers={progress.quizAnswers}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          style={{
            flex: 1,
            padding: '48px 40px 80px 40px',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {COURSE_MODULES.map((courseModule) => (
            <section
              key={courseModule.id}
              id={courseModule.id}
              aria-labelledby={`module-title-${courseModule.id}`}
              style={{
                scrollMarginTop: '88px',
                marginBottom: '64px',
                paddingBottom: '32px',
                borderBottom: '1px solid var(--smg-gray-200)',
              }}
            >
              {/* Module Header */}
              <div style={{ marginBottom: '32px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--smg-violet)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  {courseModule.eyebrow}
                </span>

                <h2
                  id={`module-title-${courseModule.id}`}
                  style={{
                    fontFamily: 'var(--smg-font-display)',
                    fontSize: 'clamp(28px, 3.2vw, 40px)',
                    fontWeight: 600,
                    lineHeight: 1.1,
                    letterSpacing: '-0.025em',
                    color: 'var(--smg-ink)',
                    margin: '0 0 14px 0',
                  }}
                >
                  {courseModule.title}
                </h2>

                <p
                  style={{
                    fontSize: 'var(--smg-web-fs-body-md, 16px)',
                    lineHeight: 1.55,
                    color: '#4A4A4A', // High contrast WCAG AA compliant (8.9:1)
                    margin: 0,
                    maxWidth: '840px',
                  }}
                >
                  {courseModule.description}
                </p>
              </div>

              {/* Topics in this module */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {courseModule.topics.map((topic) => (
                  <LessonCard
                    key={topic.id}
                    topic={topic}
                    isCompleted={progress.completedTopics.includes(topic.id)}
                    onToggleComplete={toggleTopicCompletion}
                  />
                ))}
              </div>

              {/* Module Interactive Quiz Case */}
              <QuizWidget
                quizCase={courseModule.quizCase}
                savedAnswer={progress.quizAnswers[courseModule.quizCase.id]}
                onSubmitAnswer={submitQuizAnswer}
                onRetry={resetQuizCase}
              />
            </section>
          ))}

          {/* Official Sources & Verification Section */}
          <SourcesSection sources={OFFICIAL_SOURCES} />
        </main>
      </div>

      {/* Footer */}
      <footer
        className="smg-footer"
        style={{
          background: 'var(--smg-black)',
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '64px 24px 32px 24px',
          borderTop: '1px solid var(--smg-border-inverse)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--smg-border-inverse)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Logo variant="light" height={28} />
              <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>
                Soft Media Group · AI Education System
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <a href="#hero" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Наверх ↑
              </a>
              <a href="#sources" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Документация
              </a>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <span>
              Учебный курс «Как работать с AI осознанно» разработан на базе дизайн-системы Soft Media Group.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
