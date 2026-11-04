import * as pdfjsLib from 'pdfjs-dist';
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { createBookIdFromLocalFile, deriveTitleFromSource } from '../utils/urlHelpers';

// Configure PDF.js worker once for the entire client session
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface LocalPdfSessionEntry {
  id: string;
  objectUrl: string;
  fileName: string;
  fileSize: number;
  title: string;
}

const localFileRegistry = new Map<string, LocalPdfSessionEntry>();

/**
 * Registers a user-uploaded PDF File in session memory using an Object URL.
 * Keeps non-serializable File/Blob instances out of Redux state.
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
  return entry;
}

export function getLocalPdfSessionEntry(id: string): LocalPdfSessionEntry | undefined {
  return localFileRegistry.get(id);
}

export function revokeAllLocalPdfFiles(): void {
  for (const entry of localFileRegistry.values()) {
    URL.revokeObjectURL(entry.objectUrl);
  }
  localFileRegistry.clear();
}

export interface LoadPdfOptions {
  url: string;
  password?: string;
  onProgress?: (loaded: number, total: number) => void;
}

export function createPdfLoadingTask({
  url,
  password,
  onProgress,
}: LoadPdfOptions): PDFDocumentLoadingTask {
  const loadingTask = pdfjsLib.getDocument({
    url,
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
