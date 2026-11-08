import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  Search,
  Trash2,
  X,
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
import { formatReverseClock } from '../components/quiz/QuizSessionDialog';
import { ReactionButtons } from '../components/common/ReactionButtons';
import { recordView } from '../features/reactions/reactionsSlice';
import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import {
  getWrittenQuestionById,
  WRITTEN_PAPERS,
  WRITTEN_QUESTIONS,
  type LocalizedAnswerContent,
  type WrittenQuestion,
} from '../data/writtenQuestionsData';
import {
  addWrittenPracticeSeconds,
  clearWrittenProgress,
  saveWrittenDraft,
  setPreferredWrittenLanguage,
  setWrittenQuestionStatus,
  toggleWrittenRubricPoint,
  type WrittenLanguageMode,
  type WrittenMasteryStatus,
} from '../features/written/writtenSlice';
import { formatCompactDuration } from '../utils/pdfHelpers';
import { resolveSampleUrl } from '../utils/urlHelpers';

type MarksFilter = 'all' | '5' | '10';
type StatusFilter = 'all' | WrittenMasteryStatus;

const LANGUAGE_OPTIONS: ReadonlyArray<{
  id: WrittenLanguageMode;
  label: string;
}> = [
  { id: 'bilingual', label: 'EN + नेपाली' },
  { id: 'en', label: 'English' },
  { id: 'ne', label: 'नेपाली' },
];

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function formatQuestionForClipboard(
  q: WrittenQuestion,
  lang: WrittenLanguageMode
): string {
  const formatBlock = (header: string, content: LocalizedAnswerContent) => {
    const sectionsText = content.sections
      .map(
        (sec) =>
          `${sec.heading}\n${sec.points.map((pt) => `• ${pt}`).join('\n')}`
      )
      .join('\n\n');

    return [
      `[${header}] ${content.title} (${content.marksAllocation})`,
      `Q: ${content.question}`,
      '',
      `Introduction:\n${content.introduction}`,
      '',
      sectionsText,
      '',
      `Conclusion:\n${content.conclusion}`,
    ].join('\n');
  };

  if (lang === 'en') {
    return `${q.id} · ${q.paper}\n\n${formatBlock('English', q.en)}`;
  }
  if (lang === 'ne') {
    return `${q.id} · ${q.paper}\n\n${formatBlock('नेपाली', q.ne)}`;
  }
  return `${q.id} · ${q.paper}\n\n${formatBlock(
    'English',
    q.en
  )}\n\n${'—'.repeat(32)}\n\n${formatBlock('नेपाली', q.ne)}`;
}

interface AnswerBlockProps {
  question: WrittenQuestion;
  languageMode: WrittenLanguageMode;
}

function StructuredModelAnswer({ question, languageMode }: AnswerBlockProps) {
  if (languageMode === 'bilingual') {
    return (
      <div className="space-y-6">
        {/* Introduction Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-zinc-200/80 dark:lg:divide-zinc-800/80">
          <div className="space-y-1.5 lg:pr-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Introduction · English
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {question.en.introduction}
            </p>
          </div>
          <div className="space-y-1.5 lg:pl-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              परिचय · नेपाली
            </p>
            <p
              lang="ne"
              className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
            >
              {question.ne.introduction}
            </p>
          </div>
        </div>

        {/* Analytical Sections Aligned Pair-by-Pair */}
        {question.en.sections.map((enSec, idx) => {
          const neSec = question.ne.sections[idx];
          return (
            <div
              key={enSec.heading}
              className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-zinc-200/80 dark:lg:divide-zinc-800/80"
            >
              <div className="space-y-2.5 lg:pr-6">
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {enSec.heading}
                </h4>
                <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed list-disc pl-4 marker:text-zinc-400">
                  {enSec.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>

              {neSec && (
                <div lang="ne" className="space-y-2.5 lg:pl-6">
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {neSec.heading}
                  </h4>
                  <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed list-disc pl-4 marker:text-zinc-400">
                    {neSec.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {/* Conclusion Side-by-Side */}
        <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-zinc-200/80 dark:lg:divide-zinc-800/80">
          <div className="space-y-1.5 lg:pr-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Conclusion &amp; Way Forward
            </p>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
              {question.en.conclusion}
            </p>
          </div>
          <div lang="ne" className="space-y-1.5 lg:pl-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              निष्कर्ष र आगामी बाटो
            </p>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
              {question.ne.conclusion}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const content = languageMode === 'ne' ? question.ne : question.en;
  const isNe = languageMode === 'ne';

  return (
    <div lang={isNe ? 'ne' : 'en'} className="max-w-3xl space-y-5">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {isNe ? 'परिचय (Introduction)' : 'Introduction'}
        </p>
        <p className="text-fluid-body text-zinc-700 dark:text-zinc-300">
          {content.introduction}
        </p>
      </div>

      {content.sections.map((sec) => (
        <div
          key={sec.heading}
          className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5"
        >
          <h4 className="text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
            {sec.heading}
          </h4>
          <ul className="space-y-2 text-fluid-body text-zinc-700 dark:text-zinc-300 list-disc pl-5 marker:text-zinc-400">
            {sec.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {isNe
            ? 'निष्कर्ष (Conclusion & Way Forward)'
            : 'Conclusion & Way Forward'}
        </p>
        <p className="text-fluid-body font-medium text-zinc-800 dark:text-zinc-200">
          {content.conclusion}
        </p>
      </div>
    </div>
  );
}

export function WrittenQuestionsPage() {
  const { questionId } = useParams<{ questionId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const preferredLanguage = useAppSelector(
    (state) => state.written.preferredLanguage
  );
  const records = useAppSelector((state) => state.written.records);

  // Catalog filter states
  const sourceParam = searchParams.get('source') ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const [paperFilter, setPaperFilter] = useState<string>('all');
  const [marksFilter, setMarksFilter] = useState<MarksFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Focused studio state (for /written/:questionId)
  const activeQuestion = useMemo(
    () => (questionId ? getWrittenQuestionById(questionId) ?? null : null),
    [questionId]
  );

  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(18 * 60);
  const [showModelAnswerInStudio, setShowModelAnswerInStudio] = useState(true);
  const unsavedElapsedRef = useRef<number>(0);

  // Reset studio timer when switching active question
  useEffect(() => {
    if (!activeQuestion) {
      setTimerRunning(false);
      return;
    }
    dispatch(recordView({ itemId: activeQuestion.id }));
    setTimerRunning(false);
    setRemainingSeconds(activeQuestion.recommendedMinutes * 60);
    setShowModelAnswerInStudio(true);
    unsavedElapsedRef.current = 0;
  }, [activeQuestion, dispatch]);

  // Countdown tick & practice time persistence for active studio
  useEffect(() => {
    if (!timerRunning || !activeQuestion) return;

    const qId = activeQuestion.id;
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setShowModelAnswerInStudio(true);
          return 0;
        }
        return prev - 1;
      });

      unsavedElapsedRef.current += 1;
      if (unsavedElapsedRef.current >= 5) {
        dispatch(
          addWrittenPracticeSeconds({
            questionId: qId,
            seconds: unsavedElapsedRef.current,
          })
        );
        unsavedElapsedRef.current = 0;
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
      if (unsavedElapsedRef.current > 0) {
        dispatch(
          addWrittenPracticeSeconds({
            questionId: qId,
            seconds: unsavedElapsedRef.current,
          })
        );
        unsavedElapsedRef.current = 0;
      }
    };
  }, [timerRunning, activeQuestion, dispatch]);

  const summaryStats = useMemo(() => {
    let masteredCount = 0;
    let practicingCount = 0;
    let draftsCount = 0;
    let checkedRubricTotal = 0;
    let totalPracticeSeconds = 0;

    for (const q of WRITTEN_QUESTIONS) {
      const rec = records[q.id];
      if (!rec) continue;
      if (rec.status === 'mastered') masteredCount += 1;
      else if (rec.status === 'practicing') practicingCount += 1;
      if (rec.draftAnswer.trim().length > 0) draftsCount += 1;
      checkedRubricTotal += rec.checkedRubricIndices.length;
      totalPracticeSeconds += rec.timeSpentSeconds;
    }

    const totalRubricPossible = WRITTEN_QUESTIONS.reduce(
      (sum, q) => sum + q.rubric.length,
      0
    );

    return {
      totalQuestions: WRITTEN_QUESTIONS.length,
      masteredCount,
      practicingCount,
      draftsCount,
      checkedRubricTotal,
      totalRubricPossible,
      totalPracticeSeconds,
      hasAnyActivity: Object.keys(records).length > 0,
    };
  }, [records]);

  const sourceMaterialTitle = useMemo(() => {
    if (!sourceParam) return null;
    const match = READING_MATERIAL_CATEGORIES.flatMap((c) => c.items).find(
      (i) => i.path === sourceParam
    );
    return match?.title ?? sourceParam;
  }, [sourceParam]);

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return WRITTEN_QUESTIONS.filter((q) => {
      if (sourceParam && q.sourcePath !== sourceParam) return false;
      if (paperFilter !== 'all' && q.paper !== paperFilter) return false;
      if (marksFilter !== 'all' && String(q.marks) !== marksFilter) return false;

      const status: WrittenMasteryStatus = records[q.id]?.status ?? 'unseen';
      if (statusFilter !== 'all' && status !== statusFilter) return false;

      if (!query) return true;

      const searchable = [
        q.id,
        q.paper,
        q.subject,
        q.postTarget,
        q.en.title,
        q.en.question,
        q.en.introduction,
        q.ne.title,
        q.ne.question,
        q.ne.introduction,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [sourceParam, paperFilter, marksFilter, statusFilter, searchQuery, records]);

  const hasActiveFilters =
    Boolean(sourceParam) ||
    Boolean(searchQuery.trim()) ||
    paperFilter !== 'all' ||
    marksFilter !== 'all' ||
    statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPaperFilter('all');
    setMarksFilter('all');
    setStatusFilter('all');
    if (sourceParam) {
      setSearchParams({});
    }
  };

  const handleCopyAnswer = async (q: WrittenQuestion) => {
    try {
      const formatted = formatQuestionForClipboard(q, preferredLanguage);
      await navigator.clipboard.writeText(formatted);
      setCopiedId(q.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === q.id ? null : prev));
      }, 1800);
    } catch {
      // Clipboard restricted in some embedded contexts
    }
  };

  const handleOpenSourcePdf = (q: WrittenQuestion, fromPath: string) => {
    const fullUrl = resolveSampleUrl(q.sourcePath);
    navigate(`/read?url=${encodeURIComponent(fullUrl)}`, {
      state: {
        from: fromPath,
        fromLabel: 'Back to Written Q&A',
      },
    });
  };

  const toggleExpandCard = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderLanguageSegmentedControl = (layoutGroupId: string) => (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
      <span className="hidden sm:inline">Answer language:</span>
      <div
        role="group"
        aria-label="Written answer language mode"
        className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
      >
        {LANGUAGE_OPTIONS.map((opt) => {
          const active = preferredLanguage === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => dispatch(setPreferredWrittenLanguage(opt.id))}
              className={`relative px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'text-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={layoutGroupId}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 500, damping: 36 }
                  }
                  className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60"
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ============================================================================
  // FOCUSED STUDIO VIEW (/written/:questionId)
  // ============================================================================
  if (questionId && activeQuestion) {
    const activeIndex = WRITTEN_QUESTIONS.findIndex(
      (q) => q.id === activeQuestion.id
    );
    const prevQuestion =
      activeIndex > 0 ? WRITTEN_QUESTIONS[activeIndex - 1] : null;
    const nextQuestion =
      activeIndex < WRITTEN_QUESTIONS.length - 1
        ? WRITTEN_QUESTIONS[activeIndex + 1]
        : null;

    const record = records[activeQuestion.id];
    const currentStatus: WrittenMasteryStatus = record?.status ?? 'unseen';
    const draftText = record?.draftAnswer ?? '';
    const wordCount = countWords(draftText);
    const checkedIndices = record?.checkedRubricIndices ?? [];
    const targetWordRange =
      activeQuestion.marks === 10 ? '320–450 words' : '150–220 words';

    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />

        <PageTransition transitionKey={`studio-${activeQuestion.id}`}>
          <main className="flex-1">
          <article className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10">
            {/* Top Navigation & Language Control */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/written"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Written Questions</span>
                </Link>

                <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                  Question {activeIndex + 1} of {WRITTEN_QUESTIONS.length} ·{' '}
                  {activeQuestion.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {renderLanguageSegmentedControl('written-studio-lang-pill')}

                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      setWrittenQuestionStatus({
                        questionId: activeQuestion.id,
                        status:
                          currentStatus === 'mastered'
                            ? 'practicing'
                            : 'mastered',
                      })
                    )
                  }
                  className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentStatus === 'mastered'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {currentStatus === 'mastered'
                      ? 'Mastered'
                      : 'Mark as Mastered'}
                  </span>
                </button>
              </div>
            </div>

            {/* Official Exam Prompt Section */}
            <header className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-sans font-medium text-zinc-700 dark:text-zinc-300">
                    {activeQuestion.paper}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans">{activeQuestion.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans">{activeQuestion.postTarget}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {activeQuestion.marks} Marks ({activeQuestion.en.marksAllocation})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeQuestion.recommendedMinutes}m exam target</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <ReactionButtons
                    itemId={activeQuestion.id}
                    itemType="question"
                    size="sm"
                    showLabels
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenSourcePdf(
                        activeQuestion,
                        `/written/${activeQuestion.id}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 font-sans font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Source PDF: {activeQuestion.sourceTitle}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {preferredLanguage === 'ne'
                  ? activeQuestion.ne.title
                  : activeQuestion.en.title}
              </h1>

              {/* Prompt Box (Single level elevation) */}
              <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
                {preferredLanguage === 'bilingual' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-zinc-200/80 dark:lg:divide-zinc-800/80">
                    <div className="space-y-2 lg:pr-6">
                      <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        English Prompt · {activeQuestion.en.marksAllocation}
                      </p>
                      <p className="text-fluid-question font-medium text-zinc-950 dark:text-zinc-50">
                        {activeQuestion.en.question}
                      </p>
                    </div>
                    <div lang="ne" className="space-y-2 lg:pl-6">
                      <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        नेपाली प्रश्न · {activeQuestion.ne.marksAllocation}
                      </p>
                      <p className="text-fluid-question font-medium text-zinc-950 dark:text-zinc-50">
                        {activeQuestion.ne.question}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    lang={preferredLanguage === 'ne' ? 'ne' : 'en'}
                    className="space-y-2"
                  >
                    <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                      {preferredLanguage === 'ne'
                        ? `प्रश्न · ${activeQuestion.ne.marksAllocation}`
                        : `Exam Question · ${activeQuestion.en.marksAllocation}`}
                    </p>
                    <p className="text-fluid-question font-medium text-zinc-950 dark:text-zinc-50">
                      {preferredLanguage === 'ne'
                        ? activeQuestion.ne.question
                        : activeQuestion.en.question}
                    </p>
                  </div>
                )}
              </div>
            </header>

            {/* Timed Writing Practice Sandbox */}
            <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    Timed Answer Writing Pad
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    PSC written papers allocate 1.8 minutes per mark (
                    <span className="font-mono tabular-nums">
                      {activeQuestion.recommendedMinutes}:00
                    </span>{' '}
                    for {activeQuestion.marks} marks · recommended{' '}
                    <span className="font-mono tabular-nums">
                      {targetWordRange}
                    </span>
                    ). Drafts save automatically in your browser.
                  </p>
                </div>

                {/* Reverse Writing Timer Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span
                    className={`font-mono tabular-nums text-lg font-semibold px-2 ${
                      remainingSeconds <= 120 && remainingSeconds > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : remainingSeconds === 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-zinc-950 dark:text-zinc-50'
                    }`}
                  >
                    {formatReverseClock(remainingSeconds)}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (!timerRunning && remainingSeconds === activeQuestion.recommendedMinutes * 60) {
                        // Hide model answer automatically when starting fresh timed practice for active recall
                        setShowModelAnswerInStudio(false);
                      }
                      setTimerRunning((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>
                          {remainingSeconds <
                          activeQuestion.recommendedMinutes * 60
                            ? 'Resume'
                            : 'Start Timer'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setRemainingSeconds(
                        activeQuestion.recommendedMinutes * 60
                      );
                    }}
                    aria-label="Reset writing timer"
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <textarea
                value={draftText}
                onChange={(e) =>
                  dispatch(
                    saveWrittenDraft({
                      questionId: activeQuestion.id,
                      draftAnswer: e.target.value,
                    })
                  )
                }
                rows={7}
                placeholder="Outline or type your practice answer in English or नेपाली (Introduction → Structured Analytical Points → Way Forward / Conclusion)..."
                className="w-full rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-4 text-fluid-body text-zinc-900 dark:text-zinc-100 placeholder:text-xs sm:placeholder:text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <div className="flex flex-wrap items-center gap-2">
                  <span>{wordCount} words drafted</span>
                  {record?.timeSpentSeconds ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {formatCompactDuration(record.timeSpentSeconds)} logged
                      </span>
                    </>
                  ) : null}
                  {draftText.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-sans text-emerald-700 dark:text-emerald-400">
                        Saved in browser
                      </span>
                    </>
                  )}
                </div>

                {draftText.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        saveWrittenDraft({
                          questionId: activeQuestion.id,
                          draftAnswer: '',
                        })
                      )
                    }
                    className="font-sans text-xs font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Clear draft
                  </button>
                )}
              </div>
            </section>

            {/* Structured Model Answer Section */}
            <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                    Structured PSC Model Answer (English &amp; नेपाली)
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Organized in official high-scoring Lok Sewa format:
                    Introduction, Analytical Body Headings, and Conclusion.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAnswer(activeQuestion)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedId === activeQuestion.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowModelAnswerInStudio((prev) => !prev)
                    }
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {showModelAnswerInStudio ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Answer</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal Model Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showModelAnswerInStudio ? (
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <StructuredModelAnswer
                    question={activeQuestion}
                    languageMode={preferredLanguage}
                  />
                </div>
              ) : (
                <div className="py-10 text-center border-t border-dashed border-zinc-200 dark:border-zinc-800 space-y-3">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Model answer hidden during active writing recall
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                    Draft your own points above before comparing against the
                    bilingual model solution and examiner rubric.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowModelAnswerInStudio(true)}
                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Bilingual Model Answer</span>
                  </button>
                </div>
              )}
            </section>

            {/* Interactive Examiner Self-Evaluation Rubric */}
            <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    Examiner Evaluation Rubric (मूल्याङ्कनका मुख्य आधारहरू)
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Verify whether your written response covers each high-value
                    constitutional, statutory, and analytical point.
                  </p>
                </div>
                <span className="font-mono tabular-nums text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {checkedIndices.length}/{activeQuestion.rubric.length} points
                  covered
                </span>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 border-t border-zinc-100 dark:border-zinc-800/80">
                {activeQuestion.rubric.map((item, idx) => {
                  const checked = checkedIndices.includes(idx);
                  return (
                    <label
                      key={item.en}
                      className="py-3 flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          dispatch(
                            toggleWrittenRubricPoint({
                              questionId: activeQuestion.id,
                              rubricIndex: idx,
                            })
                          )
                        }
                        className="mt-1 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-600 cursor-pointer shrink-0"
                      />
                      <div className="space-y-0.5 text-fluid-option min-w-0 break-words">
                        {preferredLanguage !== 'ne' && (
                          <p
                            className={
                              checked
                                ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                                : 'text-zinc-700 dark:text-zinc-300'
                            }
                          >
                            {item.en}
                          </p>
                        )}
                        {preferredLanguage !== 'en' && (
                          <p
                            lang="ne"
                            className={
                              preferredLanguage === 'bilingual'
                                ? 'text-zinc-500 dark:text-zinc-400'
                                : checked
                                  ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                                  : 'text-zinc-700 dark:text-zinc-300'
                            }
                          >
                            {item.ne}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Previous / Next Question Footer Navigation */}
            <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-4">
              {prevQuestion ? (
                <Link
                  to={`/written/${prevQuestion.id}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-xs sm:max-w-md">
                    {prevQuestion.id}: {prevQuestion.en.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {nextQuestion ? (
                <Link
                  to={`/written/${nextQuestion.id}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors ml-auto text-right"
                >
                  <span className="truncate max-w-xs sm:max-w-md">
                    {nextQuestion.id}: {nextQuestion.en.title}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              ) : null}
            </div>
          </article>
          </main>

          <Footer />
        </PageTransition>
      </div>
    );
  }

  // ============================================================================
  // CATALOG & INLINE STUDY HUB VIEW (/written)
  // ============================================================================
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition transitionKey="catalog">
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
                Written Q&amp;A
              </span>
            </div>

            <AssessmentFormatNav active="written" />
          </div>

          {/* Header & Language Mode */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                PSC Written Exam Long Questions &amp; Bilingual Answers
              </h1>
              <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                Practice authentic{' '}
                <span className="font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-200">
                  5-mark
                </span>{' '}
                and{' '}
                <span className="font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-200">
                  10-mark
                </span>{' '}
                Lok Sewa subjective questions across Governance (Paper II),
                Contemporary Development (Paper III), and Service Delivery &amp;
                Case Analysis (Paper IV)—complete with structured{' '}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  English and नेपाली
                </span>{' '}
                model answers, timed writing scratchpads, and examiner rubrics.
              </p>
            </div>

            {renderLanguageSegmentedControl('written-catalog-lang-pill')}
          </div>

          {/* Invalid Question Deep-Link Notice */}
          {questionId && !activeQuestion && (
            <div
              role="status"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-wrap items-center justify-between gap-3 text-sm"
            >
              <span className="text-zinc-700 dark:text-zinc-300">
                Question &ldquo;{questionId}&rdquo; was not found. Select any
                long question below to study or launch timed writing mode.
              </span>
              <button
                type="button"
                onClick={() => navigate('/written')}
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Unboxed Quantitative KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 py-6 border-y border-zinc-200/80 dark:border-zinc-800/80">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Long Questions Mastered
              </p>
              <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {summaryStats.masteredCount}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{summaryStats.totalQuestions}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Rubric Criteria Verified
              </p>
              <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-emerald-700 dark:text-emerald-400">
                {summaryStats.checkedRubricTotal}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{summaryStats.totalRubricPossible}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Saved Answer Drafts
              </p>
              <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {summaryStats.draftsCount}
              </p>
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Written Practice Time
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                  {summaryStats.totalPracticeSeconds > 0
                    ? formatCompactDuration(summaryStats.totalPracticeSeconds)
                    : '0s'}
                </span>
                {summaryStats.hasAnyActivity && !confirmClearAll && (
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(true)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {confirmClearAll && (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/80 dark:bg-amber-950/30 p-4 flex flex-wrap items-center justify-between gap-4 text-xs"
            >
              <p className="text-amber-950 dark:text-amber-200 font-medium">
                Clear all saved written answer drafts, rubric checkmarks, and
                mastery statuses from this browser?
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(clearWrittenProgress());
                    setConfirmClearAll(false);
                  }}
                  className="h-8 px-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Confirm Clear
                </button>
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
            {sourceMaterialTitle && (
              <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-zinc-600 dark:text-zinc-300">
                  Showing written questions linked to:{' '}
                  <strong className="text-zinc-950 dark:text-zinc-50">
                    {sourceMaterialTitle}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer"
                >
                  Show all {WRITTEN_QUESTIONS.length} questions
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              {/* Search EN / नेपाली */}
              <div className="lg:col-span-4 space-y-1.5">
                <label
                  htmlFor="written-search-input"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Search (English or नेपाली)
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="written-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Federalism, संघीयता, 16th Plan, RTI..."
                    className="w-full h-10 sm:h-9 pl-8 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-[13.5px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Paper Filter */}
              <div className="lg:col-span-4 space-y-1.5">
                <label
                  htmlFor="written-paper-select"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  PSC Written Paper
                </label>
                <select
                  id="written-paper-select"
                  value={paperFilter}
                  onChange={(e) => setPaperFilter(e.target.value)}
                  className="w-full h-10 sm:h-9 min-w-0 truncate px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-[13.5px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="all">
                    All Papers (Papers II, III &amp; IV)
                  </option>
                  {WRITTEN_PAPERS.map((paper) => (
                    <option key={paper} value={paper}>
                      {paper}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marks Weightage */}
              <div className="lg:col-span-2 space-y-1.5">
                <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Marks
                </span>
                <div
                  role="group"
                  aria-label="Filter by marks"
                  className="grid grid-cols-3 h-10 sm:h-9 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono tabular-nums"
                >
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: '10', label: '10M' },
                      { id: '5', label: '5M' },
                    ] as const
                  ).map((m) => {
                    const active = marksFilter === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMarksFilter(m.id)}
                        className={`rounded-md font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-2 space-y-1.5">
                <label
                  htmlFor="written-status-select"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Status
                </label>
                <select
                  id="written-status-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="w-full h-10 sm:h-9 min-w-0 truncate px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-[13.5px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="mastered">Mastered</option>
                  <option value="practicing">Practicing</option>
                  <option value="unseen">Unseen</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-mono tabular-nums">
                  Showing {filteredQuestions.length} of{' '}
                  {WRITTEN_QUESTIONS.length} written questions
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Question List */}
          {filteredQuestions.length === 0 ? (
            <div className="py-14 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
              <p className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No written questions match the current filters
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Try clearing your search keyword or selecting All Papers.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center h-8 px-3.5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredQuestions.map((q, index) => {
                const rec = records[q.id];
                const status: WrittenMasteryStatus = rec?.status ?? 'unseen';
                const isExpanded = Boolean(expandedIds[q.id]);
                const checkedIndices = rec?.checkedRubricIndices ?? [];
                const hasDraft = Boolean(rec?.draftAnswer.trim());

                return (
                  <article
                    key={q.id}
                    className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 transition-colors"
                  >
                    {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {String(index + 1).padStart(2, '0')} · {q.id}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">{q.paper}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {q.marks} Marks ({q.en.marksAllocation})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{q.recommendedMinutes}:00 limit</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasDraft && (
                          <span className="font-sans text-blue-700 dark:text-blue-400">
                            Draft saved
                          </span>
                        )}
                        {hasDraft && status !== 'unseen' && (
                          <span aria-hidden="true">·</span>
                        )}
                        {status === 'mastered' && (
                          <span className="inline-flex items-center gap-1 font-sans font-medium text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mastered</span>
                          </span>
                        )}
                        {status === 'practicing' && (
                          <span className="font-sans font-medium text-amber-700 dark:text-amber-400">
                            Practicing
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="mt-3 font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                      {preferredLanguage === 'ne' ? q.ne.title : q.en.title}
                    </h2>
                    {preferredLanguage === 'bilingual' && (
                      <p
                        lang="ne"
                        className="mt-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400"
                      >
                        {q.ne.title}
                      </p>
                    )}

                    {/* Question Prompt */}
                    <div className="mt-4">
                      {preferredLanguage === 'bilingual' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:divide-x lg:divide-zinc-200/80 dark:lg:divide-zinc-800/80">
                          <p className="text-fluid-body text-zinc-800 dark:text-zinc-200 lg:pr-6">
                            {q.en.question}
                          </p>
                          <p
                            lang="ne"
                            className="text-fluid-body text-zinc-800 dark:text-zinc-200 lg:pl-6"
                          >
                            {q.ne.question}
                          </p>
                        </div>
                      ) : (
                        <p
                          lang={preferredLanguage === 'ne' ? 'ne' : 'en'}
                          className="text-fluid-body text-zinc-800 dark:text-zinc-200"
                        >
                          {preferredLanguage === 'ne'
                            ? q.ne.question
                            : q.en.question}
                        </p>
                      )}
                    </div>

                    {/* Card Action Bar */}
                    <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          to={`/written/${q.id}`}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                          <span>
                            Write Timed Answer ({q.recommendedMinutes}:00)
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleExpandCard(q.id)}
                          aria-expanded={isExpanded}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Hide Model Answer</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" />
                              <span>Read Model Answer (EN / ने)</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <ReactionButtons
                          itemId={q.id}
                          itemType="question"
                          size="sm"
                        />

                        <button
                          type="button"
                          onClick={() => handleOpenSourcePdf(q, '/written')}
                          className="inline-flex items-center gap-1 font-medium text-zinc-600 hover:text-blue-700 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Source PDF</span>
                          <ArrowUpRight className="w-3 h-3 opacity-70" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Expandable Model Answer & Rubric (Separated cleanly via border-t, no nested card) */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
                        <StructuredModelAnswer
                          question={q}
                          languageMode={preferredLanguage}
                        />

                        {/* Inline Rubric & Mastery Footer */}
                        <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                              Examiner Checklist ·{' '}
                              <span className="font-mono tabular-nums">
                                {checkedIndices.length}/{q.rubric.length}
                              </span>{' '}
                              checked
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyAnswer(q)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                {copiedId === q.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Answer</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    setWrittenQuestionStatus({
                                      questionId: q.id,
                                      status:
                                        status === 'mastered'
                                          ? 'practicing'
                                          : 'mastered',
                                    })
                                  )
                                }
                                className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                  status === 'mastered'
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>
                                  {status === 'mastered'
                                    ? 'Mastered'
                                    : 'Mark Mastered'}
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {q.rubric.map((rub, rIdx) => {
                              const isChecked = checkedIndices.includes(rIdx);
                              return (
                                <label
                                  key={rub.en}
                                  className="flex items-start gap-2.5 text-fluid-option text-zinc-700 dark:text-zinc-300 cursor-pointer break-words"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                      dispatch(
                                        toggleWrittenRubricPoint({
                                          questionId: q.id,
                                          rubricIndex: rIdx,
                                        })
                                      )
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-600 cursor-pointer shrink-0"
                                  />
                                  <span className="min-w-0">
                                    {preferredLanguage === 'ne' ? (
                                      <span lang="ne">{rub.ne}</span>
                                    ) : preferredLanguage === 'en' ? (
                                      rub.en
                                    ) : (
                                      <>
                                        {rub.en} / <span lang="ne">{rub.ne}</span>
                                      </>
                                    )}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Cross-Link Footer Banner to Paper I Timed MCQs */}
          <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
            <p className="text-zinc-600 dark:text-zinc-400">
              Preparing for{' '}
              <strong className="font-medium text-zinc-900 dark:text-zinc-100">
                Paper I Objective Preliminary Exam
              </strong>
              ? Drill timed 1-minute-per-question MCQs with -20% PSC net
              scoring.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Switch to Timed Objective Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
