import { BarChart3, Clock, FileCheck2, Gauge, RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetBookReadingStats } from '../../features/library/librarySlice';
import {
  formatCompactDuration,
  formatEstimatedRemaining,
  formatReadingDuration,
} from '../../utils/pdfHelpers';
import { Button } from '../ui/Button';
import { SharedTable } from '../common/SharedTable';

interface ReadingStatsViewProps {
  open: boolean;
  bookId: string | null;
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  sessionSeconds: number;
  onResetSessionTimer?: () => void;
  onClose: () => void;
}

export function ReadingStatsView({
  open,
  bookId,
  bookTitle,
  currentPage,
  totalPages,
  sessionSeconds,
  onResetSessionTimer,
  onClose,
}: ReadingStatsViewProps) {
  const dispatch = useAppDispatch();
  const readingStatsMap = useAppSelector((state) => state.library.readingStats);
  const recentBooks = useAppSelector((state) => state.library.recentBooks);

  const currentStats = bookId ? readingStatsMap[bookId] : undefined;
  const totalSeconds = currentStats?.totalReadingSeconds ?? 0;
  const pagesPerMinute = currentStats?.pagesPerMinute ?? 0;
  const pagesReadCount = currentStats?.pagesReadCount ?? 0;
  const sessionsCount = currentStats?.sessionsCount ?? 1;
  const uniqueVisited = currentStats?.uniquePagesVisited?.length ?? (totalPages > 0 ? 1 : 0);

  const clampedVisited =
    totalPages > 0 ? Math.min(totalPages, Math.max(1, uniqueVisited)) : 0;
  const coveragePct =
    totalPages > 0 ? Math.min(100, Math.round((clampedVisited / totalPages) * 100)) : 0;
  const remainingPages = Math.max(0, totalPages - currentPage);

  const handleResetCurrentStats = () => {
    if (!bookId) return;
    dispatch(resetBookReadingStats({ bookId, currentPage }));
    onResetSessionTimer?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reading-stats-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.16 }}
            className="relative z-10 w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Reading Stats</span>
                </div>
                <h2
                  id="reading-stats-title"
                  className="mt-1 font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-100 truncate"
                >
                  {bookTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close reading stats"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* Primary Current-Book Metrics (Hairline Grid, Zero Nested Cards) */}
              {bookId ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
                  {/* Metric 1: Time Spent Reading */}
                  <div className="p-6 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Time Spent Reading</span>
                    </div>
                    <p className="font-mono tabular-nums text-3xl font-semibold text-zinc-950 dark:text-zinc-50 tracking-tight">
                      {formatReadingDuration(totalSeconds)}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      Current session · {formatReadingDuration(sessionSeconds)}
                    </p>
                  </div>

                  {/* Metric 2: Pages Per Minute */}
                  <div className="p-6 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <Gauge className="w-3.5 h-3.5 shrink-0" />
                      <span>Reading Pace</span>
                    </div>
                    <p className="font-mono tabular-nums text-3xl font-semibold text-zinc-950 dark:text-zinc-50 tracking-tight">
                      {pagesPerMinute.toFixed(1)}{' '}
                      <span className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
                        pages/min
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      {formatEstimatedRemaining(remainingPages, pagesPerMinute)}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Secondary Current-Book Progress & Coverage Strip */}
              {bookId && totalPages > 0 ? (
                <div className="px-6 py-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Document Coverage &amp; Activity</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      <span>
                        {clampedVisited} of {totalPages} pages visited ({coveragePct}%)
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{pagesReadCount} page turns</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {sessionsCount} {sessionsCount === 1 ? 'session' : 'sessions'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-transform duration-200 origin-left"
                      style={{ transform: `scaleX(${coveragePct / 100})` }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Per-Document Library Stats Breakdown */}
              {recentBooks.length > 0 && (
                <div className="px-6 py-5">
                  <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    All Documents in Library
                  </h3>
                  {/* Mobile Responsive View (< 640px): Document + Progress top justify-between, time + pace bottom */}
                  <div className="sm:hidden divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                    {recentBooks.map((item) => {
                      const stats = readingStatsMap[item.id];
                      const secs = stats?.totalReadingSeconds ?? 0;
                      const ppm = stats?.pagesPerMinute ?? 0;
                      const pct =
                        item.totalPages > 0
                          ? Math.min(
                              100,
                              Math.round((item.lastPage / item.totalPages) * 100)
                            )
                          : 0;
                      const isCurrent = item.id === bookId;

                      return (
                        <div
                          key={`mob-${item.id}`}
                          className={`py-3 px-2 space-y-1.5 transition-colors ${
                            isCurrent
                              ? 'bg-zinc-100/80 dark:bg-zinc-800/50 font-medium'
                              : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                          }`}
                        >
                          {/* Top: Document Title + Progress in justify-between */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                              {item.title}
                            </span>
                            <span className="font-mono tabular-nums text-xs text-zinc-700 dark:text-zinc-300 shrink-0 font-medium">
                              {item.lastPage}/{item.totalPages} ({pct}%)
                            </span>
                          </div>

                          {/* Bottom: Time Spent and Reading Pace */}
                          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tabular-nums pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                            <span>Time: {formatCompactDuration(secs)}</span>
                            <span>Speed: {ppm.toFixed(1)} p/min</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop / Tablet View (>= 640px): SharedTable */}
                  <div className="hidden sm:block">
                    <SharedTable
                      compact
                      data={recentBooks}
                      keyExtractor={(item) => item.id}
                      caption="Document reading activity statistics"
                      rowClassName={(item) =>
                        item.id === bookId
                          ? 'bg-zinc-100/80 dark:bg-zinc-800/50 font-medium'
                          : ''
                      }
                      columns={[
                        {
                          id: 'title',
                          header: 'Document',
                          className: 'max-w-[220px] truncate text-zinc-900 dark:text-zinc-100',
                          sortable: true,
                          sortKey: (item) => item.title,
                          render: (item) => item.title,
                        },
                        {
                          id: 'timeSpent',
                          header: 'Time Spent',
                          align: 'right',
                          className: 'font-mono tabular-nums text-zinc-700 dark:text-zinc-300 whitespace-nowrap',
                          sortable: true,
                          sortKey: (item) => readingStatsMap[item.id]?.totalReadingSeconds ?? 0,
                          render: (item) =>
                            formatCompactDuration(
                              readingStatsMap[item.id]?.totalReadingSeconds ?? 0
                            ),
                        },
                        {
                          id: 'ppm',
                          header: 'Pages / Min',
                          align: 'right',
                          className: 'font-mono tabular-nums text-zinc-700 dark:text-zinc-300 whitespace-nowrap',
                          sortable: true,
                          sortKey: (item) => readingStatsMap[item.id]?.pagesPerMinute ?? 0,
                          render: (item) =>
                            (readingStatsMap[item.id]?.pagesPerMinute ?? 0).toFixed(1),
                        },
                        {
                          id: 'progress',
                          header: 'Progress',
                          align: 'right',
                          className: 'font-mono tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap',
                          sortable: true,
                          sortKey: (item) =>
                            item.totalPages > 0
                              ? Math.round((item.lastPage / item.totalPages) * 100)
                              : 0,
                          render: (item) => {
                            const pct =
                              item.totalPages > 0
                                ? Math.min(
                                    100,
                                    Math.round((item.lastPage / item.totalPages) * 100)
                                  )
                                : 0;
                            return `${item.lastPage}/${item.totalPages} (${pct}%)`;
                          },
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 flex items-center justify-between gap-4 shrink-0">
              {bookId ? (
                <button
                  type="button"
                  onClick={handleResetCurrentStats}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset current book stats</span>
                </button>
              ) : (
                <span />
              )}

              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
