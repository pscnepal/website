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
  },
});

export const {
  setTheme,
  toggleTheme,
  setDefaultReadingMode,
  setDefaultSoundEnabled,
} = settingsSlice.actions;

export default settingsSlice.reducer;
