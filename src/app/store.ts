import { configureStore } from '@reduxjs/toolkit';
import libraryReducer from '../features/library/librarySlice';
import pscReducer from '../features/psc/pscSlice';
import quizReducer from '../features/quiz/quizSlice';
import reactionsReducer from '../features/reactions/reactionsSlice';
import readerReducer from '../features/reader/readerSlice';
import settingsReducer from '../features/settings/settingsSlice';
import writtenReducer from '../features/written/writtenSlice';
import { storageService } from '../services/storageService';

export const store = configureStore({
  reducer: {
    reader: readerReducer,
    library: libraryReducer,
    settings: settingsReducer,
    quiz: quizReducer,
    written: writtenReducer,
    psc: pscReducer,
    reactions: reactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

let prevSettings = store.getState().settings;
let prevRecentBooks = store.getState().library.recentBooks;
let prevProgress = store.getState().library.readingProgress;
let prevStats = store.getState().library.readingStats;
let prevQuiz = store.getState().quiz;
let prevWritten = store.getState().written;
let prevPsc = store.getState().psc;
let prevReactions = store.getState().reactions;

store.subscribe(() => {
  const state = store.getState();

  if (state.settings !== prevSettings) {
    prevSettings = state.settings;
    storageService.saveSettings(state.settings);
  }

  if (state.library.recentBooks !== prevRecentBooks) {
    prevRecentBooks = state.library.recentBooks;
    storageService.saveRecentBooks(state.library.recentBooks);
  }

  if (state.library.readingProgress !== prevProgress) {
    prevProgress = state.library.readingProgress;
    storageService.saveReadingProgress(state.library.readingProgress);
  }

  if (state.library.readingStats !== prevStats) {
    prevStats = state.library.readingStats;
    storageService.saveReadingStats(state.library.readingStats);
  }

  if (state.quiz !== prevQuiz) {
    prevQuiz = state.quiz;
    storageService.saveQuizState(state.quiz);
  }

  if (state.written !== prevWritten) {
    prevWritten = state.written;
    storageService.saveWrittenState(state.written);
  }

  if (state.psc !== prevPsc) {
    prevPsc = state.psc;
    storageService.savePscPrepState(state.psc);
  }

  if (state.reactions !== prevReactions) {
    prevReactions = state.reactions;
    storageService.saveReactions(state.reactions);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
