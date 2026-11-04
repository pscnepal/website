import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type {
  BookMetadata,
  BookReadingStats,
  ReadingProgressEntry,
  RecentBookEntry,
} from '../../types/pdf';

export interface LibraryState {
  currentBook: BookMetadata | null;
  recentBooks: RecentBookEntry[];
  readingProgress: Record<string, ReadingProgressEntry>;
  readingStats: Record<string, BookReadingStats>;
}

function computePagesPerMinute(
  pagesReadCount: number,
  totalReadingSeconds: number
): number {
  if (pagesReadCount <= 0 || totalReadingSeconds <= 0) {
    return 0;
  }
  // Use a 10-second minimum smoothing floor so initial rapid clicks don't spike unrealistically
  const effectiveMinutes = Math.max(totalReadingSeconds, 10) / 60;
  const ppm = pagesReadCount / effectiveMinutes;
  return Math.round(ppm * 100) / 100;
}

function createEmptyStats(initialPage?: number): BookReadingStats {
  return {
    totalReadingSeconds: 0,
    pagesReadCount: 0,
    pagesPerMinute: 0,
    uniquePagesVisited: initialPage && initialPage > 0 ? [initialPage] : [],
    sessionsCount: 0,
    lastReadAt: new Date().toISOString(),
  };
}

const initialState: LibraryState = {
  currentBook: null,
  recentBooks: storageService.loadRecentBooks(),
  readingProgress: storageService.loadReadingProgress(),
  readingStats: storageService.loadReadingStats(),
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setCurrentBook(state, action: PayloadAction<BookMetadata | null>) {
      state.currentBook = action.payload;
    },
    recordBookOpened(
      state,
      action: PayloadAction<{
        book: BookMetadata;
        totalPages: number;
        currentPage: number;
      }>
    ) {
      const { book, totalPages, currentPage } = action.payload;
      const now = new Date().toISOString();

      state.currentBook = {
        ...book,
        totalPages,
      };

      state.readingProgress[book.id] = {
        lastPage: currentPage,
        totalPages,
        updatedAt: now,
      };

      const existingStats =
        state.readingStats[book.id] ?? createEmptyStats(currentPage);
      const visited = existingStats.uniquePagesVisited.includes(currentPage)
        ? existingStats.uniquePagesVisited
        : [...existingStats.uniquePagesVisited, currentPage];

      state.readingStats[book.id] = {
        ...existingStats,
        uniquePagesVisited: visited,
        sessionsCount: existingStats.sessionsCount + 1,
        lastReadAt: now,
      };

      const entry: RecentBookEntry = {
        id: book.id,
        title: book.title,
        author: book.author,
        sourceType: book.sourceType,
        url: book.url,
        fileName: book.fileName,
        fileSize: book.fileSize,
        lastPage: currentPage,
        totalPages,
        lastOpenedAt: now,
      };

      state.recentBooks = [
        entry,
        ...state.recentBooks.filter((b) => b.id !== book.id),
      ].slice(0, 12);
    },
    updateReadingProgress(
      state,
      action: PayloadAction<{
        bookId: string;
        page: number;
        totalPages: number;
      }>
    ) {
      const { bookId, page, totalPages } = action.payload;
      if (totalPages <= 0) return;

      const clampedPage = Math.max(1, Math.min(totalPages, page));
      const now = new Date().toISOString();

      state.readingProgress[bookId] = {
        lastPage: clampedPage,
        totalPages,
        updatedAt: now,
      };

      const recentIdx = state.recentBooks.findIndex((b) => b.id === bookId);
      if (recentIdx !== -1) {
        state.recentBooks[recentIdx].lastPage = clampedPage;
        state.recentBooks[recentIdx].totalPages = totalPages;
        state.recentBooks[recentIdx].lastOpenedAt = now;
      }
    },
    recordReadingTick(
      state,
      action: PayloadAction<{ bookId: string; elapsedSeconds: number }>
    ) {
      const { bookId, elapsedSeconds } = action.payload;
      if (!bookId || elapsedSeconds <= 0) return;

      const current = state.readingStats[bookId] ?? createEmptyStats();
      const nextSeconds = current.totalReadingSeconds + elapsedSeconds;

      state.readingStats[bookId] = {
        ...current,
        totalReadingSeconds: nextSeconds,
        pagesPerMinute: computePagesPerMinute(
          current.pagesReadCount,
          nextSeconds
        ),
        lastReadAt: new Date().toISOString(),
      };
    },
    recordPageTurnStats(
      state,
      action: PayloadAction<{
        bookId: string;
        fromPage: number;
        toPage: number;
      }>
    ) {
      const { bookId, fromPage, toPage } = action.payload;
      if (!bookId || fromPage === toPage || toPage <= 0) return;

      const current = state.readingStats[bookId] ?? createEmptyStats(fromPage);
      // Cap single jump contribution to 2 pages (e.g. a two-page spread turn) so jumping via TOC/thumbnails doesn't skew PPM
      const stepDelta = Math.min(2, Math.abs(toPage - fromPage));
      const nextPagesRead = current.pagesReadCount + stepDelta;

      const visitedSet = new Set(current.uniquePagesVisited);
      visitedSet.add(fromPage);
      visitedSet.add(toPage);
      // If turning a 2-page spread forward (e.g. 1 -> 3 or 2 -> 4), also mark the intermediate facing page visited
      if (Math.abs(toPage - fromPage) === 2) {
        visitedSet.add(Math.min(fromPage, toPage) + 1);
      }

      state.readingStats[bookId] = {
        ...current,
        pagesReadCount: nextPagesRead,
        pagesPerMinute: computePagesPerMinute(
          nextPagesRead,
          current.totalReadingSeconds
        ),
        uniquePagesVisited: Array.from(visitedSet).sort((a, b) => a - b),
        lastReadAt: new Date().toISOString(),
      };
    },
    resetBookReadingStats(
      state,
      action: PayloadAction<{ bookId: string; currentPage?: number }>
    ) {
      const { bookId, currentPage } = action.payload;
      state.readingStats[bookId] = {
        ...createEmptyStats(currentPage),
        sessionsCount: 1,
      };
    },
    removeRecentBook(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.recentBooks = state.recentBooks.filter((b) => b.id !== id);
    },
    clearRecentBooks(state) {
      state.recentBooks = [];
    },
    clearAllReadingData(state) {
      state.recentBooks = [];
      state.readingProgress = {};
      state.readingStats = {};
    },
  },
});

export const {
  setCurrentBook,
  recordBookOpened,
  updateReadingProgress,
  recordReadingTick,
  recordPageTurnStats,
  resetBookReadingStats,
  removeRecentBook,
  clearRecentBooks,
  clearAllReadingData,
} = librarySlice.actions;

export default librarySlice.reducer;
