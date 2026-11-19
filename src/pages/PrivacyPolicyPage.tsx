import { useState } from 'react';
import { CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react';
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
import { resetLocalWorkspaceState } from '../features/workspace/workspaceSlice';
import { clearWrittenProgress } from '../features/written/writtenSlice';
import {
  PRIVACY_POLICY_CONTENT,
  PRIVACY_STORAGE_KEY_DESCRIPTIONS,
} from '../data/legalContentData';
import { SITE_CONFIG } from '../data/siteConfig';
import { storageService } from '../services/storageService';

const DAILY_WIDGET_STORAGE_KEY = 'psc_nepal_daily_quiz_v1';

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
  const writtenEvaluationsCount = useAppSelector(
    (state) => state.workspace.writtenEvaluations.length
  );
  const flashcardsCount = useAppSelector(
    (state) => Object.keys(state.workspace.flashcardProgress).length
  );
  const bookmarksChecklistCount = useAppSelector(
    (state) =>
      Object.keys(state.workspace.pyqBookmarks).length +
      Object.keys(state.workspace.affairBookmarks).length +
      Object.keys(state.workspace.examChecklist).length
  );
  const reactionsCount = useAppSelector(
    (state) =>
      Object.keys(state.reactions.userReactions).length +
      Object.keys(state.reactions.itemViews).length
  );

  const [inquiriesCount, setInquiriesCount] = useState(
    () => storageService.loadContactInquiries().length
  );
  const [flaggedCount, setFlaggedCount] = useState(
    () => Object.keys(storageService.loadFlaggedQuestions()).length
  );
  const [hasDailyWidgetState, setHasDailyWidgetState] = useState(() =>
    typeof window !== 'undefined'
      ? Boolean(window.localStorage.getItem(DAILY_WIDGET_STORAGE_KEY))
      : false
  );
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const clearDailyWidgetKey = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(DAILY_WIDGET_STORAGE_KEY);
      } catch {
        // ignore storage errors
      }
    }
    setHasDailyWidgetState(false);
  };

  const handleClearReading = () => {
    dispatch(clearAllReadingData());
    setStatusMessage(
      'Cleared saved reading shelf, last-read page positions, and reading pace statistics.'
    );
  };

  const handleClearQuizzes = () => {
    dispatch(clearQuizHistory());
    clearDailyWidgetKey();
    setStatusMessage(
      'Cleared timed quiz attempt history, question mastery records, and daily widget session state.'
    );
  };

  const handleClearWritten = () => {
    dispatch(clearWrittenProgress());
    setStatusMessage(
      'Cleared saved written answer drafts, rubric checkmarks, and mastery records.'
    );
  };

  const handleClearWorkspaceTools = () => {
    dispatch(resetLocalWorkspaceState());
    setStatusMessage(
      'Cleared written rubric evaluations, Leitner flashcard intervals, PYQ/affairs bookmarks, and exam hall checklist.'
    );
  };

  const handleClearPscPrep = () => {
    dispatch(clearPscSyllabusProgress());
    dispatch(clearSimulationHistory());
    setStatusMessage(
      'Cleared saved PSC syllabus checklists, topic bookmarks, and OMR/written hall simulation history.'
    );
  };

  const handleClearInquiries = () => {
    storageService.clearContactInquiries();
    setInquiriesCount(0);
    setStatusMessage('Cleared saved contact inquiry drafts and tickets.');
  };

  const handleEraseEverything = () => {
    dispatch(clearAllReadingData());
    dispatch(clearQuizHistory());
    dispatch(clearWrittenProgress());
    dispatch(clearPscSyllabusProgress());
    dispatch(clearSimulationHistory());
    dispatch(clearAllReactions());
    dispatch(resetLocalWorkspaceState());
    storageService.clearAllFlaggedQuestions();
    storageService.clearContactInquiries();
    clearDailyWidgetKey();
    setInquiriesCount(0);
    setFlaggedCount(0);
    setConfirmClearAll(false);
    setStatusMessage(
      'All PSC Nepal reading, quiz, written Q&A, evaluations, flashcards, bookmarks, syllabus, simulation, flags, reactions, and inquiry records have been cleared.'
    );
  };

  const storageCountLabels = {
    settings: 'Active preferences',
    recentBooks: `${recentBooksCount} saved`,
    readingProgress: `${progressRecordsCount} records`,
    readingStats: `${statsRecordsCount} records`,
    quizAttempts: `${quizAttemptsCount} attempts`,
    writtenRecords: `${writtenRecordsCount} records`,
    writtenEvaluations: `${writtenEvaluationsCount} scored`,
    pscPrep: `${pscSyllabusAndSimCount} items`,
    flashcards: `${flashcardsCount} cards`,
    bookmarksChecklist: `${bookmarksChecklistCount} saved`,
    flagsReactions: `${flaggedCount} flagged · ${reactionsCount} logs`,
    dailyWidget: hasDailyWidgetState ? 'Active session' : '0 saved',
    inquiries: `${inquiriesCount} logged`,
  };

  const storageRows = PRIVACY_STORAGE_KEY_DESCRIPTIONS.map((item) => ({
    keyName: item.keyName,
    purpose: item.purpose,
    countLabel: storageCountLabels[item.countType],
  }));

  const workspaceToolsCount =
    writtenEvaluationsCount + flashcardsCount + bookmarksChecklistCount;

  const { sections } = PRIVACY_POLICY_CONTENT;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          <article className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
            {/* Header */}
            <header className="space-y-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-8">
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

              <p className="pt-1 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                {PRIVACY_POLICY_CONTENT.intro}
              </p>

              {/* Privacy Key Highlights */}
              <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRIVACY_POLICY_CONTENT.highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-1"
                  >
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.label}
                    </p>
                    <p className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50">
                      {item.value}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Section Navigation */}
              <nav
                aria-label="Privacy policy sections"
                className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs"
              >
                {PRIVACY_POLICY_CONTENT.tableOfContents.map((toc) => (
                  <a
                    key={toc.id}
                    href={`#${toc.id}`}
                    className="font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {toc.label}
                  </a>
                ))}
              </nav>
            </header>

            {/* Policy Sections */}
            <div className="space-y-10 text-fluid-body text-zinc-700 dark:text-zinc-300">
              <section id="privacy-pdf" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.localPdfProcessing.heading}
                </h2>
                <p>
                  {sections.localPdfProcessing.paragraph1Lead}
                  <code className="font-mono text-xs">
                    {sections.localPdfProcessing.paragraph1Code}
                  </code>
                  {sections.localPdfProcessing.paragraph1Trail}
                </p>
                <p>
                  {sections.localPdfProcessing.paragraph2Lead}
                  <code className="font-mono text-xs">
                    {sections.localPdfProcessing.paragraph2Code}
                  </code>
                  {sections.localPdfProcessing.paragraph2Trail}
                </p>
                <p>{sections.localPdfProcessing.paragraph3}</p>
              </section>

              <section id="privacy-auth" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.googleAuth.heading}
                </h2>
                <p>{sections.googleAuth.paragraph1}</p>
                <ul className="space-y-2.5 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800">
                  {sections.googleAuth.bullets.map((b) => (
                    <li key={b.title} className="text-sm leading-relaxed">
                      <span className="font-semibold text-zinc-950 dark:text-zinc-100">
                        {b.title}:{' '}
                      </span>
                      <span>{b.detail}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="privacy-firestore" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.cloudFirestore.heading}
                </h2>
                <p>{sections.cloudFirestore.paragraph1}</p>
                <ul className="space-y-2.5 pl-4 border-l-2 border-blue-200 dark:border-blue-900/70">
                  {sections.cloudFirestore.bullets.map((b) => (
                    <li key={b.title} className="text-sm leading-relaxed">
                      <span className="font-semibold text-zinc-950 dark:text-zinc-100">
                        {b.title}:{' '}
                      </span>
                      <span>{b.detail}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="privacy-storage" className="space-y-4 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.savedRecords.heading}
                </h2>
                <p>{sections.savedRecords.description}</p>

                <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                  {storageRows.map((row) => (
                    <div
                      key={row.keyName}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <p className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 break-all">
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

              <section id="privacy-remote" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.remotePdfLinks.heading}
                </h2>
                <p>
                  {sections.remotePdfLinks.paragraph1Lead}
                  <Link
                    to="/materials"
                    className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                  >
                    {sections.remotePdfLinks.paragraph1LinkLabel}
                  </Link>
                  {sections.remotePdfLinks.paragraph1Trail}
                </p>
                <p>{sections.remotePdfLinks.paragraph2}</p>
              </section>

              <section id="privacy-cookies" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.cookiesAnalytics.heading}
                </h2>
                <p>{sections.cookiesAnalytics.body}</p>
              </section>

              <section id="privacy-rights" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.retentionAndRights.heading}
                </h2>
                <ul className="space-y-2.5 pl-4 border-l-2 border-emerald-200 dark:border-emerald-900/70">
                  {sections.retentionAndRights.bullets.map((b) => (
                    <li key={b.title} className="text-sm leading-relaxed">
                      <span className="font-semibold text-zinc-950 dark:text-zinc-100">
                        {b.title}:{' '}
                      </span>
                      <span>{b.detail}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="privacy-eligibility" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.eligibilityAndChanges.heading}
                </h2>
                <p>{sections.eligibilityAndChanges.paragraph1}</p>
                <p>{sections.eligibilityAndChanges.paragraph2}</p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Privacy Inquiries Desk: {SITE_CONFIG.supportEmail}
                  </span>
                </div>
              </section>

              {/* Interactive Workspace Data Controls */}
              <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {sections.manageData.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    {sections.manageData.lead}
                    <Link
                      to="/progress"
                      className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                    >
                      {sections.manageData.progressLinkLabel}
                    </Link>
                    {sections.manageData.trail}
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
                    onClick={handleClearWorkspaceTools}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      Clear Flashcards, Evals &amp; Bookmarks ({workspaceToolsCount})
                    </span>
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
                  Questions regarding data handling, Firestore synchronization, or account deletion requests can be submitted via our{' '}
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
