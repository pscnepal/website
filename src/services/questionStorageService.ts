import {
  ALL_QUIZ_QUESTIONS,
  isBilingualQuizQuestion,
  QUIZ_DECKS,
} from '../data/quizData';
import { WRITTEN_QUESTIONS } from '../data/writtenQuestionsData';
import { auth } from '../lib/firebase';
import type {
  CloudQuizQuestionOverride,
  CloudWrittenQuestionOverride,
  QuizDeck,
  QuizQuestion,
  WrittenQuestion,
} from '../types';
import {
  resetAllQuizOverridesInFirestore,
  resetAllWrittenOverridesInFirestore,
  upsertQuizQuestionInFirestore,
  upsertWrittenQuestionInFirestore,
} from './cloudSyncService';
import { SITE_CONFIG } from '../data/siteConfig';
import { toast } from './toastService';
import { formatUserFriendlyError } from '../utils/errorHelpers';

const QUIZ_STORAGE_KEY = 'psc_nepal_quiz_questions_custom_v1';
const WRITTEN_STORAGE_KEY = 'psc_nepal_written_questions_custom_v1';
const ADMIN_EMAIL = SITE_CONFIG.supportEmail;

const SEED_QUIZ_BY_ID = new Map<string, QuizQuestion>(
  ALL_QUIZ_QUESTIONS.map((q) => [q.id, q])
);

const SEED_WRITTEN_BY_ID = new Map<string, WrittenQuestion>(
  WRITTEN_QUESTIONS.map((q) => [q.id, q])
);

const pendingQuizMutations = new Set<string>();
const pendingWrittenMutations = new Set<string>();
let pendingQuizReset = false;
let pendingWrittenReset = false;

function isAuthenticatedAdmin(): boolean {
  const user = auth.currentUser;
  return Boolean(
    user &&
      user.emailVerified &&
      user.email?.trim().toLowerCase() === ADMIN_EMAIL
  );
}

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
  // MCQ (Quiz) Questions CRUD & Cloud Sync
  // ==========================================

  loadQuizQuestions(): QuizQuestion[] {
    const custom = safeRead<QuizQuestion[]>(QUIZ_STORAGE_KEY);
    if (custom !== null) {
      return hydrateQuizSeedBilingualFields(custom);
    }
    return ALL_QUIZ_QUESTIONS.map(sanitizeQuizQuestionLanguage);
  },

  hydrateQuizDecks(questions?: QuizQuestion[]): QuizDeck[] {
    const liveQuestions = questions ?? this.loadQuizQuestions();
    const byId = new Map(liveQuestions.map((q) => [q.id, q]));
    const customAdditions = liveQuestions.filter((q) => !SEED_QUIZ_BY_ID.has(q.id));

    const matchesDeckSubject = (deckId: string, q: QuizQuestion): boolean => {
      const s = q.subject.trim().toLowerCase();
      if (deckId === 'language-and-writing') {
        return s === 'nepali' || s === 'english' || s.includes('language');
      }
      if (deckId === 'nepal-parichaya') {
        return (
          s.includes('geography') ||
          s.includes('history') ||
          s.includes('culture') ||
          s.includes('parichaya')
        );
      }
      if (deckId === 'laws-and-constitution') {
        return (
          s.includes('constitution') ||
          s.includes('governance') ||
          s.includes('administration') ||
          s.includes('law')
        );
      }
      if (deckId === 'psc-and-planning') {
        return (
          s.includes('planning') ||
          s.includes('development') ||
          s.includes('mental ability') ||
          s.includes('aptitude') ||
          s.includes('iq')
        );
      }
      return deckId === 'comprehensive-mock';
    };

    return QUIZ_DECKS.map((deck) => {
      const seedMatched = deck.questions
        .map((q) => byId.get(q.id))
        .filter((q): q is QuizQuestion => Boolean(q));
      const existingIds = new Set(seedMatched.map((q) => q.id));
      const additions = customAdditions.filter(
        (q) => !existingIds.has(q.id) && matchesDeckSubject(deck.id, q)
      );
      const merged = [...additions, ...seedMatched];
      return {
        ...deck,
        subtitle: `${merged.length} Questions · ${merged.length}-Minute Reverse Countdown`,
        questions: merged,
      };
    });
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

  applyCloudQuizOverrides(overrides: CloudQuizQuestionOverride[]): void {
    if (pendingQuizReset) return;

    if (!overrides || overrides.length === 0) {
      if (pendingQuizMutations.size > 0) {
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage.getItem(QUIZ_STORAGE_KEY)) {
        window.localStorage.removeItem(QUIZ_STORAGE_KEY);
        window.dispatchEvent(
          new CustomEvent(QUESTION_EVENTS.QUIZ_CHANGED, {
            detail: ALL_QUIZ_QUESTIONS.map(sanitizeQuizQuestionLanguage),
          })
        );
      }
      return;
    }

    const localById = new Map(this.loadQuizQuestions().map((q) => [q.id, q]));

    const overrideMap = new Map<string, CloudQuizQuestionOverride>();
    for (const item of overrides) {
      overrideMap.set(item.question.id, item);
    }

    const customNew: QuizQuestion[] = [];
    for (const item of overrides) {
      if (!item.isDeleted && !SEED_QUIZ_BY_ID.has(item.question.id)) {
        customNew.push(sanitizeQuizQuestionLanguage(item.question));
      }
    }

    const mergedSeed: QuizQuestion[] = [];
    for (const seedQ of ALL_QUIZ_QUESTIONS) {
      const ov = overrideMap.get(seedQ.id);
      if (ov) {
        if (!ov.isDeleted) {
          mergedSeed.push(sanitizeQuizQuestionLanguage(ov.question));
        }
      } else {
        mergedSeed.push(sanitizeQuizQuestionLanguage(seedQ));
      }
    }

    const mergedBase = [...customNew, ...mergedSeed];
    const mergedById = new Map(mergedBase.map((q) => [q.id, q]));

    for (const pendingId of pendingQuizMutations) {
      const localVersion = localById.get(pendingId);
      if (localVersion) {
        mergedById.set(pendingId, sanitizeQuizQuestionLanguage(localVersion));
      } else {
        mergedById.delete(pendingId);
      }
    }

    const merged = Array.from(mergedById.values());
    this.saveQuizQuestions(merged);
  },

  createQuizQuestion(
    newQuestion: Omit<QuizQuestion, 'id'> & { id?: string }
  ): QuizQuestion {
    const current = this.loadQuizQuestions();
    const id =
      newQuestion.id?.trim() || `PSC-MCQ-${Date.now().toString().slice(-6)}`;
    const fullQuestion = sanitizeQuizQuestionLanguage({
      ...newQuestion,
      id,
    });

    // Place new question at top so user sees it right away
    const updated = [fullQuestion, ...current.filter((q) => q.id !== id)];
    this.saveQuizQuestions(updated);

    if (isAuthenticatedAdmin()) {
      pendingQuizMutations.add(id);
      void upsertQuizQuestionInFirestore(fullQuestion, false)
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Saved ${fullQuestion.id} locally, but cloud sync failed.`
            ),
            { id: `cloud-quiz-save-${fullQuestion.id}` }
          );
        })
        .finally(() => {
          pendingQuizMutations.delete(id);
        });
    }

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

    if (isAuthenticatedAdmin()) {
      pendingQuizMutations.add(sanitized.id);
      void upsertQuizQuestionInFirestore(sanitized, false)
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Updated ${sanitized.id} locally, but cloud sync failed.`
            ),
            { id: `cloud-quiz-save-${sanitized.id}` }
          );
        })
        .finally(() => {
          pendingQuizMutations.delete(sanitized.id);
        });
    }

    return sanitized;
  },

  deleteQuizQuestion(questionId: string): boolean {
    const current = this.loadQuizQuestions();
    const target = current.find((q) => q.id === questionId);
    const updated = current.filter((q) => q.id !== questionId);
    if (updated.length === current.length) return false;
    this.saveQuizQuestions(updated);

    if (isAuthenticatedAdmin() && target) {
      pendingQuizMutations.add(questionId);
      void upsertQuizQuestionInFirestore(target, true)
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Deleted ${questionId} locally, but cloud sync failed.`
            ),
            { id: `cloud-quiz-del-${questionId}` }
          );
        })
        .finally(() => {
          pendingQuizMutations.delete(questionId);
        });
    }

    return true;
  },

  resetQuizQuestionsToDefault(): void {
    pendingQuizMutations.clear();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(QUIZ_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.QUIZ_CHANGED, {
          detail: ALL_QUIZ_QUESTIONS,
        })
      );
    }

    if (isAuthenticatedAdmin()) {
      pendingQuizReset = true;
      void resetAllQuizOverridesInFirestore()
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              'Restored defaults locally, but failed to clear cloud overrides.'
            ),
            { id: 'cloud-quiz-reset' }
          );
        })
        .finally(() => {
          pendingQuizReset = false;
        });
    }
  },

  hasCustomQuizQuestions(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem(QUIZ_STORAGE_KEY));
  },

  // ==========================================
  // Written Questions CRUD & Cloud Sync
  // ==========================================

  loadWrittenQuestions(): WrittenQuestion[] {
    const custom = safeRead<WrittenQuestion[]>(WRITTEN_STORAGE_KEY);
    if (custom !== null) {
      return custom;
    }
    return [...WRITTEN_QUESTIONS];
  },

  getWrittenQuestionById(questionId: string): WrittenQuestion | undefined {
    return this.loadWrittenQuestions().find((q) => q.id === questionId);
  },

  saveWrittenQuestions(questions: WrittenQuestion[]): void {
    safeWrite(WRITTEN_STORAGE_KEY, questions);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.WRITTEN_CHANGED, { detail: questions })
      );
    }
  },

  applyCloudWrittenOverrides(overrides: CloudWrittenQuestionOverride[]): void {
    if (pendingWrittenReset) return;

    if (!overrides || overrides.length === 0) {
      if (pendingWrittenMutations.size > 0) {
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage.getItem(WRITTEN_STORAGE_KEY)) {
        window.localStorage.removeItem(WRITTEN_STORAGE_KEY);
        window.dispatchEvent(
          new CustomEvent(QUESTION_EVENTS.WRITTEN_CHANGED, {
            detail: [...WRITTEN_QUESTIONS],
          })
        );
      }
      return;
    }

    const localById = new Map(this.loadWrittenQuestions().map((q) => [q.id, q]));

    const overrideMap = new Map<string, CloudWrittenQuestionOverride>();
    for (const item of overrides) {
      overrideMap.set(item.question.id, item);
    }

    const customNew: WrittenQuestion[] = [];
    for (const item of overrides) {
      if (!item.isDeleted && !SEED_WRITTEN_BY_ID.has(item.question.id)) {
        customNew.push(item.question);
      }
    }

    const mergedSeed: WrittenQuestion[] = [];
    for (const seedQ of WRITTEN_QUESTIONS) {
      const ov = overrideMap.get(seedQ.id);
      if (ov) {
        if (!ov.isDeleted) {
          mergedSeed.push(ov.question);
        }
      } else {
        mergedSeed.push(seedQ);
      }
    }

    const mergedBase = [...customNew, ...mergedSeed];
    const mergedById = new Map(mergedBase.map((q) => [q.id, q]));

    for (const pendingId of pendingWrittenMutations) {
      const localVersion = localById.get(pendingId);
      if (localVersion) {
        mergedById.set(pendingId, localVersion);
      } else {
        mergedById.delete(pendingId);
      }
    }

    const merged = Array.from(mergedById.values());
    this.saveWrittenQuestions(merged);
  },

  createWrittenQuestion(
    newQuestion: Omit<WrittenQuestion, 'id'> & { id?: string }
  ): WrittenQuestion {
    const current = this.loadWrittenQuestions();
    const id =
      newQuestion.id?.trim() || `PSC-WR-${Date.now().toString().slice(-5)}`;
    const fullQuestion: WrittenQuestion = {
      ...newQuestion,
      id,
    };

    const updated = [fullQuestion, ...current.filter((q) => q.id !== id)];
    this.saveWrittenQuestions(updated);

    if (isAuthenticatedAdmin()) {
      pendingWrittenMutations.add(id);
      void upsertWrittenQuestionInFirestore(fullQuestion, false)
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Saved ${fullQuestion.id} locally, but cloud sync failed.`
            ),
            { id: `cloud-written-save-${fullQuestion.id}` }
          );
        })
        .finally(() => {
          pendingWrittenMutations.delete(id);
        });
    }

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

    if (isAuthenticatedAdmin()) {
      pendingWrittenMutations.add(question.id);
      void upsertWrittenQuestionInFirestore(question, false)
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Updated ${question.id} locally, but cloud sync failed.`
            ),
            { id: `cloud-written-save-${question.id}` }
          );
        })
        .finally(() => {
          pendingWrittenMutations.delete(question.id);
        });
    }

    return question;
  },

  deleteWrittenQuestion(questionId: string): boolean {
    const current = this.loadWrittenQuestions();
    const target = current.find((q) => q.id === questionId);
    const updated = current.filter((q) => q.id !== questionId);
    if (updated.length === current.length) return false;
    this.saveWrittenQuestions(updated);

    if (isAuthenticatedAdmin() && target) {
      pendingWrittenMutations.add(questionId);
      void upsertWrittenQuestionInFirestore(target, true)
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Deleted ${questionId} locally, but cloud sync failed.`
            ),
            { id: `cloud-written-del-${questionId}` }
          );
        })
        .finally(() => {
          pendingWrittenMutations.delete(questionId);
        });
    }

    return true;
  },

  resetWrittenQuestionsToDefault(): void {
    pendingWrittenMutations.clear();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(WRITTEN_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(QUESTION_EVENTS.WRITTEN_CHANGED, {
          detail: WRITTEN_QUESTIONS,
        })
      );
    }

    if (isAuthenticatedAdmin()) {
      pendingWrittenReset = true;
      void resetAllWrittenOverridesInFirestore()
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              'Restored defaults locally, but failed to clear cloud overrides.'
            ),
            { id: 'cloud-written-reset' }
          );
        })
        .finally(() => {
          pendingWrittenReset = false;
        });
    }
  },

  hasCustomWrittenQuestions(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem(WRITTEN_STORAGE_KEY));
  },
};
