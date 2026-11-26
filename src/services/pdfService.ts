import * as pdfjsLib from 'pdfjs-dist';
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { LoadPdfOptions, LocalPdfSessionEntry } from '../types/pdf';
import {
  cachePdfFromUrl,
  cacheStudyPackPdfs,
  containsPdfHeader,
  getLocalPdfSessionEntry,
  getOfflinePdfBytes,
  registerLocalPdfFile,
  restoreLocalPdfFromIndexedDB,
  revokeAllLocalPdfFiles,
} from './pdfLocalCacheService';

export type { LoadPdfOptions, LocalPdfSessionEntry };
export {
  cachePdfFromUrl,
  cacheStudyPackPdfs,
  getLocalPdfSessionEntry,
  getOfflinePdfBytes,
  registerLocalPdfFile,
  restoreLocalPdfFromIndexedDB,
  revokeAllLocalPdfFiles,
};

// Configure PDF.js worker once for the entire client session
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function createNamedStatusError(
  name: string,
  message: string,
  status?: number
): Error & { status?: number } {
  const error = new Error(message) as Error & { status?: number };
  error.name = name;
  if (typeof status === 'number') {
    error.status = status;
  }
  return error;
}

/**
 * Fetches a PDF document (typically via same-origin `/api/pdf-proxy`) with streaming
 * progress updates and strict `%PDF-` signature validation.
 */
export async function fetchPdfBytesWithProgress(
  fetchUrl: string,
  onProgress?: (loaded: number, total: number) => void,
  signal?: AbortSignal
): Promise<Uint8Array> {
  const response = await fetch(fetchUrl, {
    credentials: 'same-origin',
    signal,
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 401 || response.status === 403) {
      throw createNamedStatusError(
        response.status === 404 ? 'MissingPDFException' : 'UnexpectedResponseException',
        `Remote server responded with HTTP ${response.status}.`,
        response.status
      );
    }
    throw createNamedStatusError(
      'ProxyUnavailableError',
      `Failed to fetch PDF (${response.status}).`,
      response.status
    );
  }

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('text/html') || contentType.includes('application/json')) {
    throw createNamedStatusError(
      'ProxyUnavailableError',
      'PDF proxy endpoint did not return a PDF stream.'
    );
  }

  const totalBytes = Number(response.headers.get('content-length')) || 0;
  if (!response.body) {
    const buffer = new Uint8Array(await response.arrayBuffer());
    if (!containsPdfHeader(buffer)) {
      throw createNamedStatusError('InvalidPDFException', 'Invalid PDF header.');
    }
    onProgress?.(buffer.byteLength, buffer.byteLength);
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value || value.byteLength === 0) continue;

    if (chunks.length === 0 && !containsPdfHeader(value) && !contentType.includes('pdf')) {
      await reader.cancel().catch(() => {});
      throw createNamedStatusError('InvalidPDFException', 'The target file is not a valid PDF.');
    }

    chunks.push(value);
    loaded += value.byteLength;
    if (totalBytes > 0) {
      onProgress?.(loaded, totalBytes);
    }
  }

  const merged = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  if (!containsPdfHeader(merged)) {
    throw createNamedStatusError('InvalidPDFException', 'Invalid PDF structure.');
  }

  return merged;
}

export function createPdfLoadingTask({
  url,
  data,
  password,
  onProgress,
}: LoadPdfOptions): PDFDocumentLoadingTask {
  const loadingTask = pdfjsLib.getDocument({
    ...(data ? { data } : { url }),
    password: password || undefined,
    cMapPacked: true,
    enableXfa: false,
  });

  if (onProgress) {
    loadingTask.onProgress = (progressData: { loaded: number; total: number }) => {
      onProgress(progressData.loaded, progressData.total);
    };
  }

  return loadingTask;
}

export async function extractPdfMetadata(
  pdfDoc: PDFDocumentProxy
): Promise<{ title?: string; author?: string }> {
  try {
    const meta = await pdfDoc.getMetadata();
    const info = meta?.info as Record<string, unknown> | undefined;
    const rawTitle = typeof info?.Title === 'string' ? info.Title.trim() : '';
    const rawAuthor = typeof info?.Author === 'string' ? info.Author.trim() : '';
    return {
      title: rawTitle || undefined,
      author: rawAuthor || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Renders a PDF page into a target HTMLCanvasElement at crisp HiDPI resolution.
 * Returns the RenderTask so callers can cancel in-flight renders on zoom/unmount.
 */
export function renderPageToCanvas(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  cssScale: number,
  maxPixelRatio = 2.25
) {
  const viewport = page.getViewport({ scale: cssScale });
  const outputScale = Math.min(
    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    maxPixelRatio
  );

  canvas.width = Math.max(1, Math.floor(viewport.width * outputScale));
  canvas.height = Math.max(1, Math.floor(viewport.height * outputScale));
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable.');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

  return page.render({
    canvasContext: ctx,
    canvas,
    viewport,
    transform,
  });
}

/**
 * Renders a single PDF page to a Blob Object URL for use inside StPageFlip
 * HTML pages (so DOM cloneNode during soft page curls preserves crisp pixels).
 */
export async function renderPageToObjectUrl(
  pdfDoc: PDFDocumentProxy,
  pageNumber: number,
  targetPixelWidth: number,
  signal?: { cancelled: boolean }
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  if (signal?.cancelled) {
    throw new Error('Cancelled');
  }

  const baseViewport = page.getViewport({ scale: 1 });
  const dpr = Math.min(
    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    2
  );
  const desiredWidth = Math.max(360, Math.min(2000, targetPixelWidth * dpr));
  const scale = desiredWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = Math.max(1, Math.floor(viewport.width));
  offscreenCanvas.height = Math.max(1, Math.floor(viewport.height));

  const ctx = offscreenCanvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Unable to initialize offscreen 2D canvas.');
  }

  ctx.fillStyle = '#fdfcf9';
  ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  const renderTask = page.render({
    canvasContext: ctx,
    canvas: offscreenCanvas,
    viewport,
  });

  try {
    await renderTask.promise;
  } finally {
    page.cleanup();
  }

  if (signal?.cancelled) {
    offscreenCanvas.width = 0;
    offscreenCanvas.height = 0;
    throw new Error('Cancelled');
  }

  return new Promise<string>((resolve, reject) => {
    offscreenCanvas.toBlob(
      (blob) => {
        offscreenCanvas.width = 0;
        offscreenCanvas.height = 0;
        if (!blob) {
          reject(new Error('Failed to encode rendered PDF page.'));
          return;
        }
        resolve(URL.createObjectURL(blob));
      },
      'image/jpeg',
      0.92
    );
  });
}

export function isRenderingCancelledError(err: unknown): boolean {
  const name = (err as { name?: string })?.name;
  const message = (err as { message?: string })?.message ?? '';
  return (
    name === 'RenderingCancelledException' ||
    message === 'Cancelled' ||
    /rendering cancelled/i.test(message)
  );
}
