import type { PdfErrorInfo } from '../types/pdf';

export const MIN_ZOOM = 50;
export const MAX_ZOOM = 250;
export const ZOOM_STEP = 15;

export function clampZoom(zoom: number): number {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(zoom)));
}

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatReadingDuration(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(
      seconds
    ).padStart(2, '0')}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

export function formatCompactDuration(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

export function formatEstimatedRemaining(
  remainingPages: number,
  pagesPerMinute: number
): string {
  if (remainingPages <= 0) return 'Completed';
  if (pagesPerMinute <= 0.05) return 'Calculating pace...';
  const remainingMinutes = remainingPages / pagesPerMinute;
  if (remainingMinutes < 1) return '< 1 min left';
  if (remainingMinutes < 60) return `~${Math.ceil(remainingMinutes)} min left`;
  const hrs = Math.floor(remainingMinutes / 60);
  const mins = Math.round(remainingMinutes % 60);
  return `~${hrs}h ${mins}m left`;
}

/**
 * Translates raw PDF.js / Fetch exceptions into clear, actionable error details.
 */
export function classifyPdfError(err: unknown): PdfErrorInfo {
  const errorObj = err as {
    name?: string;
    message?: string;
    status?: number;
    code?: number;
  };
  const name = errorObj?.name ?? '';
  const message = errorObj?.message ?? String(err ?? '');
  const status = errorObj?.status;

  if (name === 'PasswordException') {
    if (errorObj?.code === 2) {
      return {
        code: 'PASSWORD_INCORRECT',
        title: 'Incorrect Password',
        message: 'The password entered for this encrypted PDF was not accepted.',
        hint: 'Double-check the document password and try again.',
      };
    }
    return {
      code: 'PASSWORD_REQUIRED',
      title: 'Password-Protected PDF',
      message: 'This PDF is encrypted and requires a password before its pages can be rendered.',
      hint: 'Enter the document password below to unlock and read it.',
    };
  }

  if (name === 'InvalidPDFException' || /invalid pdf/i.test(message)) {
    return {
      code: 'INVALID_PDF',
      title: 'Unable to Read PDF File',
      message:
        'The target resource is either not a PDF document or its internal PDF structure is corrupted.',
      hint: 'Verify that the URL points directly to a raw .pdf file rather than an HTML web page.',
    };
  }

  if (status === 404 || name === 'MissingPDFException' || /missing pdf/i.test(message)) {
    return {
      code: 'NOT_FOUND',
      title: 'Document Not Found (404)',
      message:
        'No PDF document was found at the requested address. The link may have expired or been moved.',
      hint: 'Check the URL spelling or upload a local copy from your device.',
    };
  }

  if (status === 401 || status === 403) {
    return {
      code: 'UNAUTHORIZED',
      title: 'Access Restricted by Server',
      message:
        'The remote server requires authentication or forbids direct access to this PDF document.',
      hint: 'Download the PDF in an authenticated browser tab first, then drag and drop the file into PSC Nepal.',
    };
  }

  if (
    name === 'UnknownErrorException' ||
    name === 'TypeError' ||
    /failed to fetch|networkerror|cors|load failed/i.test(message)
  ) {
    return {
      code: 'CORS_OR_NETWORK',
      title: 'Cross-Origin (CORS) or Network Restriction',
      message:
        'The browser could not fetch this PDF directly. Many servers block cross-origin requests from external web readers, or your network connection was interrupted.',
      hint: 'Download the PDF file to your computer and open it via Local PDF Upload—local files never face CORS limits.',
    };
  }

  return {
    code: 'UNKNOWN',
    title: 'Failed to Open Document',
    message:
      message || 'An unexpected error occurred while loading the PDF document.',
    hint: 'Try reloading the document or opening a local copy of the PDF.',
  };
}
