import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

export type WrittenLanguageMode = 'bilingual' | 'en' | 'ne';
export type WrittenMasteryStatus = 'unseen' | 'practicing' | 'mastered';

export interface WrittenQuestionProgress {
  questionId: string;
  status: WrittenMasteryStatus;
  checkedRubricIndices: number[];
  draftAnswer: string;
  timeSpentSeconds: number;
  updatedAt: string;
}

export interface WrittenState {
  preferredLanguage: WrittenLanguageMode;
  records: Record<string, WrittenQuestionProgress>;
}

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
  },
});

export const {
  setPreferredWrittenLanguage,
  saveWrittenDraft,
  toggleWrittenRubricPoint,
  setWrittenQuestionStatus,
  addWrittenPracticeSeconds,
  clearWrittenProgress,
} = writtenSlice.actions;

export default writtenSlice.reducer;
