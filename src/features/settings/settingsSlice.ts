import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import type { ReadingMode, SettingsState, ThemeMode } from '../../types/reader';

const initialState: SettingsState = storageService.loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setDefaultReadingMode(state, action: PayloadAction<ReadingMode>) {
      state.defaultReadingMode = action.payload;
    },
    setDefaultSoundEnabled(state, action: PayloadAction<boolean>) {
      state.defaultSoundEnabled = action.payload;
    },
    hydrateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      if (action.payload.theme === 'light' || action.payload.theme === 'dark') {
        state.theme = action.payload.theme;
      }
      if (
        action.payload.defaultReadingMode === 'standard' ||
        action.payload.defaultReadingMode === 'flipbook'
      ) {
        state.defaultReadingMode = action.payload.defaultReadingMode;
      }
      if (typeof action.payload.defaultSoundEnabled === 'boolean') {
        state.defaultSoundEnabled = action.payload.defaultSoundEnabled;
      }
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setDefaultReadingMode,
  setDefaultSoundEnabled,
  hydrateSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
