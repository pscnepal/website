import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageFlip } from 'page-flip';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
  isRenderingCancelledError,
  renderPageToObjectUrl,
} from '../../services/pdfService';
import { soundService } from '../../services/soundService';
import type { PdfPageDimensions } from '../../types/pdf';
import type { FitMode } from '../../types/reader';
import { clampZoom } from '../../utils/pdfHelpers';

export interface FlipbookViewerHandle {
  flipNext: () => void;
  flipPrev: () => void;
  goToPage: (pageNumber: number) => void;
}

interface FlipbookViewerProps {
  pdfDoc: PDFDocumentProxy;
  totalPages: number;
  currentPage: number;
  zoom: number;
  fitMode: FitMode;
  soundEnabled: boolean;
  pageDimensions: PdfPageDimensions;
  onPageFlip: (page: number) => void;
  onEffectiveZoomChange: (zoomPct: number) => void;
}

export const FlipbookViewer = forwardRef<
  FlipbookViewerHandle,
  FlipbookViewerProps
>(function FlipbookViewer(
  {
    pdfDoc,
    totalPages,
    currentPage,
    zoom,
    fitMode,
    soundEnabled,
    pageDimensions,
    onPageFlip,
    onEffectiveZoomChange,
  },
  ref
) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bookMountContainerRef = useRef<HTMLDivElement | null>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const pageImgMapRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pageStatusMapRef = useRef<Map<number, HTMLSpanElement>>(new Map());
  const objectUrlsRef = useRef<Map<number, string>>(new Map());
  const renderedBucketRef = useRef<number>(0);

  const currentPageRef = useRef<number>(currentPage);
  currentPageRef.current = currentPage;

  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const onPageFlipRef = useRef(onPageFlip);
  onPageFlipRef.current = onPageFlip;

  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 1024,
    height: 700,
  });

  // Preload page-turn sound when sound is enabled
  useEffect(() => {
    if (soundEnabled) {
      soundService.preload();
    }
  }, [soundEnabled]);

  // Debounced ResizeObserver on flipbook stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      setStageSize({
        width: Math.max(280, stage.clientWidth),
        height: Math.max(300, stage.clientHeight),
      });
    };

    measure();

    let timeoutId: number | undefined;
    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(measure, 120);
      };
      window.addEventListener('resize', onResize);
      return () => {
        window.clearTimeout(timeoutId);
        window.removeEventListener('resize', onResize);
      };
    }

    const observer = new ResizeObserver(() => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(measure, 120);
    });

    observer.observe(stage);
    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Compute responsive single-page geometry preserving exact PDF aspect ratio
  const layoutMetrics = useMemo(() => {
    const isDesktopSpread = stageSize.width >= 820 && totalPages > 1;
    const hPad = stageSize.width < 640 ? 28 : 104;
    const vPad = stageSize.height < 640 ? 32 : 56;

    const availW = Math.max(220, stageSize.width - hPad);
    const availH = Math.max(240, stageSize.height - vPad);
    const aspect = pageDimensions.aspectRatio;

    const maxSinglePageByWidth = isDesktopSpread ? availW / 2 : availW;
    const fitPageHeight = Math.min(availH, maxSinglePageByWidth / aspect);
    const fitPageWidth = fitPageHeight * aspect;

    let singleWidth = fitPageWidth;
    if (fitMode === 'width') {
      singleWidth = maxSinglePageByWidth;
    } else if (fitMode === 'custom') {
      singleWidth = fitPageWidth * (zoom / 100);
    }

    singleWidth = Math.max(180, Math.min(1100, Math.round(singleWidth)));
    const singleHeight = Math.max(
      220,
      Math.round(singleWidth / aspect)
    );

    const effectiveZoom = clampZoom((singleWidth / Math.max(1, fitPageWidth)) * 100);
    // Bucket resolution into 240px steps so small window tweaks don't re-rasterize PDF blobs unnecessarily
    const renderResolutionBucket = Math.ceil(singleWidth / 240) * 240;

    return {
      isDesktopSpread,
      singleWidth,
      singleHeight,
      effectiveZoom,
      renderResolutionBucket,
    };
  }, [stageSize, totalPages, pageDimensions.aspectRatio, fitMode, zoom]);

  useEffect(() => {
    onEffectiveZoomChange(layoutMetrics.effectiveZoom);
  }, [layoutMetrics.effectiveZoom, onEffectiveZoomChange]);

  // Revoke cached blob URLs when document changes or component unmounts
  useEffect(() => {
    const urlMap = objectUrlsRef.current;
    return () => {
      for (const blobUrl of urlMap.values()) {
        URL.revokeObjectURL(blobUrl);
      }
      urlMap.clear();
      renderedBucketRef.current = 0;
    };
  }, [pdfDoc]);

  // Initialize / rebuild StPageFlip instance cleanly in an imperative host node
  useEffect(() => {
    const hostContainer = bookMountContainerRef.current;
    if (!hostContainer || totalPages < 1) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    hostContainer.innerHTML = '';
    pageImgMapRef.current.clear();
    pageStatusMapRef.current.clear();

    const mountNode = document.createElement('div');
    hostContainer.appendChild(mountNode);

    const useHardCover = totalPages >= 3 && layoutMetrics.isDesktopSpread;
    const pageElements: HTMLElement[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageEl = document.createElement('div');
      pageEl.className = 'psc-nepal-flip-page relative w-full h-full';
      if (useHardCover && (pageNum === 1 || pageNum === totalPages)) {
        pageEl.setAttribute('data-density', 'hard');
      } else {
        pageEl.setAttribute('data-density', 'soft');
      }

      const inner = document.createElement('div');
      inner.className =
        'relative w-full h-full flex items-center justify-center bg-[#FDFCF9]';

      const placeholder = document.createElement('span');
      placeholder.className =
        'font-mono text-xs text-zinc-400 select-none pointer-events-none';
      placeholder.textContent = `Page ${pageNum}`;

      const img = document.createElement('img');
      img.alt = `PDF Page ${pageNum}`;
      img.draggable = false;
      img.className =
        'absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-150';

      const cachedUrl = objectUrlsRef.current.get(pageNum);
      if (cachedUrl) {
        img.src = cachedUrl;
        img.style.opacity = '1';
        placeholder.style.display = 'none';
      } else {
        img.style.opacity = '0';
      }

      inner.appendChild(placeholder);
      inner.appendChild(img);
      pageEl.appendChild(inner);

      pageImgMapRef.current.set(pageNum, img);
      pageStatusMapRef.current.set(pageNum, placeholder);
      pageElements.push(pageEl);
    }

    const startZeroIdx = Math.max(
      0,
      Math.min(totalPages - 1, currentPageRef.current - 1)
    );

    const flipInstance = new PageFlip(mountNode, {
      width: layoutMetrics.singleWidth,
      height: layoutMetrics.singleHeight,
      size: 'fixed',
      minWidth: 160,
      maxWidth: 1200,
      minHeight: 200,
      maxHeight: 1600,
      drawShadow: true,
      maxShadowOpacity: 0.38,
      flippingTime: prefersReducedMotion ? 220 : 680,
      usePortrait: !layoutMetrics.isDesktopSpread,
      startPage: startZeroIdx,
      autoSize: true,
      showCover: useHardCover,
      mobileScrollSupport: false,
      clickEventForward: false,
      useMouseEvents: true,
      swipeDistance: 28,
      showPageCorners: !prefersReducedMotion,
      disableFlipByClick: false,
    });

    let initialized = false;
    let soundPlayedForCurrentTurn = false;
    let lastFlipState = 'read';

    flipInstance.on('init', () => {
      initialized = true;
    });

    flipInstance.on('changeState', (event) => {
      const nextState = String(event.data);
      if (initialized && soundEnabledRef.current) {
        if (nextState === 'flipping' && !soundPlayedForCurrentTurn) {
          soundService.playPageTurn('full');
          soundPlayedForCurrentTurn = true;
        } else if (nextState === 'user_fold' && lastFlipState !== 'user_fold') {
          soundService.playPageTurn('soft');
          soundPlayedForCurrentTurn = true;
        }
      }
      if (nextState === 'read') {
        soundPlayedForCurrentTurn = false;
      }
      lastFlipState = nextState;
    });

    flipInstance.on('flip', (event) => {
      const nextOneBased = Number(event.data) + 1;
      if (!Number.isNaN(nextOneBased)) {
        if (initialized && soundEnabledRef.current && !soundPlayedForCurrentTurn) {
          soundService.playPageTurn('soft');
        }
        soundPlayedForCurrentTurn = false;
        onPageFlipRef.current(nextOneBased);
      }
    });

    flipInstance.loadFromHTML(pageElements);
    pageFlipRef.current = flipInstance;

    return () => {
      pageFlipRef.current = null;
      try {
        flipInstance.destroy();
      } catch {
        // Ignore teardown issues on detached nodes
      }
      hostContainer.innerHTML = '';
    };
  }, [
    pdfDoc,
    totalPages,
    layoutMetrics.singleWidth,
    layoutMetrics.singleHeight,
    layoutMetrics.isDesktopSpread,
  ]);

  // Progressive PDF page rasterization queue prioritized around currentPage
  useEffect(() => {
    const targetBucket = layoutMetrics.renderResolutionBucket;
    if (
      renderedBucketRef.current !== 0 &&
      renderedBucketRef.current !== targetBucket
    ) {
      // Clear stale-resolution blobs when user zooms substantially
      for (const blobUrl of objectUrlsRef.current.values()) {
        URL.revokeObjectURL(blobUrl);
      }
      objectUrlsRef.current.clear();
    }
    renderedBucketRef.current = targetBucket;

    const cancelToken = { cancelled: false };

    // Build priority queue: current spread & neighbors first, covers next, then rest within window
    const prioritySet = new Set<number>();
    const offsets = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    for (const offset of offsets) {
      const p = currentPage + offset;
      if (p >= 1 && p <= totalPages) {
        prioritySet.add(p);
      }
    }
    prioritySet.add(1);
    prioritySet.add(totalPages);

    // For moderate-sized documents (<= 40 pages), also queue remaining pages gently in background
    if (totalPages <= 40) {
      for (let p = 1; p <= totalPages; p++) {
        prioritySet.add(p);
      }
    }

    const queue = Array.from(prioritySet).filter(
      (pageNum) => !objectUrlsRef.current.has(pageNum)
    );

    if (queue.length === 0) return;

    const runQueue = async () => {
      for (const pageNum of queue) {
        if (cancelToken.cancelled) break;
        if (objectUrlsRef.current.has(pageNum)) continue;

        try {
          const blobUrl = await renderPageToObjectUrl(
            pdfDoc,
            pageNum,
            targetBucket,
            cancelToken
          );
          if (cancelToken.cancelled) {
            URL.revokeObjectURL(blobUrl);
            break;
          }

          objectUrlsRef.current.set(pageNum, blobUrl);

          const imgEl = pageImgMapRef.current.get(pageNum);
          const statusEl = pageStatusMapRef.current.get(pageNum);
          if (imgEl) {
            imgEl.src = blobUrl;
            imgEl.style.opacity = '1';
          }
          if (statusEl) {
            statusEl.style.display = 'none';
          }
        } catch (err) {
          if (!cancelToken.cancelled && !isRenderingCancelledError(err)) {
            const statusEl = pageStatusMapRef.current.get(pageNum);
            if (statusEl) {
              statusEl.textContent = `Page ${pageNum}`;
            }
          }
        }
      }
    };

    runQueue();

    return () => {
      cancelToken.cancelled = true;
    };
  }, [pdfDoc, totalPages, currentPage, layoutMetrics.renderResolutionBucket]);

  const handleFlipNext = useCallback(() => {
    const instance = pageFlipRef.current;
    if (!instance) return;
    if (totalPages <= 1) return;
    instance.flipNext();
  }, [totalPages]);

  const handleFlipPrev = useCallback(() => {
    const instance = pageFlipRef.current;
    if (!instance) return;
    if (totalPages <= 1) return;
    instance.flipPrev();
  }, [totalPages]);

  const handleGoToPage = useCallback(
    (targetPage: number) => {
      const instance = pageFlipRef.current;
      if (!instance) return;
      const clampedIdx = Math.max(0, Math.min(totalPages - 1, targetPage - 1));
      const currentIdx = instance.getCurrentPageIndex();
      if (clampedIdx === currentIdx) return;

      if (Math.abs(clampedIdx - currentIdx) <= 4) {
        instance.flip(clampedIdx);
      } else {
        instance.turnToPage(clampedIdx);
        if (soundEnabledRef.current) {
          soundService.playPageTurn();
        }
        onPageFlipRef.current(clampedIdx + 1);
      }
    },
    [totalPages]
  );

  useImperativeHandle(
    ref,
    () => ({
      flipNext: handleFlipNext,
      flipPrev: handleFlipPrev,
      goToPage: handleGoToPage,
    }),
    [handleFlipNext, handleFlipPrev, handleGoToPage]
  );

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      ref={stageRef}
      className="relative flex-1 h-full overflow-auto bg-zinc-200/55 dark:bg-zinc-900/80 flex items-center justify-center p-4 sm:p-6 select-none"
    >
      {/* Left side quick-turn paddle on larger viewports */}
      {totalPages > 1 && (
        <button
          type="button"
          onClick={handleFlipPrev}
          disabled={!canGoPrev}
          aria-label="Turn to previous page"
          className="hidden sm:flex fixed sm:absolute left-3 lg:left-6 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Centered interactive book stage */}
      <div className="relative flex items-center justify-center my-auto">
        <div ref={bookMountContainerRef} className="relative" />
      </div>

      {/* Right side quick-turn paddle on larger viewports */}
      {totalPages > 1 && (
        <button
          type="button"
          onClick={handleFlipNext}
          disabled={!canGoNext}
          aria-label="Turn to next page"
          className="hidden sm:flex fixed sm:absolute right-3 lg:right-6 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});
