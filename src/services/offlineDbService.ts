const DB_NAME = 'psc_nepal_offline_v1';
const DB_VERSION = 1;

const STORE_PDFS = 'pdfs';
const STORE_STUDY_BANKS = 'study_banks';
const STORE_USER_PROGRESS = 'user_progress';

export const OFFLINE_CACHE_EVENTS = {
  CHANGED: 'psc_offline_cache_changed',
} as const;

export type StudyBankKey =
  | 'quiz_questions'
  | 'written_questions'
  | 'material_categories'
  | 'current_affairs';

export type ProgressStoreKey =
  | 'settings'
  | 'recent_books'
  | 'reading_progress'
  | 'reading_stats'
  | 'quiz_state'
  | 'written_state'
  | 'psc_prep_state'
  | 'flashcard_progress'
  | 'pyq_bookmarks'
  | 'affair_bookmarks'
  | 'exam_checklist'
  | 'written_evaluations'
  | 'reactions'
  | 'flagged_questions'
  | 'contact_inquiries'
  | 'daily_quiz';

export interface OfflinePdfRecord {
  id: string;
  title: string;
  sourceType: 'url' | 'local';
  url?: string;
  fileName?: string;
  fileSize: number;
  data: ArrayBuffer;
  savedAt: string;
}

export interface OfflinePdfSummaryItem {
  id: string;
  title: string;
  sourceType: 'url' | 'local';
  url?: string;
  fileName?: string;
  fileSize: number;
  savedAt: string;
}

export interface StudyBankRecord<T = unknown> {
  key: StudyBankKey;
  items: T;
  updatedAt: string;
}

export interface ProgressSnapshotRecord<T = unknown> {
  key: ProgressStoreKey;
  value: T;
  updatedAt: string;
}

export interface OfflineCacheSummary {
  supported: boolean;
  pdfCount: number;
  pdfBytes: number;
  studyBankCount: number;
  progressKeyCount: number;
  pdfs: OfflinePdfSummaryItem[];
}

const MAX_SINGLE_PDF_CACHE_BYTES = 30 * 1024 * 1024; // 30 MB per PDF safety limit

let dbPromise: Promise<IDBDatabase | null> | null = null;

function isIndexedDbAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function emitOfflineCacheChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OFFLINE_CACHE_EVENTS.CHANGED));
  }
}

function openOfflineDb(): Promise<IDBDatabase | null> {
  if (!isIndexedDbAvailable()) {
    return Promise.resolve(null);
  }
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_PDFS)) {
          const pdfStore = db.createObjectStore(STORE_PDFS, { keyPath: 'id' });
          pdfStore.createIndex('by_url', 'url', { unique: false });
          pdfStore.createIndex('by_savedAt', 'savedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_STUDY_BANKS)) {
          db.createObjectStore(STORE_STUDY_BANKS, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE_USER_PROGRESS)) {
          db.createObjectStore(STORE_USER_PROGRESS, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };
        resolve(db);
      };

      request.onerror = () => {
        dbPromise = null;
        resolve(null);
      };

      request.onblocked = () => {
        resolve(null);
      };
    } catch {
      dbPromise = null;
      resolve(null);
    }
  });

  return dbPromise;
}

function wrapRequest<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

export const offlineDbService = {
  isSupported(): boolean {
    return isIndexedDbAvailable();
  },

  // ==========================================================================
  // PDF Binary Caching (Official Catalog Materials & Local Uploaded PDFs)
  // ==========================================================================

  async savePdfRecord(record: OfflinePdfRecord): Promise<boolean> {
    if (record.data.byteLength <= 0 || record.data.byteLength > MAX_SINGLE_PDF_CACHE_BYTES) {
      return false;
    }
    const db = await openOfflineDb();
    if (!db) return false;

    try {
      const tx = db.transaction(STORE_PDFS, 'readwrite');
      const store = tx.objectStore(STORE_PDFS);
      await wrapRequest(store.put(record));
      emitOfflineCacheChanged();
      return true;
    } catch {
      return false;
    }
  },

  async getPdfRecordById(id: string): Promise<OfflinePdfRecord | null> {
    const db = await openOfflineDb();
    if (!db || !id) return null;

    try {
      const tx = db.transaction(STORE_PDFS, 'readonly');
      const store = tx.objectStore(STORE_PDFS);
      const found = await wrapRequest(store.get(id));
      return (found as OfflinePdfRecord | undefined) ?? null;
    } catch {
      return null;
    }
  },

  async getPdfRecordByUrl(url: string): Promise<OfflinePdfRecord | null> {
    const db = await openOfflineDb();
    if (!db || !url) return null;

    try {
      const tx = db.transaction(STORE_PDFS, 'readonly');
      const store = tx.objectStore(STORE_PDFS);
      const index = store.index('by_url');
      const found = await wrapRequest(index.get(url));
      return (found as OfflinePdfRecord | undefined) ?? null;
    } catch {
      return null;
    }
  },

  async listCachedPdfSummaries(): Promise<OfflinePdfSummaryItem[]> {
    const db = await openOfflineDb();
    if (!db) return [];

    try {
      const tx = db.transaction(STORE_PDFS, 'readonly');
      const store = tx.objectStore(STORE_PDFS);
      const all = (await wrapRequest(store.getAll())) as OfflinePdfRecord[];
      return all
        .map((rec) => ({
          id: rec.id,
          title: rec.title,
          sourceType: rec.sourceType,
          url: rec.url,
          fileName: rec.fileName,
          fileSize: rec.fileSize || rec.data?.byteLength || 0,
          savedAt: rec.savedAt,
        }))
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    } catch {
      return [];
    }
  },

  async deletePdfRecord(id: string): Promise<void> {
    const db = await openOfflineDb();
    if (!db || !id) return;
    try {
      const tx = db.transaction(STORE_PDFS, 'readwrite');
      await wrapRequest(tx.objectStore(STORE_PDFS).delete(id));
      emitOfflineCacheChanged();
    } catch {
      // Ignore cleanup errors
    }
  },

  async clearAllPdfs(): Promise<void> {
    const db = await openOfflineDb();
    if (!db) return;
    try {
      const tx = db.transaction(STORE_PDFS, 'readwrite');
      await wrapRequest(tx.objectStore(STORE_PDFS).clear());
      emitOfflineCacheChanged();
    } catch {
      // Ignore cleanup errors
    }
  },

  // ==========================================================================
  // Study Banks (MCQs, Written Q&A, Materials Catalog, Current Affairs)
  // ==========================================================================

  async putStudyBank<T>(key: StudyBankKey, items: T): Promise<void> {
    const db = await openOfflineDb();
    if (!db) return;
    try {
      const tx = db.transaction(STORE_STUDY_BANKS, 'readwrite');
      const payload: StudyBankRecord<T> = {
        key,
        items,
        updatedAt: new Date().toISOString(),
      };
      await wrapRequest(tx.objectStore(STORE_STUDY_BANKS).put(payload));
    } catch {
      // Graceful fallback
    }
  },

  async getStudyBank<T>(key: StudyBankKey): Promise<StudyBankRecord<T> | null> {
    const db = await openOfflineDb();
    if (!db) return null;
    try {
      const tx = db.transaction(STORE_STUDY_BANKS, 'readonly');
      const res = await wrapRequest(tx.objectStore(STORE_STUDY_BANKS).get(key));
      return (res as StudyBankRecord<T> | undefined) ?? null;
    } catch {
      return null;
    }
  },

  // ==========================================================================
  // User Progress Snapshot Mirror (Survives localStorage eviction / quota)
  // ==========================================================================

  async putProgressRecord<T>(key: ProgressStoreKey, value: T): Promise<void> {
    const db = await openOfflineDb();
    if (!db) return;
    try {
      const tx = db.transaction(STORE_USER_PROGRESS, 'readwrite');
      const record: ProgressSnapshotRecord<T> = {
        key,
        value,
        updatedAt: new Date().toISOString(),
      };
      await wrapRequest(tx.objectStore(STORE_USER_PROGRESS).put(record));
    } catch {
      // Graceful fallback
    }
  },

  async getProgressRecord<T>(
    key: ProgressStoreKey
  ): Promise<ProgressSnapshotRecord<T> | null> {
    const db = await openOfflineDb();
    if (!db) return null;
    try {
      const tx = db.transaction(STORE_USER_PROGRESS, 'readonly');
      const res = await wrapRequest(tx.objectStore(STORE_USER_PROGRESS).get(key));
      return (res as ProgressSnapshotRecord<T> | undefined) ?? null;
    } catch {
      return null;
    }
  },

  async getAllProgressRecords(): Promise<
    Partial<Record<ProgressStoreKey, unknown>>
  > {
    const db = await openOfflineDb();
    if (!db) return {};
    try {
      const tx = db.transaction(STORE_USER_PROGRESS, 'readonly');
      const rows = (await wrapRequest(
        tx.objectStore(STORE_USER_PROGRESS).getAll()
      )) as ProgressSnapshotRecord[];
      const map: Partial<Record<ProgressStoreKey, unknown>> = {};
      for (const row of rows) {
        if (row && row.key) {
          map[row.key] = row.value;
        }
      }
      return map;
    } catch {
      return {};
    }
  },

  async deleteProgressRecord(key: ProgressStoreKey): Promise<void> {
    const db = await openOfflineDb();
    if (!db) return;
    try {
      const tx = db.transaction(STORE_USER_PROGRESS, 'readwrite');
      await wrapRequest(tx.objectStore(STORE_USER_PROGRESS).delete(key));
    } catch {
      // Ignore
    }
  },

  // ==========================================================================
  // Cache Summary & Inspector
  // ==========================================================================

  async getCacheSummary(): Promise<OfflineCacheSummary> {
    if (!isIndexedDbAvailable()) {
      return {
        supported: false,
        pdfCount: 0,
        pdfBytes: 0,
        studyBankCount: 0,
        progressKeyCount: 0,
        pdfs: [],
      };
    }

    const db = await openOfflineDb();
    if (!db) {
      return {
        supported: false,
        pdfCount: 0,
        pdfBytes: 0,
        studyBankCount: 0,
        progressKeyCount: 0,
        pdfs: [],
      };
    }

    try {
      const pdfs = await this.listCachedPdfSummaries();
      const pdfBytes = pdfs.reduce((acc, item) => acc + item.fileSize, 0);

      const tx = db.transaction([STORE_STUDY_BANKS, STORE_USER_PROGRESS], 'readonly');
      const [studyBankCount, progressKeyCount] = await Promise.all([
        wrapRequest(tx.objectStore(STORE_STUDY_BANKS).count()),
        wrapRequest(tx.objectStore(STORE_USER_PROGRESS).count()),
      ]);

      return {
        supported: true,
        pdfCount: pdfs.length,
        pdfBytes,
        studyBankCount,
        progressKeyCount,
        pdfs,
      };
    } catch {
      return {
        supported: true,
        pdfCount: 0,
        pdfBytes: 0,
        studyBankCount: 0,
        progressKeyCount: 0,
        pdfs: [],
      };
    }
  },
};
