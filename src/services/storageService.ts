import type { PscPrepState } from '../features/psc/pscSlice';
import type { QuizState } from '../features/quiz/quizSlice';
import type { WrittenState } from '../features/written/writtenSlice';
import type {
  BookReadingStats,
  ReadingProgressEntry,
  RecentBookEntry,
} from '../types/pdf';
import type { SettingsState } from '../types/reader';
import { auth } from '../lib/firebase';
import {
  clearAllFlaggedQuestionsInFirestore,
  deleteFlaggedQuestionInFirestore,
  upsertFlaggedQuestionInFirestore,
} from './cloudSyncService';

const KEYS = {
  SETTINGS: 'psc_nepal_settings_v2',
  RECENT_BOOKS: 'psc_nepal_recent_books_v1',
  READING_PROGRESS: 'psc_nepal_reading_progress_v1',
  READING_STATS: 'psc_nepal_reading_stats_v1',
  QUIZ_STATE: 'psc_nepal_quiz_state_v2',
  WRITTEN_STATE: 'psc_nepal_written_state_v1',
  PSC_PREP_STATE: 'psc_nepal_prep_v1',
  CONTACT_INQUIRIES: 'psc_nepal_contact_inquiries_v1',
  REACTIONS: 'psc_nepal_reactions_v1',
  FLAGGED_QUESTIONS: 'psc_nepal_flagged_questions_v1',
} as const;

const LEGACY_KEY_FALLBACKS: Record<string, string> = {
  [KEYS.SETTINGS]: 'page' + 'flow_settings_v2',
  [KEYS.RECENT_BOOKS]: 'page' + 'flow_recent_books_v1',
  [KEYS.READING_PROGRESS]: 'page' + 'flow_reading_progress_v1',
  [KEYS.READING_STATS]: 'page' + 'flow_reading_stats_v1',
  [KEYS.QUIZ_STATE]: 'page' + 'flow_quiz_state_v2',
  [KEYS.WRITTEN_STATE]: 'page' + 'flow_written_state_v1',
  [KEYS.PSC_PREP_STATE]: 'page' + 'flow_psc_prep_v1',
  [KEYS.CONTACT_INQUIRIES]: 'page' + 'flow_contact_inquiries_v1',
  [KEYS.REACTIONS]: 'psc_nepal_reactions_v1',
};

export type InquiryCategory =
  | 'general'
  | 'quiz-errata'
  | 'material-request'
  | 'reader-support';

export interface ContactInquiryRecord {
  id: string;
  ticketCode: string;
  name: string;
  email: string;
  category: InquiryCategory;
  reference: string;
  message: string;
  createdAt: string;
}

export interface FlaggedQuestionRecord {
  questionId: string;
  flaggedAt: string;
  source?: 'quiz' | 'simulation' | 'dashboard';
  deckTitle?: string;
  cadreId?: string;
  note?: string;
}

function getVerifiedUid(): string | null {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.emailVerified) {
    return null;
  }
  return currentUser.uid;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'light',
  defaultReadingMode: 'flipbook',
  defaultSoundEnabled: true,
};

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
    const legacyKey = LEGACY_KEY_FALLBACKS[key];
    if (legacyKey) {
      const legacyRaw = window.localStorage.getItem(legacyKey);
      if (legacyRaw) {
        const parsed = JSON.parse(legacyRaw) as T;
        window.localStorage.setItem(key, legacyRaw);
        window.localStorage.removeItem(legacyKey);
        return parsed;
      }
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode errors gracefully
  }
}

export const STORAGE_KEYS = KEYS;

export const storageService = {
  loadSettings(): SettingsState {
    const saved = safeReadJson<Partial<SettingsState>>(KEYS.SETTINGS, {});
    return {
      theme:
        saved.theme === 'light' || saved.theme === 'dark'
          ? saved.theme
          : DEFAULT_SETTINGS.theme,
      defaultReadingMode:
        saved.defaultReadingMode === 'standard' || saved.defaultReadingMode === 'flipbook'
          ? saved.defaultReadingMode
          : DEFAULT_SETTINGS.defaultReadingMode,
      defaultSoundEnabled:
        typeof saved.defaultSoundEnabled === 'boolean'
          ? saved.defaultSoundEnabled
          : DEFAULT_SETTINGS.defaultSoundEnabled,
    };
  },

  saveSettings(settings: SettingsState): void {
    safeWriteJson(KEYS.SETTINGS, settings);
  },

  loadRecentBooks(): RecentBookEntry[] {
    const items = safeReadJson<RecentBookEntry[]>(KEYS.RECENT_BOOKS, []);
    if (!Array.isArray(items)) return [];
    return items.slice(0, 12);
  },

  saveRecentBooks(books: RecentBookEntry[]): void {
    // Strip ephemeral blob: URLs before writing to LocalStorage
    const sanitized = books.slice(0, 12).map((book) => ({
      ...book,
      url: book.sourceType === 'local' ? '' : book.url,
    }));
    safeWriteJson(KEYS.RECENT_BOOKS, sanitized);
  },

  loadReadingProgress(): Record<string, ReadingProgressEntry> {
    const map = safeReadJson<Record<string, ReadingProgressEntry>>(
      KEYS.READING_PROGRESS,
      {}
    );
    return map && typeof map === 'object' ? map : {};
  },

  saveReadingProgress(progress: Record<string, ReadingProgressEntry>): void {
    safeWriteJson(KEYS.READING_PROGRESS, progress);
  },

  loadReadingStats(): Record<string, BookReadingStats> {
    const map = safeReadJson<Record<string, BookReadingStats>>(
      KEYS.READING_STATS,
      {}
    );
    return map && typeof map === 'object' ? map : {};
  },

  saveReadingStats(stats: Record<string, BookReadingStats>): void {
    safeWriteJson(KEYS.READING_STATS, stats);
  },

  loadQuizState(): QuizState {
    const saved = safeReadJson<Partial<QuizState>>(KEYS.QUIZ_STATE, {});
    const rawAttempts = Array.isArray(saved.attempts) ? saved.attempts : [];

    const normalizedAttempts = rawAttempts.slice(0, 30).map((att) => ({
      ...att,
      deadlineSeconds:
        typeof att.deadlineSeconds === 'number' && att.deadlineSeconds > 0
          ? att.deadlineSeconds
          : att.totalQuestions * 60,
      timedOut: Boolean(att.timedOut),
    }));

    return {
      preferredMode: saved.preferredMode === 'study' ? 'study' : 'exam',
      attempts: normalizedAttempts,
    };
  },

  saveQuizState(quizState: QuizState): void {
    safeWriteJson(KEYS.QUIZ_STATE, quizState);
  },

  loadWrittenState(): WrittenState {
    const saved = safeReadJson<Partial<WrittenState>>(KEYS.WRITTEN_STATE, {});
    const preferredLanguage =
      saved.preferredLanguage === 'en' ||
      saved.preferredLanguage === 'ne' ||
      saved.preferredLanguage === 'bilingual'
        ? saved.preferredLanguage
        : 'bilingual';

    const rawRecords =
      saved.records && typeof saved.records === 'object' ? saved.records : {};

    return {
      preferredLanguage,
      records: rawRecords,
    };
  },

  saveWrittenState(writtenState: WrittenState): void {
    safeWriteJson(KEYS.WRITTEN_STATE, writtenState);
  },

  loadPscPrepState(): PscPrepState {
    const saved = safeReadJson<Partial<PscPrepState>>(KEYS.PSC_PREP_STATE, {});
    const targetCadreId =
      saved.targetCadreId === 'section-officer' ||
      saved.targetCadreId === 'nayab-subba' ||
      saved.targetCadreId === 'kharidar'
        ? saved.targetCadreId
        : 'section-officer';

    const completedUnitIds = Array.isArray(saved.completedUnitIds)
      ? saved.completedUnitIds.filter((x): x is string => typeof x === 'string')
      : [];

    const completedTopicIds = Array.isArray(saved.completedTopicIds)
      ? saved.completedTopicIds.filter((x): x is string => typeof x === 'string')
      : [];

    const bookmarkedUnitIds = Array.isArray(saved.bookmarkedUnitIds)
      ? saved.bookmarkedUnitIds.filter((x): x is string => typeof x === 'string')
      : [];

    const simulationHistory = Array.isArray(saved.simulationHistory)
      ? saved.simulationHistory.slice(0, 30)
      : [];

    return {
      targetCadreId,
      completedUnitIds,
      completedTopicIds,
      bookmarkedUnitIds,
      simulationHistory,
    };
  },

  savePscPrepState(pscState: PscPrepState): void {
    safeWriteJson(KEYS.PSC_PREP_STATE, pscState);
  },

  loadContactInquiries(): ContactInquiryRecord[] {
    const items = safeReadJson<ContactInquiryRecord[]>(
      KEYS.CONTACT_INQUIRIES,
      []
    );
    if (!Array.isArray(items)) return [];
    return items.slice(0, 25);
  },

  saveContactInquiries(items: ContactInquiryRecord[]): void {
    safeWriteJson(KEYS.CONTACT_INQUIRIES, items.slice(0, 25));
  },

  clearContactInquiries(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(KEYS.CONTACT_INQUIRIES);
      const legacyKey = LEGACY_KEY_FALLBACKS[KEYS.CONTACT_INQUIRIES];
      if (legacyKey) {
        window.localStorage.removeItem(legacyKey);
      }
    } catch {
      // Ignore private-mode storage errors
    }
  },

  loadReactions(): {
    userReactions: Record<string, 'like' | 'dislike'>;
    itemViews: Record<string, number>;
  } {
    const saved = safeReadJson<{
      userReactions?: Record<string, 'like' | 'dislike'>;
      itemViews?: Record<string, number>;
    }>(KEYS.REACTIONS, { userReactions: {}, itemViews: {} });
    return {
      userReactions:
        saved && typeof saved.userReactions === 'object' && saved.userReactions !== null
          ? saved.userReactions
          : {},
      itemViews:
        saved && typeof saved.itemViews === 'object' && saved.itemViews !== null
          ? saved.itemViews
          : {},
    };
  },

  saveReactions(reactions: {
    userReactions: Record<string, 'like' | 'dislike'>;
    itemViews?: Record<string, number>;
  }): void {
    safeWriteJson(KEYS.REACTIONS, reactions);
  },

  loadFlaggedQuestions(): Record<string, FlaggedQuestionRecord> {
    const map = safeReadJson<Record<string, FlaggedQuestionRecord>>(
      KEYS.FLAGGED_QUESTIONS,
      {}
    );
    return map && typeof map === 'object' && !Array.isArray(map) ? map : {};
  },

  saveFlaggedQuestions(map: Record<string, FlaggedQuestionRecord>): void {
    safeWriteJson(KEYS.FLAGGED_QUESTIONS, map);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('psc_flagged_questions_changed', { detail: map })
      );
    }
  },

  toggleFlaggedQuestion(
    questionId: string,
    meta?: Partial<FlaggedQuestionRecord>
  ): boolean {
    const current = this.loadFlaggedQuestions();
    const isAlreadyFlagged = Boolean(current[questionId]);
    const uid = getVerifiedUid();

    if (isAlreadyFlagged) {
      delete current[questionId];
      this.saveFlaggedQuestions(current);
      if (uid) {
        void deleteFlaggedQuestionInFirestore(uid, questionId).catch((err) => {
          console.error('Failed to remove flagged question from Firestore:', err);
        });
      }
      return false;
    } else {
      const record: FlaggedQuestionRecord = {
        questionId,
        flaggedAt: new Date().toISOString(),
        source: meta?.source || 'quiz',
        deckTitle: meta?.deckTitle,
        cadreId: meta?.cadreId,
        note: meta?.note || '',
      };
      current[questionId] = record;
      this.saveFlaggedQuestions(current);
      if (uid) {
        void upsertFlaggedQuestionInFirestore(uid, record).catch((err) => {
          console.error('Failed to sync flagged question to Firestore:', err);
        });
      }
      return true;
    }
  },

  removeFlaggedQuestion(questionId: string): void {
    const current = this.loadFlaggedQuestions();
    if (current[questionId]) {
      delete current[questionId];
      this.saveFlaggedQuestions(current);
      const uid = getVerifiedUid();
      if (uid) {
        void deleteFlaggedQuestionInFirestore(uid, questionId).catch((err) => {
          console.error('Failed to delete flagged question in Firestore:', err);
        });
      }
    }
  },

  updateFlaggedQuestionNote(questionId: string, note: string): void {
    const current = this.loadFlaggedQuestions();
    if (current[questionId]) {
      current[questionId].note = note;
      this.saveFlaggedQuestions(current);
      const uid = getVerifiedUid();
      if (uid) {
        void upsertFlaggedQuestionInFirestore(uid, current[questionId]).catch(
          (err) => {
            console.error('Failed to update flagged question note in Firestore:', err);
          }
        );
      }
    }
  },

  clearAllFlaggedQuestions(): void {
    this.saveFlaggedQuestions({});
    const uid = getVerifiedUid();
    if (uid) {
      void clearAllFlaggedQuestionsInFirestore(uid).catch((err) => {
        console.error('Failed to clear flagged questions in Firestore:', err);
      });
    }
  },

  mergeCloudFlaggedQuestions(
    cloudMap: Record<string, FlaggedQuestionRecord>
  ): {
    merged: Record<string, FlaggedQuestionRecord>;
    toPushToCloud: FlaggedQuestionRecord[];
  } {
    const localMap = this.loadFlaggedQuestions();
    const merged: Record<string, FlaggedQuestionRecord> = {};
    const toPushToCloud: FlaggedQuestionRecord[] = [];

    const allIds = new Set<string>([
      ...Object.keys(cloudMap),
      ...Object.keys(localMap),
    ]);

    for (const id of allIds) {
      const localRec = localMap[id];
      const cloudRec = cloudMap[id];

      if (localRec && !cloudRec) {
        merged[id] = localRec;
        toPushToCloud.push(localRec);
      } else if (cloudRec && !localRec) {
        merged[id] = cloudRec;
      } else if (localRec && cloudRec) {
        const localTime = new Date(localRec.flaggedAt || 0).getTime() || 0;
        const cloudTime = new Date(cloudRec.flaggedAt || 0).getTime() || 0;
        const newer = localTime >= cloudTime ? localRec : cloudRec;
        const older = localTime >= cloudTime ? cloudRec : localRec;
        const resolvedNote =
          (newer.note && newer.note.trim() ? newer.note : older.note) ?? '';

        const combined: FlaggedQuestionRecord = {
          questionId: id,
          flaggedAt: newer.flaggedAt || older.flaggedAt,
          source: newer.source || older.source || 'quiz',
          ...(newer.deckTitle || older.deckTitle
            ? { deckTitle: newer.deckTitle || older.deckTitle }
            : {}),
          ...(newer.cadreId || older.cadreId
            ? { cadreId: newer.cadreId || older.cadreId }
            : {}),
          note: resolvedNote,
        };
        merged[id] = combined;

        if (
          (combined.note ?? '') !== (cloudRec.note ?? '') ||
          combined.flaggedAt !== cloudRec.flaggedAt
        ) {
          toPushToCloud.push(combined);
        }
      }
    }

    this.saveFlaggedQuestions(merged);
    return { merged, toPushToCloud };
  },
};
