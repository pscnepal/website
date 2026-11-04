import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PdfPageDimensions } from '../../types/pdf';
import type { FitMode, StandardLayout } from '../../types/reader';
import { clampZoom } from '../../utils/pdfHelpers';
import { PdfPage } from './PdfPage';

export interface PdfViewerHandle {
  scrollToPage: (pageNumber: number) => void;
}

interface PdfViewerProps {
  pdfDoc: PDFDocumentProxy;
  totalPages: number;
  currentPage: number;
  zoom: number;
  fitMode: FitMode;
  layout: StandardLayout;
  pageDimensions: PdfPageDimensions;
  onPageInViewChange: (page: number) => void;
  onEffectiveZoomChange: (zoomPct: number) => void;
}

const NATURAL_SCALE = 1.25;

export const PdfViewer = forwardRef<PdfViewerHandle, PdfViewerProps>(
  function PdfViewer(
    {
      pdfDoc,
      totalPages,
      currentPage,
      zoom,
      fitMode,
      layout,
      pageDimensions,
      onPageInViewChange,
      onEffectiveZoomChange,
    },
    ref
  ) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const pageElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());
    const programmaticScrollUntilRef = useRef<number>(0);

    const [containerSize, setContainerSize] = useState<{
      width: number;
      height: number;
    }>({ width: 960, height: 720 });

    // Measure scroll viewport with debounced ResizeObserver
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const updateMeasurements = () => {
        setContainerSize({
          width: Math.max(280, container.clientWidth),
          height: Math.max(280, container.clientHeight),
        });
      };

      updateMeasurements();

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', updateMeasurements);
        return () => window.removeEventListener('resize', updateMeasurements);
      }

      let rafId = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateMeasurements);
      });

      observer.observe(container);
      return () => {
        cancelAnimationFrame(rafId);
        observer.disconnect();
      };
    }, []);

    const { cssScale, computedZoomPct } = useMemo(() => {
      const horizontalPadding = containerSize.width < 640 ? 24 : 56;
      const verticalPadding = containerSize.height < 640 ? 24 : 48;

      const availableWidth = Math.max(220, containerSize.width - horizontalPadding);
      const availableHeight = Math.max(220, containerSize.height - verticalPadding);

      let targetScale = NATURAL_SCALE * (zoom / 100);

      if (fitMode === 'width') {
        targetScale = availableWidth / pageDimensions.width;
      } else if (fitMode === 'page') {
        const scaleW = availableWidth / pageDimensions.width;
        const scaleH = availableHeight / pageDimensions.height;
        targetScale = Math.min(scaleW, scaleH);
      }

      const clampedScale = Math.max(0.35, Math.min(3.2, targetScale));
      const pct = clampZoom((clampedScale / NATURAL_SCALE) * 100);

      return {
        cssScale: clampedScale,
        computedZoomPct: pct,
      };
    }, [containerSize, fitMode, pageDimensions, zoom]);

    useEffect(() => {
      onEffectiveZoomChange(computedZoomPct);
    }, [computedZoomPct, onEffectiveZoomChange]);

    const registerPageElement = useCallback(
      (pageNum: number, el: HTMLDivElement | null) => {
        if (el) {
          pageElementsRef.current.set(pageNum, el);
        } else {
          pageElementsRef.current.delete(pageNum);
        }
      },
      []
    );

    const scrollToPage = useCallback(
      (targetPage: number, instant = false) => {
        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior: ScrollBehavior =
          instant || prefersReduced ? 'auto' : 'smooth';

        if (layout === 'single') {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior });
          }
          return;
        }

        const el = pageElementsRef.current.get(targetPage);
        if (el && scrollContainerRef.current) {
          programmaticScrollUntilRef.current =
            performance.now() + (behavior === 'smooth' ? 520 : 120);
          el.scrollIntoView({ behavior, block: 'start' });
        }
      },
      [layout]
    );

    useImperativeHandle(
      ref,
      () => ({
        scrollToPage: (pageNumber: number) => scrollToPage(pageNumber, false),
      }),
      [scrollToPage]
    );

    // Scroll to initial/restored page on mount or layout switch to continuous
    const hasAlignedInitialPageRef = useRef(false);
    useEffect(() => {
      if (layout === 'continuous' && !hasAlignedInitialPageRef.current && currentPage > 1) {
        const timer = window.setTimeout(() => {
          scrollToPage(currentPage, true);
          hasAlignedInitialPageRef.current = true;
        }, 40);
        return () => window.clearTimeout(timer);
      }
      hasAlignedInitialPageRef.current = true;
    }, [layout, currentPage, scrollToPage]);

    // Track current visible page during continuous vertical scrolling
    const handleScroll = useCallback(() => {
      if (layout !== 'continuous') return;
      if (performance.now() < programmaticScrollUntilRef.current) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const focalY = containerRect.top + containerRect.height * 0.36;

      let closestPage = currentPage;
      let smallestDistance = Number.POSITIVE_INFINITY;

      for (const [pageNum, el] of pageElementsRef.current.entries()) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalY && rect.bottom >= focalY) {
          closestPage = pageNum;
          break;
        }
        const centerDist = Math.abs((rect.top + rect.bottom) / 2 - focalY);
        if (centerDist < smallestDistance) {
          smallestDistance = centerDist;
          closestPage = pageNum;
        }
      }

      if (closestPage !== currentPage) {
        onPageInViewChange(closestPage);
      }
    }, [currentPage, layout, onPageInViewChange]);

    const pagesToRender = useMemo(() => {
      if (layout === 'single') {
        return [currentPage];
      }
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }, [layout, currentPage, totalPages]);

    return (
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 h-full overflow-auto bg-zinc-100/90 dark:bg-zinc-900/60 px-3 sm:px-6 py-6"
      >
        <div className="min-h-full flex flex-col items-center justify-start gap-6">
          {pagesToRender.map((pageNum) => (
            <PdfPage
              key={pageNum}
              pdfDoc={pdfDoc}
              pageNumber={pageNum}
              scale={cssScale}
              intrinsicWidth={pageDimensions.width}
              intrinsicHeight={pageDimensions.height}
              eager={
                layout === 'single' || Math.abs(pageNum - currentPage) <= 1
              }
              onRegisterElement={registerPageElement}
            />
          ))}
        </div>
      </div>
    );
  }
);
