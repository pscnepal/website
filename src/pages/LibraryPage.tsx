import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { RecentBooks } from '../components/home/RecentBooks';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { formatCompactDuration } from '../utils/pdfHelpers';

export function LibraryPage() {
  const recentBooks = useAppSelector((state) => state.library.recentBooks);
  const readingStats = useAppSelector((state) => state.library.readingStats);

  const summary = useMemo(() => {
    let totalSeconds = 0;
    let totalPagesRead = 0;
    for (const book of recentBooks) {
      const st = readingStats[book.id];
      if (st) {
        totalSeconds += st.totalReadingSeconds;
        totalPagesRead += st.pagesReadCount;
      }
    }
    const avgPpm =
      totalSeconds > 0
        ? Math.round((totalPagesRead / (totalSeconds / 60)) * 100) / 100
        : 0;

    return {
      booksCount: recentBooks.length,
      totalSeconds,
      totalPagesRead,
      avgPpm,
    };
  }, [recentBooks, readingStats]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
                <Link
                  to="/"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Library
                </span>
              </div>

              <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Personal Reading Library
              </h1>
              <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                Resume any recently opened book from your saved page and inspect per-document reading time and pace stored locally in your browser.
              </p>
            </div>

            <div className="max-w-full overflow-x-auto inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs shrink-0">
              <Link
                to="/materials"
                className="px-3 py-1.5 rounded-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors whitespace-nowrap shrink-0"
              >
                PSC Study Catalog
              </Link>
              <Link
                to="/library"
                aria-current="page"
                className="px-3 py-1.5 rounded-md font-medium bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs whitespace-nowrap shrink-0"
              >
                Personal Library
              </Link>
              <Link
                to="/read"
                className="px-3 py-1.5 rounded-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors whitespace-nowrap shrink-0"
              >
                Open Reader
              </Link>
            </div>
          </div>

          {/* Unboxed Aggregate Reading Metrics Strip (when history exists) */}
          {summary.booksCount > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 py-6 border-y border-zinc-200/80 dark:border-zinc-800/80">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Saved Documents
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                  {summary.booksCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Active Reading Time
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                  {summary.totalSeconds > 0
                    ? formatCompactDuration(summary.totalSeconds)
                    : '0s'}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Pages Turned
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                  {summary.totalPagesRead}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Average Pace
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                  {summary.avgPpm.toFixed(1)}{' '}
                  <span className="text-xs font-sans font-normal text-zinc-500 dark:text-zinc-400">
                    pages/min
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Recent Books List or Empty State */}
          <RecentBooks showEmptyState />
        </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
