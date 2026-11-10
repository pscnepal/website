import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { store } from '../app/store';
import { PdfUpload } from '../components/home/PdfUpload';
import { PdfUrlInput } from '../components/home/PdfUrlInput';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  FlipbookViewer,
  type FlipbookViewerHandle,
} from '../components/reader/FlipbookViewer';
import { KeyboardShortcutsDialog } from '../components/reader/KeyboardShortcutsDialog';
import { PdfViewer, type PdfViewerHandle } from '../components/reader/PdfViewer';
import { ReaderError } from '../components/reader/ReaderError';
import { ReaderLoading } from '../components/reader/ReaderLoading';
import { ReaderToolbar } from '../components/reader/ReaderToolbar';
import { ReadingStatsView } from '../components/reader/ReadingStatsView';
import { ThumbnailSidebar } from '../components/reader/ThumbnailSidebar';
import { recordBookOpened } from '../features/library/librarySlice';
import {
  initializeReaderSession,
  nextPage,
  prevPage,
  resetReaderDocumentState,
  setCurrentPage,
  setFitMode,
  setReadingMode,
  setShortcutsOpen,
  setSidebarOpen,
  setStandardLayout,
  setStatsOpen,
  setZoom,
  toggleReadingMode,
  toggleSidebar,
  toggleSound,
  toggleStatsOpen,
} from '../features/reader/readerSlice';
import {
  setDefaultSoundEnabled,
  toggleTheme,
} from '../features/settings/settingsSlice';
import { useFullscreen } from '../hooks/useFullscreen';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { usePdfDocument } from '../hooks/usePdfDocument';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useReadingStats } from '../hooks/useReadingStats';
import { getLocalPdfSessionEntry } from '../services/pdfService';
import { soundService } from '../services/soundService';
import type { BookMetadata, PdfErrorInfo } from '../types/pdf';
import { clampZoom, ZOOM_STEP } from '../utils/pdfHelpers';
import {
  createBookIdFromUrl,
  deriveTitleFromSource,
  resolveSampleUrl,
  SAMPLE_EDITIONS,
  validatePdfUrl,
} from '../utils/urlHelpers';

export function ReaderPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const routeOrigin = location.state as
    | { from?: string; fromLabel?: string }
    | null;
  const backTo = routeOrigin?.from || '/';
  const backLabel = routeOrigin?.fromLabel || 'Return to Home';

  const readerContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfViewerRef = useRef<PdfViewerHandle | null>(null);
  const flipbookRef = useRef<FlipbookViewerHandle | null>(null);

  const currentPage = useAppSelector((state) => state.reader.currentPage);
  const totalPages = useAppSelector((state) => state.reader.totalPages);
  const zoom = useAppSelector((state) => state.reader.zoom);
  const fitMode = useAppSelector((state) => state.reader.fitMode);
  const readingMode = useAppSelector((state) => state.reader.readingMode);
  const standardLayout = useAppSelector((state) => state.reader.standardLayout);
  const isSidebarOpen = useAppSelector((state) => state.reader.isSidebarOpen);
  const soundEnabled = useAppSelector((state) => state.reader.soundEnabled);
  const isShortcutsOpen = useAppSelector((state) => state.reader.isShortcutsOpen);
  const isStatsOpen = useAppSelector((state) => state.reader.isStatsOpen);
  const theme = useAppSelector((state) => state.settings.theme);
  const currentBookInStore = useAppSelector((state) => state.library.currentBook);

  const [retryKey, setRetryKey] = useState(0);
  const [pdfPassword, setPdfPassword] = useState<string | undefined>(undefined);
  const [effectiveZoom, setEffectiveZoom] = useState<number>(100);

  const urlParam = searchParams.get('url');
  const sourceParam = searchParams.get('source');
  const localIdParam = searchParams.get('id');

  // Resolve active PDF source (URL query parameter vs local session file)
  const resolvedSource = useMemo<{
    status: 'empty' | 'error' | 'ready';
    url: string | null;
    book: BookMetadata | null;
    error?: PdfErrorInfo;
  }>(() => {
    if (sourceParam === 'local' && localIdParam) {
      const localEntry = getLocalPdfSessionEntry(localIdParam);
      if (!localEntry) {
        return {
          status: 'error',
          url: null,
          book: null,
          error: {
            code: 'LOCAL_FILE_EXPIRED',
            title: 'Local File Session Ended',
            message:
              'For your privacy, browsers clear local file memory when the page is refreshed.',
            hint: 'Drop or select the PDF file below to resume right where you left off.',
          },
        };
      }
      return {
        status: 'ready',
        url: localEntry.objectUrl,
        book: {
          id: localEntry.id,
          title: currentBookInStore?.id === localEntry.id
            ? currentBookInStore.title
            : localEntry.title,
          sourceType: 'local',
          url: localEntry.objectUrl,
          fileName: localEntry.fileName,
          fileSize: localEntry.fileSize,
        },
      };
    }

    if (urlParam !== null) {
      const validation = validatePdfUrl(urlParam);
      if (!validation.valid) {
        return {
          status: 'error',
          url: null,
          book: null,
          error: {
            code: 'INVALID_URL',
            title: 'Invalid PDF URL',
            message:
              validation.errorMessage ??
              'The provided URL is not a valid HTTP or HTTPS address.',
            hint: 'Check that the link begins with https:// and points directly to a PDF document.',
          },
        };
      }

      const id = createBookIdFromUrl(validation.normalizedUrl);
      return {
        status: 'ready',
        url: validation.normalizedUrl,
        book: {
          id,
          title: deriveTitleFromSource(validation.normalizedUrl),
          sourceType: 'url',
          url: validation.normalizedUrl,
        },
      };
    }

    // Fallback if user navigated to /read while a session book is already loaded in store
    if (currentBookInStore) {
      if (currentBookInStore.sourceType === 'local') {
        const localEntry = getLocalPdfSessionEntry(currentBookInStore.id);
        if (localEntry) {
          return {
            status: 'ready',
            url: localEntry.objectUrl,
            book: currentBookInStore,
          };
        }
      } else if (currentBookInStore.url) {
        return {
          status: 'ready',
          url: currentBookInStore.url,
          book: currentBookInStore,
        };
      }
    }

    return {
      status: 'empty',
      url: null,
      book: null,
    };
  }, [urlParam, sourceParam, localIdParam, currentBookInStore]);

  // Reset password when switching to a different book
  const activeBookId = resolvedSource.book?.id ?? null;
  useEffect(() => {
    setPdfPassword(undefined);
  }, [activeBookId]);

  const {
    pdfDoc,
    numPages,
    pageDimensions,
    docMetadata,
    isLoading,
    progressPercent,
    error: pdfLoadError,
  } = usePdfDocument({
    url: resolvedSource.url,
    password: pdfPassword,
    retryKey,
  });

  // Initialize reader session and restore saved reading progress when PDF finishes loading
  const initializedDocRef = useRef<unknown>(null);
  useEffect(() => {
    if (!pdfDoc || !resolvedSource.book || numPages <= 0) return;
    if (initializedDocRef.current === pdfDoc) return;
    initializedDocRef.current = pdfDoc;

    const existingProgress =
      store.getState().library.readingProgress[resolvedSource.book.id];
    const restoredPage = existingProgress
      ? Math.max(1, Math.min(numPages, existingProgress.lastPage))
      : 1;

    const enrichedBook: BookMetadata = {
      ...resolvedSource.book,
      title: docMetadata.title || resolvedSource.book.title,
      author: docMetadata.author || resolvedSource.book.author,
      totalPages: numPages,
    };

    dispatch(
      initializeReaderSession({
        initialPage: restoredPage,
        totalPages: numPages,
      })
    );

    dispatch(
      recordBookOpened({
        book: enrichedBook,
        totalPages: numPages,
        currentPage: restoredPage,
      })
    );
  }, [pdfDoc, numPages, docMetadata, resolvedSource.book, dispatch]);

  // Reset document page count on unmount
  useEffect(() => {
    return () => {
      dispatch(resetReaderDocumentState());
    };
  }, [dispatch]);

  // Persist page progress automatically whenever currentPage changes
  useReadingProgress(pdfDoc ? activeBookId : null);

  // Track active reading time and pages per minute per individual document
  const { bookStats, sessionSeconds, resetSessionTimer } = useReadingStats({
    bookId: activeBookId,
    isActiveDocument: Boolean(pdfDoc) && !isLoading && !pdfLoadError,
    currentPage,
  });

  const { isFullscreen, isSupported: isFullscreenSupported, toggleFullscreen } =
    useFullscreen(readerContainerRef);

  // Navigation handlers coordinated across Standard & Flipbook modes
  const handlePrevPage = useCallback(() => {
    if (readingMode === 'flipbook' && flipbookRef.current) {
      flipbookRef.current.flipPrev();
      return;
    }
    if (currentPage <= 1) return;
    const target = Math.max(1, currentPage - 1);
    dispatch(prevPage(1));
    pdfViewerRef.current?.scrollToPage(target);
  }, [readingMode, currentPage, dispatch]);

  const handleNextPage = useCallback(() => {
    if (readingMode === 'flipbook' && flipbookRef.current) {
      flipbookRef.current.flipNext();
      return;
    }
    if (currentPage >= totalPages) return;
    const target = Math.min(totalPages, currentPage + 1);
    dispatch(nextPage(1));
    pdfViewerRef.current?.scrollToPage(target);
  }, [readingMode, currentPage, totalPages, dispatch]);

  const handleJumpToPage = useCallback(
    (targetPage: number) => {
      const clamped = Math.max(1, Math.min(totalPages, targetPage));
      if (clamped === currentPage) return;
      dispatch(setCurrentPage(clamped));
      if (readingMode === 'flipbook') {
        flipbookRef.current?.goToPage(clamped);
      } else {
        pdfViewerRef.current?.scrollToPage(clamped);
      }
    },
    [totalPages, currentPage, readingMode, dispatch]
  );

  const handleToggleSound = useCallback(() => {
    const nextEnabled = !soundEnabled;
    dispatch(toggleSound());
    dispatch(setDefaultSoundEnabled(nextEnabled));
    if (nextEnabled) {
      soundService.playPageTurn('soft');
    }
  }, [soundEnabled, dispatch]);

  // Smooth zoom transitions from fitted or custom states
  const handleZoomIn = useCallback(() => {
    const base = fitMode === 'custom' ? zoom : effectiveZoom;
    dispatch(setZoom(clampZoom(base + ZOOM_STEP)));
  }, [fitMode, zoom, effectiveZoom, dispatch]);

  const handleZoomOut = useCallback(() => {
    const base = fitMode === 'custom' ? zoom : effectiveZoom;
    dispatch(setZoom(clampZoom(base - ZOOM_STEP)));
  }, [fitMode, zoom, effectiveZoom, dispatch]);

  const handleFitWidth = useCallback(() => {
    dispatch(setFitMode('width'));
  }, [dispatch]);

  const handleFitPage = useCallback(() => {
    dispatch(setFitMode('page'));
  }, [dispatch]);

  const handleEscapeOverlay = useCallback(() => {
    if (isStatsOpen) {
      dispatch(setStatsOpen(false));
      return;
    }
    if (isShortcutsOpen) {
      dispatch(setShortcutsOpen(false));
      return;
    }
    if (isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      dispatch(setSidebarOpen(false));
    }
  }, [isStatsOpen, isShortcutsOpen, isSidebarOpen, dispatch]);

  useKeyboardShortcuts({
    enabled: Boolean(pdfDoc) && !isLoading,
    onPrevPage: handlePrevPage,
    onNextPage: handleNextPage,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onFitToPage: handleFitPage,
    onToggleFullscreen: toggleFullscreen,
    onToggleMode: () => dispatch(toggleReadingMode()),
    onToggleSound: handleToggleSound,
    onToggleStats: () => dispatch(toggleStatsOpen()),
    onEscapeOverlay: handleEscapeOverlay,
  });

  const handleDownloadPdf = useCallback(async () => {
    if (!resolvedSource.url || !resolvedSource.book) return;
    const rawName =
      resolvedSource.book.fileName ||
      `${resolvedSource.book.title.replace(/[^a-z0-9-_]+/gi, '_')}.pdf`;

    try {
      if (
        resolvedSource.url.startsWith('blob:') ||
        resolvedSource.url.startsWith(window.location.origin)
      ) {
        const link = document.createElement('a');
        link.href = resolvedSource.url;
        link.download = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      // Attempt CORS blob download first so browser honors filename
      const response = await fetch(resolvedSource.url);
      if (!response.ok) throw new Error('Download fetch failed');
      const blob = await response.blob();
      const tempUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = tempUrl;
      link.download = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(tempUrl), 2000);
    } catch {
      // Fallback: anchor link navigation when server forbids programmatic blob download
      const fallbackLink = document.createElement('a');
      fallbackLink.href = resolvedSource.url;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    }
  }, [resolvedSource.url, resolvedSource.book]);

  // 1. Empty state when /read is visited without a document URL or local upload
  if (resolvedSource.status === 'empty') {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />

        <PageTransition>
          <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center space-y-2.5">
              <div className="w-11 h-11 mx-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                No Book Selected Yet
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Paste a direct PDF URL, drop a local PDF file from your computer, or open one of our sample editions below.
              </p>
            </div>

            <div className="space-y-3.5">
              <PdfUrlInput compact />
              <PdfUpload compact />
            </div>

            <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Or open a featured reading material:
                </p>
                <Link
                  to="/materials"
                  className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  Browse all collections
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_EDITIONS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/read?url=${encodeURIComponent(
                          resolveSampleUrl(sample.path)
                        )}`
                      )
                    }
                    className="text-left p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group"
                  >
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate">
                      {sample.title}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between font-mono tabular-nums">
                      <span>{sample.pages} pages</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </main>
        </PageTransition>
      </div>
    );
  }

  const activeError = resolvedSource.error ?? pdfLoadError;
  const displayTitle =
    docMetadata.title || resolvedSource.book?.title || 'Document';
  const progressRatio =
    totalPages > 0 ? Math.min(1, Math.max(0, currentPage / totalPages)) : 0;

  return (
    <div
      ref={readerContainerRef}
      className="h-screen w-full overflow-hidden flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
    >
      <ReaderToolbar
        bookTitle={displayTitle}
        materialId={resolvedSource.book?.id}
        backTo={backTo}
        backLabel={backLabel}
        currentPage={currentPage}
        totalPages={totalPages}
        displayZoom={fitMode === 'custom' ? zoom : effectiveZoom}
        fitMode={fitMode}
        readingMode={readingMode}
        standardLayout={standardLayout}
        isSidebarOpen={isSidebarOpen}
        soundEnabled={soundEnabled}
        theme={theme}
        isFullscreen={isFullscreen}
        isFullscreenSupported={isFullscreenSupported}
        canDownload={Boolean(pdfDoc && resolvedSource.url)}
        isStatsOpen={isStatsOpen}
        totalReadingSeconds={bookStats?.totalReadingSeconds ?? 0}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onJumpToPage={handleJumpToPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitWidth={handleFitWidth}
        onFitPage={handleFitPage}
        onChangeMode={(mode) => dispatch(setReadingMode(mode))}
        onChangeStandardLayout={(layout) => dispatch(setStandardLayout(layout))}
        onToggleSidebar={() => dispatch(toggleSidebar())}
        onToggleSound={handleToggleSound}
        onToggleTheme={() => dispatch(toggleTheme())}
        onToggleFullscreen={toggleFullscreen}
        onOpenShortcuts={() => dispatch(setShortcutsOpen(true))}
        onToggleStats={() => dispatch(toggleStatsOpen())}
        onDownload={handleDownloadPdf}
      />

      {/* Subtle reading progress hairline */}
      {pdfDoc && totalPages > 0 && (
        <div className="h-0.5 w-full bg-zinc-200/80 dark:bg-zinc-800/80 shrink-0 overflow-hidden">
          <div
            className="h-full bg-crimson-600 dark:bg-crimson-500 transition-transform duration-200 origin-left"
            style={{ transform: `scaleX(${progressRatio})` }}
          />
        </div>
      )}

      {/* Main Workspace */}
      <PageTransition fadeOnly className="flex-1 min-h-0 flex relative overflow-hidden">
        {activeError ? (
          <ReaderError
            error={activeError}
            documentUrl={resolvedSource.url}
            onRetry={() => setRetryKey((k) => k + 1)}
            onSubmitPassword={(pw) => {
              setPdfPassword(pw);
              setRetryKey((k) => k + 1);
            }}
          />
        ) : isLoading || !pdfDoc || !pageDimensions ? (
          <ReaderLoading
            title={resolvedSource.book?.title}
            progressPercent={progressPercent}
          />
        ) : (
          <>
            <ThumbnailSidebar
              pdfDoc={pdfDoc}
              totalPages={totalPages}
              currentPage={currentPage}
              pageDimensions={pageDimensions}
              isOpen={isSidebarOpen}
              onSelectPage={handleJumpToPage}
              onClose={() => dispatch(setSidebarOpen(false))}
            />

            <main className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              {readingMode === 'flipbook' ? (
                <FlipbookViewer
                  ref={flipbookRef}
                  pdfDoc={pdfDoc}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  zoom={zoom}
                  fitMode={fitMode}
                  soundEnabled={soundEnabled}
                  pageDimensions={pageDimensions}
                  onPageFlip={(page) => dispatch(setCurrentPage(page))}
                  onEffectiveZoomChange={setEffectiveZoom}
                />
              ) : (
                <PdfViewer
                  ref={pdfViewerRef}
                  pdfDoc={pdfDoc}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  zoom={zoom}
                  fitMode={fitMode}
                  layout={standardLayout}
                  pageDimensions={pageDimensions}
                  onPageInViewChange={(page) => dispatch(setCurrentPage(page))}
                  onEffectiveZoomChange={setEffectiveZoom}
                />
              )}
            </main>
          </>
        )}
      </PageTransition>

      <KeyboardShortcutsDialog
        open={isShortcutsOpen}
        onClose={() => dispatch(setShortcutsOpen(false))}
      />

      <ReadingStatsView
        open={isStatsOpen}
        bookId={activeBookId}
        bookTitle={displayTitle}
        currentPage={currentPage}
        totalPages={totalPages}
        sessionSeconds={sessionSeconds}
        onResetSessionTimer={resetSessionTimer}
        onClose={() => dispatch(setStatsOpen(false))}
      />
    </div>
  );
}
