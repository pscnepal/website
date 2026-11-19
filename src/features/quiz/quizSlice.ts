import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type {
  QuestionOutcome,
  QuizAttemptRecord,
  QuizPlayMode,
  QuizState,
} from '../../types';

export type { QuestionOutcome, QuizAttemptRecord, QuizPlayMode, QuizState };

const initialState: QuizState = storageService.loadQuizState();

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setPreferredQuizMode(state, action: PayloadAction<QuizPlayMode>) {
      state.preferredMode = action.payload;
    },
    recordQuizAttempt(state, action: PayloadAction<QuizAttemptRecord>) {
      state.attempts = [action.payload, ...state.attempts].slice(0, 30);
    },
    mergeRemoteQuizAttempts(state, action: PayloadAction<QuizAttemptRecord[]>) {
      const byId = new Map<string, QuizAttemptRecord>();
      for (const att of state.attempts) {
        byId.set(att.id, att);
      }
      for (const att of action.payload) {
        if (!byId.has(att.id)) {
          byId.set(att.id, att);
        }
      }
      state.attempts = Array.from(byId.values())
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )
        .slice(0, 30);
    },
    clearQuizHistory(state) {
      state.attempts = [];
    },
    resetLocalQuizHistory(state) {
      state.attempts = [];
    },
    hydrateQuizPreferences(state, action: PayloadAction<QuizPlayMode>) {
      state.preferredMode = action.payload;
    },
    hydrateQuizState(state, action: PayloadAction<QuizState>) {
      state.preferredMode = action.payload.preferredMode;
      state.attempts = action.payload.attempts.slice(0, 30);
    },
  },
});

export const {
  setPreferredQuizMode,
  recordQuizAttempt,
  mergeRemoteQuizAttempts,
  clearQuizHistory,
  resetLocalQuizHistory,
  hydrateQuizPreferences,
  hydrateQuizState,
} = quizSlice.actions;

export default quizSlice.reducer;
