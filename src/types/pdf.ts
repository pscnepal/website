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
