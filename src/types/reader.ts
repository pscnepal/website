import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PdfErrorInfo, PdfPageDimensions } from './pdf';

export type ReadingMode = 'standard' | 'flipbook';

export type FitMode = 'page' | 'width' | 'custom';

export type StandardLayout = 'continuous' | 'single';

export type ThemeMode = 'light' | 'dark';

export type PageSoundIntensity = 'full' | 'soft';

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

// ============================================================================
// READER COMPONENT & HOOK PROPS
// ============================================================================

export interface FlipbookViewerHandle {
  flipNext: () => void;
  flipPrev: () => void;
  goToPage: (pageNumber: number) => void;
}

export interface FlipbookViewerProps {
  pdfDoc: PDFDocumentProxy;
  totalPages: number;
  currentPage: number;
  zoom: number;
  fitMode: FitMode;
  soundEnabled: boolean;
  pageDimensions: PdfPageDimensions;
  onPageFlip: (page: number) => void;
  onEffectiveZoomChange: (zoomPct: number) => void;
}

export interface ReaderToolbarProps {
  bookTitle: string;
  materialId?: string;
  backTo?: string;
  backLabel?: string;
  currentPage: number;
  totalPages: number;
  displayZoom: number;
  fitMode: FitMode;
  readingMode: ReadingMode;
  standardLayout: StandardLayout;
  isSidebarOpen: boolean;
  soundEnabled: boolean;
  theme: ThemeMode;
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  canDownload: boolean;
  isStatsOpen: boolean;
  totalReadingSeconds: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onJumpToPage: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  onChangeMode: (mode: ReadingMode) => void;
  onChangeStandardLayout: (layout: StandardLayout) => void;
  onToggleSidebar: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onToggleFullscreen: () => void;
  onOpenShortcuts: () => void;
  onToggleStats: () => void;
  onDownload: () => void;
}

export interface ReaderErrorProps {
  error: PdfErrorInfo;
  documentUrl?: string | null;
  onRetry: () => void;
  onSubmitPassword?: (password: string) => void;
}

export interface ReaderLoadingProps {
  title?: string;
  progressPercent: number | null;
}

export interface ReadingStatsViewProps {
  open: boolean;
  bookId: string | null;
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  sessionSeconds: number;
  onResetSessionTimer?: () => void;
  onClose: () => void;
}

export interface ZoomControlsProps {
  displayZoom: number;
  fitMode: FitMode;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  showFitButtons?: boolean;
}

export interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpToPage: (page: number) => void;
}

export interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface FullscreenButtonProps {
  isFullscreen: boolean;
  isSupported: boolean;
  onToggle: () => void;
}

export interface UseReadingStatsParams {
  bookId: string | null;
  isActiveDocument: boolean;
  currentPage: number;
}

export interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToPage: () => void;
  onToggleFullscreen: () => void;
  onToggleMode: () => void;
  onToggleSound: () => void;
  onToggleStats: () => void;
  onEscapeOverlay: () => void;
}
