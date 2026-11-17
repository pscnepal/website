import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { FitMode, StandardLayout } from './reader';

export type BookSourceType = 'url' | 'local';

export type PdfErrorCode =
  | 'INVALID_URL'
  | 'CORS_OR_NETWORK'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'INVALID_PDF'
  | 'PASSWORD_REQUIRED'
  | 'PASSWORD_INCORRECT'
  | 'LOCAL_FILE_EXPIRED'
  | 'UNKNOWN';

export interface PdfErrorInfo {
  code: PdfErrorCode;
  title: string;
  message: string;
  hint?: string;
}

export interface BookMetadata {
  id: string;
  title: string;
  author?: string;
  sourceType: BookSourceType;
  url: string;
  fileName?: string;
  fileSize?: number;
  totalPages?: number;
}

export interface RecentBookEntry {
  id: string;
  title: string;
  author?: string;
  sourceType: BookSourceType;
  /** Empty string for local files when persisted across sessions */
  url: string;
  fileName?: string;
  fileSize?: number;
  lastPage: number;
  totalPages: number;
  lastOpenedAt: string;
}

export interface ReadingProgressEntry {
  lastPage: number;
  totalPages: number;
  updatedAt: string;
}

export interface BookReadingStats {
  totalReadingSeconds: number;
  pagesReadCount: number;
  pagesPerMinute: number;
  uniquePagesVisited: number[];
  sessionsCount: number;
  lastReadAt: string;
}

export interface SampleEdition {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  path: string;
  description: string;
}

export interface PdfPageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// ============================================================================
// PDF SERVICE, HOOK & COMPONENT PROPS
// ============================================================================

export interface LocalPdfSessionEntry {
  id: string;
  objectUrl: string;
  fileName: string;
  fileSize: number;
  title: string;
}

export interface LoadPdfOptions {
  url: string;
  password?: string;
  onProgress?: (loaded: number, total: number) => void;
}

export interface UsePdfDocumentParams {
  url: string | null;
  password?: string;
  retryKey: number;
}

export interface UsePdfDocumentResult {
  pdfDoc: PDFDocumentProxy | null;
  numPages: number;
  pageDimensions: PdfPageDimensions | null;
  docMetadata: { title?: string; author?: string };
  isLoading: boolean;
  progressPercent: number | null;
  error: PdfErrorInfo | null;
}

export interface PdfViewerHandle {
  scrollToPage: (pageNumber: number) => void;
}

export interface PdfViewerProps {
  pdfDoc: PDFDocumentProxy;
  totalPages: number;
  currentPage: number;
  zoom: number;
  fitMode: FitMode;
  layout: StandardLayout;
  pageDimensions: PdfPageDimensions;
  onPageInViewChange: (page: number) => void;
  onEffectiveZoomChange: (zoomPct: number) => void;
}

export interface PdfPageProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  intrinsicWidth: number;
  intrinsicHeight: number;
  eager?: boolean;
  onRegisterElement?: (pageNumber: number, el: HTMLDivElement | null) => void;
}

export interface ThumbnailSidebarProps {
  pdfDoc: PDFDocumentProxy;
  totalPages: number;
  currentPage: number;
  pageDimensions: PdfPageDimensions;
  isOpen: boolean;
  onSelectPage: (page: number) => void;
  onClose: () => void;
}

export interface ThumbnailItemProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  isActive: boolean;
  aspectRatio: number;
  onSelect: (page: number) => void;
}

export interface PdfUploadProps {
  compact?: boolean;
}

export interface PdfUrlInputProps {
  compact?: boolean;
}

export interface RecentBooksProps {
  showEmptyState?: boolean;
}
