import { useState, useEffect, useCallback } from 'react';
import type { CourseProgress } from '../types/course';
import { COURSE_MODULES } from '../data/courseData';

const STORAGE_KEY = 'smg_ai_course_progress_v1';

const DEFAULT_PROGRESS: CourseProgress = {
  completedTopics: [],
  quizAnswers: {},
  lastUpdated: new Date().toISOString(),
};

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedTopics) && typeof parsed.quizAnswers === 'object') {
          return parsed;
        }
      }
    } catch {
      // Fallback for private browsing or disabled localStorage
    }
    return DEFAULT_PROGRESS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore write errors (e.g. quota exceeded in rare cases)
    }
  }, [progress]);

  // Total counts
  const totalTopics = COURSE_MODULES.reduce((acc, m) => acc + m.topics.length, 0); // 8 topics
  const totalQuizzes = COURSE_MODULES.length; // 3 quizzes

  const completedTopicsCount = progress.completedTopics.length;
  const correctQuizzesCount = Object.values(progress.quizAnswers).filter((a) => a.isCorrect).length;

  // Weighted total progress percentage (0 - 100)
  const progressPercent = Math.round(
    ((completedTopicsCount + correctQuizzesCount) / (totalTopics + totalQuizzes)) * 100
  );

  const toggleTopicCompletion = useCallback((topicId: string) => {
    setProgress((prev) => {
      const isCompleted = prev.completedTopics.includes(topicId);
      const newTopics = isCompleted
        ? prev.completedTopics.filter((id) => id !== topicId)
        : [...prev.completedTopics, topicId];

      return {
        ...prev,
        completedTopics: newTopics,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const markTopicAsRead = useCallback((topicId: string) => {
    setProgress((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev;
      return {
        ...prev,
        completedTopics: [...prev.completedTopics, topicId],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const submitQuizAnswer = useCallback((caseId: string, optionId: string, isCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [caseId]: {
          selectedOptionId: optionId,
          isCorrect,
        },
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const resetQuizCase = useCallback((caseId: string) => {
    setProgress((prev) => {
      const nextAnswers = { ...prev.quizAnswers };
      delete nextAnswers[caseId];
      return {
        ...prev,
        quizAnswers: nextAnswers,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress({
      completedTopics: [],
      quizAnswers: {},
      lastUpdated: new Date().toISOString(),
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    progress,
    totalTopics,
    totalQuizzes,
    completedTopicsCount,
    correctQuizzesCount,
    progressPercent,
    toggleTopicCompletion,
    markTopicAsRead,
    submitQuizAnswer,
    resetQuizCase,
    resetAllProgress,
  };
}
