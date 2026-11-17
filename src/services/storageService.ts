import { auth } from '../lib/firebase';
import type {
  BookReadingStats,
  ContactInquiryRecord,
  FlaggedQuestionRecord,
  FlashcardProgress,
  InquiryCategory,
  InquiryStatus,
  LeitnerBoxLevel,
  PscPrepState,
  QuizState,
  ReadingProgressEntry,
  RecentBookEntry,
  SettingsState,
  WrittenEvaluationRecord,
  WrittenState,
} from '../types';

export type {
  ContactInquiryRecord,
  FlaggedQuestionRecord,
  FlashcardProgress,
  InquiryCategory,
  InquiryStatus,
  LeitnerBoxLevel,
  WrittenEvaluationRecord,
};
import {
  clearAllFlaggedQuestionsInFirestore,
  deleteFlaggedQuestionInFirestore,
  upsertFlaggedQuestionInFirestore,
} from './cloudSyncService';
import { toast } from './toastService';
import {
  formatUserFriendlyError,
  isFirestoreOfflineError,
} from '../utils/errorHelpers';

function handleFlagSyncError(label: string, err: unknown, fallback: string) {
  if (isFirestoreOfflineError(err)) {
    console.warn(`${label} (offline):`, err instanceof Error ? err.message : err);
    toast.warning(
      'Cloud database is offline. Saved locally and will sync when reconnected.',
      { id: 'firebase-offline', title: 'Offline Mode' }
    );
    return;
  }
  console.error(`${label}:`, err);
  toast.error(formatUserFriendlyError(err, fallback), {
    id: 'cloud-flag-sync-err',
  });
}

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
  FLASHCARD_PROGRESS: 'psc_nepal_flashcard_progress_v2',
  PYQ_BOOKMARKS: 'psc_nepal_pyq_bookmarks_v1',
  AFFAIR_BOOKMARKS: 'psc_nepal_affair_bookmarks_v1',
  EXAM_CHECKLIST: 'psc_nepal_exam_checklist_v1',
  WRITTEN_EVALUATIONS: 'psc_nepal_written_evaluations_v2',
  LAST_CLOUD_UID: 'psc_nepal_cloud_owner_uid_v1',
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
  [KEYS.FLASHCARD_PROGRESS]: 'psc_flashcards_progress_v2',
  [KEYS.PYQ_BOOKMARKS]: 'psc_pyq_bookmarks_v1',
  [KEYS.AFFAIR_BOOKMARKS]: 'psc_affairs_bookmarks_v1',
  [KEYS.EXAM_CHECKLIST]: 'psc_exam_hall_checklist_v1',
  [KEYS.WRITTEN_EVALUATIONS]: 'psc_written_evaluations_v2',
};

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
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      toast.warning(
        'Browser storage is full. Export a backup or clear old drafts to keep saving locally.',
        { id: 'local-storage-quota', title: 'Storage Limit Reached' }
      );
    }
  }
}

export const STORAGE_KEYS = KEYS;

export const storageService = {
  getLastCloudUid(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(KEYS.LAST_CLOUD_UID);
      return raw && raw.trim() ? raw.trim() : null;
    } catch {
      return null;
    }
  },

  setLastCloudUid(uid: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(KEYS.LAST_CLOUD_UID, uid);
    } catch {
      // Ignore storage restrictions
    }
  },

  clearLastCloudUid(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(KEYS.LAST_CLOUD_UID);
    } catch {
      // Ignore storage restrictions
    }
  },

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
    const items = safeReadJson<Array<Partial<ContactInquiryRecord>>>(
      KEYS.CONTACT_INQUIRIES,
      []
    );
    if (!Array.isArray(items)) return [];
    return items.slice(0, 25).map((item) => ({
      id: String(item.id ?? `inq-${Date.now()}`),
      ...(typeof item.userId === 'string' && item.userId ? { userId: item.userId } : {}),
      ticketCode: String(item.ticketCode ?? 'PSC-INQ'),
      name: String(item.name ?? ''),
      email: String(item.email ?? ''),
      category:
        item.category === 'quiz-errata' ||
        item.category === 'material-request' ||
        item.category === 'reader-support'
          ? item.category
          : 'general',
      reference: String(item.reference ?? ''),
      message: String(item.message ?? ''),
      status:
        item.status === 'in-review' || item.status === 'resolved'
          ? item.status
          : 'open',
      ...(typeof item.adminReply === 'string' && item.adminReply
        ? { adminReply: item.adminReply }
        : {}),
      ...(typeof item.respondedBy === 'string' && item.respondedBy
        ? { respondedBy: item.respondedBy }
        : {}),
      ...(typeof item.respondedAt === 'string' && item.respondedAt
        ? { respondedAt: item.respondedAt }
        : {}),
      createdAt: String(item.createdAt ?? new Date().toISOString()),
      ...(typeof item.updatedAt === 'string' && item.updatedAt
        ? { updatedAt: item.updatedAt }
        : {}),
    }));
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

  loadFlashcardProgress(): Record<string, FlashcardProgress> {
    const raw = safeReadJson<Record<string, FlashcardProgress>>(
      KEYS.FLASHCARD_PROGRESS,
      {}
    );
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const sanitized: Record<string, FlashcardProgress> = {};
    for (const [id, entry] of Object.entries(raw)) {
      if (!entry || typeof entry !== 'object') continue;
      const boxLevel: LeitnerBoxLevel =
        entry.boxLevel === 2 ? 2 : entry.boxLevel === 3 ? 3 : 1;
      sanitized[id] = {
        boxLevel,
        lastReviewedAt: Number(entry.lastReviewedAt) || 0,
        timesReviewed: Math.max(0, Number(entry.timesReviewed) || 0),
        timesCorrect: Math.max(0, Number(entry.timesCorrect) || 0),
      };
    }
    return sanitized;
  },

  saveFlashcardProgress(progress: Record<string, FlashcardProgress>): void {
    safeWriteJson(KEYS.FLASHCARD_PROGRESS, progress);
  },

  loadPyqBookmarks(): Record<string, boolean> {
    const raw = safeReadJson<Record<string, boolean> | string[]>(
      KEYS.PYQ_BOOKMARKS,
      {}
    );
    if (Array.isArray(raw)) {
      return Object.fromEntries(raw.filter((x) => typeof x === 'string').map((id) => [id, true]));
    }
    if (!raw || typeof raw !== 'object') return {};
    const out: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v) out[k] = true;
    }
    return out;
  },

  savePyqBookmarks(bookmarks: Record<string, boolean>): void {
    const compact: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(bookmarks)) {
      if (v) compact[k] = true;
    }
    safeWriteJson(KEYS.PYQ_BOOKMARKS, compact);
  },

  loadAffairBookmarks(): Record<string, boolean> {
    const raw = safeReadJson<Record<string, boolean> | string[]>(
      KEYS.AFFAIR_BOOKMARKS,
      {}
    );
    if (Array.isArray(raw)) {
      return Object.fromEntries(raw.filter((x) => typeof x === 'string').map((id) => [id, true]));
    }
    if (!raw || typeof raw !== 'object') return {};
    const out: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v) out[k] = true;
    }
    return out;
  },

  saveAffairBookmarks(bookmarks: Record<string, boolean>): void {
    const compact: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(bookmarks)) {
      if (v) compact[k] = true;
    }
    safeWriteJson(KEYS.AFFAIR_BOOKMARKS, compact);
  },

  loadExamChecklist(): Record<string, boolean> {
    const raw = safeReadJson<Record<string, boolean>>(KEYS.EXAM_CHECKLIST, {});
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const out: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v) out[k] = true;
    }
    return out;
  },

  saveExamChecklist(checklist: Record<string, boolean>): void {
    const compact: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(checklist)) {
      if (v) compact[k] = true;
    }
    safeWriteJson(KEYS.EXAM_CHECKLIST, compact);
  },

  loadWrittenEvaluations(): WrittenEvaluationRecord[] {
    const items = safeReadJson<WrittenEvaluationRecord[]>(
      KEYS.WRITTEN_EVALUATIONS,
      []
    );
    if (!Array.isArray(items)) return [];
    return items.slice(0, 30);
  },

  saveWrittenEvaluations(records: WrittenEvaluationRecord[]): void {
    safeWriteJson(KEYS.WRITTEN_EVALUATIONS, records.slice(0, 30));
  },

  loadReactions(): {
    userReactions: Record<string, 'like' | 'dislike'>;
    itemViews: Record<string, number>;
  } {
    const saved = safeReadJson<{
      userReactions?: Record<string, 'like' | 'dislike'>;
      itemViews?: Record<string, number>;
    }>(KEYS.REACTIONS, { userReactions: {}, itemViews: {} });
    const userReactions: Record<string, 'like' | 'dislike'> =
      saved && typeof saved.userReactions === 'object' && saved.userReactions !== null
        ? { ...saved.userReactions }
        : {};
    const itemViews: Record<string, number> =
      saved && typeof saved.itemViews === 'object' && saved.itemViews !== null
        ? { ...saved.itemViews }
        : {};

    // One-time migration of legacy Current Affairs localStorage likes/dislikes
    if (typeof window !== 'undefined') {
      try {
        let migrated = false;
        const legacyLikesRaw = window.localStorage.getItem('psc_affairs_likes_v1');
        if (legacyLikesRaw) {
          const legacyLikes = JSON.parse(legacyLikesRaw) as Record<string, boolean>;
          if (legacyLikes && typeof legacyLikes === 'object') {
            for (const [id, active] of Object.entries(legacyLikes)) {
              if (active && !userReactions[id]) {
                userReactions[id] = 'like';
              }
            }
          }
          window.localStorage.removeItem('psc_affairs_likes_v1');
          migrated = true;
        }
        const legacyDislikesRaw = window.localStorage.getItem('psc_affairs_dislikes_v1');
        if (legacyDislikesRaw) {
          const legacyDislikes = JSON.parse(legacyDislikesRaw) as Record<string, boolean>;
          if (legacyDislikes && typeof legacyDislikes === 'object') {
            for (const [id, active] of Object.entries(legacyDislikes)) {
              if (active && !userReactions[id]) {
                userReactions[id] = 'dislike';
              }
            }
          }
          window.localStorage.removeItem('psc_affairs_dislikes_v1');
          migrated = true;
        }
        if (migrated) {
          safeWriteJson(KEYS.REACTIONS, { userReactions, itemViews });
        }
      } catch {
        // Ignore malformed legacy reaction storage
      }
    }

    return {
      userReactions,
      itemViews,
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
          handleFlagSyncError(
            'Failed to remove flagged question from Firestore',
            err,
            'Flag removed locally, but cloud sync failed.'
          );
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
        reason: (meta?.reason ?? '').trim().slice(0, 500),
        note: meta?.note || '',
      };
      current[questionId] = record;
      this.saveFlaggedQuestions(current);
      if (uid) {
        void upsertFlaggedQuestionInFirestore(uid, record).catch((err) => {
          handleFlagSyncError(
            'Failed to sync flagged question to Firestore',
            err,
            'Question flagged locally, but cloud sync failed.'
          );
        });
      }
      return true;
    }
  },

  flagQuestionWithReason(
    questionId: string,
    meta: Omit<FlaggedQuestionRecord, 'questionId' | 'flaggedAt'> & {
      reason: string;
    }
  ): FlaggedQuestionRecord {
    const current = this.loadFlaggedQuestions();
    const uid = getVerifiedUid();
    const record: FlaggedQuestionRecord = {
      questionId,
      flaggedAt: new Date().toISOString(),
      source: meta.source || 'quiz',
      deckTitle: meta.deckTitle,
      cadreId: meta.cadreId,
      reason: meta.reason.trim().slice(0, 500),
      note: meta.note ?? current[questionId]?.note ?? '',
    };
    current[questionId] = record;
    this.saveFlaggedQuestions(current);
    if (uid) {
      void upsertFlaggedQuestionInFirestore(uid, record).catch((err) => {
        handleFlagSyncError(
          'Failed to sync flagged question to Firestore',
          err,
          'Question flagged locally, but cloud sync failed.'
        );
      });
    }
    return record;
  },

  removeFlaggedQuestion(questionId: string): void {
    const current = this.loadFlaggedQuestions();
    if (current[questionId]) {
      delete current[questionId];
      this.saveFlaggedQuestions(current);
      const uid = getVerifiedUid();
      if (uid) {
        void deleteFlaggedQuestionInFirestore(uid, questionId).catch((err) => {
          handleFlagSyncError(
            'Failed to delete flagged question in Firestore',
            err,
            'Could not remove flagged question from cloud.'
          );
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
            handleFlagSyncError(
              'Failed to update flagged question note in Firestore',
              err,
              'Note saved locally, but cloud sync failed.'
            );
          }
        );
      }
    }
  },

  updateFlaggedQuestionDetails(
    questionId: string,
    updates: { reason?: string; note?: string }
  ): void {
    const current = this.loadFlaggedQuestions();
    if (current[questionId]) {
      if (typeof updates.reason === 'string') {
        current[questionId].reason = updates.reason.trim().slice(0, 500);
      }
      if (typeof updates.note === 'string') {
        current[questionId].note = updates.note.slice(0, 1000);
      }
      this.saveFlaggedQuestions(current);
      const uid = getVerifiedUid();
      if (uid) {
        void upsertFlaggedQuestionInFirestore(uid, current[questionId]).catch(
          (err) => {
            handleFlagSyncError(
              'Failed to update flagged question details in Firestore',
              err,
              'Changes saved locally, but cloud sync failed.'
            );
          }
        );
      }
    }
  },

  clearLocalFlaggedQuestionsOnly(): void {
    this.saveFlaggedQuestions({});
  },

  clearAllFlaggedQuestions(): void {
    this.saveFlaggedQuestions({});
    const uid = getVerifiedUid();
    if (uid) {
      void clearAllFlaggedQuestionsInFirestore(uid).catch((err) => {
        handleFlagSyncError(
          'Failed to clear flagged questions in Firestore',
          err,
          'Could not clear cloud flagged questions.'
        );
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
        const resolvedReason =
          (newer.reason && newer.reason.trim() ? newer.reason : older.reason) ??
          '';

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
          reason: resolvedReason,
          note: resolvedNote,
        };
        merged[id] = combined;

        if (
          (combined.reason ?? '') !== (cloudRec.reason ?? '') ||
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
