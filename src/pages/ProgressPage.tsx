import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  PenLine,
  RotateCcw,
  Scale,
  Trash2,
  Trophy,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import { formatReverseClock } from '../components/quiz/QuizSessionDialog';
import { ALL_SYLLABUS_UNITS, PSC_CADRE_SYLLABI } from '../data/pscSyllabusData';
import { ALL_QUIZ_QUESTIONS, QUIZ_DECKS } from '../data/quizData';
import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import {
  WRITTEN_PAPERS,
  WRITTEN_QUESTIONS,
} from '../data/writtenQuestionsData';
import { clearAllReadingData } from '../features/library/librarySlice';
import {
  clearPscSyllabusProgress,
  clearSimulationHistory,
} from '../features/psc/pscSlice';
import { clearQuizHistory } from '../features/quiz/quizSlice';
import { clearWrittenProgress } from '../features/written/writtenSlice';
import {
  formatCompactDuration,
  formatRelativeDate,
} from '../utils/pdfHelpers';
import { createBookIdFromUrl, resolveSampleUrl } from '../utils/urlHelpers';

type CurriculumStatusFilter = 'all' | 'in-progress' | 'completed' | 'unread';

interface EnrichedCatalogMaterial {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  codeOrEdition: string;
  path: string;
  fullUrl: string;
  bookId: string;
  totalPages: number;
  lastPage: number;
  uniqueVisitedCount: number;
  readingSeconds: number;
  completionPct: number;
  status: 'unread' | 'in-progress' | 'completed';
  linkedQuestionCount: number;
  linkedWrittenCount: number;
  updatedAt: string | null;
}

export function ProgressPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const recentBooks = useAppSelector((state) => state.library.recentBooks);
  const readingProgress = useAppSelector(
    (state) => state.library.readingProgress
  );
  const readingStats = useAppSelector((state) => state.library.readingStats);
  const attempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const completedUnitIds = useAppSelector(
    (state) => state.psc.completedUnitIds
  );
  const simulationHistory = useAppSelector(
    (state) => state.psc.simulationHistory
  );
  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);

  const [statusFilter, setStatusFilter] =
    useState<CurriculumStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [confirmReset, setConfirmReset] = useState(false);

  const quizCountBySourcePath = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of ALL_QUIZ_QUESTIONS) {
      if (q.sourcePath) {
        map[q.sourcePath] = (map[q.sourcePath] ?? 0) + 1;
      }
    }
    return map;
  }, []);

  const writtenCountBySourcePath = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of WRITTEN_QUESTIONS) {
      if (q.sourcePath) {
        map[q.sourcePath] = (map[q.sourcePath] ?? 0) + 1;
      }
    }
    return map;
  }, []);

  const writtenEvaluations = useMemo(() => {
    try {
      const saved = localStorage.getItem('psc_written_evaluations_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const evalSummary = useMemo(() => {
    if (writtenEvaluations.length === 0) return null;
    const totalMarksPossible = writtenEvaluations.reduce(
      (sum: number, r: { marks: number }) => sum + r.marks,
      0
    );
    const totalMarksScored = writtenEvaluations.reduce(
      (sum: number, r: { totalScore: number }) => sum + r.totalScore,
      0
    );
    const avgPercentage = Math.round(
      (totalMarksScored / (totalMarksPossible || 1)) * 100
    );
    return {
      count: writtenEvaluations.length,
      avgPercentage,
      totalMarksScored: Number(totalMarksScored.toFixed(1)),
      totalMarksPossible,
    };
  }, [writtenEvaluations]);

  const catalogMaterials = useMemo<EnrichedCatalogMaterial[]>(() => {
    const list: EnrichedCatalogMaterial[] = [];
    for (const category of READING_MATERIAL_CATEGORIES) {
      for (const item of category.items) {
        const fullUrl = resolveSampleUrl(item.path);
        const bookId = createBookIdFromUrl(fullUrl);
        const prog = readingProgress[bookId];
        const stats = readingStats[bookId];
        const totalPages = prog?.totalPages || item.pages;
        const lastPage = prog?.lastPage ?? 0;
        const uniqueVisitedCount = stats?.uniquePagesVisited?.length ?? 0;
        const readingSeconds = stats?.totalReadingSeconds ?? 0;

        const effectivePagesCovered = Math.max(lastPage, uniqueVisitedCount);
        const completionPct =
          prog && totalPages > 0
            ? Math.min(100, Math.round((effectivePagesCovered / totalPages) * 100))
            : 0;

        let status: 'unread' | 'in-progress' | 'completed' = 'unread';
        if (prog) {
          if (lastPage >= totalPages || completionPct >= 100) {
            status = 'completed';
          } else {
            status = 'in-progress';
          }
        }

        list.push({
          id: item.id,
          categoryId: category.id,
          categoryName: category.name,
          title: item.title,
          codeOrEdition: item.codeOrEdition,
          path: item.path,
          fullUrl,
          bookId,
          totalPages,
          lastPage,
          uniqueVisitedCount,
          readingSeconds,
          completionPct,
          status,
          linkedQuestionCount: quizCountBySourcePath[item.path] ?? 0,
          linkedWrittenCount: writtenCountBySourcePath[item.path] ?? 0,
          updatedAt: prog?.updatedAt ?? stats?.lastReadAt ?? null,
        });
      }
    }
    return list;
  }, [
    readingProgress,
    readingStats,
    quizCountBySourcePath,
    writtenCountBySourcePath,
  ]);

  const readingSummary = useMemo(() => {
    let totalReadingSeconds = 0;
    let totalPagesTurned = 0;
    for (const st of Object.values(readingStats)) {
      totalReadingSeconds += st.totalReadingSeconds;
      totalPagesTurned += st.pagesReadCount;
    }

    const catalogTotal = catalogMaterials.length;
    const catalogStarted = catalogMaterials.filter(
      (m) => m.status !== 'unread'
    ).length;
    const catalogCompleted = catalogMaterials.filter(
      (m) => m.status === 'completed'
    ).length;

    const totalCatalogPages = catalogMaterials.reduce(
      (sum, m) => sum + m.totalPages,
      0
    );
    const coveredCatalogPages = catalogMaterials.reduce((sum, m) => {
      if (m.status === 'unread') return sum;
      return sum + Math.min(m.totalPages, Math.max(m.lastPage, m.uniqueVisitedCount));
    }, 0);

    const catalogCoveragePct =
      totalCatalogPages > 0
        ? Math.round((coveredCatalogPages / totalCatalogPages) * 100)
        : 0;

    return {
      totalReadingSeconds,
      totalPagesTurned,
      catalogTotal,
      catalogStarted,
      catalogCompleted,
      totalCatalogPages,
      coveredCatalogPages,
      catalogCoveragePct,
    };
  }, [readingStats, catalogMaterials]);

  const quizMastery = useMemo(() => {
    const totalBankCount = ALL_QUIZ_QUESTIONS.length;
    const latestOutcomeByQuestion: Record<string, 'correct' | 'wrong'> = {};
    const everCorrectSet = new Set<string>();

    // Iterate oldest to newest so latest outcome reflects current mastery
    for (let i = attempts.length - 1; i >= 0; i--) {
      const outcomes = attempts[i].questionOutcomes;
      if (!outcomes) continue;
      for (const [qId, outcome] of Object.entries(outcomes)) {
        if (outcome === 'correct') {
          latestOutcomeByQuestion[qId] = 'correct';
          everCorrectSet.add(qId);
        } else if (outcome === 'wrong') {
          latestOutcomeByQuestion[qId] = 'wrong';
        }
      }
    }

    let weakCount = 0;
    for (const outcome of Object.values(latestOutcomeByQuestion)) {
      if (outcome === 'wrong') weakCount += 1;
    }

    let totalQuizSeconds = 0;
    let bestAccuracy = 0;
    let accuracySum = 0;
    let bestNetScore = 0;
    let totalAnswered = 0;

    for (const att of attempts) {
      totalQuizSeconds += att.durationSeconds;
      accuracySum += att.accuracyPercent;
      totalAnswered += att.correctCount + att.wrongCount;
      if (att.accuracyPercent > bestAccuracy) {
        bestAccuracy = att.accuracyPercent;
      }
      if (att.pscNetScore > bestNetScore) {
        bestNetScore = att.pscNetScore;
      }
    }

    const avgAccuracy =
      attempts.length > 0 ? Math.round(accuracySum / attempts.length) : 0;

    // Subject-wise bank mastery
    const subjectMap = new Map<
      string,
      {
        subject: string;
        totalInBank: number;
        masteredCount: number;
        attemptedCount: number;
        weakCount: number;
      }
    >();

    for (const q of ALL_QUIZ_QUESTIONS) {
      const entry = subjectMap.get(q.subject) ?? {
        subject: q.subject,
        totalInBank: 0,
        masteredCount: 0,
        attemptedCount: 0,
        weakCount: 0,
      };
      entry.totalInBank += 1;
      const latest = latestOutcomeByQuestion[q.id];
      if (everCorrectSet.has(q.id)) {
        entry.masteredCount += 1;
      }
      if (latest) {
        entry.attemptedCount += 1;
        if (latest === 'wrong') {
          entry.weakCount += 1;
        }
      }
      subjectMap.set(q.subject, entry);
    }

    const subjectRows = Array.from(subjectMap.values()).map((row) => ({
      ...row,
      masteryPct:
        row.totalInBank > 0
          ? Math.round((row.masteredCount / row.totalInBank) * 100)
          : 0,
    }));

    return {
      totalBankCount,
      masteredCount: everCorrectSet.size,
      attemptedUniqueCount: Object.keys(latestOutcomeByQuestion).length,
      weakCount,
      bankMasteryPct:
        totalBankCount > 0
          ? Math.round((everCorrectSet.size / totalBankCount) * 100)
          : 0,
      attemptsCount: attempts.length,
      totalQuizSeconds,
      bestAccuracy,
      avgAccuracy,
      bestNetScore,
      totalAnswered,
      subjectRows,
    };
  }, [attempts]);

  const writtenMastery = useMemo(() => {
    const totalCount = WRITTEN_QUESTIONS.length;
    let masteredCount = 0;
    let practicingCount = 0;
    let draftsCount = 0;
    let totalPracticeSeconds = 0;

    for (const q of WRITTEN_QUESTIONS) {
      const rec = writtenRecords[q.id];
      if (!rec) continue;
      if (rec.status === 'mastered') masteredCount += 1;
      else if (rec.status === 'practicing') practicingCount += 1;
      if (rec.draftAnswer.trim().length > 0) draftsCount += 1;
      totalPracticeSeconds += rec.timeSpentSeconds;
    }

    const paperRows = WRITTEN_PAPERS.map((paper) => {
      const pool = WRITTEN_QUESTIONS.filter((q) => q.paper === paper);
      const mastered = pool.filter(
        (q) => writtenRecords[q.id]?.status === 'mastered'
      ).length;
      const practicing = pool.filter(
        (q) => writtenRecords[q.id]?.status === 'practicing'
      ).length;
      const masteryPct =
        pool.length > 0 ? Math.round((mastered / pool.length) * 100) : 0;

      return {
        paper,
        totalInPaper: pool.length,
        mastered,
        practicing,
        masteryPct,
        firstQuestionId: pool[0]?.id ?? 'PSC-WR-201',
      };
    });

    return {
      totalCount,
      masteredCount,
      practicingCount,
      draftsCount,
      totalPracticeSeconds,
      masteryPct:
        totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0,
      paperRows,
    };
  }, [writtenRecords]);

  const deckProgressRows = useMemo(() => {
    return QUIZ_DECKS.map((deck) => {
      const matching = attempts.filter((a) => a.deckId === deck.id);
      let bestAcc: number | null = null;
      let bestNet: number | null = null;
      for (const att of matching) {
        if (bestAcc === null || att.accuracyPercent > bestAcc) {
          bestAcc = att.accuracyPercent;
        }
        if (bestNet === null || att.pscNetScore > bestNet) {
          bestNet = att.pscNetScore;
        }
      }
      return {
        deck,
        attemptsCount: matching.length,
        bestAcc,
        bestNet,
        lastAttemptAt: matching[0]?.completedAt ?? null,
      };
    });
  }, [attempts]);

  const recommendedReading = useMemo(() => {
    const inProgress = catalogMaterials
      .filter((m) => m.status === 'in-progress')
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
    if (inProgress.length > 0) {
      return {
        type: 'resume' as const,
        material: inProgress[0],
      };
    }
    const nextUnread = catalogMaterials.find((m) => m.status === 'unread');
    if (nextUnread) {
      return {
        type: 'start' as const,
        material: nextUnread,
      };
    }
    return {
      type: 'review' as const,
      material: catalogMaterials[0],
    };
  }, [catalogMaterials]);

  const recommendedQuiz = useMemo(() => {
    if (quizMastery.weakCount > 0) {
      return {
        label: `Retry ${quizMastery.weakCount} Missed ${
          quizMastery.weakCount === 1 ? 'Question' : 'Questions'
        }`,
        meta: `${quizMastery.weakCount} min reverse timer · Targeted error recovery`,
        title: 'Targeted Mistake Review Session',
        description:
          'Clear recent incorrect answers from your study record with immediate explanations or timed exam scoring.',
        href: '/quiz/custom?filter=weak',
      };
    }

    const unattemptedDeck = deckProgressRows.find((d) => d.attemptsCount === 0);
    if (unattemptedDeck) {
      const qLen = unattemptedDeck.deck.questions.length;
      return {
        label: `Start Quiz (${qLen} Qs)`,
        meta: `${qLen}:00 countdown · Unattempted curated set`,
        title: unattemptedDeck.deck.title,
        description: unattemptedDeck.deck.description,
        href: `/quiz/${unattemptedDeck.deck.id}`,
      };
    }

    const lowestSubject = [...quizMastery.subjectRows].sort(
      (a, b) => a.masteryPct - b.masteryPct
    )[0];

    return {
      label: `Practice ${lowestSubject?.subject ?? 'Mock Quiz'}`,
      meta: `${lowestSubject?.masteryPct ?? 0}% mastered · Strengthen subject score`,
      title: lowestSubject
        ? `${lowestSubject.subject} Practice Set`
        : QUIZ_DECKS[0].title,
      description:
        'Focus your next timed drill on the subject with the most remaining unmastered questions.',
      href: lowestSubject
        ? `/quiz/custom?subject=${encodeURIComponent(lowestSubject.subject)}`
        : `/quiz/${QUIZ_DECKS[0].id}`,
    };
  }, [quizMastery, deckProgressRows]);

  const filteredCurriculum = useMemo(() => {
    return catalogMaterials.filter((item) => {
      if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) {
        return false;
      }
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [catalogMaterials, categoryFilter, statusFilter]);

  const unifiedTimeline = useMemo(() => {
    const items: Array<{
      id: string;
      kind: 'read' | 'quiz';
      title: string;
      detail: string;
      timestamp: string;
      actionLabel: string;
      onAction: () => void;
    }> = [];

    for (const book of recentBooks) {
      const pct =
        book.totalPages > 0
          ? Math.min(100, Math.round((book.lastPage / book.totalPages) * 100))
          : 0;
      const st = readingStats[book.id];
      const durationNote =
        st && st.totalReadingSeconds > 0
          ? ` · ${formatCompactDuration(st.totalReadingSeconds)} read`
          : '';
      items.push({
        id: `read-${book.id}`,
        kind: 'read',
        title: book.title,
        detail: `Reading · Page ${book.lastPage}/${book.totalPages} (${pct}%)${durationNote}`,
        timestamp: book.lastOpenedAt,
        actionLabel: book.sourceType === 'url' ? 'Resume' : 'View Shelf',
        onAction: () => {
          if (book.sourceType === 'url' && book.url) {
            navigate(`/read?url=${encodeURIComponent(book.url)}`, {
              state: { from: '/progress', fromLabel: 'Back to Progress' },
            });
          } else {
            navigate('/library');
          }
        },
      });
    }

    for (const att of attempts) {
      const isCurated = QUIZ_DECKS.some((d) => d.id === att.deckId);
      items.push({
        id: `quiz-${att.id}`,
        kind: 'quiz',
        title: att.deckTitle,
        detail: `Quiz · ${att.correctCount}/${att.totalQuestions} (${att.accuracyPercent}%) · Net ${att.pscNetScore.toFixed(
          2
        )} · ${formatCompactDuration(att.durationSeconds)}/${formatReverseClock(
          att.deadlineSeconds
        )}`,
        timestamp: att.completedAt,
        actionLabel: isCurated ? 'Retake' : 'Open Quiz Hub',
        onAction: () => {
          navigate(isCurated ? `/quiz/${att.deckId}` : '/quiz');
        },
      });
    }

    for (const q of WRITTEN_QUESTIONS) {
      const rec = writtenRecords[q.id];
      if (!rec || rec.status === 'unseen') continue;
      items.push({
        id: `written-${q.id}`,
        kind: 'quiz',
        title: `${q.id}: ${q.en.title}`,
        detail: `Written (${q.marks}M) · ${
          rec.status === 'mastered' ? 'Mastered' : 'Practicing'
        }${
          rec.draftAnswer.trim() ? ' · Draft saved' : ''
        }${
          rec.timeSpentSeconds > 0
            ? ` · ${formatCompactDuration(rec.timeSpentSeconds)}`
            : ''
        }`,
        timestamp: rec.updatedAt,
        actionLabel: 'Open Studio',
        onAction: () => {
          navigate(`/written/${q.id}`);
        },
      });
    }

    for (const sim of simulationHistory) {
      items.push({
        id: `sim-${sim.id}`,
        kind: 'quiz',
        title: `Hall Simulation: ${sim.presetTitle}`,
        detail: `${
          sim.simulationType === 'omr-hall'
            ? `OMR Key ${sim.bookletKey}`
            : 'Written Hall'
        } · Net ${sim.netMarks.toFixed(2)}/${sim.fullMarks} (${
          sim.percentage
        }%) · ${
          sim.passed
            ? 'Qualified'
            : `Below ${Math.round(
                (sim.passMarks / Math.max(1, sim.fullMarks)) * 100
              )}%`
        }`,
        timestamp: sim.completedAt,
        actionLabel: 'Open Simulator',
        onAction: () => {
          navigate(
            `/simulate?preset=${encodeURIComponent(sim.presetId)}&launch=1`
          );
        },
      });
    }

    return items
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 12);
  }, [
    recentBooks,
    readingStats,
    attempts,
    writtenRecords,
    simulationHistory,
    navigate,
  ]);

  const totalCombinedStudySeconds =
    readingSummary.totalReadingSeconds +
    quizMastery.totalQuizSeconds +
    writtenMastery.totalPracticeSeconds;
  const hasAnyProgress =
    recentBooks.length > 0 ||
    Object.keys(readingProgress).length > 0 ||
    attempts.length > 0 ||
    Object.keys(writtenRecords).length > 0 ||
    completedUnitIds.length > 0 ||
    simulationHistory.length > 0;

  const syllabusCoveragePct =
    ALL_SYLLABUS_UNITS.length > 0
      ? Math.round((completedUnitIds.length / ALL_SYLLABUS_UNITS.length) * 100)
      : 0;

  const targetCadreLabel =
    PSC_CADRE_SYLLABI.find((c) => c.id === targetCadreId)?.shortTitle ??
    'Section Officer';

  const handleConfirmResetAll = () => {
    dispatch(clearAllReadingData());
    dispatch(clearQuizHistory());
    dispatch(clearWrittenProgress());
    dispatch(clearPscSyllabusProgress());
    dispatch(clearSimulationHistory());
    setConfirmReset(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
          {/* Header & Actions */}
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
                  Progress
                </span>
              </div>

              <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                Study &amp; Exam Progress Tracker
              </h1>
              <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                Unified readiness dashboard tracking your PDF reading coverage,
                active study time, subject-by-subject question mastery, and Lok
                Sewa PSC timed mock scores.
              </p>
            </div>

            {hasAnyProgress && !confirmReset && (
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
              </div>
            )}
          </div>

          {/* Inline Reset Confirmation Strip */}
          {confirmReset && (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/80 dark:bg-amber-950/30 p-4 flex flex-wrap items-center justify-between gap-4 text-xs"
            >
              <p className="text-amber-950 dark:text-amber-200 font-medium">
                Reset all locally stored syllabus checklists, simulation
                sittings, reading progress, and timed quiz history? This action
                cannot be undone.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetAll}
                  className="h-8 px-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}

          {/* Unboxed Top Quantitative KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 py-6 border-y border-zinc-200/80 dark:border-zinc-800/80">
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                PSC Syllabus Units
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {completedUnitIds.length}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{ALL_SYLLABUS_UNITS.length}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {syllabusCoveragePct}% ·{' '}
                <Link
                  to={`/syllabus/${targetCadreId}`}
                  className="font-sans underline hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  {targetCadreLabel}
                </Link>
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Curriculum Volumes Read
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {readingSummary.catalogStarted}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{readingSummary.catalogTotal}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {readingSummary.catalogCompleted} done ·{' '}
                {readingSummary.catalogCoveragePct}% pages
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Objective MCQs Mastered
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {quizMastery.masteredCount}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{quizMastery.totalBankCount}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {quizMastery.bankMasteryPct}% bank ·{' '}
                {quizMastery.attemptedUniqueCount} tried
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Written Q&amp;A Mastered
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {writtenMastery.masteredCount}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{writtenMastery.totalCount}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {writtenMastery.draftsCount} drafts · EN/नेपाली
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hall Simulations &amp; Best
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-emerald-700 dark:text-emerald-400">
                {quizMastery.attemptsCount > 0
                  ? `${quizMastery.avgAccuracy}%`
                  : simulationHistory.length > 0
                    ? `${simulationHistory[0].percentage}%`
                    : '—'}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {simulationHistory.length} hall runs · {quizMastery.attemptsCount}{' '}
                quizzes
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Total Active Study Time
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {totalCombinedStudySeconds > 0
                  ? formatCompactDuration(totalCombinedStudySeconds)
                  : '0s'}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                Read{' '}
                {readingSummary.totalReadingSeconds > 0
                  ? formatCompactDuration(readingSummary.totalReadingSeconds)
                  : '0s'}{' '}
                · Practice{' '}
                {quizMastery.totalQuizSeconds +
                  writtenMastery.totalPracticeSeconds >
                0
                  ? formatCompactDuration(
                      quizMastery.totalQuizSeconds +
                        writtenMastery.totalPracticeSeconds
                    )
                  : '0s'}
              </p>
            </div>
          </div>

          {/* Recommended Study Loop (Read -> Practice) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                Continue Your Study Loop
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Read reference PDF · Practice timed quiz
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Next Reading Step */}
              {recommendedReading.material && (
                <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      <span className="font-sans font-medium text-zinc-700 dark:text-zinc-300">
                        {recommendedReading.type === 'resume'
                          ? 'In-Progress Book'
                          : recommendedReading.type === 'start'
                            ? 'Recommended Next Volume'
                            : 'Reference Review'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{recommendedReading.material.categoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {recommendedReading.material.lastPage > 0
                          ? `Page ${recommendedReading.material.lastPage}/${recommendedReading.material.totalPages}`
                          : `${recommendedReading.material.totalPages} pages`}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                      {recommendedReading.material.title}
                    </h3>
                    <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                      {recommendedReading.type === 'resume'
                        ? `Pick up directly on page ${recommendedReading.material.lastPage} in realistic flipbook spreads or continuous PDF view.`
                        : 'Open this foundational syllabus reference in Read Mode and automatically save page progress.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/read?url=${encodeURIComponent(
                            recommendedReading.material.fullUrl
                          )}`,
                          {
                            state: {
                              from: '/progress',
                              fromLabel: 'Back to Progress',
                            },
                          }
                        )
                      }
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {recommendedReading.type === 'resume'
                          ? `Resume Page ${recommendedReading.material.lastPage}`
                          : 'Start Reading'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {recommendedReading.material.linkedQuestionCount > 0 && (
                      <Link
                        to={`/quiz/custom?source=${encodeURIComponent(
                          recommendedReading.material.path
                        )}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-blue-700 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>
                          Linked Quiz (
                          {recommendedReading.material.linkedQuestionCount} Qs)
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Next Timed Quiz Step */}
              <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                    <span className="font-sans font-medium text-zinc-700 dark:text-zinc-300">
                      Next Timed Assessment
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{recommendedQuiz.meta}</span>
                  </div>

                  <h3 className="mt-2.5 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    {recommendedQuiz.title}
                  </h3>
                  <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                    {recommendedQuiz.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={recommendedQuiz.href}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{recommendedQuiz.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/quiz"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>All {QUIZ_DECKS.length} Quiz Sets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-by-Subject PSC Mastery Matrix */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Subject-Wise Quiz Mastery
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Question bank mastery across all{' '}
                  {quizMastery.subjectRows.length} Federal Civil Service
                  subjects ({quizMastery.totalBankCount} structured questions).
                </p>
              </div>
              {quizMastery.weakCount > 0 && (
                <Link
                  to="/quiz/custom?filter=weak"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Review {quizMastery.weakCount} missed questions</span>
                </Link>
              )}
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
              {quizMastery.subjectRows.map((row) => (
                <div
                  key={row.subject}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between sm:justify-start gap-2.5">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {row.subject}
                      </h3>
                      <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        {row.masteredCount}/{row.totalInBank} mastered (
                        {row.masteryPct}%)
                        {row.weakCount > 0
                          ? ` · ${row.weakCount} needs review`
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-full sm:w-32 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full transition-transform duration-300 origin-left"
                        style={{
                          transform: `scaleX(${Math.min(
                            1,
                            Math.max(0, row.masteryPct / 100)
                          )})`,
                        }}
                      />
                    </div>

                    <Link
                      to={`/quiz/custom?subject=${encodeURIComponent(
                        row.subject
                      )}`}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Practice ({row.totalInBank})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paper-Wise Bilingual Written Q&A Mastery */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Written Exam Long Q&amp;A Mastery (EN / नेपाली)
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Subjective 5-mark and 10-mark model answer mastery across
                  Papers II, III, and IV ({writtenMastery.totalCount} bilingual
                  questions).
                </p>
              </div>
              <Link
                to="/written"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Open Written Q&amp;A Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
              {writtenMastery.paperRows.map((row) => (
                <div
                  key={row.paper}
                  className="py-3.5 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between sm:justify-start gap-2.5">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {row.paper}
                      </h3>
                      <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        {row.mastered}/{row.totalInPaper} ({row.masteryPct}%)
                        {row.practicing > 0
                          ? ` · ${row.practicing} practicing`
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 shrink-0">
                    <div className="w-full sm:w-32 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full transition-transform duration-300 origin-left"
                        style={{
                          transform: `scaleX(${Math.min(
                            1,
                            Math.max(0, row.masteryPct / 100)
                          )})`,
                        }}
                      />
                    </div>

                    <Link
                      to={`/written/${row.firstQuestionId}`}
                      className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Study ({row.totalInPaper})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written Answer Self-Evaluation & Rubric Log */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <span>लिखित उत्तर रुब्रिक स्व-मूल्याङ्कन (Written Answer Rubric Track)</span>
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Performance audit across 1.8 min/mark timed drafting and official 4-part scoring rubrics.
                </p>
              </div>

              <Link
                to="/evaluator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Open Evaluator Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {evalSummary ? (
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 font-medium">Answers Graded</span>
                    <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                      {evalSummary.count} <span className="text-xs font-normal text-zinc-500">attempts</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 font-medium">Average Rubric Score</span>
                    <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                      {evalSummary.avgPercentage}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 font-medium">Total Marks Earned</span>
                    <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                      {evalSummary.totalMarksScored} <span className="text-xs font-normal text-zinc-500">/ {evalSummary.totalMarksPossible}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-400 font-medium">Competitiveness</span>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                        {evalSummary.avgPercentage >= 70 ? 'Topper Tier' : evalSummary.avgPercentage >= 55 ? 'Competitive Pass' : 'Needs Practice'}
                      </div>
                    </div>
                    <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <span className="text-zinc-500">
                    Want to improve score? Re-attempt questions under the 1.8 min/mark countdown clock.
                  </span>
                  <Link
                    to="/evaluator"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Practice New Question</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                <Scale className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  No Written Answer Evaluations Yet
                </h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Practice writing 5-mark and 10-mark answers under authentic countdown conditions and self-grade on the official 4-dimension Lok Sewa rubric.
                </p>
                <div className="pt-2">
                  <Link
                    to="/evaluator"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Start First Self-Evaluation</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Curated Exam Deck Benchmarks */}
          <div className="space-y-4">
            <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
              Curated Mock Exam Benchmarks
            </h2>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
              {deckProgressRows.map((row) => (
                <div
                  key={row.deck.id}
                  className="py-3.5 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.deck.title}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      <span>{row.deck.questions.length} Qs</span>
                      <span aria-hidden="true">·</span>
                      <span>{row.deck.questions.length}:00 limit</span>
                      <span aria-hidden="true">·</span>
                      {row.attemptsCount > 0 ? (
                        <span className="text-emerald-700 dark:text-emerald-400">
                          Best {row.bestAcc}% · Net {row.bestNet?.toFixed(2)} (
                          {row.attemptsCount}{' '}
                          {row.attemptsCount === 1 ? 'run' : 'runs'})
                        </span>
                      ) : (
                        <span className="font-sans">Not attempted yet</span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/quiz/${row.deck.id}`}
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto h-8 px-3 rounded-lg sm:rounded-none sm:h-auto sm:p-0 border sm:border-0 border-zinc-200 dark:border-zinc-800 bg-white sm:bg-transparent dark:bg-zinc-900 sm:dark:bg-transparent text-xs font-medium text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>
                      {row.attemptsCount > 0 ? 'Retake Set' : 'Start Timed Set'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Curriculum & Linked Quiz Checklist */}
          <div className="space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Reading Curriculum &amp; Linked Quizzes
                </h2>
                <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Track every study volume from first page to linked timed
                  practice.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SharedSearchSelect
                  ariaLabel="Filter curriculum by collection"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { label: 'All Collections (16)', value: 'all' },
                    ...READING_MATERIAL_CATEGORIES.map((cat) => ({
                      label: `${cat.name} (${cat.items.length})`,
                      value: cat.id,
                    })),
                  ]}
                  size="sm"
                  popoverWidth="w-64"
                  className="min-w-[160px]"
                />

                <div
                  role="group"
                  aria-label="Filter curriculum by reading status"
                  className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'in-progress', label: 'In Progress' },
                      { id: 'completed', label: 'Completed' },
                      { id: 'unread', label: 'Unread' },
                    ] as const
                  ).map((opt) => {
                    const active = statusFilter === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStatusFilter(opt.id)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {filteredCurriculum.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400">
                No curriculum documents match the selected status filter.
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                {filteredCurriculum.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {item.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <span className="font-sans">{item.categoryName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">{item.codeOrEdition}</span>
                        <span aria-hidden="true">·</span>
                        {item.status === 'unread' ? (
                          <span>Unread ({item.totalPages} pages)</span>
                        ) : (
                          <span className="text-blue-700 dark:text-blue-400">
                            Page {item.lastPage}/{item.totalPages} (
                            {item.completionPct}%)
                          </span>
                        )}
                        {item.readingSeconds > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>
                              {formatCompactDuration(item.readingSeconds)} read
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <div className="hidden lg:block w-24 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mr-1">
                        <div
                          className={`h-full rounded-full transition-transform duration-300 origin-left ${
                            item.status === 'completed'
                              ? 'bg-emerald-600 dark:bg-emerald-400'
                              : 'bg-blue-600 dark:bg-blue-400'
                          }`}
                          style={{
                            transform: `scaleX(${item.completionPct / 100})`,
                          }}
                        />
                      </div>

                      {item.linkedQuestionCount > 0 && (
                        <Link
                          to={`/quiz/custom?source=${encodeURIComponent(
                            item.path
                          )}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors whitespace-nowrap shrink-0"
                        >
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Quiz ({item.linkedQuestionCount})</span>
                        </Link>
                      )}

                      {item.linkedWrittenCount > 0 && (
                        <Link
                          to={`/written?source=${encodeURIComponent(
                            item.path
                          )}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors whitespace-nowrap shrink-0"
                        >
                          <PenLine className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Written ({item.linkedWrittenCount})</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/read?url=${encodeURIComponent(item.fullUrl)}`,
                            {
                              state: {
                                from: '/progress',
                                fromLabel: 'Back to Progress',
                              },
                            }
                          )
                        }
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>
                          {item.status === 'in-progress'
                            ? `Resume p.${item.lastPage}`
                            : item.status === 'completed'
                              ? 'Review PDF'
                              : 'Read PDF'}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unified Recent Study & Quiz Timeline */}
          <div className="space-y-4">
            <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
              Recent Reading &amp; Quiz Activity
            </h2>

            {unifiedTimeline.length === 0 ? (
              <div className="py-12 px-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white/50 dark:bg-zinc-900/40">
                <p className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  No study sessions logged yet
                </p>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  Open any curated study PDF or start a timed practice quiz—your
                  reading pages, durations, and exam scores will appear here
                  automatically.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/materials"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                  >
                    Browse Study Books
                  </Link>
                  <Link
                    to="/quiz"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                  >
                    Take a Timed Quiz
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                {unifiedTimeline.map((entry) => (
                  <div
                    key={entry.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {entry.title}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <span>{entry.detail}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">
                          {formatRelativeDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={entry.onAction}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>{entry.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
