import { useRef, useState, type ChangeEvent } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  FolderOpen,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearRecentBooks,
  removeRecentBook,
  setCurrentBook,
} from '../../features/library/librarySlice';
import {
  getLocalPdfSessionEntry,
  registerLocalPdfFile,
} from '../../services/pdfService';
import type { RecentBookEntry } from '../../types/pdf';
import {
  formatBytes,
  formatCompactDuration,
  formatRelativeDate,
} from '../../utils/pdfHelpers';
import { ReadingStatsView } from '../reader/ReadingStatsView';

interface RecentBooksProps {
  showEmptyState?: boolean;
}

export function RecentBooks({ showEmptyState = false }: RecentBooksProps) {
  const recentBooks = useAppSelector((state) => state.library.recentBooks);
  const readingStats = useAppSelector((state) => state.library.readingStats);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const relinkInputRef = useRef<HTMLInputElement | null>(null);
  const pendingBookRef = useRef<RecentBookEntry | null>(null);
  const [statsBook, setStatsBook] = useState<RecentBookEntry | null>(null);

  if (recentBooks.length === 0) {
    if (!showEmptyState) {
      return null;
    }

    return (
      <div className="py-16 px-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white/50 dark:bg-zinc-900/40">
        <div className="w-11 h-11 mx-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
          <BookOpen className="w-5 h-5" />
        </div>
        <h2 className="mt-4 font-serif text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Your reading library is empty
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Documents you open from a PDF link, local file upload, or curated reading collections automatically save your last-read page and reading pace here.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/materials"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            Browse Books &amp; Materials
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            Open PDF URL or Local File
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenRecent = (book: RecentBookEntry) => {
    const navState = { from: '/library', fromLabel: 'Back to Library' };

    if (book.sourceType === 'url' && book.url) {
      navigate(`/read?url=${encodeURIComponent(book.url)}`, {
        state: navState,
      });
      return;
    }

    // Local file: check if still registered in current browser tab session
    const activeSession = getLocalPdfSessionEntry(book.id);
    if (activeSession) {
      dispatch(
        setCurrentBook({
          id: activeSession.id,
          title: book.title,
          author: book.author,
          sourceType: 'local',
          url: activeSession.objectUrl,
          fileName: activeSession.fileName,
          fileSize: activeSession.fileSize,
          totalPages: book.totalPages,
        })
      );
      navigate(`/read?source=local&id=${encodeURIComponent(activeSession.id)}`, {
        state: navState,
      });
      return;
    }

    // Prompt user to re-select local file so we can jump straight to their saved lastPage
    pendingBookRef.current = book;
    relinkInputRef.current?.click();
  };

  const handleRelinkFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const sessionEntry = registerLocalPdfFile(file);
    dispatch(
      setCurrentBook({
        id: sessionEntry.id,
        title: pendingBookRef.current?.title || sessionEntry.title,
        sourceType: 'local',
        url: sessionEntry.objectUrl,
        fileName: sessionEntry.fileName,
        fileSize: sessionEntry.fileSize,
      })
    );
    pendingBookRef.current = null;
    navigate(`/read?source=local&id=${encodeURIComponent(sessionEntry.id)}`, {
      state: { from: '/library', fromLabel: 'Back to Library' },
    });
  };

  return (
    <div>
      <input
        ref={relinkInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleRelinkFile}
        className="hidden"
      />

      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Documents
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Pick up directly from your last-read page across recent books and study materials.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setStatsBook(recentBooks[0] ?? null)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Reading Stats</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(clearRecentBooks())}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Clear history
          </button>
        </div>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
        {recentBooks.map((book) => {
          const pct =
            book.totalPages > 0
              ? Math.min(100, Math.round((book.lastPage / book.totalPages) * 100))
              : 0;
          const isLocalSessionActive =
            book.sourceType === 'local'
              ? Boolean(getLocalPdfSessionEntry(book.id))
              : true;
          const docStats = readingStats[book.id];

          return (
            <div
              key={book.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleOpenRecent(book)}
                  className="text-left group/title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded cursor-pointer max-w-full"
                >
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover/title:text-blue-700 dark:group-hover/title:text-blue-400 transition-colors truncate">
                    {book.title}
                  </h3>
                </button>

                {/* Zero-pill unboxed metadata with typographic separators */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-sans">
                    {book.sourceType === 'local' ? 'Local PDF' : 'Web URL'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Page {book.lastPage} of {book.totalPages} ({pct}%)
                  </span>
                  {docStats && docStats.totalReadingSeconds > 0 ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {formatCompactDuration(docStats.totalReadingSeconds)} read
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{docStats.pagesPerMinute.toFixed(1)} pages/min</span>
                    </>
                  ) : null}
                  {book.fileSize ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{formatBytes(book.fileSize)}</span>
                    </>
                  ) : null}
                  <span aria-hidden="true">·</span>
                  <span className="font-sans">
                    {formatRelativeDate(book.lastOpenedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden md:block w-28 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-crimson-700 dark:bg-crimson-500 rounded-full transition-transform duration-200 origin-left"
                    style={{ transform: `scaleX(${pct / 100})` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRecent(book)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {book.sourceType === 'local' && !isLocalSessionActive ? (
                    <>
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Locate &amp; Resume</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Resume</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStatsBook(book)}
                  aria-label={`View reading stats for ${book.title}`}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(removeRecentBook(book.id))}
                  aria-label={`Remove ${book.title} from reading history`}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ReadingStatsView
        open={Boolean(statsBook)}
        bookId={statsBook?.id ?? null}
        bookTitle={statsBook?.title ?? 'Library Reading Stats'}
        currentPage={statsBook?.lastPage ?? 1}
        totalPages={statsBook?.totalPages ?? 0}
        sessionSeconds={0}
        onClose={() => setStatsBook(null)}
      />
    </div>
  );
}
