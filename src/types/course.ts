export interface OfficialSource {
  id: string;
  title: string;
  url: string;
  organization: string;
  verifiedDate: string;
  summary: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizCase {
  id: string;
  moduleId: string;
  title: string;
  badge: string;
  scenario: string;
  question: string;
  options: QuizOption[];
  practicalTakeaway: string;
}

export interface TopicConcept {
  term: string;
  definition: string;
  workAnalogy: string;
}

export interface LessonTopic {
  id: string;
  topicNumber: number;
  title: string;
  tagline: string;
  readingTimeMin: number;
  concepts: TopicConcept[];
  bestPractice: {
    title: string;
    description: string;
    example: string;
  };
  pitfallToAvoid: {
    title: string;
    description: string;
    badExample: string;
  };
  keyTakeaway: string;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  eyebrow: string;
  description: string;
  topics: LessonTopic[];
  quizCase: QuizCase;
}

export interface CourseProgress {
  completedTopics: string[]; // Topic IDs that the user has marked as read
  quizAnswers: Record<string, { selectedOptionId: string; isCorrect: boolean }>;
  lastUpdated: string;
}
