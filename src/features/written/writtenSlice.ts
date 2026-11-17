import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type {
  WrittenLanguageMode,
  WrittenMasteryStatus,
  WrittenQuestionProgress,
  WrittenState,
} from '../../types';

export type {
  WrittenLanguageMode,
  WrittenMasteryStatus,
  WrittenQuestionProgress,
  WrittenState,
};

function getOrCreateRecord(
  records: Record<string, WrittenQuestionProgress>,
  questionId: string
): WrittenQuestionProgress {
  return (
    records[questionId] ?? {
      questionId,
      status: 'unseen',
      checkedRubricIndices: [],
      draftAnswer: '',
      timeSpentSeconds: 0,
      updatedAt: new Date().toISOString(),
    }
  );
}

const initialState: WrittenState = storageService.loadWrittenState();

const writtenSlice = createSlice({
  name: 'written',
  initialState,
  reducers: {
    setPreferredWrittenLanguage(
      state,
      action: PayloadAction<WrittenLanguageMode>
    ) {
      state.preferredLanguage = action.payload;
    },

    saveWrittenDraft(
      state,
      action: PayloadAction<{ questionId: string; draftAnswer: string }>
    ) {
      const { questionId, draftAnswer } = action.payload;
      const record = getOrCreateRecord(state.records, questionId);
      record.draftAnswer = draftAnswer;
      if (draftAnswer.trim().length > 0 && record.status === 'unseen') {
        record.status = 'practicing';
      }
      record.updatedAt = new Date().toISOString();
      state.records[questionId] = record;
    },

    toggleWrittenRubricPoint(
      state,
      action: PayloadAction<{ questionId: string; rubricIndex: number }>
    ) {
      const { questionId, rubricIndex } = action.payload;
      const record = getOrCreateRecord(state.records, questionId);
      const exists = record.checkedRubricIndices.includes(rubricIndex);
      if (exists) {
        record.checkedRubricIndices = record.checkedRubricIndices.filter(
          (idx) => idx !== rubricIndex
        );
      } else {
        record.checkedRubricIndices = [
          ...record.checkedRubricIndices,
          rubricIndex,
        ].sort((a, b) => a - b);
        if (record.status === 'unseen') {
          record.status = 'practicing';
        }
      }
      record.updatedAt = new Date().toISOString();
      state.records[questionId] = record;
    },

    setWrittenQuestionStatus(
      state,
      action: PayloadAction<{
        questionId: string;
        status: WrittenMasteryStatus;
      }>
    ) {
      const { questionId, status } = action.payload;
      const record = getOrCreateRecord(state.records, questionId);
      record.status = status;
      record.updatedAt = new Date().toISOString();
      state.records[questionId] = record;
    },

    addWrittenPracticeSeconds(
      state,
      action: PayloadAction<{ questionId: string; seconds: number }>
    ) {
      const { questionId, seconds } = action.payload;
      if (seconds <= 0) return;
      const record = getOrCreateRecord(state.records, questionId);
      record.timeSpentSeconds += seconds;
      if (record.status === 'unseen') {
        record.status = 'practicing';
      }
      record.updatedAt = new Date().toISOString();
      state.records[questionId] = record;
    },

    clearWrittenProgress(state) {
      state.records = {};
    },

    hydrateWrittenState(
      state,
      action: PayloadAction<{
        preferredLanguage?: WrittenLanguageMode;
        records?: Record<string, WrittenQuestionProgress>;
      }>
    ) {
      if (action.payload.preferredLanguage) {
        state.preferredLanguage = action.payload.preferredLanguage;
      }
      if (action.payload.records) {
        state.records = action.payload.records;
      }
    },

    resetLocalWrittenState(state) {
      state.records = {};
    },
  },
});

export const {
  setPreferredWrittenLanguage,
  saveWrittenDraft,
  toggleWrittenRubricPoint,
  setWrittenQuestionStatus,
  addWrittenPracticeSeconds,
  clearWrittenProgress,
  hydrateWrittenState,
  resetLocalWrittenState,
} = writtenSlice.actions;

export default writtenSlice.reducer;
