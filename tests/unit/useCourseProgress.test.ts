import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCourseProgress } from '../../src/hooks/useCourseProgress';

describe('useCourseProgress hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default empty progress and calculates 0%', () => {
    const { result } = renderHook(() => useCourseProgress());

    expect(result.current.totalTopics).toBe(8);
    expect(result.current.totalQuizzes).toBe(3);
    expect(result.current.completedTopicsCount).toBe(0);
    expect(result.current.correctQuizzesCount).toBe(0);
    expect(result.current.progressPercent).toBe(0);
  });

  it('marks topic as read and increments completed topics count', () => {
    const { result } = renderHook(() => useCourseProgress());

    act(() => {
      result.current.markTopicAsRead('topic-1');
    });

    expect(result.current.completedTopicsCount).toBe(1);
    expect(result.current.progress.completedTopics).toContain('topic-1');
  });

  it('toggles topic completion on and off', () => {
    const { result } = renderHook(() => useCourseProgress());

    act(() => {
      result.current.toggleTopicCompletion('topic-1');
    });
    expect(result.current.completedTopicsCount).toBe(1);

    act(() => {
      result.current.toggleTopicCompletion('topic-1');
    });
    expect(result.current.completedTopicsCount).toBe(0);
  });

  it('handles quiz answer submission and calculates correct percentage', () => {
    const { result } = renderHook(() => useCourseProgress());

    act(() => {
      result.current.submitQuizAnswer('quiz-case-1', 'c1-opt-2', true);
    });

    expect(result.current.correctQuizzesCount).toBe(1);
    expect(result.current.progress.quizAnswers['quiz-case-1']?.isCorrect).toBe(true);

    // 1 quiz correct out of (8 + 3 = 11 items) -> 1/11 ~ 9%
    expect(result.current.progressPercent).toBe(9);
  });

  it('resets a single quiz case for retry', () => {
    const { result } = renderHook(() => useCourseProgress());

    act(() => {
      result.current.submitQuizAnswer('quiz-case-1', 'c1-opt-1', false);
    });
    expect(result.current.progress.quizAnswers['quiz-case-1']).toBeDefined();

    act(() => {
      result.current.resetQuizCase('quiz-case-1');
    });
    expect(result.current.progress.quizAnswers['quiz-case-1']).toBeUndefined();
  });

  it('resets all progress and clears localStorage', () => {
    const { result } = renderHook(() => useCourseProgress());

    act(() => {
      result.current.markTopicAsRead('topic-1');
      result.current.markTopicAsRead('topic-4');
      result.current.submitQuizAnswer('quiz-case-1', 'c1-opt-2', true);
    });

    expect(result.current.completedTopicsCount).toBe(2);
    expect(result.current.correctQuizzesCount).toBe(1);

    act(() => {
      result.current.resetAllProgress();
    });

    expect(result.current.completedTopicsCount).toBe(0);
    expect(result.current.correctQuizzesCount).toBe(0);
    expect(result.current.progressPercent).toBe(0);
    const stored = JSON.parse(localStorage.getItem('smg_ai_course_progress_v1') || '{}');
    expect(stored.completedTopics).toEqual([]);
    expect(stored.quizAnswers).toEqual({});
  });
});
