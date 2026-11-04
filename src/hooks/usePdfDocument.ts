import { useEffect, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import {
  createPdfLoadingTask,
  extractPdfMetadata,
  isRenderingCancelledError,
} from '../services/pdfService';
import type { PdfErrorInfo, PdfPageDimensions } from '../types/pdf';
import { classifyPdfError } from '../utils/pdfHelpers';

interface UsePdfDocumentParams {
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
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let loadedDocument: PDFDocumentProxy | null = null;

    setIsLoading(true);
    setProgressPercent(null);
    setError(null);
    setPdfDoc(null);
    setNumPages(0);
    setPageDimensions(null);

    try {
      loadingTask = createPdfLoadingTask({
        url,
        password,
        onProgress: (loaded, total) => {
          if (isCancelled) return;
          if (total > 0) {
            const pct = Math.min(99, Math.round((loaded / total) * 100));
            setProgressPercent(pct);
          }
        },
      });
    } catch (syncErr) {
      setError(classifyPdfError(syncErr));
      setIsLoading(false);
      return;
    }

    loadingTask.promise
      .then(async (doc) => {
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
      })
      .catch((err: unknown) => {
        if (isCancelled || isRenderingCancelledError(err)) return;
        const name = (err as { name?: string })?.name;
        if (name === 'AbortException') return;

        setError(classifyPdfError(err));
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
      if (loadedDocument) {
        loadedDocument.cleanup().catch(() => {
          // Ignore document cleanup errors
        });
      }
      if (loadingTask) {
        loadingTask.destroy().catch(() => {
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
