import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { AssessmentFormatNav } from '../components/quiz/AssessmentFormatNav';
import {
  formatReverseClock,
  QuizSessionDialog,
} from '../components/quiz/QuizSessionDialog';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import {
  ALL_QUIZ_QUESTIONS,
  getDeckTotalMarks,
  getQuizDeadlineSeconds,
  QUIZ_DECKS,
  type QuizDeck,
  type QuizDifficulty,
} from '../data/quizData';
import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import {
  clearQuizHistory,
  setPreferredQuizMode,
  type QuizPlayMode,
} from '../features/quiz/quizSlice';
import {
  formatCompactDuration,
  formatRelativeDate,
} from '../utils/pdfHelpers';
import { storageService } from '../services/storageService';

type DifficultyFilter = 'All' | QuizDifficulty;

export function QuizPage() {
  const { deckId } = useParams<{ deckId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const preferredMode = useAppSelector((state) => state.quiz.preferredMode);
  const attempts = useAppSelector((state) => state.quiz.attempts);

  // Taxonomy explorer filter state
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [subtopicFilter, setSubtopicFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>('All');

  const availableSubjects = useMemo(
    () => Array.from(new Set(ALL_QUIZ_QUESTIONS.map((q) => q.subject))),
    []
  );

  const [flaggedCount, setFlaggedCount] = useState<number>(() => {
    return Object.keys(storageService.loadFlaggedQuestions()).length;
  });

  useEffect(() => {
    const handleSync = () => {
      setFlaggedCount(Object.keys(storageService.loadFlaggedQuestions()).length);
    };
    window.addEventListener('psc_flagged_questions_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('psc_flagged_questions_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const availableTopics = useMemo(() => {
    const pool =
      subjectFilter === 'All'
        ? ALL_QUIZ_QUESTIONS
        : ALL_QUIZ_QUESTIONS.filter((q) => q.subject === subjectFilter);
    return Array.from(new Set(pool.map((q) => q.topic)));
  }, [subjectFilter]);

  const availableSubtopics = useMemo(() => {
    let pool = ALL_QUIZ_QUESTIONS;
    if (subjectFilter !== 'All') {
      pool = pool.filter((q) => q.subject === subjectFilter);
    }
    if (topicFilter !== 'All') {
      pool = pool.filter((q) => q.topic === topicFilter);
    }
    return Array.from(new Set(pool.map((q) => q.subtopic)));
  }, [subjectFilter, topicFilter]);

  const filteredCustomQuestions = useMemo(() => {
    return ALL_QUIZ_QUESTIONS.filter((q) => {
      if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false;
      if (topicFilter !== 'All' && q.topic !== topicFilter) return false;
      if (subtopicFilter !== 'All' && q.subtopic !== subtopicFilter)
        return false;
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [subjectFilter, topicFilter, subtopicFilter, difficultyFilter]);

  const hasActiveFilter =
    subjectFilter !== 'All' ||
    topicFilter !== 'All' ||
    subtopicFilter !== 'All' ||
    difficultyFilter !== 'All';

  const handleSubjectChange = (nextSubject: string) => {
    setSubjectFilter(nextSubject);
    setTopicFilter('All');
    setSubtopicFilter('All');
  };

  const handleTopicChange = (nextTopic: string) => {
    setTopicFilter(nextTopic);
    setSubtopicFilter('All');
  };

  const handleResetFilters = () => {
    setSubjectFilter('All');
    setTopicFilter('All');
    setSubtopicFilter('All');
    setDifficultyFilter('All');
  };

  const handleLaunchFilteredQuiz = () => {
    if (filteredCustomQuestions.length === 0) return;
    const params = new URLSearchParams();
    if (subjectFilter !== 'All') params.set('subject', subjectFilter);
    if (topicFilter !== 'All') params.set('topic', topicFilter);
    if (subtopicFilter !== 'All') params.set('subtopic', subtopicFilter);
    if (difficultyFilter !== 'All') params.set('difficulty', difficultyFilter);
    const qs = params.toString();
    navigate(qs ? `/quiz/custom?${qs}` : '/quiz/custom');
  };

  const weakQuestionIdSet = useMemo(() => {
    const latestOutcomeByQ: Record<string, string> = {};
    // attempts[0] is newest; iterate oldest -> newest so newest outcome wins
    for (let i = attempts.length - 1; i >= 0; i--) {
      const outcomes = attempts[i].questionOutcomes;
      if (!outcomes) continue;
      for (const [qId, outcome] of Object.entries(outcomes)) {
        if (outcome === 'correct' || outcome === 'wrong') {
          latestOutcomeByQ[qId] = outcome;
        }
      }
    }
    const set = new Set<string>();
    for (const [qId, outcome] of Object.entries(latestOutcomeByQ)) {
      if (outcome === 'wrong') set.add(qId);
    }
    return set;
  }, [attempts]);

  const selectedDeck: QuizDeck | null = useMemo(() => {
    if (!deckId) return null;

    if (deckId === 'custom') {
      const qSource = searchParams.get('source');
      const qFilter = searchParams.get('filter');

      if (qSource) {
        const questions = ALL_QUIZ_QUESTIONS.filter(
          (q) => q.sourcePath === qSource
        );
        if (questions.length === 0) return null;

        const materialMatch = READING_MATERIAL_CATEGORIES.flatMap(
          (c) => c.items
        ).find((item) => item.path === qSource);

        const title = materialMatch
          ? `Quiz: ${materialMatch.title}`
          : questions[0]?.sourceTitle
            ? `Quiz: ${questions[0].sourceTitle}`
            : 'Document Practice Quiz';

        return {
          id: `custom-source-${qSource}`,
          title,
          subtitle: `${questions.length} Questions · ${questions.length}-Minute Reverse Countdown`,
          description:
            'Targeted timed practice quiz covering questions directly linked to this reading document.',
          questions,
        };
      }

      if (qFilter === 'weak') {
        const questions = ALL_QUIZ_QUESTIONS.filter((q) =>
          weakQuestionIdSet.has(q.id)
        );
        if (questions.length === 0) return null;

        return {
          id: 'custom-weak-review',
          title: 'Targeted Mistake Review Set',
          subtitle: `${questions.length} Questions · ${questions.length}-Minute Reverse Countdown`,
          description:
            'Focused practice session on questions answered incorrectly in your most recent attempts.',
          questions,
        };
      }

      if (qFilter === 'flagged') {
        const savedFlags = storageService.loadFlaggedQuestions();
        const flaggedIds = new Set(Object.keys(savedFlags));
        const questions = ALL_QUIZ_QUESTIONS.filter((q) =>
          flaggedIds.has(q.id)
        );
        if (questions.length === 0) return null;

        return {
          id: 'custom-flagged-review',
          title: 'Flagged for Review Practice Set',
          subtitle: `${questions.length} Questions · ${questions.length}-Minute Reverse Countdown`,
          description:
            'Targeted revision quiz containing high-priority questions flagged during your study sessions.',
          questions,
        };
      }

      const qSubject = searchParams.get('subject') ?? 'All';
      const qTopic = searchParams.get('topic') ?? 'All';
      const qSubtopic = searchParams.get('subtopic') ?? 'All';
      const qDifficulty = searchParams.get('difficulty') ?? 'All';

      const questions = ALL_QUIZ_QUESTIONS.filter((q) => {
        if (qSubject !== 'All' && q.subject !== qSubject) return false;
        if (qTopic !== 'All' && q.topic !== qTopic) return false;
        if (qSubtopic !== 'All' && q.subtopic !== qSubtopic) return false;
        if (qDifficulty !== 'All' && q.difficulty !== qDifficulty) return false;
        return true;
      });

      if (questions.length === 0) return null;

      const labelParts: string[] = [];
      if (qSubject !== 'All') labelParts.push(qSubject);
      if (qTopic !== 'All') labelParts.push(qTopic);
      if (qSubtopic !== 'All') labelParts.push(qSubtopic);
      if (qDifficulty !== 'All') labelParts.push(`${qDifficulty} Difficulty`);

      const title =
        labelParts.length > 0
          ? labelParts.join(' · ')
          : 'Complete PSC Master Question Bank';

      return {
        id: `custom-${qSubject}-${qTopic}-${qSubtopic}-${qDifficulty}`,
        title,
        subtitle: `${questions.length} Questions · ${questions.length}-Minute Reverse Countdown`,
        description:
          'Custom PSC practice quiz filtered by structured subject, topic, subtopic, and difficulty.',
        questions,
      };
    }

    return QUIZ_DECKS.find((deck) => deck.id === deckId) ?? null;
  }, [deckId, searchParams, weakQuestionIdSet]);

  const handleOpenQuizDialog = (targetDeckId: string) => {
    navigate(`/quiz/${targetDeckId}`);
  };

  const handleCloseQuizDialog = () => {
    navigate('/quiz');
  };

  const overallStats = useMemo(() => {
    if (attempts.length === 0) {
      return {
        attemptsCount: 0,
        bestAccuracy: 0,
        questionsAnswered: 0,
      };
    }

    let bestAccuracy = 0;
    let questionsAnswered = 0;
    for (const att of attempts) {
      if (att.accuracyPercent > bestAccuracy) {
        bestAccuracy = att.accuracyPercent;
      }
      questionsAnswered += att.correctCount + att.wrongCount;
    }

    return {
      attemptsCount: attempts.length,
      bestAccuracy,
      questionsAnswered,
    };
  }, [attempts]);

  const bestScoreByDeck = useMemo(() => {
    const map: Record<string, number> = {};
    for (const att of attempts) {
      if (
        map[att.deckId] === undefined ||
        att.accuracyPercent > map[att.deckId]
      ) {
        map[att.deckId] = att.accuracyPercent;
      }
    }
    return map;
  }, [attempts]);

  const customDeadlineSeconds = getQuizDeadlineSeconds(
    Math.max(1, filteredCustomQuestions.length)
  );
  const customTotalMarks = useMemo(
    () => getDeckTotalMarks(filteredCustomQuestions),
    [filteredCustomQuestions]
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
          {/* Format Switcher & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link
                to="/"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                Quiz
              </span>
            </div>

            <AssessmentFormatNav active="quiz" />
          </div>

          {/* Header & Spring Mode Preference */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
                Timed PSC Practice Quizzes &amp; Mock Exams
              </h1>
              <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                Practice structured Federal Civil Service questions categorized
                by subject, topic, subtopic, difficulty, and marks under a
                strict{' '}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  1 minute per question
                </span>{' '}
                reverse countdown—30 questions starts at{' '}
                <span className="font-mono tabular-nums">30:00</span>, 15
                questions starts at{' '}
                <span className="font-mono tabular-nums">15:00</span>, and
                auto-submits at{' '}
                <span className="font-mono tabular-nums">00:00</span>.
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
              <span>Default mode:</span>
              <div
                role="group"
                aria-label="Preferred quiz mode"
                className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                {(['exam', 'study'] as const).map((modeOption: QuizPlayMode) => {
                  const active = preferredMode === modeOption;
                  return (
                    <button
                      key={modeOption}
                      type="button"
                      onClick={() => dispatch(setPreferredQuizMode(modeOption))}
                      className={`relative px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'text-zinc-950 dark:text-zinc-50'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="quiz-page-preferred-mode-indicator"
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : {
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 36,
                                }
                          }
                          className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60"
                        />
                      )}
                      <span className="relative z-10">
                        {modeOption === 'exam' ? 'Real Quiz' : 'Study Hints'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Invalid Deep-Link Notice */}
          {deckId && !selectedDeck && (
            <div
              role="status"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-wrap items-center justify-between gap-3 text-sm"
            >
              <span className="text-zinc-700 dark:text-zinc-300">
                The requested quiz set was not found or matched zero questions.
                Choose any curated set or filter below to open it in a dialog.
              </span>
              <button
                type="button"
                onClick={handleCloseQuizDialog}
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Aggregate Quiz Performance Strip (if attempts exist) */}
          {overallStats.attemptsCount > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 py-6 border-y border-zinc-200/80 dark:border-zinc-800/80">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Quizzes Completed
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                  {overallStats.attemptsCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Best Accuracy
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-emerald-700 dark:text-emerald-400">
                  {overallStats.bestAccuracy}%
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Questions Answered
                </p>
                <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                  {overallStats.questionsAnswered}
                </p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Study Analytics
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Link
                    to="/progress"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                  >
                    <span>View Full Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Flagged Questions Quick Review Banner */}
          {flaggedCount > 0 && (
            <div className="rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-zinc-950 dark:text-zinc-50">
                    Flagged for Review ({flaggedCount} Questions)
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Targeted practice set compiled from your flagged tricky questions.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  to="/dashboard/flagged"
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Manage in Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => handleOpenQuizDialog('custom?filter=flagged')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Practice Set</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Structured Taxonomy Filter & Custom Practice Builder */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>
                    Structured PSC Question Bank · {ALL_QUIZ_QUESTIONS.length}{' '}
                    unique items
                  </span>
                </div>
                <h2 className="mt-1 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                  Practice by Subject, Topic, Subtopic &amp; Difficulty
                </h2>
              </div>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Subject Select */}
              <div className="space-y-1.5">
                <SharedSearchSelect
                  id="psc-subject-filter"
                  label="Subject"
                  value={subjectFilter}
                  onChange={handleSubjectChange}
                  options={[
                    { label: `All Subjects (${availableSubjects.length})`, value: 'All' },
                    ...availableSubjects.map((subj) => ({ label: subj, value: subj })),
                  ]}
                  size="sm"
                  className="w-full"
                  popoverWidth="w-full"
                  searchPlaceholder="Filter subjects..."
                />
              </div>

              {/* Topic Select */}
              <div className="space-y-1.5">
                <SharedSearchSelect
                  id="psc-topic-filter"
                  label="Topic"
                  value={topicFilter}
                  onChange={handleTopicChange}
                  options={[
                    { label: `All Topics (${availableTopics.length})`, value: 'All' },
                    ...availableTopics.map((top) => ({ label: top, value: top })),
                  ]}
                  size="sm"
                  className="w-full"
                  popoverWidth="w-full"
                  searchPlaceholder="Filter topics..."
                />
              </div>

              {/* Subtopic Select */}
              <div className="space-y-1.5">
                <SharedSearchSelect
                  id="psc-subtopic-filter"
                  label="Subtopic"
                  value={subtopicFilter}
                  onChange={setSubtopicFilter}
                  options={[
                    { label: `All Subtopics (${availableSubtopics.length})`, value: 'All' },
                    ...availableSubtopics.map((sub) => ({ label: sub, value: sub })),
                  ]}
                  size="sm"
                  className="w-full"
                  popoverWidth="w-full"
                  searchPlaceholder="Filter subtopics..."
                />
              </div>

              {/* Difficulty Segmented Control */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Difficulty
                </span>
                <div
                  role="group"
                  aria-label="Question difficulty"
                  className="grid grid-cols-4 h-10 sm:h-9 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
                    const active = difficultyFilter === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficultyFilter(diff)}
                        className={`rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {filteredCustomQuestions.length} matching{' '}
                  {filteredCustomQuestions.length === 1
                    ? 'question'
                    : 'questions'}
                </span>
                {filteredCustomQuestions.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{customTotalMarks} marks</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {formatReverseClock(customDeadlineSeconds)} reverse timer
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={filteredCustomQuestions.length === 0}
                onClick={handleLaunchFilteredQuiz}
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {hasActiveFilter
                    ? `Start Filtered Quiz (${filteredCustomQuestions.length} Qs)`
                    : `Start Full Master Bank (${ALL_QUIZ_QUESTIONS.length} Qs)`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Curated Quiz Decks Grid */}
          <div className="space-y-4">
            <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
              Curated Exam &amp; Subject Sets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUIZ_DECKS.map((deck, idx) => {
                const bestAccuracy = bestScoreByDeck[deck.id];
                const deckDeadline = getQuizDeadlineSeconds(
                  deck.questions.length
                );
                const deckMarks = getDeckTotalMarks(deck.questions);
                const distinctSubjects = Array.from(
                  new Set(deck.questions.map((q) => q.subject))
                );
                const distinctTopics = Array.from(
                  new Set(deck.questions.map((q) => q.topic))
                ).slice(0, 4);

                const easyCount = deck.questions.filter(
                  (q) => q.difficulty === 'Easy'
                ).length;
                const mediumCount = deck.questions.filter(
                  (q) => q.difficulty === 'Medium'
                ).length;
                const hardCount = deck.questions.filter(
                  (q) => q.difficulty === 'Hard'
                ).length;

                const difficultySummary = [
                  easyCount > 0 ? `${easyCount} Easy` : null,
                  mediumCount > 0 ? `${mediumCount} Medium` : null,
                  hardCount > 0 ? `${hardCount} Hard` : null,
                ]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <motion.article
                    key={deck.id}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`Open ${deck.title} in quiz dialog`}
                    onClick={() => handleOpenQuizDialog(deck.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenQuizDialog(deck.id);
                      }
                    }}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
                    transition={{
                      duration: 0.18,
                      delay: shouldReduceMotion ? 0 : idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`group flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      idx === 0 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                            0{idx + 1}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{deck.questions.length} questions</span>
                          <span aria-hidden="true">·</span>
                          <span>{deckMarks} marks</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {formatReverseClock(deckDeadline)} countdown
                          </span>
                        </div>

                        {bestAccuracy !== undefined && (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Best {bestAccuracy}%</span>
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {deck.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {deck.subtitle}
                      </p>

                      <p className="mt-3 text-fluid-body text-zinc-600 dark:text-zinc-400">
                        {deck.description}
                      </p>

                      {/* Clean Unboxed Taxonomy Metadata (Zero-Pill Discipline) */}
                      <div className="mt-4 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <p className="leading-relaxed">
                          <span className="text-zinc-400 dark:text-zinc-500">
                            Subjects:
                          </span>{' '}
                          {distinctSubjects.join(' · ')}
                        </p>
                        <p className="leading-relaxed">
                          <span className="text-zinc-400 dark:text-zinc-500">
                            Topics:
                          </span>{' '}
                          {distinctTopics.join(' · ')}
                        </p>
                        <p className="font-mono tabular-nums leading-relaxed">
                          <span className="font-sans text-zinc-400 dark:text-zinc-500">
                            Difficulty:
                          </span>{' '}
                          {difficultySummary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {bestAccuracy !== undefined && (
                        <div className="h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-400 transition-transform duration-300 origin-left"
                            style={{
                              transform: `scaleX(${Math.min(1, Math.max(0, bestAccuracy / 100))})`,
                            }}
                          />
                        </div>
                      )}

                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
                          <span>
                            Start Timed Quiz ({formatReverseClock(deckDeadline)})
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums whitespace-nowrap shrink-0">
                          <span className="hidden sm:inline font-sans">
                            {preferredMode === 'exam'
                              ? 'Real Quiz'
                              : 'Study Hints'}
                          </span>
                          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Attempts Log */}
          {attempts.length > 0 && (
            <div className="pt-4">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-900 dark:text-zinc-100">
                  Recent Quiz Attempts
                </h2>
                <button
                  type="button"
                  onClick={() => dispatch(clearQuizHistory())}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear quiz history</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                {attempts.slice(0, 6).map((attempt) => {
                  const isCuratedDeck = QUIZ_DECKS.some(
                    (d) => d.id === attempt.deckId
                  );
                  return (
                    <div
                      key={attempt.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {attempt.deckTitle}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                          <span className="font-sans">
                            {attempt.mode === 'exam'
                              ? 'Real Quiz'
                              : 'Study Hints'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {attempt.correctCount}/{attempt.totalQuestions}{' '}
                            correct ({attempt.accuracyPercent}%)
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            PSC Net {attempt.pscNetScore.toFixed(2)}
                            {attempt.totalMarks ? `/${attempt.totalMarks}` : ''}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {formatCompactDuration(attempt.durationSeconds)} /{' '}
                            {formatReverseClock(attempt.deadlineSeconds)}
                            {attempt.timedOut ? ' (Time Expired)' : ''}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-sans">
                            {formatRelativeDate(attempt.completedAt)}
                          </span>
                        </div>
                      </div>

                      {isCuratedDeck && (
                        <button
                          type="button"
                          onClick={() => handleOpenQuizDialog(attempt.deckId)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>Practice Again</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
        </main>

        <Footer />
      </PageTransition>

      {/* Active Timed Quiz Modal Dialog */}
      <QuizSessionDialog
        open={Boolean(selectedDeck)}
        deck={selectedDeck}
        initialMode={preferredMode}
        onClose={handleCloseQuizDialog}
      />
    </div>
  );
}
