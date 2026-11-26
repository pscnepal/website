import { useEffect, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import {
  cachePdfFromUrl,
  createPdfLoadingTask,
  extractPdfMetadata,
  fetchPdfBytesWithProgress,
  getOfflinePdfBytes,
  isRenderingCancelledError,
} from '../services/pdfService';
import type {
  PdfErrorInfo,
  PdfPageDimensions,
  UsePdfDocumentParams,
  UsePdfDocumentResult,
} from '../types/pdf';
import { classifyPdfError } from '../utils/pdfHelpers';
import {
  getLocalFallbackPdfUrl,
  getProxyPdfUrl,
  isExternalHttpUrl,
  shouldPreferProxyForUrl,
} from '../utils/urlHelpers';

export type { UsePdfDocumentParams, UsePdfDocumentResult };

function isCorsOrProxyRecoverableError(err: unknown): boolean {
  const errObj = err as { name?: string; message?: string; status?: number };
  const name = errObj?.name ?? '';
  const status = errObj?.status;
  if (
    name === 'PasswordException' ||
    name === 'AbortException' ||
    isRenderingCancelledError(err)
  ) {
    return false;
  }
  if (status === 401 || status === 403 || status === 404) {
    return false;
  }
  if (name === 'InvalidPDFException') {
    return false;
  }
  return true;
}

export function usePdfDocument({
  url,
  password,
  retryKey,
}: UsePdfDocumentParams): UsePdfDocumentResult {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageDimensions, setPageDimensions] = useState<PdfPageDimensions | null>(
    null
  );
  const [docMetadata, setDocMetadata] = useState<{
    title?: string;
    author?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(url));
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const [error, setError] = useState<PdfErrorInfo | null>(null);

  useEffect(() => {
    if (!url) {
      setPdfDoc(null);
      setNumPages(0);
      setPageDimensions(null);
      setDocMetadata({});
      setIsLoading(false);
      setProgressPercent(null);
      setError(null);
      return;
    }

    let isCancelled = false;
    let activeLoadingTask: PDFDocumentLoadingTask | null = null;
    let loadedDocument: PDFDocumentProxy | null = null;
    const proxyAbortController = new AbortController();

    setIsLoading(true);
    setProgressPercent(null);
    setError(null);
    setPdfDoc(null);
    setNumPages(0);
    setPageDimensions(null);

    const finalizeDocument = async (
      doc: PDFDocumentProxy,
      fromOfflineCache: boolean
    ) => {
      if (isCancelled) {
        await doc.cleanup();
        await doc.loadingTask.destroy();
        return;
      }

      loadedDocument = doc;
      if (doc.numPages < 1) {
        await doc.cleanup();
        await doc.loadingTask.destroy();
        loadedDocument = null;
        if (!isCancelled) {
          setError({
            code: 'INVALID_PDF',
            title: 'Empty PDF Document',
            message: 'This PDF file contains zero readable pages.',
          });
          setIsLoading(false);
        }
        return;
      }

      const [firstPage, meta] = await Promise.all([
        doc.getPage(1),
        extractPdfMetadata(doc),
      ]);

      if (isCancelled) {
        firstPage.cleanup();
        await doc.cleanup();
        await doc.loadingTask.destroy();
        loadedDocument = null;
        return;
      }

      const viewport = firstPage.getViewport({ scale: 1 });
      const width = Math.max(1, viewport.width);
      const height = Math.max(1, viewport.height);
      firstPage.cleanup();

      setPageDimensions({
        width,
        height,
        aspectRatio: width / height,
      });
      setDocMetadata(meta);
      setNumPages(doc.numPages);
      setPdfDoc(doc);
      setProgressPercent(100);
      setIsLoading(false);

      // Silently cache loaded same-origin PDFs into IndexedDB so they remain available offline
      if (
        !fromOfflineCache &&
        typeof window !== 'undefined' &&
        !url.startsWith('blob:') &&
        (url.startsWith(window.location.origin) || url.startsWith('/'))
      ) {
        void cachePdfFromUrl(url, { title: meta.title });
      }
    };

    const loadDirectFromUrl = async (targetUrl: string): Promise<PDFDocumentProxy> => {
      const task = createPdfLoadingTask({
        url: targetUrl,
        password,
        onProgress: (loaded, total) => {
          if (isCancelled) return;
          if (total > 0) {
            const pct = Math.min(99, Math.round((loaded / total) * 100));
            setProgressPercent(pct);
          }
        },
      });
      activeLoadingTask = task;
      return task.promise;
    };

    const loadViaProxy = async (targetUrl: string): Promise<PDFDocumentProxy> => {
      const bytes = await fetchPdfBytesWithProgress(
        getProxyPdfUrl(targetUrl),
        (loaded, total) => {
          if (isCancelled) return;
          if (total > 0) {
            const pct = Math.min(99, Math.round((loaded / total) * 100));
            setProgressPercent(pct);
          }
        },
        proxyAbortController.signal
      );
      if (isCancelled) {
        throw new Error('Cancelled');
      }
      const task = createPdfLoadingTask({
        data: bytes,
        password,
      });
      activeLoadingTask = task;
      return task.promise;
    };

    const loadDocument = async () => {
      const isOffline =
        typeof navigator !== 'undefined' && navigator.onLine === false;

      // Prefer IndexedDB cached bytes immediately when offline or for blob-less local recovery
      const cachedBytes = await getOfflinePdfBytes(url);
      if (isCancelled) return;

      if (cachedBytes && isOffline) {
        const offlineTask = createPdfLoadingTask({
          data: cachedBytes,
          password,
        });
        activeLoadingTask = offlineTask;
        const doc = await offlineTask.promise;
        await finalizeDocument(doc, true);
        return;
      }

      const external = isExternalHttpUrl(url);
      const localFallbackUrl = external ? getLocalFallbackPdfUrl(url) : null;

      try {
        let doc: PDFDocumentProxy;

        if (external && shouldPreferProxyForUrl(url)) {
          try {
            doc = await loadViaProxy(url);
          } catch (proxyErr: unknown) {
            if (isCancelled || isRenderingCancelledError(proxyErr)) return;
            const proxyErrName = (proxyErr as { name?: string })?.name;
            if (proxyErrName === 'AbortError' || proxyErrName === 'AbortException') return;
            if (proxyErrName === 'PasswordException') throw proxyErr;

            if (localFallbackUrl) {
              doc = await loadDirectFromUrl(localFallbackUrl);
            } else if (isCorsOrProxyRecoverableError(proxyErr)) {
              doc = await loadDirectFromUrl(url);
            } else {
              throw proxyErr;
            }
          }
        } else if (external) {
          try {
            doc = await loadDirectFromUrl(url);
          } catch (directErr: unknown) {
            if (isCancelled || isRenderingCancelledError(directErr)) return;
            const directName = (directErr as { name?: string })?.name;
            if (directName === 'AbortException') return;

            if (isCorsOrProxyRecoverableError(directErr)) {
              try {
                doc = await loadViaProxy(url);
              } catch (proxyErr: unknown) {
                if (isCancelled || isRenderingCancelledError(proxyErr)) return;
                const proxyName = (proxyErr as { name?: string })?.name;
                if (proxyName === 'AbortError' || proxyName === 'AbortException') return;
                if (proxyName === 'PasswordException') throw proxyErr;
                if (localFallbackUrl) {
                  doc = await loadDirectFromUrl(localFallbackUrl);
                } else {
                  throw directErr;
                }
              }
            } else if (localFallbackUrl) {
              doc = await loadDirectFromUrl(localFallbackUrl);
            } else {
              throw directErr;
            }
          }
        } else {
          doc = await loadDirectFromUrl(url);
        }

        await finalizeDocument(doc, false);
      } catch (networkErr: unknown) {
        if (isCancelled || isRenderingCancelledError(networkErr)) return;
        const name = (networkErr as { name?: string })?.name;
        if (name === 'AbortException' || name === 'AbortError') return;

        // Do not swallow password prompts with cached copy if same password applies; otherwise try cached fallback
        if (name !== 'PasswordException' && cachedBytes) {
          const fallbackTask = createPdfLoadingTask({
            data: cachedBytes,
            password,
          });
          activeLoadingTask = fallbackTask;
          const doc = await fallbackTask.promise;
          await finalizeDocument(doc, true);
          return;
        }

        throw networkErr;
      }
    };

    loadDocument().catch((err: unknown) => {
      if (isCancelled || isRenderingCancelledError(err)) return;
      const name = (err as { name?: string })?.name;
      if (name === 'AbortException' || name === 'AbortError') return;

      setError(classifyPdfError(err));
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
      proxyAbortController.abort();
      if (loadedDocument) {
        loadedDocument.cleanup().catch(() => {
          // Ignore document cleanup errors
        });
      }
      if (activeLoadingTask) {
        activeLoadingTask.destroy().catch(() => {
          // Ignore task teardown errors
        });
      }
    };
  }, [url, password, retryKey]);

  return {
    pdfDoc,
    numPages,
    pageDimensions,
    docMetadata,
    isLoading,
    progressPercent,
    error,
  };
}
