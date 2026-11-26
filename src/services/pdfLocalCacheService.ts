import type { LocalPdfSessionEntry } from '../types/pdf';
import {
  createBookIdFromLocalFile,
  createBookIdFromUrl,
  deriveTitleFromSource,
  getLocalFallbackPdfUrl,
  getProxyPdfUrl,
  isExternalHttpUrl,
  shouldPreferProxyForUrl,
} from '../utils/urlHelpers';
import { offlineDbService } from './offlineDbService';

export type { LocalPdfSessionEntry };

const localFileRegistry = new Map<string, LocalPdfSessionEntry>();

export function containsPdfHeader(bytes: Uint8Array): boolean {
  const limit = Math.min(bytes.byteLength, 1024);
  if (limit < 5) return false;
  const header = new TextDecoder('ascii').decode(bytes.subarray(0, limit));
  return header.includes('%PDF-');
}

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

export function getLocalPdfSessionEntry(
  id: string
): LocalPdfSessionEntry | undefined {
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

  const candidates: string[] = [];
  if (isExternalHttpUrl(url)) {
    if (shouldPreferProxyForUrl(url)) {
      candidates.push(getProxyPdfUrl(url));
      const localFallback = getLocalFallbackPdfUrl(url);
      if (localFallback) candidates.push(localFallback);
      candidates.push(url);
    } else {
      candidates.push(url, getProxyPdfUrl(url));
      const localFallback = getLocalFallbackPdfUrl(url);
      if (localFallback) candidates.push(localFallback);
    }
  } else {
    candidates.push(url);
  }

  for (const candidateUrl of candidates) {
    try {
      const response = await fetch(candidateUrl, { credentials: 'same-origin' });
      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        continue;
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength < 16) {
        continue;
      }

      const bytes = new Uint8Array(buffer);
      if (!containsPdfHeader(bytes) && !contentType.includes('pdf')) {
        continue;
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

      if (saved) {
        return { id, fileSize: buffer.byteLength };
      }
    } catch {
      // Try next candidate URL
    }
  }

  return null;
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

  const candidateId =
    urlOrId.startsWith('http') || urlOrId.startsWith('/')
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
