import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type {
  PscCadreId,
  PscPrepState,
  SimulationHallType,
  SimulationRunRecord,
} from '../../types';

export type { PscPrepState, SimulationHallType, SimulationRunRecord };

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

    hydratePscPrepState(state, action: PayloadAction<Partial<PscPrepState>>) {
      if (
        action.payload.targetCadreId === 'section-officer' ||
        action.payload.targetCadreId === 'nayab-subba' ||
        action.payload.targetCadreId === 'kharidar' ||
        action.payload.targetCadreId === 'ntc-computer-engineer-7'
      ) {
        state.targetCadreId = action.payload.targetCadreId;
      }
      if (Array.isArray(action.payload.completedUnitIds)) {
        state.completedUnitIds = action.payload.completedUnitIds;
      }
      if (Array.isArray(action.payload.completedTopicIds)) {
        state.completedTopicIds = action.payload.completedTopicIds;
      }
      if (Array.isArray(action.payload.bookmarkedUnitIds)) {
        state.bookmarkedUnitIds = action.payload.bookmarkedUnitIds;
      }
      if (Array.isArray(action.payload.simulationHistory)) {
        state.simulationHistory = action.payload.simulationHistory.slice(0, 30);
      }
    },

    mergeRemoteSimulationRuns(
      state,
      action: PayloadAction<SimulationRunRecord[]>
    ) {
      const byId = new Map<string, SimulationRunRecord>();
      for (const run of state.simulationHistory) {
        byId.set(run.id, run);
      }
      for (const run of action.payload) {
        if (!byId.has(run.id)) {
          byId.set(run.id, run);
        }
      }
      state.simulationHistory = Array.from(byId.values())
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )
        .slice(0, 30);
    },

    resetLocalPscState(state) {
      state.completedUnitIds = [];
      state.completedTopicIds = [];
      state.bookmarkedUnitIds = [];
      state.simulationHistory = [];
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
  hydratePscPrepState,
  mergeRemoteSimulationRuns,
  resetLocalPscState,
} = pscSlice.actions;

export default pscSlice.reducer;
