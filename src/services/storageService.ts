import type { PscPrepState } from '../features/psc/pscSlice';
import type { QuizState } from '../features/quiz/quizSlice';
import type { WrittenState } from '../features/written/writtenSlice';
import type {
  BookReadingStats,
  ReadingProgressEntry,
  RecentBookEntry,
} from '../types/pdf';
import type { SettingsState } from '../types/reader';

const KEYS = {
  SETTINGS: 'psc_nepal_settings_v2',
  RECENT_BOOKS: 'psc_nepal_recent_books_v1',
  READING_PROGRESS: 'psc_nepal_reading_progress_v1',
  READING_STATS: 'psc_nepal_reading_stats_v1',
  QUIZ_STATE: 'psc_nepal_quiz_state_v2',
  WRITTEN_STATE: 'psc_nepal_written_state_v1',
  PSC_PREP_STATE: 'psc_nepal_prep_v1',
  CONTACT_INQUIRIES: 'psc_nepal_contact_inquiries_v1',
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
};
