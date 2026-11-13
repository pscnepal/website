import {
  ALL_QUIZ_QUESTIONS,
  isBilingualQuizQuestion,
  type QuizQuestion,
} from '../data/quizData';
import { WRITTEN_QUESTIONS, type WrittenQuestion } from '../data/writtenQuestionsData';

const QUIZ_STORAGE_KEY = 'psc_nepal_quiz_questions_custom_v1';
const WRITTEN_STORAGE_KEY = 'psc_nepal_written_questions_custom_v1';

const SEED_QUIZ_BY_ID = new Map<string, QuizQuestion>(
  ALL_QUIZ_QUESTIONS.map((q) => [q.id, q])
);

function sanitizeQuizQuestionLanguage(question: QuizQuestion): QuizQuestion {
  const bilingual = isBilingualQuizQuestion(question);
  return {
    ...question,
    questionNe: bilingual ? question.questionNe : undefined,
    explanationNe: bilingual ? question.explanationNe : undefined,
    options: question.options.map((opt) => ({
      ...opt,
      textNe: bilingual ? opt.textNe : undefined,
    })),
  };
}

function hydrateQuizSeedBilingualFields(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((item) => {
    const seed = SEED_QUIZ_BY_ID.get(item.id);
    if (!seed) {
      return sanitizeQuizQuestionLanguage(item);
    }

    const bilingual = isBilingualQuizQuestion(item);
    if (!bilingual) {
      return sanitizeQuizQuestionLanguage(item);
    }

    const seedOptionMap = new Map(seed.options.map((o) => [o.key, o]));
    return {
      ...item,
      questionNe: item.questionNe?.trim() ? item.questionNe : seed.questionNe,
      explanationNe: item.explanationNe?.trim()
        ? item.explanationNe
        : seed.explanationNe,
      options: item.options.map((opt) => {
        const seedOpt = seedOptionMap.get(opt.key);
        return {
          ...opt,
          textNe: opt.textNe?.trim() ? opt.textNe : seedOpt?.textNe,
        };
      }),
    };
  });
}

export const QUESTION_EVENTS = {
  QUIZ_CHANGED: 'psc_quiz_questions_changed',
  WRITTEN_CHANGED: 'psc_written_questions_changed',
} as const;

function safeRead<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as unknown as T) : null;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful fallback for storage quota
  }
}

export const questionStorageService = {
  // ==========================================
  // MCQ (Quiz) Questions CRUD
  // ==========================================

  loadQuizQuestions(): QuizQuestion[] {
    const custom = safeRead<QuizQuestion[]>(QUIZ_STORAGE_KEY);
    if (custom && custom.length > 0) {
      return hydrateQuizSeedBilingualFields(custom);
    }
    return ALL_QUIZ_QUESTIONS.map(sanitizeQuizQuestionLanguage);
  },

  saveQuizQuestions(questions: QuizQuestion[]): void {
    const cleaned = questions.map(sanitizeQuizQuestionLanguage);
    safeWrite(QUIZ_STORAGE_KEY, cleaned);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.QUIZ_CHANGED, { detail: cleaned })
      );
    }
  },

  createQuizQuestion(newQuestion: Omit<QuizQuestion, 'id'> & { id?: string }): QuizQuestion {
    const current = this.loadQuizQuestions();
    const id = newQuestion.id?.trim() || `PSC-MCQ-${Date.now().toString().slice(-6)}`;
    const fullQuestion = sanitizeQuizQuestionLanguage({
      ...newQuestion,
      id,
    });

    // Place new question at top so user sees it right away
    const updated = [fullQuestion, ...current.filter((q) => q.id !== id)];
    this.saveQuizQuestions(updated);
    return fullQuestion;
  },

  updateQuizQuestion(question: QuizQuestion): QuizQuestion {
    const current = this.loadQuizQuestions();
    const sanitized = sanitizeQuizQuestionLanguage(question);
    const index = current.findIndex((q) => q.id === sanitized.id);
    let updated: QuizQuestion[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = sanitized;
    } else {
      updated = [sanitized, ...current];
    }

    this.saveQuizQuestions(updated);
    return sanitized;
  },

  deleteQuizQuestion(questionId: string): boolean {
    const current = this.loadQuizQuestions();
    const updated = current.filter((q) => q.id !== questionId);
    if (updated.length === current.length) return false;
    this.saveQuizQuestions(updated);
    return true;
  },

  resetQuizQuestionsToDefault(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(QUIZ_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.QUIZ_CHANGED, { detail: ALL_QUIZ_QUESTIONS })
      );
    }
  },

  hasCustomQuizQuestions(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem(QUIZ_STORAGE_KEY));
  },

  // ==========================================
  // Written Questions CRUD
  // ==========================================

  loadWrittenQuestions(): WrittenQuestion[] {
    const custom = safeRead<WrittenQuestion[]>(WRITTEN_STORAGE_KEY);
    if (custom && custom.length > 0) {
      return custom;
    }
    return [...WRITTEN_QUESTIONS];
  },

  saveWrittenQuestions(questions: WrittenQuestion[]): void {
    safeWrite(WRITTEN_STORAGE_KEY, questions);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.WRITTEN_CHANGED, { detail: questions })
      );
    }
  },

  createWrittenQuestion(newQuestion: Omit<WrittenQuestion, 'id'> & { id?: string }): WrittenQuestion {
    const current = this.loadWrittenQuestions();
    const id = newQuestion.id?.trim() || `PSC-WR-${Date.now().toString().slice(-5)}`;
    const fullQuestion: WrittenQuestion = {
      ...newQuestion,
      id,
    };

    const updated = [fullQuestion, ...current.filter((q) => q.id !== id)];
    this.saveWrittenQuestions(updated);
    return fullQuestion;
  },

  updateWrittenQuestion(question: WrittenQuestion): WrittenQuestion {
    const current = this.loadWrittenQuestions();
    const index = current.findIndex((q) => q.id === question.id);
    let updated: WrittenQuestion[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...question };
    } else {
      updated = [question, ...current];
    }

    this.saveWrittenQuestions(updated);
    return question;
  },

  deleteWrittenQuestion(questionId: string): boolean {
    const current = this.loadWrittenQuestions();
    const updated = current.filter((q) => q.id !== questionId);
    if (updated.length === current.length) return false;
    this.saveWrittenQuestions(updated);
    return true;
  },

  resetWrittenQuestionsToDefault(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(WRITTEN_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.WRITTEN_CHANGED, { detail: WRITTEN_QUESTIONS })
      );
    }
  },

  hasCustomWrittenQuestions(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem(WRITTEN_STORAGE_KEY));
  },
};
