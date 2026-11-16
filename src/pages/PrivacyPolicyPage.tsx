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
import {
  PRIVACY_POLICY_CONTENT,
  PRIVACY_STORAGE_KEY_DESCRIPTIONS,
} from '../data/legalContentData';
import { storageService } from '../services/storageService';

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
      'Cleared saved reading shelf, last-read page positions, and reading pace statistics.'
    );
  };

  const handleClearQuizzes = () => {
    dispatch(clearQuizHistory());
    setStatusMessage(
      'Cleared timed quiz attempt history and question mastery records.'
    );
  };

  const handleClearWritten = () => {
    dispatch(clearWrittenProgress());
    setStatusMessage(
      'Cleared saved written answer drafts, rubric checkmarks, and mastery records.'
    );
  };

  const handleClearInquiries = () => {
    storageService.clearContactInquiries();
    setInquiriesCount(0);
    setStatusMessage(
      'Cleared saved contact inquiry drafts and tickets.'
    );
  };

  const handleClearPscPrep = () => {
    dispatch(clearPscSyllabusProgress());
    dispatch(clearSimulationHistory());
    setStatusMessage(
      'Cleared saved PSC syllabus checklists, topic bookmarks, and OMR/written hall simulation history.'
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

  const storageCountLabels = {
    settings: 'Active preferences',
    recentBooks: `${recentBooksCount} saved`,
    readingProgress: `${progressRecordsCount} records`,
    readingStats: `${statsRecordsCount} records`,
    quizAttempts: `${quizAttemptsCount} attempts`,
    writtenRecords: `${writtenRecordsCount} records`,
    pscPrep: `${pscSyllabusAndSimCount} items`,
    inquiries: `${inquiriesCount} logged`,
  };

  const storageRows = PRIVACY_STORAGE_KEY_DESCRIPTIONS.map((item) => ({
    keyName: item.keyName,
    purpose: item.purpose,
    countLabel: storageCountLabels[item.countType],
  }));

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
                {PRIVACY_POLICY_CONTENT.breadcrumbLabel}
              </span>
            </div>

            <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {PRIVACY_POLICY_CONTENT.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
              <span>{PRIVACY_POLICY_CONTENT.effectiveDateLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans">
                {PRIVACY_POLICY_CONTENT.subtitle}
              </span>
            </div>

            <p className="pt-2 text-fluid-lead text-zinc-600 dark:text-zinc-400">
              {PRIVACY_POLICY_CONTENT.intro}
            </p>
          </header>

          {/* Policy Sections */}
          <div className="space-y-10 text-fluid-body text-zinc-700 dark:text-zinc-300">
            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.heading}
              </h2>
              <p>
                {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.paragraph1Lead}
                <code className="font-mono text-xs">
                  {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.paragraph1Code}
                </code>
                {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.paragraph1Trail}
              </p>
              <p>
                {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.paragraph2Lead}
                <code className="font-mono text-xs">
                  {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.paragraph2Code}
                </code>
                {PRIVACY_POLICY_CONTENT.sections.localPdfProcessing.paragraph2Trail}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {PRIVACY_POLICY_CONTENT.sections.savedRecords.heading}
              </h2>
              <p>
                {PRIVACY_POLICY_CONTENT.sections.savedRecords.description}
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
                {PRIVACY_POLICY_CONTENT.sections.remotePdfLinks.heading}
              </h2>
              <p>
                {PRIVACY_POLICY_CONTENT.sections.remotePdfLinks.paragraph1Lead}
                <Link
                  to="/materials"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  {PRIVACY_POLICY_CONTENT.sections.remotePdfLinks.paragraph1LinkLabel}
                </Link>
                {PRIVACY_POLICY_CONTENT.sections.remotePdfLinks.paragraph1Trail}
              </p>
              <p>
                {PRIVACY_POLICY_CONTENT.sections.remotePdfLinks.paragraph2}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {PRIVACY_POLICY_CONTENT.sections.cookiesAnalytics.heading}
              </h2>
              <p>
                {PRIVACY_POLICY_CONTENT.sections.cookiesAnalytics.body}
              </p>
            </section>

            {/* Interactive Workspace Data Controls */}
            <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="font-serif text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {PRIVACY_POLICY_CONTENT.sections.manageData.heading}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {PRIVACY_POLICY_CONTENT.sections.manageData.lead}
                  <Link
                    to="/progress"
                    className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                  >
                    {PRIVACY_POLICY_CONTENT.sections.manageData.progressLinkLabel}
                  </Link>
                  {PRIVACY_POLICY_CONTENT.sections.manageData.trail}
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
                    <span>Erase All Workspace Data</span>
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
