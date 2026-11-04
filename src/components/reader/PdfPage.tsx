import { memo, useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import {
  isRenderingCancelledError,
  renderPageToCanvas,
} from '../../services/pdfService';

interface PdfPageProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  intrinsicWidth: number;
  intrinsicHeight: number;
  eager?: boolean;
  onRegisterElement?: (pageNumber: number, el: HTMLDivElement | null) => void;
}

export const PdfPage = memo(function PdfPage({
  pdfDoc,
  pageNumber,
  scale,
  intrinsicWidth,
  intrinsicHeight,
  eager = false,
  onRegisterElement,
}: PdfPageProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(eager);
  const [isRendered, setIsRendered] = useState<boolean>(false);

  const pixelWidth = Math.max(1, Math.floor(intrinsicWidth * scale));
  const pixelHeight = Math.max(1, Math.floor(intrinsicHeight * scale));

  useEffect(() => {
    if (onRegisterElement) {
      onRegisterElement(pageNumber, wrapperRef.current);
      return () => {
        onRegisterElement(pageNumber, null);
      };
    }
  }, [pageNumber, onRegisterElement]);

  // Lazy rendering observer for large documents
  useEffect(() => {
    if (eager) {
      setIsVisible(true);
      return;
    }

    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        rootMargin: '800px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [eager]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    let cancelled = false;
    let activeTask: RenderTask | null = null;

    setIsRendered(false);

    pdfDoc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled || !canvasRef.current) {
          page.cleanup();
          return;
        }

        const viewport = page.getViewport({ scale });
        if (wrapperRef.current) {
          wrapperRef.current.style.width = `${Math.floor(viewport.width)}px`;
          wrapperRef.current.style.height = `${Math.floor(viewport.height)}px`;
        }

        activeTask = renderPageToCanvas(page, canvasRef.current, scale);
        return activeTask.promise
          .then(() => {
            if (!cancelled) {
              setIsRendered(true);
            }
          })
          .finally(() => {
            page.cleanup();
          });
      })
      .catch((err: unknown) => {
        if (!cancelled && !isRenderingCancelledError(err)) {
          // Keep page placeholder intact on transient render error
        }
      });

    return () => {
      cancelled = true;
      if (activeTask) {
        try {
          activeTask.cancel();
        } catch {
          // Ignore cancel exception
        }
      }
    };
  }, [pdfDoc, pageNumber, scale, isVisible]);

  return (
    <div
      ref={wrapperRef}
      data-page-number={pageNumber}
      style={{ width: `${pixelWidth}px`, height: `${pixelHeight}px` }}
      className="relative mx-auto bg-white shadow-sm ring-1 ring-zinc-950/8 dark:ring-white/10 select-none overflow-hidden shrink-0"
    >
      {isVisible && (
        <canvas
          ref={canvasRef}
          className={`block w-full h-full transition-opacity duration-150 ${
            isRendered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {(!isVisible || !isRendered) && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FDFCF9] dark:bg-zinc-900">
          <span className="font-mono tabular-nums text-xs text-zinc-400 dark:text-zinc-600">
            Page {pageNumber}
          </span>
        </div>
      )}
    </div>
  );
});
