import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizWidget } from '../../src/components/course/QuizWidget';
import { COURSE_MODULES } from '../../src/data/courseData';

describe('QuizWidget component', () => {
  const sampleQuiz = COURSE_MODULES[0].quizCase;

  it('renders quiz title, scenario, and question', () => {
    render(
      <QuizWidget
        quizCase={sampleQuiz}
        onSubmitAnswer={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(sampleQuiz.title)).toBeInTheDocument();
    expect(screen.getByText(sampleQuiz.scenario)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(sampleQuiz.question))).toBeInTheDocument();
  });

  it('calls onSubmitAnswer when an option is clicked', () => {
    const handleSubmit = vi.fn();
    render(
      <QuizWidget
        quizCase={sampleQuiz}
        onSubmitAnswer={handleSubmit}
        onRetry={vi.fn()}
      />
    );

    const firstOption = screen.getByText(sampleQuiz.options[0].text);
    fireEvent.click(firstOption);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      sampleQuiz.id,
      sampleQuiz.options[0].id,
      sampleQuiz.options[0].isCorrect
    );
  });

  it('displays explanation and retry button when wrong answer is submitted', () => {
    const handleRetry = vi.fn();
    render(
      <QuizWidget
        quizCase={sampleQuiz}
        savedAnswer={{
          selectedOptionId: sampleQuiz.options[0].id, // Incorrect option
          isCorrect: false,
        }}
        onSubmitAnswer={vi.fn()}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText('Есть ошибка ✕')).toBeInTheDocument();
    expect(screen.getByText(sampleQuiz.options[0].explanation)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /попробовать/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledWith(sampleQuiz.id);
  });

  it('displays success badge and explanation when correct answer is submitted', () => {
    const correctOpt = sampleQuiz.options.find((o) => o.isCorrect)!;
    render(
      <QuizWidget
        quizCase={sampleQuiz}
        savedAnswer={{
          selectedOptionId: correctOpt.id,
          isCorrect: true,
        }}
        onSubmitAnswer={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('Решено верно ✓')).toBeInTheDocument();
    expect(screen.getByText(correctOpt.explanation)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /попробовать/i })).not.toBeInTheDocument();
  });
});
