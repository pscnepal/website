import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

export type QuizPlayMode = 'exam' | 'study';

export type QuestionOutcome = 'correct' | 'wrong' | 'skipped';

export interface QuizAttemptRecord {
  id: string;
  deckId: string;
  deckTitle: string;
  mode: QuizPlayMode;
  totalQuestions: number;
  totalMarks?: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  accuracyPercent: number;
  pscNetScore: number;
  durationSeconds: number;
  deadlineSeconds: number;
  timedOut: boolean;
  completedAt: string;
  questionOutcomes?: Record<string, QuestionOutcome>;
}

export interface QuizState {
  preferredMode: QuizPlayMode;
  attempts: QuizAttemptRecord[];
}

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
  },
});

export const {
  setPreferredQuizMode,
  recordQuizAttempt,
  mergeRemoteQuizAttempts,
  clearQuizHistory,
} = quizSlice.actions;

export default quizSlice.reducer;
