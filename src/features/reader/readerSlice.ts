import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type {
  FitMode,
  ReaderState,
  ReadingMode,
  StandardLayout,
} from '../../types/reader';
import { clampZoom } from '../../utils/pdfHelpers';

const savedSettings = storageService.loadSettings();

const initialState: ReaderState = {
  currentPage: 1,
  totalPages: 0,
  zoom: 100,
  fitMode: 'page',
  readingMode: savedSettings.defaultReadingMode,
  standardLayout: 'continuous',
  isFullscreen: false,
  isSidebarOpen: false,
  soundEnabled: savedSettings.defaultSoundEnabled,
  isShortcutsOpen: false,
  isStatsOpen: false,
};

const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    initializeReaderSession(
      state,
      action: PayloadAction<{ initialPage?: number; totalPages: number }>
    ) {
      const total = Math.max(0, action.payload.totalPages);
      state.totalPages = total;
      const requested = action.payload.initialPage ?? 1;
      state.currentPage =
        total > 0 ? Math.max(1, Math.min(total, requested)) : 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      if (state.totalPages <= 0) {
        state.currentPage = 1;
        return;
      }
      state.currentPage = Math.max(
        1,
        Math.min(state.totalPages, Math.floor(action.payload))
      );
    },
    nextPage(state, action: PayloadAction<number | undefined>) {
      if (state.totalPages <= 0) return;
      const step = action.payload ?? 1;
      state.currentPage = Math.min(state.totalPages, state.currentPage + step);
    },
    prevPage(state, action: PayloadAction<number | undefined>) {
      if (state.totalPages <= 0) return;
      const step = action.payload ?? 1;
      state.currentPage = Math.max(1, state.currentPage - step);
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = clampZoom(action.payload);
      state.fitMode = 'custom';
    },
    setFitMode(state, action: PayloadAction<FitMode>) {
      state.fitMode = action.payload;
      if (action.payload === 'page' || action.payload === 'width') {
        state.zoom = 100;
      }
    },
    setReadingMode(state, action: PayloadAction<ReadingMode>) {
      state.readingMode = action.payload;
    },
    toggleReadingMode(state) {
      state.readingMode =
        state.readingMode === 'flipbook' ? 'standard' : 'flipbook';
    },
    setStandardLayout(state, action: PayloadAction<StandardLayout>) {
      state.standardLayout = action.payload;
    },
    setFullscreenState(state, action: PayloadAction<boolean>) {
      state.isFullscreen = action.payload;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
    },
    setSoundEnabled(state, action: PayloadAction<boolean>) {
      state.soundEnabled = action.payload;
    },
    setShortcutsOpen(state, action: PayloadAction<boolean>) {
      state.isShortcutsOpen = action.payload;
    },
    setStatsOpen(state, action: PayloadAction<boolean>) {
      state.isStatsOpen = action.payload;
    },
    toggleStatsOpen(state) {
      state.isStatsOpen = !state.isStatsOpen;
    },
    resetReaderDocumentState(state) {
      state.currentPage = 1;
      state.totalPages = 0;
    },
  },
});

export const {
  initializeReaderSession,
  setCurrentPage,
  nextPage,
  prevPage,
  setZoom,
  setFitMode,
  setReadingMode,
  toggleReadingMode,
  setStandardLayout,
  setFullscreenState,
  toggleSidebar,
  setSidebarOpen,
  toggleSound,
  setSoundEnabled,
  setShortcutsOpen,
  setStatsOpen,
  toggleStatsOpen,
  resetReaderDocumentState,
} = readerSlice.actions;

export default readerSlice.reducer;
