export type ReadingMode = 'standard' | 'flipbook';

export type FitMode = 'page' | 'width' | 'custom';

export type StandardLayout = 'continuous' | 'single';

export type ThemeMode = 'light' | 'dark';

export interface ReaderState {
  currentPage: number;
  totalPages: number;
  zoom: number; // Percentage: 50 to 250
  fitMode: FitMode;
  readingMode: ReadingMode;
  standardLayout: StandardLayout;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  soundEnabled: boolean;
  isShortcutsOpen: boolean;
  isStatsOpen: boolean;
}

export interface SettingsState {
  theme: ThemeMode;
  defaultReadingMode: ReadingMode;
  defaultSoundEnabled: boolean;
}
