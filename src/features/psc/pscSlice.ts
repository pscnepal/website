import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PscCadreId } from '../../data/pscSyllabusData';
import { storageService } from '../../services/storageService';

export type SimulationHallType = 'omr-hall' | 'written-hall';

export interface SimulationRunRecord {
  id: string;
  presetId: string;
  presetTitle: string;
  cadreId: PscCadreId;
  simulationType: SimulationHallType;
  fullMarks: number;
  passMarks: number;
  grossMarks: number;
  negativeDeduction: number;
  netMarks: number;
  percentage: number;
  passed: boolean;
  totalItems: number;
  attemptedItems: number;
  correctItems: number;
  wrongItems: number;
  durationSeconds: number;
  allocatedSeconds: number;
  rollNumber: string;
  bookletKey: 'A' | 'B' | 'C' | 'D';
  completedAt: string;
}

export interface PscPrepState {
  targetCadreId: PscCadreId;
  completedUnitIds: string[];
  completedTopicIds: string[];
  bookmarkedUnitIds: string[];
  simulationHistory: SimulationRunRecord[];
}

const initialState: PscPrepState = storageService.loadPscPrepState();

const pscSlice = createSlice({
  name: 'psc',
  initialState,
  reducers: {
    setTargetCadre(state, action: PayloadAction<PscCadreId>) {
      state.targetCadreId = action.payload;
    },

    toggleSyllabusUnitCompleted(state, action: PayloadAction<string>) {
      const unitId = action.payload;
      if (state.completedUnitIds.includes(unitId)) {
        state.completedUnitIds = state.completedUnitIds.filter(
          (id) => id !== unitId
        );
      } else {
        state.completedUnitIds.push(unitId);
      }
    },

    setPaperUnitsCompleted(
      state,
      action: PayloadAction<{ unitIds: string[]; completed: boolean }>
    ) {
      const { unitIds, completed } = action.payload;
      const targetSet = new Set(unitIds);
      if (completed) {
        const merged = new Set([...state.completedUnitIds, ...unitIds]);
        state.completedUnitIds = Array.from(merged);
      } else {
        state.completedUnitIds = state.completedUnitIds.filter(
          (id) => !targetSet.has(id)
        );
      }
    },

    toggleSyllabusTopicCompleted(state, action: PayloadAction<string>) {
      const topicId = action.payload;
      if (state.completedTopicIds.includes(topicId)) {
        state.completedTopicIds = state.completedTopicIds.filter(
          (id) => id !== topicId
        );
      } else {
        state.completedTopicIds.push(topicId);
      }
    },

    setSyllabusTopicsCompleted(
      state,
      action: PayloadAction<{ topicIds: string[]; completed: boolean }>
    ) {
      const { topicIds, completed } = action.payload;
      const targetSet = new Set(topicIds);
      if (completed) {
        const merged = new Set([...state.completedTopicIds, ...topicIds]);
        state.completedTopicIds = Array.from(merged);
      } else {
        state.completedTopicIds = state.completedTopicIds.filter(
          (id) => !targetSet.has(id)
        );
      }
    },

    toggleSyllabusUnitBookmarked(state, action: PayloadAction<string>) {
      const unitId = action.payload;
      if (state.bookmarkedUnitIds.includes(unitId)) {
        state.bookmarkedUnitIds = state.bookmarkedUnitIds.filter(
          (id) => id !== unitId
        );
      } else {
        state.bookmarkedUnitIds.push(unitId);
      }
    },

    recordSimulationRun(state, action: PayloadAction<SimulationRunRecord>) {
      state.simulationHistory = [
        action.payload,
        ...state.simulationHistory,
      ].slice(0, 30);
    },

    clearSimulationHistory(state) {
      state.simulationHistory = [];
    },

    clearPscSyllabusProgress(state) {
      state.completedUnitIds = [];
      state.completedTopicIds = [];
      state.bookmarkedUnitIds = [];
    },
  },
});

export const {
  setTargetCadre,
  toggleSyllabusUnitCompleted,
  setPaperUnitsCompleted,
  toggleSyllabusTopicCompleted,
  setSyllabusTopicsCompleted,
  toggleSyllabusUnitBookmarked,
  recordSimulationRun,
  clearSimulationHistory,
  clearPscSyllabusProgress,
} = pscSlice.actions;

export default pscSlice.reducer;
