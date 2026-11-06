import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Download,
  FileText,
  Keyboard,
  Maximize,
  Minimize,
  Moon,
  MoreHorizontal,
  MoveHorizontal,
  PanelLeft,
  Rows3,
  Scan,
  Square,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  FitMode,
  ReadingMode,
  StandardLayout,
  ThemeMode,
} from '../../types/reader';
import { formatCompactDuration } from '../../utils/pdfHelpers';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Tooltip } from '../ui/Tooltip';
import { ReactionButtons } from '../common/ReactionButtons';
import { FullscreenButton } from './FullscreenButton';
import { PageNavigation } from './PageNavigation';
import { ZoomControls } from './ZoomControls';

interface ReaderToolbarProps {
  bookTitle: string;
  materialId?: string;
  backTo?: string;
  backLabel?: string;
  currentPage: number;
  totalPages: number;
  displayZoom: number;
  fitMode: FitMode;
  readingMode: ReadingMode;
  standardLayout: StandardLayout;
  isSidebarOpen: boolean;
  soundEnabled: boolean;
  theme: ThemeMode;
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  canDownload: boolean;
  isStatsOpen: boolean;
  totalReadingSeconds: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onJumpToPage: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  onChangeMode: (mode: ReadingMode) => void;
  onChangeStandardLayout: (layout: StandardLayout) => void;
  onToggleSidebar: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onToggleFullscreen: () => void;
  onOpenShortcuts: () => void;
  onToggleStats: () => void;
  onDownload: () => void;
}

export function ReaderToolbar({
  bookTitle,
  materialId,
  backTo = '/',
  backLabel = 'Return to Home',
  currentPage,
  totalPages,
  displayZoom,
  fitMode,
  readingMode,
  standardLayout,
  isSidebarOpen,
  soundEnabled,
  theme,
  isFullscreen,
  isFullscreenSupported,
  canDownload,
  isStatsOpen,
  totalReadingSeconds,
  onPrevPage,
  onNextPage,
  onJumpToPage,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  onFitPage,
  onChangeMode,
  onChangeStandardLayout,
  onToggleSidebar,
  onToggleSound,
  onToggleTheme,
  onToggleFullscreen,
  onOpenShortcuts,
  onToggleStats,
  onDownload,
}: ReaderToolbarProps) {
  return (
    <header className="h-14 w-full shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-2 z-30">
      {/* Left: Return link, sidebar toggle, document title */}
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
        <Tooltip content={backLabel}>
          <Link
            to={backTo}
            aria-label={backLabel}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Tooltip>

        <Tooltip content={isSidebarOpen ? 'Hide thumbnails' : 'Show thumbnails'}>
          <Button
            variant="icon"
            size="sm"
            active={isSidebarOpen}
            onClick={onToggleSidebar}
            aria-label="Toggle page thumbnails sidebar"
            aria-pressed={isSidebarOpen}
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        </Tooltip>

        <div className="hidden sm:block w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0" />

        <h1
          title={bookTitle}
          className="hidden sm:block text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[140px] lg:max-w-[220px]"
        >
          {bookTitle}
        </h1>
      </div>

      {/* Center: Page navigation + Reading mode switch */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <PageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={onPrevPage}
          onNext={onNextPage}
          onJumpToPage={onJumpToPage}
        />

        <div className="hidden md:block w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

        {/* Segmented mode selector */}
        <div
          role="group"
          aria-label="Reading mode"
          className="hidden md:flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
        >
          <button
            type="button"
            onClick={() => onChangeMode('flipbook')}
            aria-pressed={readingMode === 'flipbook'}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              readingMode === 'flipbook'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Flipbook</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode('standard')}
            aria-pressed={readingMode === 'standard'}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              readingMode === 'standard'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Standard</span>
          </button>
        </div>

        {/* Standard view layout toggle (Continuous vs Single page) */}
        {readingMode === 'standard' && (
          <Tooltip
            content={
              standardLayout === 'continuous'
                ? 'Switch to single-page view'
                : 'Switch to continuous scroll'
            }
          >
            <Button
              variant="icon"
              size="sm"
              onClick={() =>
                onChangeStandardLayout(
                  standardLayout === 'continuous' ? 'single' : 'continuous'
                )
              }
              aria-label={
                standardLayout === 'continuous'
                  ? 'Switch to single-page view'
                  : 'Switch to continuous scroll'
              }
              className="hidden xl:inline-flex"
            >
              {standardLayout === 'continuous' ? (
                <Rows3 className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Right: Zoom, Sound, Theme, Shortcuts, Download, Fullscreen */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="hidden lg:flex items-center">
          <ZoomControls
            displayZoom={displayZoom}
            fitMode={fitMode}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onFitWidth={onFitWidth}
            onFitPage={onFitPage}
          />
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1.5" />
        </div>

        {materialId && (
          <div className="hidden sm:flex items-center mr-1">
            <ReactionButtons
              itemId={materialId}
              itemType="material"
              size="sm"
            />
          </div>
        )}

        <Tooltip content="Reading Stats" shortcut="I">
          <button
            type="button"
            onClick={onToggleStats}
            aria-label="Open reading stats"
            aria-pressed={isStatsOpen}
            className={`hidden min-[380px]:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isStatsOpen
                ? 'bg-zinc-200/90 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline font-mono tabular-nums">
              {formatCompactDuration(totalReadingSeconds)}
            </span>
          </button>
        </Tooltip>

        <Tooltip
          content={
            soundEnabled
              ? 'Page-turn sound: On (click to mute)'
              : 'Page-turn sound: Muted (click to enable)'
          }
          shortcut="S"
        >
          <Button
            variant="icon"
            size="sm"
            active={soundEnabled}
            onClick={onToggleSound}
            aria-label={
              soundEnabled ? 'Mute page-turn sound' : 'Enable page-turn sound'
            }
            aria-pressed={soundEnabled}
            className="hidden sm:inline-flex"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        </Tooltip>

        <div className="hidden xl:flex items-center gap-0.5">
          <Tooltip
            content={
              theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            }
          >
            <Button
              variant="icon"
              size="sm"
              onClick={onToggleTheme}
              aria-label="Toggle dark reading theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </Tooltip>

          <Tooltip content="Keyboard shortcuts">
            <Button
              variant="icon"
              size="sm"
              onClick={onOpenShortcuts}
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
          </Tooltip>

          {canDownload && (
            <Tooltip content="Download PDF">
              <Button
                variant="icon"
                size="sm"
                onClick={onDownload}
                aria-label="Download PDF"
              >
                <Download className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}

          <FullscreenButton
            isFullscreen={isFullscreen}
            isSupported={isFullscreenSupported}
            onToggle={onToggleFullscreen}
          />
        </div>

        {/* Compact overflow menu for tablet & mobile */}
        <div className="xl:hidden">
          <Dropdown
            trigger={({ open, toggle }) => (
              <Button
                variant="icon"
                size="sm"
                active={open}
                onClick={toggle}
                aria-label="More reader controls"
                aria-expanded={open}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            )}
          >
            {({ close }) => (
              <div className="space-y-1 text-xs">
                {/* Mobile Mode Switch */}
                <div className="md:hidden p-1.5 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-[11px] font-medium text-zinc-400 px-1.5 mb-1.5">
                    Reading Mode
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeMode('flipbook');
                        close();
                      }}
                      className={`flex items-center justify-center gap-1.5 h-8 rounded-md font-medium cursor-pointer ${
                        readingMode === 'flipbook'
                          ? 'bg-blue-700 text-white dark:bg-blue-600 dark:text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Flipbook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeMode('standard');
                        close();
                      }}
                      className={`flex items-center justify-center gap-1.5 h-8 rounded-md font-medium cursor-pointer ${
                        readingMode === 'standard'
                          ? 'bg-blue-700 text-white dark:bg-blue-600 dark:text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Standard</span>
                    </button>
                  </div>
                </div>

                {/* Mobile/Tablet Zoom Controls */}
                <div className="lg:hidden px-2 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Zoom</span>
                    <ZoomControls
                      displayZoom={displayZoom}
                      fitMode={fitMode}
                      onZoomIn={onZoomIn}
                      onZoomOut={onZoomOut}
                      onFitWidth={onFitWidth}
                      onFitPage={onFitPage}
                      showFitButtons={false}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onFitWidth();
                        close();
                      }}
                      className={`flex items-center justify-center gap-1.5 h-8 rounded-md font-medium cursor-pointer ${
                        fitMode === 'width'
                          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-white'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <MoveHorizontal className="w-3.5 h-3.5" />
                      <span>Fit Width</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onFitPage();
                        close();
                      }}
                      className={`flex items-center justify-center gap-1.5 h-8 rounded-md font-medium cursor-pointer ${
                        fitMode === 'page'
                          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-white'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Fit Page</span>
                    </button>
                  </div>
                </div>

                {readingMode === 'standard' && (
                  <button
                    type="button"
                    onClick={() => {
                      onChangeStandardLayout(
                        standardLayout === 'continuous' ? 'single' : 'continuous'
                      );
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {standardLayout === 'continuous' ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Rows3 className="w-4 h-4" />
                    )}
                    <span>
                      {standardLayout === 'continuous'
                        ? 'Single-page view'
                        : 'Continuous scroll'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onToggleSound();
                    close();
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    <span>Page-turn sound</span>
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    {soundEnabled ? 'On' : 'Off'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onToggleTheme();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>
                    {theme === 'dark' ? 'Light reading theme' : 'Dark reading theme'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onToggleStats();
                    close();
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4" />
                    <span>Reading stats</span>
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-zinc-400">
                    {formatCompactDuration(totalReadingSeconds)}
                  </span>
                </button>

                {materialId && (
                  <div className="sm:hidden px-2.5 py-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400">Rate this book</span>
                    <ReactionButtons itemId={materialId} itemType="material" size="sm" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onOpenShortcuts();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Keyboard shortcuts</span>
                </button>

                {canDownload && (
                  <button
                    type="button"
                    onClick={() => {
                      onDownload();
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                )}

                {isFullscreenSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleFullscreen();
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                    <span>
                      {isFullscreen ? 'Exit fullscreen' : 'Fullscreen mode'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
