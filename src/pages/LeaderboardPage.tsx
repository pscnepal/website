import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Loader2,
  PenLine,
  RefreshCw,
  Search,
  Trophy,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { GoogleLogoIcon } from '../components/auth/QuizAuthGate';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import { PSC_CADRE_SYLLABI } from '../data/pscSyllabusData';
import {
  fetchOwnLeaderboardEntry,
  fetchPublicLeaderboard,
  subscribeToPublicLeaderboard,
  upsertLeaderboardEntryInFirestore,
} from '../services/cloudSyncService';
import { toast } from '../services/toastService';
import type {
  LeaderboardCategory,
  LeaderboardEntry,
  PscCadreId,
} from '../types';
import { formatUserFriendlyError } from '../utils/errorHelpers';
import {
  buildLeaderboardStatsPayload,
  computeQuizCategoryScore,
  computeReadingCategoryScore,
  computeWrittenCategoryScore,
  formatReadingDurationShort,
  sortLeaderboardEntries,
} from '../utils/leaderboardHelpers';

const CADRE_SHORT_LABELS: Record<PscCadreId, string> = {
  'section-officer': 'Section Officer',
  'nayab-subba': 'Nayab Subba',
  kharidar: 'Kharidar',
};

const CATEGORY_TABS: ReadonlyArray<{
  id: LeaderboardCategory;
  label: string;
  shortDesc: string;
}> = [
  {
    id: 'overall',
    label: 'Overall Rank',
    shortDesc: 'Combined Reading + Written + Quiz XP',
  },
  {
    id: 'reading',
    label: 'Reading',
    shortDesc: 'Books opened, pages read & reading duration',
  },
  {
    id: 'written',
    label: 'Written',
    shortDesc: 'Drafts practiced, mastered, words & rubric evals',
  },
  {
    id: 'quiz',
    label: 'Quiz & OMR',
    shortDesc: 'Quizzes, hall runs, questions solved & net score',
  },
];

function AspirantAvatar({
  name,
  photoURL,
  sizeClass = 'w-9 h-9 text-xs',
}: {
  name: string;
  photoURL?: string;
  sizeClass?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const initial = (name.trim().slice(0, 1) || 'A').toUpperCase();
  const canShowImg = Boolean(photoURL && failedUrl !== photoURL);

  if (canShowImg && photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailedUrl(photoURL)}
        className={`${sizeClass} rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} rounded-full bg-blue-700 text-white font-semibold inline-flex items-center justify-center shrink-0`}
    >
      {initial}
    </span>
  );
}

function formatPrimaryMetricValue(
  entry: LeaderboardEntry,
  category: LeaderboardCategory
): { value: string; unit: string } {
  if (category === 'reading') {
    return {
      value: entry.totalPagesRead.toLocaleString(),
      unit: `${entry.booksReadCount} ${
        entry.booksReadCount === 1 ? 'book' : 'books'
      } · ${formatReadingDurationShort(entry.readingMinutes)}`,
    };
  }
  if (category === 'written') {
    return {
      value: entry.writtenWordsCount.toLocaleString(),
      unit: `${entry.writtenPracticedCount} practiced · ${entry.writtenMasteredCount} mastered`,
    };
  }
  if (category === 'quiz') {
    return {
      value: entry.quizQuestionsSolved.toLocaleString(),
      unit: `${entry.quizAvgAccuracy}% acc · Net ${entry.quizTotalNetScore.toFixed(1)}`,
    };
  }
  return {
    value: entry.totalScore.toLocaleString(),
    unit: 'Study XP',
  };
}

function getCategorySortPoints(
  entry: LeaderboardEntry,
  category: LeaderboardCategory
): number {
  if (category === 'reading') return computeReadingCategoryScore(entry);
  if (category === 'written') return computeWrittenCategoryScore(entry);
  if (category === 'quiz') return computeQuizCategoryScore(entry);
  return entry.totalScore;
}

export function LeaderboardPage() {
  const { user, isAuthReady, isSigningIn, signInWithGoogle } = useAuth();

  const recentBooks = useAppSelector((state) => state.library.recentBooks);
  const readingProgress = useAppSelector(
    (state) => state.library.readingProgress
  );
  const readingStats = useAppSelector((state) => state.library.readingStats);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const writtenEvaluations = useAppSelector(
    (state) => state.workspace.writtenEvaluations
  );
  const quizAttempts = useAppSelector((state) => state.quiz.attempts);
  const simulationHistory = useAppSelector(
    (state) => state.psc.simulationHistory
  );
  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [ownEntry, setOwnEntry] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<LeaderboardCategory>('overall');
  const [cadreFilter, setCadreFilter] = useState<'all' | PscCadreId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScoringGuide, setShowScoringGuide] = useState(false);
  const [isSyncingOwn, setIsSyncingOwn] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  const localComputedStats = useMemo(() => {
    return buildLeaderboardStatsPayload({
      userId: user?.uid || 'guest-preview',
      displayName:
        user?.displayName?.trim() ||
        user?.email?.split('@')[0] ||
        'Your Study Session',
      photoURL: user?.photoURL || undefined,
      targetCadre: targetCadreId,
      isPublic: ownEntry ? ownEntry.isPublic : true,
      recentBooks,
      readingProgress,
      readingStats,
      writtenRecords,
      writtenEvaluations,
      quizAttempts,
      simulationHistory,
    });
  }, [
    user,
    targetCadreId,
    ownEntry,
    recentBooks,
    readingProgress,
    readingStats,
    writtenRecords,
    writtenEvaluations,
    quizAttempts,
    simulationHistory,
  ]);

  // Real-time public subscription to visible leaderboard entries
  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);

    const unsubscribe = subscribeToPublicLeaderboard(
      (list) => {
        setEntries(list);
        setIsLoading(false);
        setLoadError(null);
      },
      (error) => {
        setLoadError(
          formatUserFriendlyError(
            error,
            'Could not load the public leaderboard right now.'
          )
        );
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Load own entry cleanly (even when hidden with isPublic: false)
  useEffect(() => {
    if (!isAuthReady || !user || !user.emailVerified) {
      setOwnEntry(null);
      return;
    }

    let cancelled = false;
    void fetchOwnLeaderboardEntry(user.uid)
      .then((entry) => {
        if (!cancelled) {
          setOwnEntry(entry);
        }
      })
      .catch(() => {
        // Non-blocking: localComputedStats remains available immediately
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthReady, user, entries.length]);

  const handleManualRefresh = useCallback(async () => {
    setLoadError(null);
    setIsLoading(true);
    try {
      const fresh = await fetchPublicLeaderboard();
      setEntries(fresh);
    } catch (error) {
      setLoadError(
        formatUserFriendlyError(
          error,
          'Could not refresh leaderboard entries right now.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSyncMyStats = useCallback(async () => {
    if (!user || !user.emailVerified) return;
    setIsSyncingOwn(true);
    try {
      const saved = await upsertLeaderboardEntryInFirestore(
        user.uid,
        localComputedStats
      );
      if (saved) {
        setOwnEntry(saved);
        toast.success('Your study progress is synced with the leaderboard.', {
          id: 'lb-sync-ok',
        });
      }
    } catch (error) {
      toast.error(
        formatUserFriendlyError(
          error,
          'Could not sync your study stats right now.'
        ),
        { id: 'lb-sync-err' }
      );
    } finally {
      setIsSyncingOwn(false);
    }
  }, [user, localComputedStats]);

  const handleTogglePublicVisibility = useCallback(async () => {
    if (!user || !user.emailVerified) return;
    const currentVisibility = ownEntry ? ownEntry.isPublic : true;
    const nextVisibility = !currentVisibility;
    setIsTogglingVisibility(true);
    try {
      const saved = await upsertLeaderboardEntryInFirestore(
        user.uid,
        {
          ...localComputedStats,
          isPublic: nextVisibility,
        },
        { overrideIsPublic: nextVisibility }
      );
      if (saved) {
        setOwnEntry(saved);
        toast.info(
          nextVisibility
            ? 'Your profile is now visible on the public leaderboard.'
            : 'Your profile is now hidden from the public leaderboard.',
          { id: 'lb-visibility' }
        );
      }
    } catch (error) {
      toast.error(
        formatUserFriendlyError(
          error,
          'Could not update leaderboard visibility.'
        ),
        { id: 'lb-vis-err' }
      );
    } finally {
      setIsTogglingVisibility(false);
    }
  }, [user, ownEntry, localComputedStats]);

  const cohortTotals = useMemo(() => {
    let pagesRead = 0;
    let wordsWritten = 0;
    let quizSolved = 0;
    for (const item of entries) {
      pagesRead += item.totalPagesRead;
      wordsWritten += item.writtenWordsCount;
      quizSolved += item.quizQuestionsSolved;
    }
    return {
      aspirantsCount: entries.length,
      pagesRead,
      wordsWritten,
      quizSolved,
    };
  }, [entries]);

  const rankedFilteredEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filtered = entries.filter((entry) => {
      if (cadreFilter !== 'all' && entry.targetCadre !== cadreFilter) {
        return false;
      }
      if (
        normalizedSearch &&
        !entry.displayName.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }
      return true;
    });
    return sortLeaderboardEntries(filtered, activeCategory);
  }, [entries, cadreFilter, searchQuery, activeCategory]);

  const overallSortedEntries = useMemo(
    () => sortLeaderboardEntries(entries, activeCategory),
    [entries, activeCategory]
  );

  const currentUserGlobalRank = useMemo(() => {
    if (!user) return null;
    const idx = overallSortedEntries.findIndex((e) => e.userId === user.uid);
    return idx >= 0 ? idx + 1 : null;
  }, [user, overallSortedEntries]);

  const podiumEntries = useMemo(
    () => rankedFilteredEntries.slice(0, 3),
    [rankedFilteredEntries]
  );

  const effectiveIsPublic = ownEntry ? ownEntry.isPublic : true;

  const displaySelfSummary: LeaderboardEntry = useMemo(() => {
    if (ownEntry && ownEntry.totalScore >= localComputedStats.totalScore) {
      return ownEntry;
    }
    return {
      ...localComputedStats,
      createdAt: ownEntry?.createdAt ?? null,
      updatedAt: ownEntry?.updatedAt ?? null,
    };
  }, [ownEntry, localComputedStats]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
            {/* Breadcrumb & Hero Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
                    Leaderboard
                  </span>
                </div>

                <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  Public Aspirants Study Leaderboard
                </h1>
                <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                  See how Lok Sewa aspirants across Nepal are reading reference
                  PDFs, practicing Paper II–IV written answers, and solving
                  timed MCQ and OMR mock sets.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowScoringGuide((v) => !v)}
                  aria-expanded={showScoringGuide}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                  <span>Scoring Formula</span>
                  {showScoringGuide ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void handleManualRefresh()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Expandable Transparent Scoring Guide */}
            {showScoringGuide && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      How Study XP &amp; Category Rankings Work
                    </h2>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      All public rankings are computed automatically from
                      verified activity counters. Private account identifiers
                      such as emails and phone numbers are never stored or
                      exposed on the leaderboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScoringGuide(false)}
                    aria-label="Close scoring guide"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 p-4 space-y-1.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      01. Reading Activity
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono tabular-nums">
                      +2 XP / min · +1 XP / page · +10 XP / book
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Tracked automatically while turning pages and studying
                      PDFs in Flipbook or Scroll Reader mode.
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 p-4 space-y-1.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      02. Written Practice
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono tabular-nums">
                      +20 XP / practiced · +30 XP / mastered · +25 XP / eval ·
                      +1 XP / 50 words
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Rewards drafting Paper II–IV analytical answers, mastering
                      rubric checklists, and logging Answer Evaluator reviews.
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 p-4 space-y-1.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      03. Quiz &amp; OMR Hall
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono tabular-nums">
                      +15 XP / quiz · +30 XP / hall · +1 XP / Q · +2 XP / net
                      mark
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Rewards timed MCQ drills, Daily Current Affairs quizzes,
                      and full OMR exam hall simulations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Status / Opt-In Card */}
            {isAuthReady &&
              (user ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <AspirantAvatar
                        name={displaySelfSummary.displayName}
                        photoURL={displaySelfSummary.photoURL}
                        sizeClass="w-12 h-12 text-sm"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-semibold text-zinc-950 dark:text-zinc-50 text-sm truncate">
                            {displaySelfSummary.displayName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {CADRE_SHORT_LABELS[displaySelfSummary.targetCadre]}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums font-medium text-blue-700 dark:text-blue-400">
                            {effectiveIsPublic && currentUserGlobalRank
                              ? `Rank #${currentUserGlobalRank}`
                              : effectiveIsPublic
                                ? 'Syncing Rank'
                                : 'Private (Hidden)'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 font-mono tabular-nums">
                          <span>
                            Read: {displaySelfSummary.booksReadCount} books /{' '}
                            {displaySelfSummary.totalPagesRead.toLocaleString()}{' '}
                            pgs ({formatReadingDurationShort(displaySelfSummary.readingMinutes)})
                          </span>
                          <span>
                            Written: {displaySelfSummary.writtenPracticedCount}{' '}
                            practiced / {displaySelfSummary.writtenMasteredCount}{' '}
                            mastered ({displaySelfSummary.writtenWordsCount.toLocaleString()}{' '}
                            words)
                          </span>
                          <span>
                            Quiz: {displaySelfSummary.quizQuestionsSolved.toLocaleString()}{' '}
                            Qs ({displaySelfSummary.quizAvgAccuracy}% acc · Net{' '}
                            {displaySelfSummary.quizTotalNetScore.toFixed(1)})
                          </span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {displaySelfSummary.totalScore.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={effectiveIsPublic}
                        disabled={isTogglingVisibility}
                        onClick={() => void handleTogglePublicVisibility()}
                        className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60 ${
                          effectiveIsPublic
                            ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50'
                            : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/80 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {isTogglingVisibility ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : effectiveIsPublic ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {effectiveIsPublic
                            ? 'Public Profile: On'
                            : 'Public Profile: Off'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isSyncingOwn}
                        onClick={() => void handleSyncMyStats()}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-xs font-medium transition-colors disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isSyncingOwn ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Sync My Stats</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-1.5 min-w-0">
                      <h2 className="font-serif text-base font-semibold text-zinc-950 dark:text-zinc-50">
                        Join the Public Cohort Leaderboard
                      </h2>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Sign in with Google to publish your Reading, Written,
                        and Quiz counts automatically (no email or private drafts
                        are ever shared publicly).
                      </p>
                      <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        Local session preview:{' '}
                        {localComputedStats.booksReadCount} books ·{' '}
                        {localComputedStats.totalPagesRead.toLocaleString()} pgs ·{' '}
                        {localComputedStats.writtenPracticedCount} written ·{' '}
                        {localComputedStats.quizQuestionsSolved.toLocaleString()}{' '}
                        MCQs ({localComputedStats.totalScore.toLocaleString()}{' '}
                        XP)
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSigningIn}
                      onClick={() => void signInWithGoogle()}
                      className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-xs font-medium transition-colors disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {isSigningIn ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <GoogleLogoIcon className="w-4 h-4" />
                      )}
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* Unboxed Top Cohort Totals */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-zinc-200/80 dark:border-zinc-800/80">
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Public Aspirants
                </p>
                <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                  {cohortTotals.aspirantsCount.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Verified opt-in profiles
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Total Pages Read
                </p>
                <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                  {cohortTotals.pagesRead.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Combined PDF reading volume
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Written Words Drafted
                </p>
                <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                  {cohortTotals.wordsWritten.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Paper II–IV subjective practice
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Questions &amp; OMR Solved
                </p>
                <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                  {cohortTotals.quizSolved.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Timed MCQs &amp; mock halls
                </p>
              </div>
            </div>

            {/* Category Tabs + Search + Cadre Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Leaderboard ranking category"
                className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 sm:w-56">
                  <Search
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search aspirant..."
                    aria-label="Search aspirant by name"
                    className="w-full h-9 pl-8 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={cadreFilter}
                  onChange={(e) =>
                    setCadreFilter(e.target.value as 'all' | PscCadreId)
                  }
                  aria-label="Filter by target cadre"
                  className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All PSC Cadres</option>
                  {PSC_CADRE_SYLLABI.map((cadre) => (
                    <option key={cadre.id} value={cadre.id}>
                      {cadre.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Tab Subtitle */}
            <div className="flex items-center justify-between gap-4 -mt-5 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {CATEGORY_TABS.find((t) => t.id === activeCategory)?.shortDesc}
              </span>
              <span className="font-mono tabular-nums">
                Showing {rankedFilteredEntries.length} of {entries.length}
              </span>
            </div>

            {/* Loading / Error / Empty / Content */}
            {isLoading && entries.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-700 dark:text-blue-400 mx-auto" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Loading live aspirant rankings...
                </p>
              </div>
            ) : loadError && entries.length === 0 ? (
              <div className="rounded-xl border border-crimson-200 dark:border-crimson-900/60 bg-white dark:bg-zinc-900 p-8 text-center space-y-3">
                <p className="text-sm font-medium text-crimson-700 dark:text-crimson-400">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => void handleManualRefresh()}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 text-xs font-medium cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : rankedFilteredEntries.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center space-y-3">
                <Trophy className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                <h3 className="font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {entries.length === 0
                    ? 'Be the first aspirant on the public leaderboard'
                    : 'No matching aspirants for this filter'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  {entries.length === 0
                    ? 'Sign in with Google and start reading PDFs, practicing written answers, or solving timed MCQs to claim the #1 spot.'
                    : 'Try clearing your search query or switching to All PSC Cadres.'}
                </p>
                {(searchQuery || cadreFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCadreFilter('all');
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Top 3 Spotlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {podiumEntries.map((entry, idx) => {
                    const rank = idx + 1;
                    const primaryMetric = formatPrimaryMetricValue(
                      entry,
                      activeCategory
                    );
                    const isSelf = Boolean(user && entry.userId === user.uid);
                    const rankLabel =
                      rank === 1
                        ? '1st Place'
                        : rank === 2
                          ? '2nd Place'
                          : '3rd Place';
                    const medalColor =
                      rank === 1
                        ? 'text-amber-600 dark:text-amber-400'
                        : rank === 2
                          ? 'text-zinc-500 dark:text-zinc-300'
                          : 'text-crimson-700 dark:text-crimson-400';

                    return (
                      <div
                        key={entry.userId}
                        className={`rounded-xl border bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between gap-5 ${
                          isSelf
                            ? 'border-blue-600/60 dark:border-blue-500/60'
                            : 'border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span
                              className={`inline-flex items-center gap-1.5 font-mono tabular-nums font-semibold ${medalColor}`}
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>{rankLabel}</span>
                            </span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              {CADRE_SHORT_LABELS[entry.targetCadre]}
                              {isSelf ? ' · You' : ''}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 min-w-0">
                            <AspirantAvatar
                              name={entry.displayName}
                              photoURL={entry.photoURL}
                              sizeClass="w-11 h-11 text-sm"
                            />
                            <div className="min-w-0">
                              <h3 className="font-serif text-base font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                                {entry.displayName}
                              </h3>
                              <p className="font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400">
                                {primaryMetric.value} {primaryMetric.unit}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                          <div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              Reading
                            </p>
                            <p className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                              {entry.totalPagesRead.toLocaleString()} pgs
                            </p>
                            <p className="font-mono tabular-nums text-[11px] text-zinc-500 dark:text-zinc-400">
                              {entry.booksReadCount} books ·{' '}
                              {formatReadingDurationShort(entry.readingMinutes)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              Written
                            </p>
                            <p className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                              {entry.writtenPracticedCount} qs
                            </p>
                            <p className="font-mono tabular-nums text-[11px] text-zinc-500 dark:text-zinc-400">
                              {entry.writtenMasteredCount} done ·{' '}
                              {entry.writtenWordsCount.toLocaleString()}w
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              Quiz
                            </p>
                            <p className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                              {entry.quizQuestionsSolved.toLocaleString()} Qs
                            </p>
                            <p className="font-mono tabular-nums text-[11px] text-zinc-500 dark:text-zinc-400">
                              {entry.quizAvgAccuracy}% ·{' '}
                              {entry.quizAttemptsCount +
                                entry.omrSimulationsCount}{' '}
                              runs
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Full Ranked Aspirant Breakdown Table (Desktop + Tablet) */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/60 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                          <th className="py-3 px-4 w-16">Rank</th>
                          <th className="py-3 px-4">Aspirant</th>
                          <th className="py-3 px-4">Reading</th>
                          <th className="py-3 px-4">Written Practice</th>
                          <th className="py-3 px-4">Quiz &amp; OMR</th>
                          <th className="py-3 px-4 text-right">
                            {activeCategory === 'overall'
                              ? 'Study XP'
                              : `${
                                  CATEGORY_TABS.find(
                                    (t) => t.id === activeCategory
                                  )?.label
                                } Score`}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs">
                        {rankedFilteredEntries.map((entry, idx) => {
                          const rank = idx + 1;
                          const isSelf = Boolean(
                            user && entry.userId === user.uid
                          );
                          const sortScore = getCategorySortPoints(
                            entry,
                            activeCategory
                          );

                          return (
                            <tr
                              key={entry.userId}
                              className={
                                isSelf
                                  ? 'bg-blue-50/60 dark:bg-blue-950/25'
                                  : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors'
                              }
                            >
                              <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-zinc-700 dark:text-zinc-300">
                                #{rank}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <AspirantAvatar
                                    name={entry.displayName}
                                    photoURL={entry.photoURL}
                                    sizeClass="w-8 h-8 text-xs"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-medium text-zinc-950 dark:text-zinc-100 truncate">
                                      {entry.displayName}
                                      {isSelf && (
                                        <span className="ml-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                          (You)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                      {CADRE_SHORT_LABELS[entry.targetCadre]}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono tabular-nums">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {entry.totalPagesRead.toLocaleString()} pages
                                </p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                  {entry.booksReadCount}{' '}
                                  {entry.booksReadCount === 1
                                    ? 'book'
                                    : 'books'}{' '}
                                  · {formatReadingDurationShort(entry.readingMinutes)}
                                </p>
                              </td>
                              <td className="py-3.5 px-4 font-mono tabular-nums">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {entry.writtenPracticedCount} practiced ·{' '}
                                  {entry.writtenMasteredCount} mastered
                                </p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                  {entry.writtenWordsCount.toLocaleString()}{' '}
                                  words · {entry.writtenEvaluationsCount} evals
                                </p>
                              </td>
                              <td className="py-3.5 px-4 font-mono tabular-nums">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {entry.quizQuestionsSolved.toLocaleString()}{' '}
                                  Qs ({entry.quizAvgAccuracy}%)
                                </p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                  {entry.quizAttemptsCount} quiz ·{' '}
                                  {entry.omrSimulationsCount} hall · Net{' '}
                                  {entry.quizTotalNetScore.toFixed(1)}
                                </p>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                <p className="font-semibold text-zinc-950 dark:text-zinc-50">
                                  {sortScore.toLocaleString()} XP
                                </p>
                                {activeCategory !== 'overall' && (
                                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                    Total {entry.totalScore.toLocaleString()}
                                  </p>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View (< md) */}
                  <div className="md:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                    {rankedFilteredEntries.map((entry, idx) => {
                      const rank = idx + 1;
                      const isSelf = Boolean(user && entry.userId === user.uid);
                      const sortScore = getCategorySortPoints(
                        entry,
                        activeCategory
                      );

                      return (
                        <div
                          key={entry.userId}
                          className={`p-4 space-y-3 ${
                            isSelf ? 'bg-blue-50/50 dark:bg-blue-950/25' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="font-mono tabular-nums text-xs font-semibold text-zinc-500 dark:text-zinc-400 w-7 shrink-0">
                                #{rank}
                              </span>
                              <AspirantAvatar
                                name={entry.displayName}
                                photoURL={entry.photoURL}
                                sizeClass="w-9 h-9 text-xs"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                                  {entry.displayName}
                                  {isSelf ? ' (You)' : ''}
                                </p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                  {CADRE_SHORT_LABELS[entry.targetCadre]}
                                </p>
                              </div>
                            </div>

                            <div className="text-right font-mono tabular-nums shrink-0">
                              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                                {sortScore.toLocaleString()} XP
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-mono tabular-nums">
                            <div>
                              <span className="font-sans text-zinc-500 dark:text-zinc-400 block">
                                Reading
                              </span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                {entry.totalPagesRead.toLocaleString()}p ·{' '}
                                {entry.booksReadCount}b
                              </span>
                            </div>
                            <div>
                              <span className="font-sans text-zinc-500 dark:text-zinc-400 block">
                                Written
                              </span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                {entry.writtenPracticedCount}p ·{' '}
                                {entry.writtenWordsCount.toLocaleString()}w
                              </span>
                            </div>
                            <div>
                              <span className="font-sans text-zinc-500 dark:text-zinc-400 block">
                                Quiz
                              </span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                {entry.quizQuestionsSolved.toLocaleString()}Q ·{' '}
                                {entry.quizAvgAccuracy}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Quick Study Action Footer Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <Link
                to="/materials"
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-blue-600/50 dark:hover:border-blue-500/50 transition-colors flex items-center gap-3.5"
              >
                <span className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 inline-flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                    Read Official PDFs
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Constitution, Nepal Parichaya &amp; syllabi
                  </p>
                </div>
              </Link>

              <Link
                to="/written"
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-crimson-600/50 dark:hover:border-crimson-500/50 transition-colors flex items-center gap-3.5"
              >
                <span className="w-9 h-9 rounded-lg bg-crimson-50 dark:bg-crimson-950/60 text-crimson-700 dark:text-crimson-300 inline-flex items-center justify-center shrink-0">
                  <PenLine className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                    Practice Written Q&amp;A
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Draft bilingual answers &amp; check rubrics
                  </p>
                </div>
              </Link>

              <Link
                to="/quiz"
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 transition-colors flex items-center gap-3.5"
              >
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 inline-flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                    Take Timed Quizzes
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Boost accuracy, speed &amp; PSC net score
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
