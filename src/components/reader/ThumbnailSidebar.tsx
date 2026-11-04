import { memo, useEffect, useRef, useState } from 'react';
import { PanelLeftClose, X } from 'lucide-react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import {
  isRenderingCancelledError,
  renderPageToCanvas,
} from '../../services/pdfService';
import type { PdfPageDimensions } from '../../types/pdf';

interface ThumbnailSidebarProps {
  pdfDoc: PDFDocumentProxy;
  totalPages: number;
  currentPage: number;
  pageDimensions: PdfPageDimensions;
  isOpen: boolean;
  onSelectPage: (page: number) => void;
  onClose: () => void;
}

interface ThumbnailItemProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  isActive: boolean;
  aspectRatio: number;
  onSelect: (page: number) => void;
}

const ThumbnailItem = memo(function ThumbnailItem({
  pdfDoc,
  pageNumber,
  isActive,
  aspectRatio,
  onSelect,
}: ThumbnailItemProps) {
  const itemRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inView, setInView] = useState(false);
  const [rendered, setRendered] = useState(false);

  const thumbWidth = 124;
  const thumbHeight = Math.max(80, Math.round(thumbWidth / aspectRatio));

  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isActive]);

  useEffect(() => {
    const el = itemRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '260px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || rendered || !canvasRef.current) return;

    let cancelled = false;
    let task: RenderTask | null = null;

    pdfDoc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled || !canvasRef.current) {
          page.cleanup();
          return;
        }
        const baseVp = page.getViewport({ scale: 1 });
        const thumbScale = thumbWidth / Math.max(1, baseVp.width);
        task = renderPageToCanvas(page, canvasRef.current, thumbScale, 1.5);
        return task.promise
          .then(() => {
            if (!cancelled) setRendered(true);
          })
          .finally(() => {
            page.cleanup();
          });
      })
      .catch((err) => {
        if (!cancelled && !isRenderingCancelledError(err)) {
          // Ignore thumbnail error
        }
      });

    return () => {
      cancelled = true;
      if (task) {
        try {
          task.cancel();
        } catch {
          // Ignore cancel error
        }
      }
    };
  }, [inView, rendered, pdfDoc, pageNumber, thumbWidth]);

  return (
    <button
      ref={itemRef}
      type="button"
      onClick={() => onSelect(pageNumber)}
      aria-label={`Go to page ${pageNumber}`}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
        isActive
          ? 'bg-zinc-200/80 dark:bg-zinc-800/90'
          : 'hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40'
      }`}
    >
      <div
        style={{ width: `${thumbWidth}px`, height: `${thumbHeight}px` }}
        className={`relative rounded bg-white overflow-hidden transition-shadow ${
          isActive
            ? 'ring-2 ring-blue-600 dark:ring-blue-400 shadow-sm'
            : 'ring-1 ring-zinc-300 dark:ring-zinc-700'
        }`}
      >
        <canvas
          ref={canvasRef}
          className={`block w-full h-full transition-opacity duration-150 ${
            rendered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
            <span className="font-mono text-[10px] text-zinc-400">
              {pageNumber}
            </span>
          </div>
        )}
      </div>

      <span
        className={`font-mono tabular-nums text-[11px] ${
          isActive
            ? 'font-semibold text-zinc-950 dark:text-zinc-50'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        {pageNumber}
      </span>
    </button>
  );
});

export function ThumbnailSidebar({
  pdfDoc,
  totalPages,
  currentPage,
  pageDimensions,
  isOpen,
  onSelectPage,
  onClose,
}: ThumbnailSidebarProps) {
  if (!isOpen) return null;

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-zinc-100/95 dark:bg-zinc-900/95 border-r border-zinc-200 dark:border-zinc-800">
      <div className="h-11 px-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Pages ({totalPages})
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Collapse thumbnail sidebar"
          className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4 hidden md:block" />
          <X className="w-4 h-4 md:hidden" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {pages.map((pageNum) => (
          <ThumbnailItem
            key={pageNum}
            pdfDoc={pdfDoc}
            pageNumber={pageNum}
            isActive={pageNum === currentPage}
            aspectRatio={pageDimensions.aspectRatio}
            onSelect={(selected) => {
              onSelectPage(selected);
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                onClose();
              }
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop docked rail */}
      <aside
        aria-label="Page thumbnails"
        className="hidden md:block w-52 shrink-0 h-full overflow-hidden"
      >
        {sidebarContent}
      </aside>

      {/* Mobile slide-over drawer */}
      <div className="md:hidden fixed inset-0 z-40 flex">
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
          onClick={onClose}
        />
        <aside
          aria-label="Page thumbnails drawer"
          className="relative z-10 w-60 max-w-[80vw] h-full shadow-xl"
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}
