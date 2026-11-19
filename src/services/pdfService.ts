import * as pdfjsLib from 'pdfjs-dist';
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { LoadPdfOptions, LocalPdfSessionEntry } from '../types/pdf';
import {
  createBookIdFromLocalFile,
  createBookIdFromUrl,
  deriveTitleFromSource,
} from '../utils/urlHelpers';
import { offlineDbService } from './offlineDbService';

export type { LoadPdfOptions, LocalPdfSessionEntry };

// Configure PDF.js worker once for the entire client session
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const localFileRegistry = new Map<string, LocalPdfSessionEntry>();

/**
 * Registers a user-uploaded PDF File in session memory using an Object URL
 * AND persists its ArrayBuffer in IndexedDB so it stays readable offline across reloads.
 */
export function registerLocalPdfFile(file: File): LocalPdfSessionEntry {
  const id = createBookIdFromLocalFile(file.name, file.size);
  const existing = localFileRegistry.get(id);
  if (existing) {
    URL.revokeObjectURL(existing.objectUrl);
  }

  const objectUrl = URL.createObjectURL(file);
  const entry: LocalPdfSessionEntry = {
    id,
    objectUrl,
    fileName: file.name,
    fileSize: file.size,
    title: deriveTitleFromSource(file.name),
  };

  localFileRegistry.set(id, entry);

  // Persist binary to IndexedDB asynchronously (never blocks synchronous upload UX)
  void file
    .arrayBuffer()
    .then((buffer) =>
      offlineDbService.savePdfRecord({
        id,
        title: entry.title,
        sourceType: 'local',
        fileName: file.name,
        fileSize: file.size,
        data: buffer,
        savedAt: new Date().toISOString(),
      })
    )
    .catch(() => {
      // Ignore IndexedDB quota / private mode failures
    });

  return entry;
}

export function getLocalPdfSessionEntry(id: string): LocalPdfSessionEntry | undefined {
  return localFileRegistry.get(id);
}

/**
 * Restores a previously uploaded local PDF from IndexedDB after page reload or PWA restart.
 */
export async function restoreLocalPdfFromIndexedDB(
  id: string
): Promise<LocalPdfSessionEntry | null> {
  const existing = localFileRegistry.get(id);
  if (existing) {
    return existing;
  }

  const record = await offlineDbService.getPdfRecordById(id);
  if (!record || !record.data) {
    return null;
  }

  const blob = new Blob([record.data], { type: 'application/pdf' });
  const objectUrl = URL.createObjectURL(blob);
  const entry: LocalPdfSessionEntry = {
    id: record.id,
    objectUrl,
    fileName: record.fileName || `${record.title}.pdf`,
    fileSize: record.fileSize || record.data.byteLength,
    title: record.title,
  };
  localFileRegistry.set(id, entry);
  return entry;
}

export function revokeAllLocalPdfFiles(): void {
  for (const entry of localFileRegistry.values()) {
    URL.revokeObjectURL(entry.objectUrl);
  }
  localFileRegistry.clear();
}

/**
 * Fetches a PDF URL and stores its binary payload in IndexedDB for true offline access.
 */
export async function cachePdfFromUrl(
  url: string,
  meta?: { id?: string; title?: string }
): Promise<{ id: string; fileSize: number } | null> {
  if (typeof window === 'undefined' || !url || url.startsWith('blob:')) {
    return null;
  }

  const id = meta?.id?.trim() || createBookIdFromUrl(url);
  const existing = await offlineDbService.getPdfRecordById(id);
  if (existing && existing.data?.byteLength > 0) {
    return { id: existing.id, fileSize: existing.fileSize };
  }

  try {
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength < 16) {
      return null;
    }

    // Verify PDF signature (%PDF-) so SPA HTML fallback pages are never mistakenly cached
    const header = new TextDecoder('ascii').decode(buffer.slice(0, 5));
    if (!header.startsWith('%PDF-') && !contentType.includes('pdf')) {
      return null;
    }

    const saved = await offlineDbService.savePdfRecord({
      id,
      title: meta?.title?.trim() || deriveTitleFromSource(url),
      sourceType: 'url',
      url,
      fileSize: buffer.byteLength,
      data: buffer,
      savedAt: new Date().toISOString(),
    });

    return saved ? { id, fileSize: buffer.byteLength } : null;
  } catch {
    return null;
  }
}

export async function cacheStudyPackPdfs(
  items: Array<{ url: string; id?: string; title: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<{ cached: number; skippedOrFailed: number }> {
  let completed = 0;
  let cached = 0;
  let skippedOrFailed = 0;
  const total = items.length;
  const CONCURRENCY = 3;

  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (item) => {
        const res = await cachePdfFromUrl(item.url, {
          id: item.id,
          title: item.title,
        });
        if (res) {
          cached++;
        } else {
          skippedOrFailed++;
        }
        completed++;
        onProgress?.(completed, total);
      })
    );
  }

  return { cached, skippedOrFailed };
}

/**
 * Returns a fresh cloned Uint8Array copy of an offline-cached PDF for PDF.js worker safety.
 */
export async function getOfflinePdfBytes(
  urlOrId: string
): Promise<Uint8Array | null> {
  if (!urlOrId) return null;

  const candidateId = urlOrId.startsWith('http') || urlOrId.startsWith('/')
    ? createBookIdFromUrl(urlOrId)
    : urlOrId;

  let record = await offlineDbService.getPdfRecordById(candidateId);
  if (!record && (urlOrId.startsWith('http') || urlOrId.startsWith('/'))) {
    record = await offlineDbService.getPdfRecordByUrl(urlOrId);
  }

  if (!record || !record.data) {
    return null;
  }

  return new Uint8Array(record.data.slice(0));
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
