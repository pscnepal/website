import { useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { clearAllReadingData } from '../features/library/librarySlice';
import {
  clearPscSyllabusProgress,
  clearSimulationHistory,
} from '../features/psc/pscSlice';
import { clearQuizHistory } from '../features/quiz/quizSlice';
import { clearAllReactions } from '../features/reactions/reactionsSlice';
import { clearWrittenProgress } from '../features/written/writtenSlice';
import { STORAGE_KEYS, storageService } from '../services/storageService';

export function PrivacyPolicyPage() {
  const dispatch = useAppDispatch();

  const recentBooksCount = useAppSelector(
    (state) => state.library.recentBooks.length
  );
  const progressRecordsCount = useAppSelector(
    (state) => Object.keys(state.library.readingProgress).length
  );
  const statsRecordsCount = useAppSelector(
    (state) => Object.keys(state.library.readingStats).length
  );
  const quizAttemptsCount = useAppSelector(
    (state) => state.quiz.attempts.length
  );
  const writtenRecordsCount = useAppSelector(
    (state) => Object.keys(state.written.records).length
  );
  const pscSyllabusAndSimCount = useAppSelector(
    (state) =>
      state.psc.completedUnitIds.length +
      state.psc.completedTopicIds.length +
      state.psc.simulationHistory.length
  );

  const [inquiriesCount, setInquiriesCount] = useState(
    () => storageService.loadContactInquiries().length
  );
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleClearReading = () => {
    dispatch(clearAllReadingData());
    setStatusMessage(
      'Cleared saved reading shelf, last-read page positions, and reading pace statistics from this browser.'
    );
  };

  const handleClearQuizzes = () => {
    dispatch(clearQuizHistory());
    setStatusMessage(
      'Cleared timed quiz attempt history and question mastery records from this browser.'
    );
  };

  const handleClearWritten = () => {
    dispatch(clearWrittenProgress());
    setStatusMessage(
      'Cleared saved written answer drafts, rubric checkmarks, and mastery records from this browser.'
    );
  };

  const handleClearInquiries = () => {
    storageService.clearContactInquiries();
    setInquiriesCount(0);
    setStatusMessage(
      'Cleared saved contact inquiry drafts and tickets from this browser.'
    );
  };

  const handleClearPscPrep = () => {
    dispatch(clearPscSyllabusProgress());
    dispatch(clearSimulationHistory());
    setStatusMessage(
      'Cleared saved PSC syllabus checklists, topic bookmarks, and OMR/written hall simulation history from this browser.'
    );
  };

  const handleEraseEverything = () => {
    dispatch(clearAllReadingData());
    dispatch(clearQuizHistory());
    dispatch(clearWrittenProgress());
    dispatch(clearPscSyllabusProgress());
    dispatch(clearSimulationHistory());
    dispatch(clearAllReactions());
    storageService.clearAllFlaggedQuestions();
    storageService.clearContactInquiries();
    setInquiriesCount(0);
    setConfirmClearAll(false);
    setStatusMessage(
      'All PSC Nepal syllabus, simulation, reading, quiz, written Q&A, flagged questions, reactions, and inquiry records have been cleared.'
    );
  };

  const storageRows = [
    {
      keyName: STORAGE_KEYS.SETTINGS,
      purpose:
        'Stores your preferred Light/Dark appearance, Flipbook vs Standard PDF default, and page-turn audio setting.',
      countLabel: 'Active preferences',
    },
    {
      keyName: STORAGE_KEYS.RECENT_BOOKS,
      purpose:
        'Stores metadata for up to 12 recently opened documents (local blob URLs are stripped prior to saving).',
      countLabel: `${recentBooksCount} saved`,
    },
    {
      keyName: STORAGE_KEYS.READING_PROGRESS,
      purpose:
        'Remembers your last-read page and total page count per document ID so you can resume seamlessly.',
      countLabel: `${progressRecordsCount} records`,
    },
    {
      keyName: STORAGE_KEYS.READING_STATS,
      purpose:
        'Logs active reading seconds, pages turned, unique pages visited, and pages-per-minute pace.',
      countLabel: `${statsRecordsCount} records`,
    },
    {
      keyName: STORAGE_KEYS.QUIZ_STATE,
      purpose:
        'Stores your preferred quiz mode and up to 30 timed PSC quiz attempts with per-question outcomes.',
      countLabel: `${quizAttemptsCount} attempts`,
    },
    {
      keyName: STORAGE_KEYS.WRITTEN_STATE,
      purpose:
        'Stores preferred bilingual language view (EN/नेपाली), local answer drafts, rubric checkmarks, and written question mastery.',
      countLabel: `${writtenRecordsCount} records`,
    },
    {
      keyName: STORAGE_KEYS.PSC_PREP_STATE,
      purpose:
        'Stores your active target PSC cadre, checked syllabus units and topics, bookmarked units, and OMR/written simulation runs.',
      countLabel: `${pscSyllabusAndSimCount} items`,
    },
    {
      keyName: STORAGE_KEYS.CONTACT_INQUIRIES,
      purpose:
        'Stores optional inquiry or question errata notes submitted on the Contact page.',
      countLabel: `${inquiriesCount} logged`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
          {/* Header */}
          <header className="space-y-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link
                to="/"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                Privacy Policy
              </span>
            </div>

            <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Privacy Policy
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
              <span>Effective Date: November 2026</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans">
                Client-Side Local-First Architecture
              </span>
            </div>

            <p className="pt-2 text-fluid-lead text-zinc-600 dark:text-zinc-400">
              PSC Nepal is built as a privacy-respecting, client-side Lok Sewa
              preparation workspace and PDF study reader. Your personal PDF
              files, syllabus checklists, reading positions, and mock exam
              scores remain on your device and are never uploaded to an external
              application database.
            </p>
          </header>

          {/* Policy Sections */}
          <div className="space-y-10 text-fluid-body text-zinc-700 dark:text-zinc-300">
            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                1. Local PDF Processing &amp; Zero File Uploads
              </h2>
              <p>
                When you open a PDF from your computer or mobile device using
                the file picker or drag-and-drop intake, PSC Nepal renders every
                page locally inside your browser&rsquo;s memory using Web
                Workers (<code className="font-mono text-xs">pdfjs-dist</code>).
              </p>
              <p>
                Temporary <code className="font-mono text-xs">blob:</code>{' '}
                object URLs exist strictly for your active browser tab session
                and are automatically revoked when you close or reload the tab.
                Your private books, notes, and documents are never transmitted
                to external servers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                2. Browser LocalStorage Inventory
              </h2>
              <p>
                To preserve your syllabus progress, reading positions,
                dark/light theme preferences, and timed PSC quiz mastery across
                sessions without requiring an account login, PSC Nepal stores
                structured JSON records in your browser&rsquo;s{' '}
                <code className="font-mono text-xs">window.localStorage</code>:
              </p>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                {storageRows.map((row) => (
                  <div
                    key={row.keyName}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <p className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {row.keyName}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        {row.purpose}
                      </p>
                    </div>
                    <span className="font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
                      {row.countLabel}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                3. Remote PDF Links &amp; Third-Party Requests
              </h2>
              <p>
                When you paste a remote HTTPS PDF link into the URL reader, your
                browser requests that PDF directly from the origin domain you
                specified. That external host may log standard HTTP request
                headers (such as IP address and User-Agent) under its own
                privacy policy. Curated study documents in{' '}
                <Link
                  to="/materials"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  Study Materials
                </Link>{' '}
                are served directly from the same origin as PSC Nepal.
              </p>
              <p>
                PSC Nepal loads web typography (Fraunces, Plus Jakarta Sans,
                Noto Sans Devanagari, and JetBrains Mono) from Google Fonts to
                ensure legible Devanagari, serif, and tabular numeric rendering.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                4. Cookies, Analytics &amp; Advertising
              </h2>
              <p>
                PSC Nepal does not set advertising cookies, cross-site tracking
                pixels, or behavioral profiling scripts. Page-turn sound effects
                are synthesized locally via the browser&rsquo;s Web Audio API.
              </p>
            </section>

            {/* Interactive Local Data Controls */}
            <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="font-serif text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  5. Manage or Erase Your Local Browser Data
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  You have direct, immediate control over every record stored by
                  PSC Nepal in this browser, and you can inspect your full study
                  breakdown anytime on the{' '}
                  <Link
                    to="/progress"
                    className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                  >
                    Progress
                  </Link>{' '}
                  page.
                </p>
              </div>

              {statusMessage && (
                <div
                  role="status"
                  className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleClearReading}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Clear Reading Data ({progressRecordsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearQuizzes}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Clear Quiz History ({quizAttemptsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearWritten}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Clear Written Q&amp;A ({writtenRecordsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearPscPrep}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Clear Syllabus &amp; Sim ({pscSyllabusAndSimCount})
                  </span>
                </button>

                {inquiriesCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearInquiries}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Clear Inquiry Log ({inquiriesCount})</span>
                  </button>
                )}

                {!confirmClearAll ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(true)}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-white dark:bg-zinc-900 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Erase All Local Data</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleEraseEverything}
                      className="h-9 px-3.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Confirm Erase All
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(false)}
                      className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                Questions regarding data handling or privacy practices can be
                submitted via our{' '}
                <Link
                  to="/contact"
                  className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
                >
                  Contact page
                </Link>{' '}
                or reviewed alongside our{' '}
                <Link
                  to="/terms"
                  className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
