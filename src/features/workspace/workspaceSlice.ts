import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type {
  FlashcardProgress,
  LeitnerBoxLevel,
  WorkspaceState,
  WrittenEvaluationRecord,
} from '../../types';

export type { WorkspaceState };

const initialState: WorkspaceState = {
  flashcardProgress: storageService.loadFlashcardProgress(),
  pyqBookmarks: storageService.loadPyqBookmarks(),
  affairBookmarks: storageService.loadAffairBookmarks(),
  examChecklist: storageService.loadExamChecklist(),
  writtenEvaluations: storageService.loadWrittenEvaluations(),
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    scoreFlashcard: (
      state,
      action: PayloadAction<{ cardId: string; level: LeitnerBoxLevel }>
    ) => {
      const { cardId, level } = action.payload;
      const current = state.flashcardProgress[cardId] || {
        boxLevel: 1,
        lastReviewedAt: 0,
        timesReviewed: 0,
        timesCorrect: 0,
      };
      state.flashcardProgress[cardId] = {
        boxLevel: level,
        lastReviewedAt: Date.now(),
        timesReviewed: current.timesReviewed + 1,
        timesCorrect: level > 1 ? current.timesCorrect + 1 : current.timesCorrect,
      };
    },

    resetFlashcardDeck: (state, action: PayloadAction<string[]>) => {
      for (const id of action.payload) {
        delete state.flashcardProgress[id];
      }
    },

    clearAllFlashcards: (state) => {
      state.flashcardProgress = {};
    },

    hydrateFlashcards: (
      state,
      action: PayloadAction<Record<string, FlashcardProgress>>
    ) => {
      state.flashcardProgress = action.payload;
    },

    togglePyqBookmark: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.pyqBookmarks[id]) {
        delete state.pyqBookmarks[id];
      } else {
        state.pyqBookmarks[id] = true;
      }
    },

    clearPyqBookmarks: (state) => {
      state.pyqBookmarks = {};
    },

    toggleAffairBookmark: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.affairBookmarks[id]) {
        delete state.affairBookmarks[id];
      } else {
        state.affairBookmarks[id] = true;
      }
    },

    clearAffairBookmarks: (state) => {
      state.affairBookmarks = {};
    },

    hydrateBookmarks: (
      state,
      action: PayloadAction<{
        pyqBookmarks: Record<string, boolean>;
        affairBookmarks: Record<string, boolean>;
      }>
    ) => {
      state.pyqBookmarks = action.payload.pyqBookmarks;
      state.affairBookmarks = action.payload.affairBookmarks;
    },

    toggleExamChecklistItem: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.examChecklist[key]) {
        delete state.examChecklist[key];
      } else {
        state.examChecklist[key] = true;
      }
    },

    clearExamChecklist: (state) => {
      state.examChecklist = {};
    },

    hydrateExamChecklist: (
      state,
      action: PayloadAction<Record<string, boolean>>
    ) => {
      state.examChecklist = action.payload;
    },

    addWrittenEvaluation: (
      state,
      action: PayloadAction<WrittenEvaluationRecord>
    ) => {
      state.writtenEvaluations = [
        action.payload,
        ...state.writtenEvaluations.filter((e) => e.id !== action.payload.id),
      ].slice(0, 30);
    },

    deleteWrittenEvaluation: (state, action: PayloadAction<string>) => {
      state.writtenEvaluations = state.writtenEvaluations.filter(
        (e) => e.id !== action.payload
      );
    },

    clearWrittenEvaluations: (state) => {
      state.writtenEvaluations = [];
    },

    hydrateWrittenEvaluations: (
      state,
      action: PayloadAction<WrittenEvaluationRecord[]>
    ) => {
      state.writtenEvaluations = action.payload.slice(0, 30);
    },

    resetLocalWorkspaceState: (state) => {
      state.flashcardProgress = {};
      state.pyqBookmarks = {};
      state.affairBookmarks = {};
      state.examChecklist = {};
      state.writtenEvaluations = [];
    },
  },
});

export const {
  scoreFlashcard,
  resetFlashcardDeck,
  clearAllFlashcards,
  hydrateFlashcards,
  togglePyqBookmark,
  clearPyqBookmarks,
  toggleAffairBookmark,
  clearAffairBookmarks,
  hydrateBookmarks,
  toggleExamChecklistItem,
  clearExamChecklist,
  hydrateExamChecklist,
  addWrittenEvaluation,
  deleteWrittenEvaluation,
  clearWrittenEvaluations,
  hydrateWrittenEvaluations,
  resetLocalWorkspaceState,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
