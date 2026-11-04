import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Eraser,
  Flag,
  Grid,
  FileText,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatReverseClock } from '../quiz/QuizSessionDialog';
import {
  isQuestionCorrect,
  QUIZ_OPTION_KEYS,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import {
  deterministicPermute,
  OMR_PRESETS,
  WRITTEN_PRESETS,
  type BookletKey,
  type OmrPreset,
  type WrittenHallPreset,
} from '../../data/simulationPresets';
import {
  WRITTEN_QUESTIONS,
  type WrittenQuestion,
} from '../../data/writtenQuestionsData';
import { recordSimulationRun } from '../../features/psc/pscSlice';
import {
  recordQuizAttempt,
  type QuestionOutcome,
} from '../../features/quiz/quizSlice';
import {
  addWrittenPracticeSeconds,
  saveWrittenDraft,
  setWrittenQuestionStatus,
  type WrittenLanguageMode,
} from '../../features/written/writtenSlice';
import { resolveSampleUrl } from '../../utils/urlHelpers';

export {
  deterministicPermute,
  OMR_PRESETS,
  WRITTEN_PRESETS,
  type BookletKey,
  type OmrPreset,
  type WrittenHallPreset,
};

export type RubricCredit = 'full' | 'partial' | 'missed';
type OmrReviewFilter = 'all' | 'wrong' | 'blank' | 'correct' | 'flagged';
type MobileOmrPane = 'paper' | 'sheet';

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

interface HallCountdownRingProps {
  ratio: number;
  urgency: 'normal' | 'low' | 'critical';
}

function HallCountdownRing({ ratio, urgency }: HallCountdownRingProps) {
  const size = 26;
  const strokeWidth = 2.75;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, ratio));
  const dashOffset = circumference * (1 - clamped);

  let strokeClass = 'text-blue-600 dark:text-blue-400';
  if (urgency === 'critical') {
    strokeClass = 'text-red-600 dark:text-red-400';
  } else if (urgency === 'low') {
    strokeClass = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200/90 dark:text-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`${strokeClass} transition-[stroke-dashoffset,color] duration-300 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {urgency !== 'normal' ? (
          <AlertTriangle className="w-3 h-3" />
        ) : (
          <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PHASE I · OMR HALL DIALOG INNER
// ============================================================================

interface OmrHallDialogInnerProps {
  preset: OmrPreset;
  rollNumber: string;
  bookletKey: BookletKey;
  onBookletKeyChange: (nextKey: BookletKey) => void;
  onClose: () => void;
}

function OmrHallDialogInner({
  preset,
  rollNumber,
  bookletKey,
  onBookletKeyChange,
  onClose,
}: OmrHallDialogInnerProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    deterministicPermute(preset.selectQuestions(), bookletKey)
  );
  const [phase, setPhase] = useState<'sitting' | 'result'>('sitting');
  const [omrIndex, setOmrIndex] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [responses, setResponses] = useState<Record<string, QuizOptionKey[]>>(
    {}
  );
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(
    preset.allocatedSeconds
  );
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [confirmingExit, setConfirmingExit] = useState<boolean>(false);
  const [confirmingSubmit, setConfirmingSubmit] = useState<boolean>(false);
  const [mobilePane, setMobilePane] = useState<MobileOmrPane>('paper');
  const [reviewFilter, setReviewFilter] = useState<OmrReviewFilter>('all');

  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const deadlineTimestampRef = useRef<number>(
    Date.now() + preset.allocatedSeconds * 1000
  );
  const submittedOnceRef = useRef<boolean>(false);
  const latestResponsesRef = useRef<Record<string, QuizOptionKey[]>>({});

  useEffect(() => {
    latestResponsesRef.current = responses;
  }, [responses]);

  const activeQuestion = questions[omrIndex];

  const liveStats = useMemo(() => {
    let attempted = 0;
    let flaggedCount = 0;
    for (const q of questions) {
      if ((responses[q.id]?.length ?? 0) > 0) attempted += 1;
      if (flagged[q.id]) flaggedCount += 1;
    }
    return {
      attempted,
      blank: Math.max(0, questions.length - attempted),
      flagged: flaggedCount,
    };
  }, [questions, responses, flagged]);

  const nextBlankIndex = useMemo(() => {
    if (questions.length === 0) return null;
    for (let i = 1; i <= questions.length; i++) {
      const candidate = (omrIndex + i) % questions.length;
      if ((responses[questions[candidate].id]?.length ?? 0) === 0) {
        return candidate;
      }
    }
    return null;
  }, [omrIndex, questions, responses]);

  const nextFlaggedIndex = useMemo(() => {
    if (questions.length === 0) return null;
    for (let i = 1; i <= questions.length; i++) {
      const candidate = (omrIndex + i) % questions.length;
      if (flagged[questions[candidate].id]) {
        return candidate;
      }
    }
    if (activeQuestion && flagged[activeQuestion.id]) return omrIndex;
    return null;
  }, [omrIndex, activeQuestion, questions, flagged]);

  const goToQuestion = useCallback(
    (nextIdx: number, switchMobileToPaper = false) => {
      const clamped = Math.max(0, Math.min(questions.length - 1, nextIdx));
      if (clamped !== omrIndex) {
        setDirection(clamped > omrIndex ? 1 : -1);
        setOmrIndex(clamped);
      }
      if (switchMobileToPaper) {
        setMobilePane('paper');
      }
      if (bodyScrollRef.current && bodyScrollRef.current.scrollTop > 100) {
        bodyScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [omrIndex, questions.length]
  );

  const finalizeSitting = useCallback(
    (
      finalResponses: Record<string, QuizOptionKey[]>,
      finalRemaining: number,
      didTimeOut: boolean
    ) => {
      if (submittedOnceRef.current) return;
      submittedOnceRef.current = true;

      const marksPerQ = preset.marksPerQuestion;
      const penaltyPerWrong = marksPerQ * preset.negativeRate;
      const fullMarks = questions.length * marksPerQ;
      const passMarks = (fullMarks * preset.passPercent) / 100;

      let correctItems = 0;
      let wrongItems = 0;
      let attemptedItems = 0;
      const outcomes: Record<string, QuestionOutcome> = {};

      for (const q of questions) {
        const picked = finalResponses[q.id] ?? [];
        if (picked.length === 0) {
          outcomes[q.id] = 'skipped';
        } else {
          attemptedItems += 1;
          if (isQuestionCorrect(q, picked)) {
            correctItems += 1;
            outcomes[q.id] = 'correct';
          } else {
            wrongItems += 1;
            outcomes[q.id] = 'wrong';
          }
        }
      }

      const grossMarks = correctItems * marksPerQ;
      const negativeDeduction =
        Math.round(wrongItems * penaltyPerWrong * 100) / 100;
      const netMarks = Math.max(
        0,
        Math.round((grossMarks - negativeDeduction) * 100) / 100
      );
      const percentage =
        fullMarks > 0 ? Math.round((netMarks / fullMarks) * 1000) / 10 : 0;
      const passed = netMarks >= passMarks;
      const elapsed = didTimeOut
        ? preset.allocatedSeconds
        : Math.max(1, preset.allocatedSeconds - Math.max(0, finalRemaining));

      const completedAt = new Date().toISOString();

      dispatch(
        recordSimulationRun({
          id: `sim-omr-${Date.now()}`,
          presetId: preset.id,
          presetTitle: preset.title,
          cadreId: preset.cadreId,
          simulationType: 'omr-hall',
          fullMarks,
          passMarks,
          grossMarks,
          negativeDeduction,
          netMarks,
          percentage,
          passed,
          totalItems: questions.length,
          attemptedItems,
          correctItems,
          wrongItems,
          durationSeconds: elapsed,
          allocatedSeconds: preset.allocatedSeconds,
          rollNumber: rollNumber.trim() || 'PSC-83-40291',
          bookletKey,
          completedAt,
        })
      );

      dispatch(
        recordQuizAttempt({
          id: `att-sim-${Date.now()}`,
          deckId: preset.id,
          deckTitle: `${preset.title} (Key ${bookletKey})`,
          mode: 'exam',
          totalQuestions: questions.length,
          totalMarks: fullMarks,
          correctCount: correctItems,
          wrongCount: wrongItems,
          unansweredCount: questions.length - attemptedItems,
          accuracyPercent:
            questions.length > 0
              ? Math.round((correctItems / questions.length) * 100)
              : 0,
          pscNetScore: netMarks,
          durationSeconds: elapsed,
          deadlineSeconds: preset.allocatedSeconds,
          timedOut: didTimeOut,
          completedAt,
          questionOutcomes: outcomes,
        })
      );

      setSecondsLeft(didTimeOut ? 0 : finalRemaining);
      setTimedOut(didTimeOut);
      setConfirmingExit(false);
      setConfirmingSubmit(false);
      setReviewFilter('all');
      setPhase('result');
      bodyScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [preset, questions, rollNumber, bookletKey, dispatch]
  );

  // Wall-clock reverse countdown timer
  useEffect(() => {
    if (phase !== 'sitting') return;

    const tick = () => {
      const msLeft = deadlineTimestampRef.current - Date.now();
      if (msLeft <= 0) {
        setSecondsLeft(0);
        finalizeSitting(latestResponsesRef.current, 0, true);
        return;
      }
      setSecondsLeft(
        Math.min(preset.allocatedSeconds, Math.ceil(msLeft / 1000))
      );
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase, preset.allocatedSeconds, finalizeSitting]);

  const handleToggleOption = useCallback(
    (question: QuizQuestion, optionKey: QuizOptionKey) => {
      if (phase !== 'sitting') return;
      setResponses((prev) => {
        const current = prev[question.id] ?? [];
        if (question.is_multi_select) {
          const exists = current.includes(optionKey);
          const next = exists
            ? current.filter((k) => k !== optionKey)
            : QUIZ_OPTION_KEYS.filter(
                (k) => k === optionKey || current.includes(k)
              );
          return { ...prev, [question.id]: next };
        }
        if (current.length === 1 && current[0] === optionKey) {
          return { ...prev, [question.id]: [] };
        }
        return { ...prev, [question.id]: [optionKey] };
      });
    },
    [phase]
  );

  const handleClearCurrent = useCallback(
    (questionId: string) => {
      if (phase !== 'sitting') return;
      setResponses((prev) => ({ ...prev, [questionId]: [] }));
    },
    [phase]
  );

  const handleToggleFlag = useCallback(
    (questionId: string) => {
      if (phase !== 'sitting') return;
      setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
    },
    [phase]
  );

  const requestClose = useCallback(() => {
    const hasAnyShaded = Object.values(latestResponsesRef.current).some(
      (keys) => keys && keys.length > 0
    );
    if (phase === 'result' || !hasAnyShaded) {
      onClose();
      return;
    }
    setConfirmingSubmit(false);
    setConfirmingExit(true);
  }, [phase, onClose]);

  const requestSubmit = useCallback(() => {
    if (phase !== 'sitting') return;
    if (liveStats.blank > 0 || liveStats.flagged > 0) {
      setConfirmingExit(false);
      setConfirmingSubmit(true);
    } else {
      finalizeSitting(responses, secondsLeft, false);
    }
  }, [phase, liveStats.blank, liveStats.flagged, finalizeSitting, responses, secondsLeft]);

  const handleRetake = (nextKey: BookletKey = bookletKey) => {
    onBookletKeyChange(nextKey);
    const nextQuestions = deterministicPermute(
      preset.selectQuestions(),
      nextKey
    );
    submittedOnceRef.current = false;
    deadlineTimestampRef.current = Date.now() + preset.allocatedSeconds * 1000;
    setQuestions(nextQuestions);
    setOmrIndex(0);
    setDirection(1);
    setResponses({});
    setFlagged({});
    setSecondsLeft(preset.allocatedSeconds);
    setTimedOut(false);
    setConfirmingExit(false);
    setConfirmingSubmit(false);
    setMobilePane('paper');
    setReviewFilter('all');
    setPhase('sitting');
    bodyScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSourcePdf = (sourcePath: string) => {
    const fullUrl = resolveSampleUrl(sourcePath);
    navigate(`/read?url=${encodeURIComponent(fullUrl)}`, {
      state: {
        from: `${location.pathname}${location.search}`,
        fromLabel: 'Back to Exam Simulator',
      },
    });
  };

  // Keyboard shortcuts inside OMR Dialog
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (confirmingExit) {
          setConfirmingExit(false);
        } else if (confirmingSubmit) {
          setConfirmingSubmit(false);
        } else {
          requestClose();
        }
        return;
      }

      if (phase !== 'sitting' || confirmingExit || confirmingSubmit) return;
      if (!activeQuestion) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === '1' || key === 'a') {
        handleToggleOption(activeQuestion, 'A');
      } else if (key === '2' || key === 'b') {
        handleToggleOption(activeQuestion, 'B');
      } else if (key === '3' || key === 'c') {
        handleToggleOption(activeQuestion, 'C');
      } else if (key === '4' || key === 'd') {
        handleToggleOption(activeQuestion, 'D');
      } else if (key === 'f') {
        event.preventDefault();
        handleToggleFlag(activeQuestion.id);
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        handleClearCurrent(activeQuestion.id);
      } else if (
        event.key === 'ArrowRight' &&
        omrIndex < questions.length - 1
      ) {
        event.preventDefault();
        goToQuestion(omrIndex + 1);
      } else if (event.key === 'ArrowLeft' && omrIndex > 0) {
        event.preventDefault();
        goToQuestion(omrIndex - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    phase,
    confirmingExit,
    confirmingSubmit,
    activeQuestion,
    omrIndex,
    questions.length,
    handleToggleOption,
    handleToggleFlag,
    handleClearCurrent,
    goToQuestion,
    requestClose,
  ]);

  const resultDiagnostic = useMemo(() => {
    if (phase !== 'result' || questions.length === 0) return null;
    const marksPerQ = preset.marksPerQuestion;
    const penaltyPerWrong = marksPerQ * preset.negativeRate;
    const fullMarks = questions.length * marksPerQ;
    const passMarks = (fullMarks * preset.passPercent) / 100;

    let correct = 0;
    let wrong = 0;
    let blank = 0;

    const subjectMap = new Map<
      string,
      { total: number; correct: number; wrong: number; net: number }
    >();

    for (const q of questions) {
      const picked = responses[q.id] ?? [];
      const row = subjectMap.get(q.subject) ?? {
        total: 0,
        correct: 0,
        wrong: 0,
        net: 0,
      };
      row.total += 1;

      if (picked.length === 0) {
        blank += 1;
      } else if (isQuestionCorrect(q, picked)) {
        correct += 1;
        row.correct += 1;
        row.net += marksPerQ;
      } else {
        wrong += 1;
        row.wrong += 1;
        row.net -= penaltyPerWrong;
      }

      subjectMap.set(q.subject, row);
    }

    const grossMarks = correct * marksPerQ;
    const negativeDeduction = Math.round(wrong * penaltyPerWrong * 100) / 100;
    const netMarks = Math.max(
      0,
      Math.round((grossMarks - negativeDeduction) * 100) / 100
    );

    return {
      fullMarks,
      passMarks,
      marksPerQ,
      penaltyPerWrong,
      correct,
      wrong,
      blank,
      grossMarks,
      negativeDeduction,
      netMarks,
      scoreWithoutWrongGuesses: grossMarks,
      passed: netMarks >= passMarks,
      percentage:
        fullMarks > 0 ? Math.round((netMarks / fullMarks) * 1000) / 10 : 0,
      subjectRows: Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject,
        ...data,
        net: Math.round(data.net * 100) / 100,
      })),
    };
  }, [phase, questions, responses, preset]);

  const filteredReviewItems = useMemo(() => {
    return questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => {
        const picked = responses[q.id] ?? [];
        const isBlank = picked.length === 0;
        const isRight = !isBlank && isQuestionCorrect(q, picked);
        if (reviewFilter === 'wrong') return !isBlank && !isRight;
        if (reviewFilter === 'blank') return isBlank;
        if (reviewFilter === 'correct') return isRight;
        if (reviewFilter === 'flagged') return Boolean(flagged[q.id]);
        return true;
      });
  }, [questions, responses, flagged, reviewFilter]);

  const remainingRatio =
    preset.allocatedSeconds > 0
      ? Math.min(1, Math.max(0, secondsLeft / preset.allocatedSeconds))
      : 0;

  const isCritical = phase === 'sitting' && secondsLeft <= 60;
  const isLow = phase === 'sitting' && !isCritical && secondsLeft <= 300;
  const urgency: 'normal' | 'low' | 'critical' = isCritical
    ? 'critical'
    : isLow
      ? 'low'
      : 'normal';

  const timerTextClass = isCritical
    ? 'text-red-600 dark:text-red-400'
    : isLow
      ? 'text-amber-700 dark:text-amber-400'
      : 'text-zinc-900 dark:text-zinc-100';

  const timerBarClass = isCritical
    ? 'bg-red-600 dark:bg-red-500'
    : isLow
      ? 'bg-amber-600 dark:bg-amber-400'
      : 'bg-blue-700 dark:bg-blue-400';

  const questionSlideVariants = {
    enter: (dir: 1 | -1) =>
      shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: dir * 18 },
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) =>
      shouldReduceMotion ? { opacity: 0, x: 0 } : { opacity: 0, x: dir * -14 },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
        className="fixed inset-0 bg-zinc-950/65 dark:bg-black/75 backdrop-blur-xs"
        onClick={requestClose}
      />

      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, scale: 0.97, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98, y: 8 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }
        }
        className="relative z-10 w-full h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] sm:max-w-6xl flex flex-col rounded-none sm:rounded-2xl bg-white dark:bg-zinc-900 border-0 sm:border border-zinc-200/90 dark:border-zinc-800 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)] dark:shadow-[0_28px_80px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
      >
        {/* Sticky Header (compact on mobile <= 15% height cap) */}
        <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95">
          <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <span>Roll {rollNumber.trim() || 'PSC-83-40291'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  Key {bookletKey}
                </span>
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span className="hidden sm:inline">
                  +{preset.marksPerQuestion.toFixed(2)}M / -
                  {(preset.marksPerQuestion * preset.negativeRate).toFixed(2)}M
                </span>
              </div>
              <h2
                id="exam-sim-dialog-title"
                className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 truncate"
              >
                {preset.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {phase === 'sitting' && (
                <>
                  {/* Live Countdown */}
                  <div
                    aria-live="off"
                    className={`inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono tabular-nums font-semibold ${timerTextClass}`}
                  >
                    <HallCountdownRing
                      ratio={remainingRatio}
                      urgency={urgency}
                    />
                    <span>{formatReverseClock(secondsLeft)}</span>
                  </div>

                  {/* Mobile Paper / OMR Sheet Switcher (< 1024px) */}
                  <div
                    role="group"
                    aria-label="Mobile exam view"
                    className="lg:hidden inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/70 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setMobilePane('paper')}
                      className={`min-h-8 px-2.5 rounded-md font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
                        mobilePane === 'paper'
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      <FileText className="w-3 h-3 hidden sm:inline" />
                      <span>Paper</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobilePane('sheet')}
                      className={`min-h-8 px-2.5 rounded-md font-mono tabular-nums font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
                        mobilePane === 'sheet'
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      <Grid className="w-3 h-3 hidden sm:inline" />
                      <span>
                        OMR {liveStats.attempted}/{questions.length}
                      </span>
                    </button>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={requestClose}
                aria-label="Close examination hall dialog"
                className="min-h-10 min-w-10 sm:min-h-9 sm:min-w-9 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {phase === 'sitting' && (
            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800/90 overflow-hidden">
              <div
                className={`h-full ${timerBarClass} transition-transform duration-300 ease-out origin-left`}
                style={{ transform: `scaleX(${remainingRatio})` }}
              />
            </div>
          )}

          {/* Safe-Exit or Submit Confirmation Strip */}
          <AnimatePresence initial={false}>
            {confirmingExit && phase === 'sitting' && (
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
                }
                transition={{ duration: 0.15 }}
                className="px-3.5 sm:px-6 py-2.5 bg-amber-50/95 dark:bg-amber-950/45 border-t border-amber-200/80 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Leave the OMR hall? You have shaded {liveStats.attempted} of{' '}
                    {questions.length} bubbles.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmingExit(false)}
                    className="h-8 px-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium whitespace-nowrap"
                  >
                    Continue Sitting
                  </button>
                  <button
                    type="button"
                    onClick={() => finalizeSitting(responses, secondsLeft, false)}
                    className="h-8 px-3 rounded-lg bg-crimson-700 text-white font-medium hover:bg-crimson-800 dark:bg-crimson-600 whitespace-nowrap"
                  >
                    Submit &amp; Score
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-8 px-3 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium whitespace-nowrap"
                  >
                    Exit Hall
                  </button>
                </div>
              </motion.div>
            )}

            {confirmingSubmit && phase === 'sitting' && (
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
                }
                transition={{ duration: 0.15 }}
                className="px-3.5 sm:px-6 py-2.5 bg-amber-50/95 dark:bg-amber-950/45 border-t border-amber-200/80 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Submit final OMR sheet? ({liveStats.attempted} shaded ·{' '}
                    {liveStats.blank} blank · {liveStats.flagged} flagged)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmingSubmit(false)}
                    className="h-8 px-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium whitespace-nowrap"
                  >
                    Continue Checking
                  </button>
                  <button
                    type="button"
                    onClick={() => finalizeSitting(responses, secondsLeft, false)}
                    className="h-8 px-3 rounded-lg bg-crimson-700 text-white font-medium hover:bg-crimson-800 dark:bg-crimson-600 whitespace-nowrap"
                  >
                    Confirm Final Submit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable Dialog Body */}
        <div
          ref={bodyScrollRef}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {phase === 'result' && resultDiagnostic ? (
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-7 lg:p-8 space-y-7"
            >
              {/* Result Ledger Header */}
              <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {resultDiagnostic.passed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-400">
                        QUALIFIED FOR PHASE II WRITTEN EXAMINATION
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      <span className="text-red-600 dark:text-red-400">
                        BELOW {preset.passPercent}% PHASE I SCREENING CUTOFF
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  {preset.title} — Official Score Ledger
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  Roll: {rollNumber.trim() || 'PSC-83-40291'} · Booklet Key{' '}
                  {bookletKey}
                  {timedOut ? ' · Auto-submitted at 00:00' : ''}
                </p>
              </div>

              {/* Adaptive KPI Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Net PSC Score
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                    {resultDiagnostic.netMarks.toFixed(2)}
                    <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                      /{resultDiagnostic.fullMarks}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {resultDiagnostic.percentage}% (Pass:{' '}
                    {resultDiagnostic.passMarks.toFixed(1)})
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Gross Positive Marks
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-emerald-700 dark:text-emerald-400">
                    +{resultDiagnostic.grossMarks.toFixed(2)}
                  </p>
                  <p className="mt-0.5 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {resultDiagnostic.correct} correct ×{' '}
                    {resultDiagnostic.marksPerQ}M
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    -20% Wrong Deduction
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-red-600 dark:text-red-400">
                    -{resultDiagnostic.negativeDeduction.toFixed(2)}
                  </p>
                  <p className="mt-0.5 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {resultDiagnostic.wrong} wrong × -
                    {resultDiagnostic.penaltyPerWrong.toFixed(2)}M
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Unanswered (Safe Blank)
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                    {resultDiagnostic.blank}
                  </p>
                  <p className="mt-0.5 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    0.00M penalty incurred
                  </p>
                </div>
              </div>

              {/* Guessing Impact Insight */}
              {resultDiagnostic.wrong > 0 && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-semibold text-zinc-950 dark:text-zinc-100">
                      OMR Guessing Impact:{' '}
                    </span>
                    Leaving your {resultDiagnostic.wrong} incorrect bubbles
                    blank would have yielded{' '}
                    <span className="font-mono tabular-nums font-semibold">
                      {resultDiagnostic.scoreWithoutWrongGuesses.toFixed(2)}
                    </span>{' '}
                    net marks (+{resultDiagnostic.negativeDeduction.toFixed(2)}M
                    saved).
                  </p>
                </div>
              )}

              {/* Subject-Wise Table */}
              <div className="space-y-3">
                <h4 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-100">
                  Subject-Wise Net Marks Breakdown
                </h4>
                <div className="overflow-x-auto border-y border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                        <th className="py-2.5 pr-4 font-medium">Subject</th>
                        <th className="py-2.5 px-3 font-medium text-right">
                          Items
                        </th>
                        <th className="py-2.5 px-3 font-medium text-right">
                          Correct
                        </th>
                        <th className="py-2.5 px-3 font-medium text-right">
                          Wrong
                        </th>
                        <th className="py-2.5 pl-3 font-medium text-right">
                          Net Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-mono tabular-nums">
                      {resultDiagnostic.subjectRows.map((row) => (
                        <tr key={row.subject}>
                          <td className="py-2.5 pr-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">
                            {row.subject}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {row.total}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                            {row.correct}
                          </td>
                          <td className="py-2.5 px-3 text-right text-red-600 dark:text-red-400">
                            {row.wrong}
                          </td>
                          <td className="py-2.5 pl-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                            {row.net.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Filterable Booklet Answer Key */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    Booklet Key {bookletKey} — Answer Verification
                  </h4>

                  <div
                    role="group"
                    aria-label="Filter answer key"
                    className="max-w-full overflow-x-auto inline-flex flex-nowrap sm:flex-wrap items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/70 text-xs"
                  >
                    {(
                      [
                        {
                          id: 'all',
                          label: `All (${questions.length})`,
                          show: true,
                        },
                        {
                          id: 'wrong',
                          label: `Wrong (${resultDiagnostic.wrong})`,
                          show: true,
                        },
                        {
                          id: 'blank',
                          label: `Blank (${resultDiagnostic.blank})`,
                          show: resultDiagnostic.blank > 0,
                        },
                        {
                          id: 'correct',
                          label: `Correct (${resultDiagnostic.correct})`,
                          show: true,
                        },
                        {
                          id: 'flagged',
                          label: `Flagged (${liveStats.flagged})`,
                          show: liveStats.flagged > 0,
                        },
                      ] as const
                    )
                      .filter((f) => f.show)
                      .map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setReviewFilter(f.id)}
                          className={`min-h-8 px-2.5 py-1 rounded-md font-mono tabular-nums font-medium transition-colors whitespace-nowrap shrink-0 ${
                            reviewFilter === f.id
                              ? 'bg-blue-700 text-white dark:bg-blue-600'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                  </div>
                </div>

                {filteredReviewItems.length === 0 ? (
                  <div className="py-8 text-center border-y border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
                    No questions match this filter.{' '}
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className="font-medium text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap"
                    >
                      Show all items
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                    {filteredReviewItems.map(({ q, idx }) => {
                      const picked = responses[q.id] ?? [];
                      const isBlank = picked.length === 0;
                      const isRight = !isBlank && isQuestionCorrect(q, picked);

                      return (
                        <article key={q.id} className="py-5 space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              Q.{String(idx + 1).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            {isBlank ? (
                              <span className="text-zinc-500">
                                Blank (0.00M)
                              </span>
                            ) : isRight ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                                Correct (+{preset.marksPerQuestion.toFixed(2)}M)
                              </span>
                            ) : (
                              <span className="text-red-600 dark:text-red-400 font-semibold">
                                Wrong (-
                                {(
                                  preset.marksPerQuestion * preset.negativeRate
                                ).toFixed(2)}
                                M)
                              </span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span className="font-sans text-zinc-500 dark:text-zinc-400">
                              {q.subject} / {q.topic}
                            </span>
                          </div>

                          <p className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                            {q.question}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-x-4 gap-y-1 text-fluid-option break-words">
                            <span className="text-zinc-600 dark:text-zinc-400">
                              Your OMR:{' '}
                              <strong className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                                {isBlank ? '—' : picked.join(', ')}
                              </strong>
                            </span>
                            <span className="text-emerald-700 dark:text-emerald-400">
                              Official Key:{' '}
                              {q.correct_options.map((k, kIdx) => {
                                const opt = q.options.find((o) => o.key === k);
                                return (
                                  <span key={k}>
                                    {kIdx > 0 ? ', ' : ''}
                                    <strong className="font-mono font-semibold">
                                      {k}
                                    </strong>
                                    {opt ? (
                                      <span className="font-sans font-medium">
                                        {' '}
                                        ({opt.text})
                                      </span>
                                    ) : null}
                                  </span>
                                );
                              })}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {q.explanation}
                          </p>

                          {q.sourcePath && q.sourceTitle && (
                            <div className="pt-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenSourcePdf(q.sourcePath!)
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap"
                              >
                                <span>Read source PDF: {q.sourceTitle}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeQuestion ? (
            /* Two-Zone Desktop Split / Switchable Mobile View (Zero Nested Cards) */
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:divide-x divide-zinc-200 dark:divide-zinc-800 min-h-full">
              {/* Left 7 Cols: Question Paper Booklet */}
              <div
                className={`lg:col-span-7 p-4 sm:p-6 lg:p-8 flex-col ${
                  mobilePane === 'paper' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Segmented Progress Bar */}
                <div
                  className="grid gap-1 mb-5"
                  style={{
                    gridTemplateColumns: `repeat(${questions.length}, minmax(0, 1fr))`,
                  }}
                  aria-label="Question progress segments"
                >
                  {questions.map((q, idx) => {
                    const isCurrent = idx === omrIndex;
                    const hasAns = (responses[q.id]?.length ?? 0) > 0;
                    const isFlag = Boolean(flagged[q.id]);

                    let barClass =
                      'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700';
                    if (isCurrent) {
                      barClass = 'bg-crimson-700 dark:bg-crimson-500';
                    } else if (isFlag && !hasAns) {
                      barClass = 'bg-amber-500/80 dark:bg-amber-400/80';
                    } else if (hasAns) {
                      barClass = 'bg-blue-700 dark:bg-blue-400';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => goToQuestion(idx)}
                        aria-label={`Go to question ${idx + 1}`}
                        className="py-1.5 focus-visible:outline-none"
                      >
                        <span
                          className={`block h-1.5 w-full rounded-full transition-colors duration-150 ${barClass}`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Question Content */}
                <div className="flex-1 overflow-x-hidden">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={`${activeQuestion.id}-${omrIndex}`}
                      custom={direction}
                      variants={questionSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
                      }
                      className="space-y-5"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              Question {String(omrIndex + 1).padStart(2, '0')}{' '}
                              of {String(questions.length).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-sans">
                              {activeQuestion.subject}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              +{preset.marksPerQuestion}M / -
                              {(
                                preset.marksPerQuestion * preset.negativeRate
                              ).toFixed(2)}
                              M
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleFlag(activeQuestion.id)}
                            aria-pressed={Boolean(flagged[activeQuestion.id])}
                            className={`min-h-8 inline-flex items-center gap-1.5 px-2.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                              flagged[activeQuestion.id]
                                ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <Flag className="w-3.5 h-3.5" />
                            <span>
                              {flagged[activeQuestion.id]
                                ? 'Flagged'
                                : 'Flag review'}
                            </span>
                          </button>
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {activeQuestion.topic} / {activeQuestion.subtopic}
                          {activeQuestion.is_multi_select
                            ? ' · Multi-select item (shade all correct keys)'
                            : ''}
                        </p>
                      </div>

                      <h3 className="font-serif text-fluid-question font-semibold text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                        {activeQuestion.question}
                      </h3>

                      {/* Tactile OMR Option Cards */}
                      <div className="space-y-2 sm:space-y-2.5">
                        {activeQuestion.options.map((opt) => {
                          const picked =
                            responses[activeQuestion.id]?.includes(opt.key) ??
                            false;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() =>
                                handleToggleOption(activeQuestion, opt.key)
                              }
                              aria-pressed={picked}
                              className={`w-full min-h-11 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl border text-left flex items-start justify-between gap-2.5 sm:gap-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                picked
                                  ? 'border-blue-700 bg-blue-50/75 dark:border-blue-400 dark:bg-blue-950/35 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/40 dark:bg-zinc-950/30 text-zinc-900 dark:text-zinc-100'
                              }`}
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
                                <span
                                  className={`mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border font-mono text-[11px] sm:text-xs font-semibold inline-flex items-center justify-center shrink-0 transition-colors ${
                                    picked
                                      ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-500 dark:text-white dark:border-blue-500'
                                      : 'border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <span className="text-fluid-option pt-0.5 min-w-0 break-words">
                                  {opt.text}
                                </span>
                              </div>

                              {picked && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap shrink-0 mt-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="sr-only sm:not-sr-only">
                                    Shaded
                                  </span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Clear Bubble & Shortcut Strip */}
                      <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => handleClearCurrent(activeQuestion.id)}
                          disabled={
                            (responses[activeQuestion.id]?.length ?? 0) === 0
                          }
                          className="min-h-9 inline-flex items-center gap-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                          <span>Clear Bubble</span>
                        </button>

                        <span className="hidden md:inline font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          1–4 / A–D shade · F flag · Backspace clear · ← / →
                          move
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right 5 Cols: Live Interactive Digital OMR Bubble Sheet */}
              <aside
                className={`lg:col-span-5 p-4 sm:p-6 bg-zinc-50/55 dark:bg-zinc-950/35 flex-col justify-between gap-4 ${
                  mobilePane === 'sheet' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="text-xs font-mono tabular-nums">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        OMR ANSWER SHEET · KEY {bookletKey}
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        Shaded {liveStats.attempted} · Blank {liveStats.blank} ·
                        Flagged {liveStats.flagged}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {nextBlankIndex !== null &&
                        liveStats.attempted > 0 &&
                        liveStats.blank > 0 && (
                          <button
                            type="button"
                            onClick={() => goToQuestion(nextBlankIndex, true)}
                            className="font-medium text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap"
                          >
                            Next blank (Q{nextBlankIndex + 1})
                          </button>
                        )}
                      {nextFlaggedIndex !== null && liveStats.flagged > 0 && (
                        <button
                          type="button"
                          onClick={() => goToQuestion(nextFlaggedIndex, true)}
                          className="font-medium text-amber-700 dark:text-amber-400 hover:underline whitespace-nowrap"
                        >
                          Flagged ({liveStats.flagged})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OMR Bubble Rows */}
                  <div className="lg:max-h-[420px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {questions.map((q, idx) => {
                      const shaded = responses[q.id] ?? [];
                      const isCurrent = idx === omrIndex;
                      const isFlag = Boolean(flagged[q.id]);

                      return (
                        <div
                          key={q.id}
                          className={`px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2 text-xs ${
                            isCurrent
                              ? 'bg-blue-50/75 dark:bg-blue-950/30'
                              : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => goToQuestion(idx, true)}
                            className="min-h-9 font-mono tabular-nums font-semibold text-left min-w-14 sm:min-w-16 text-zinc-800 dark:text-zinc-200 hover:text-blue-700 dark:hover:text-blue-400 inline-flex items-center gap-1 whitespace-nowrap"
                          >
                            <span>Q.{String(idx + 1).padStart(2, '0')}</span>
                            {isFlag && (
                              <Flag className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            )}
                          </button>

                          <div className="flex items-center gap-1.5 sm:gap-2.5">
                            {QUIZ_OPTION_KEYS.map((key) => {
                              const isShaded = shaded.includes(key);
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => {
                                    goToQuestion(idx, false);
                                    handleToggleOption(q, key);
                                  }}
                                  aria-label={`Question ${idx + 1} option ${key}`}
                                  aria-pressed={isShaded}
                                  className={`w-8 h-8 lg:w-7 lg:h-7 rounded-full border font-mono text-[11px] font-semibold inline-flex items-center justify-center transition-colors ${
                                    isShaded
                                      ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-500 dark:text-white dark:border-blue-500'
                                      : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500'
                                  }`}
                                >
                                  {key}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Unshaded rows carry 0.00M deduction. Wrong bubbles deduct 20%
                  (-{(preset.marksPerQuestion * preset.negativeRate).toFixed(2)}
                  M). Minimum {preset.passPercent}% net score qualifies.
                </p>
              </aside>
            </div>
          ) : null}
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/75 flex flex-wrap items-center justify-between gap-2.5">
          {phase === 'result' ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  role="group"
                  aria-label="Select booklet key for retake"
                  className="hidden sm:inline-flex items-center gap-1 p-0.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                >
                  {(['A', 'B', 'C', 'D'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => onBookletKeyChange(k)}
                      className={`h-8 px-2.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                        bookletKey === k
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                      }`}
                    >
                      Key {k}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleRetake(bookletKey)}
                  className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Sitting (Key {bookletKey})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-10 sm:h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={omrIndex === 0}
                onClick={() => goToQuestion(omrIndex - 1, true)}
                className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3 sm:px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="hidden md:inline text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                {liveStats.attempted} of {questions.length} shaded ·{' '}
                {liveStats.blank} blank
              </span>

              <div className="flex items-center gap-2">
                {omrIndex < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={() => goToQuestion(omrIndex + 1, true)}
                    className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={requestSubmit}
                  className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 hidden sm:inline" />
                  <span>Submit OMR</span>
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ============================================================================
// PHASE II · TIMED WRITTEN PAPER HALL DIALOG INNER
// ============================================================================

interface WrittenHallDialogInnerProps {
  preset: WrittenHallPreset;
  rollNumber: string;
  initialLang: WrittenLanguageMode;
  onClose: () => void;
}

function WrittenHallDialogInner({
  preset,
  rollNumber,
  initialLang,
  onClose,
}: WrittenHallDialogInnerProps) {
  const dispatch = useAppDispatch();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const writtenRecords = useAppSelector((state) => state.written.records);

  const sittingQuestions = useMemo<WrittenQuestion[]>(() => {
    return preset.questionIds
      .map((id) => WRITTEN_QUESTIONS.find((q) => q.id === id))
      .filter((q): q is WrittenQuestion => Boolean(q));
  }, [preset]);

  const [lang, setLang] = useState<WrittenLanguageMode>(initialLang);
  const [phase, setPhase] = useState<'sitting' | 'grading'>('sitting');
  const [qIndex, setQIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    preset.allocatedSeconds
  );
  const [confirmingExit, setConfirmingExit] = useState<boolean>(false);
  const [runSaved, setRunSaved] = useState<boolean>(false);

  const [scripts, setScripts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const q of sittingQuestions) {
      initial[q.id] = writtenRecords[q.id]?.draftAnswer ?? '';
    }
    return initial;
  });

  const [rubricScores, setRubricScores] = useState<
    Record<string, Record<number, RubricCredit>>
  >(() => {
    const initial: Record<string, Record<number, RubricCredit>> = {};
    for (const q of sittingQuestions) {
      const qRubric: Record<number, RubricCredit> = {};
      q.rubric.forEach((_, idx) => {
        qRubric[idx] = 'partial';
      });
      initial[q.id] = qRubric;
    }
    return initial;
  });

  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const deadlineTimestampRef = useRef<number>(
    Date.now() + preset.allocatedSeconds * 1000
  );
  const finishedOnceRef = useRef<boolean>(false);
  const latestScriptsRef = useRef<Record<string, string>>(scripts);

  useEffect(() => {
    latestScriptsRef.current = scripts;
  }, [scripts]);

  const activeQuestion = sittingQuestions[qIndex];

  const finishSitting = useCallback(
    (finalScripts: Record<string, string>, finalRemaining: number) => {
      if (finishedOnceRef.current) return;
      finishedOnceRef.current = true;

      const elapsed = Math.max(
        1,
        preset.allocatedSeconds - Math.max(0, finalRemaining)
      );
      const perQuestionSeconds = Math.max(
        1,
        Math.round(elapsed / Math.max(1, sittingQuestions.length))
      );

      for (const q of sittingQuestions) {
        const text = finalScripts[q.id] ?? '';
        dispatch(saveWrittenDraft({ questionId: q.id, draftAnswer: text }));
        dispatch(
          addWrittenPracticeSeconds({
            questionId: q.id,
            seconds: perQuestionSeconds,
          })
        );
      }

      setSecondsLeft(Math.max(0, finalRemaining));
      setConfirmingExit(false);
      setPhase('grading');
      bodyScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [preset.allocatedSeconds, sittingQuestions, dispatch]
  );

  // Wall-clock reverse countdown timer
  useEffect(() => {
    if (phase !== 'sitting') return;

    const tick = () => {
      const msLeft = deadlineTimestampRef.current - Date.now();
      if (msLeft <= 0) {
        setSecondsLeft(0);
        finishSitting(latestScriptsRef.current, 0);
        return;
      }
      setSecondsLeft(
        Math.min(preset.allocatedSeconds, Math.ceil(msLeft / 1000))
      );
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase, preset.allocatedSeconds, finishSitting]);

  const totalDraftWords = useMemo(
    () =>
      sittingQuestions.reduce(
        (sum, q) => sum + countWords(scripts[q.id] ?? ''),
        0
      ),
    [sittingQuestions, scripts]
  );

  const requestClose = useCallback(() => {
    if (phase === 'grading' || totalDraftWords === 0) {
      onClose();
      return;
    }
    setConfirmingExit(true);
  }, [phase, totalDraftWords, onClose]);

  const handleSaveAndExit = () => {
    for (const q of sittingQuestions) {
      dispatch(
        saveWrittenDraft({
          questionId: q.id,
          draftAnswer: scripts[q.id] ?? '',
        })
      );
    }
    onClose();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (confirmingExit) {
          setConfirmingExit(false);
        } else {
          requestClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmingExit, requestClose]);

  const selfEvaluation = useMemo(() => {
    let fullMarks = 0;
    let earnedMarks = 0;

    for (const q of sittingQuestions) {
      fullMarks += q.marks;
      const rCount = Math.max(1, q.rubric.length);
      const perCriterion = q.marks / rCount;
      const qScores = rubricScores[q.id] ?? {};
      q.rubric.forEach((_, idx) => {
        const credit = qScores[idx] ?? 'partial';
        if (credit === 'full') earnedMarks += perCriterion;
        else if (credit === 'partial') earnedMarks += perCriterion * 0.6;
      });
    }

    const roundedEarned = Math.round(earnedMarks * 10) / 10;
    const passMarks = Math.round(fullMarks * 0.4 * 10) / 10;
    const percentage =
      fullMarks > 0 ? Math.round((roundedEarned / fullMarks) * 1000) / 10 : 0;

    return {
      fullMarks,
      earnedMarks: roundedEarned,
      passMarks,
      passed: roundedEarned >= passMarks,
      percentage,
    };
  }, [sittingQuestions, rubricScores]);

  const handleRecordScore = () => {
    if (runSaved) return;
    const elapsed = Math.max(
      1,
      preset.allocatedSeconds - Math.max(0, secondsLeft)
    );
    const attemptedCount = sittingQuestions.filter(
      (q) => countWords(scripts[q.id] ?? '') > 0
    ).length;

    for (const q of sittingQuestions) {
      const qScores = rubricScores[q.id] ?? {};
      const allFull =
        q.rubric.length > 0 &&
        q.rubric.every((_, idx) => qScores[idx] === 'full');
      if (allFull) {
        dispatch(
          setWrittenQuestionStatus({ questionId: q.id, status: 'mastered' })
        );
      }
    }

    dispatch(
      recordSimulationRun({
        id: `sim-wr-${Date.now()}`,
        presetId: preset.id,
        presetTitle: preset.title,
        cadreId: preset.cadreId,
        simulationType: 'written-hall',
        fullMarks: selfEvaluation.fullMarks,
        passMarks: selfEvaluation.passMarks,
        grossMarks: selfEvaluation.earnedMarks,
        negativeDeduction: 0,
        netMarks: selfEvaluation.earnedMarks,
        percentage: selfEvaluation.percentage,
        passed: selfEvaluation.passed,
        totalItems: sittingQuestions.length,
        attemptedItems: attemptedCount,
        correctItems: attemptedCount,
        wrongItems: 0,
        durationSeconds: elapsed,
        allocatedSeconds: preset.allocatedSeconds,
        rollNumber: rollNumber.trim() || 'PSC-83-40291',
        bookletKey: 'A',
        completedAt: new Date().toISOString(),
      })
    );

    setRunSaved(true);
  };

  const handleRetakePaper = () => {
    finishedOnceRef.current = false;
    deadlineTimestampRef.current = Date.now() + preset.allocatedSeconds * 1000;
    setQIndex(0);
    setSecondsLeft(preset.allocatedSeconds);
    setRunSaved(false);
    setConfirmingExit(false);
    setPhase('sitting');
    bodyScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remainingRatio =
    preset.allocatedSeconds > 0
      ? Math.min(1, Math.max(0, secondsLeft / preset.allocatedSeconds))
      : 0;
  const isCritical = phase === 'sitting' && secondsLeft <= 120;
  const isLow = phase === 'sitting' && !isCritical && secondsLeft <= 300;
  const urgency: 'normal' | 'low' | 'critical' = isCritical
    ? 'critical'
    : isLow
      ? 'low'
      : 'normal';

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
        className="fixed inset-0 bg-zinc-950/65 dark:bg-black/75 backdrop-blur-xs"
        onClick={requestClose}
      />

      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, scale: 0.97, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98, y: 8 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }
        }
        className="relative z-10 w-full h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] sm:max-w-5xl flex flex-col rounded-none sm:rounded-2xl bg-white dark:bg-zinc-900 border-0 sm:border border-zinc-200/90 dark:border-zinc-800 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)] dark:shadow-[0_28px_80px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95">
          <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <span className="font-sans font-medium text-blue-700 dark:text-blue-400">
                  {preset.paperCode}
                </span>
                <span aria-hidden="true">·</span>
                <span>Roll {rollNumber.trim() || 'PSC-83-40291'}</span>
              </div>
              <h2
                id="exam-sim-dialog-title"
                className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 truncate"
              >
                {preset.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {phase === 'sitting' && (
                <>
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono tabular-nums font-semibold ${
                      isCritical
                        ? 'text-red-600 dark:text-red-400'
                        : isLow
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    <HallCountdownRing
                      ratio={remainingRatio}
                      urgency={urgency}
                    />
                    <span>{formatReverseClock(secondsLeft)}</span>
                  </div>

                  <div
                    role="group"
                    aria-label="Prompt language"
                    className="hidden sm:inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/70 text-xs"
                  >
                    {(
                      [
                        { id: 'bilingual', label: 'EN + ने' },
                        { id: 'en', label: 'EN' },
                        { id: 'ne', label: 'नेपाली' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLang(opt.id)}
                        className={`min-h-7 px-2.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                          lang === opt.id
                            ? 'bg-blue-700 text-white dark:bg-blue-600'
                            : 'text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={requestClose}
                aria-label="Close written examination dialog"
                className="min-h-10 min-w-10 sm:min-h-9 sm:min-w-9 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {phase === 'sitting' && (
            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800/90 overflow-hidden">
              <div
                className={`h-full ${
                  isCritical
                    ? 'bg-red-600 dark:bg-red-500'
                    : isLow
                      ? 'bg-amber-600 dark:bg-amber-400'
                      : 'bg-blue-700 dark:bg-blue-400'
                } transition-transform duration-300 ease-out origin-left`}
                style={{ transform: `scaleX(${remainingRatio})` }}
              />
            </div>
          )}

          {/* Safe-Exit Banner */}
          <AnimatePresence initial={false}>
            {confirmingExit && phase === 'sitting' && (
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
                }
                transition={{ duration: 0.15 }}
                className="px-3.5 sm:px-6 py-2.5 bg-amber-50/95 dark:bg-amber-950/45 border-t border-amber-200/80 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Leave written hall? You have drafted {totalDraftWords} words
                    across your booklet.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmingExit(false)}
                    className="h-8 px-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium whitespace-nowrap"
                  >
                    Continue Writing
                  </button>
                  <button
                    type="button"
                    onClick={() => finishSitting(scripts, secondsLeft)}
                    className="h-8 px-3 rounded-lg bg-crimson-700 text-white font-medium hover:bg-crimson-800 dark:bg-crimson-600 whitespace-nowrap"
                  >
                    Submit &amp; Grade
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndExit}
                    className="h-8 px-3 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium whitespace-nowrap"
                  >
                    Save Draft &amp; Exit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable Body */}
        <div
          ref={bodyScrollRef}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8"
        >
          {phase === 'sitting' && activeQuestion ? (
            <div className="space-y-6">
              {/* Question Tabs + Mobile Language Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  {sittingQuestions.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setQIndex(idx)}
                      className={`min-h-9 px-3.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                        idx === qIndex
                          ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 dark:border-blue-500'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      Q{idx + 1} · {q.marks}M (
                      {countWords(scripts[q.id] ?? '')}w)
                    </button>
                  ))}
                </div>

                <div
                  role="group"
                  aria-label="Prompt language"
                  className="sm:hidden inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs"
                >
                  {(
                    [
                      { id: 'bilingual', label: 'EN+ने' },
                      { id: 'en', label: 'EN' },
                      { id: 'ne', label: 'नेपाली' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLang(opt.id)}
                      className={`min-h-7 px-2 rounded-md font-medium whitespace-nowrap ${
                        lang === opt.id
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Prompt */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span>{activeQuestion.id}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans">{activeQuestion.paper}</span>
                  <span aria-hidden="true">·</span>
                  <span>Marks: {activeQuestion.en.marksAllocation}</span>
                </div>

                {lang === 'bilingual' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
                    <p className="text-fluid-question font-serif font-semibold text-zinc-950 dark:text-zinc-50 lg:pr-6">
                      {activeQuestion.en.question}
                    </p>
                    <p
                      lang="ne"
                      className="text-fluid-question font-medium text-zinc-800 dark:text-zinc-200 lg:pl-6"
                    >
                      {activeQuestion.ne.question}
                    </p>
                  </div>
                ) : lang === 'en' ? (
                  <p className="text-fluid-question font-serif font-semibold text-zinc-950 dark:text-zinc-50">
                    {activeQuestion.en.question}
                  </p>
                ) : (
                  <p
                    lang="ne"
                    className="text-fluid-question font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    {activeQuestion.ne.question}
                  </p>
                )}
              </div>

              {/* Candidate Answer Booklet Textarea */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-sans">
                    Candidate Answer Script (English or नेपाली medium)
                  </span>
                  <span>
                    {countWords(scripts[activeQuestion.id] ?? '')} words ·
                    Target {activeQuestion.marks === 10 ? '180–240' : '90–120'}{' '}
                    words
                  </span>
                </div>

                <textarea
                  rows={11}
                  value={scripts[activeQuestion.id] ?? ''}
                  onChange={(e) =>
                    setScripts((prev) => ({
                      ...prev,
                      [activeQuestion.id]: e.target.value,
                    }))
                  }
                  placeholder="Write your structured PSC answer here (1. Introduction -> 2. Numbered Analytical Headings -> 3. Way Forward / Conclusion)..."
                  className="w-full min-h-[220px] sm:min-h-[280px] p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-fluid-body placeholder:text-xs sm:placeholder:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          ) : (
            /* Examiner Self-Grading View */
            <div className="space-y-8">
              <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    Examiner Self-Grading Sheet · Pass Benchmark: 40% (
                    {selfEvaluation.passMarks}M)
                  </p>
                  <h3 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                    Estimated Written Score:{' '}
                    <span className="font-mono tabular-nums">
                      {selfEvaluation.earnedMarks} / {selfEvaluation.fullMarks}
                    </span>{' '}
                    ({selfEvaluation.percentage}%)
                  </h3>
                </div>

                <span
                  className={`text-xs font-semibold font-mono tabular-nums whitespace-nowrap ${
                    selfEvaluation.passed
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {selfEvaluation.passed
                    ? 'CLEARS 40% WRITTEN BENCHMARK'
                    : 'BELOW 40% WRITTEN BENCHMARK'}
                </span>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {sittingQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`${idx === 0 ? 'pb-8' : 'py-8'} space-y-6`}
                  >
                    <div>
                      <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        Question {idx + 1} · {q.marks} Marks ·{' '}
                        {q.en.marksAllocation}
                      </p>
                      <h4 className="mt-1 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                        {q.en.title} / <span lang="ne">{q.ne.title}</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          Your Submitted Script (
                          {countWords(scripts[q.id] ?? '')} words)
                        </p>
                        <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-fluid-body text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap min-h-36">
                          {(scripts[q.id] ?? '').trim() ||
                            '(No response written during timed sitting)'}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          Official-Style Model Structure (EN / नेपाली)
                        </p>
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 text-xs leading-relaxed max-h-72 overflow-y-auto">
                          <p className="text-zinc-800 dark:text-zinc-200">
                            <strong>Intro:</strong> {q.en.introduction}
                          </p>
                          {q.en.sections.map((sec) => (
                            <div key={sec.heading} className="space-y-1">
                              <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                                {sec.heading}
                              </p>
                              <ul className="list-disc pl-4 space-y-0.5 text-zinc-700 dark:text-zinc-300">
                                {sec.points.map((pt) => (
                                  <li key={pt}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <p className="text-zinc-800 dark:text-zinc-200">
                            <strong>Conclusion:</strong> {q.en.conclusion}
                          </p>
                          <Link
                            to={`/written/${q.id}`}
                            className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-medium hover:underline"
                          >
                            <span>
                              Open full side-by-side नेपाली &amp; English studio
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Examiner Rubric Matrix */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Score Your Script Against Examiner Rubric Criteria:
                      </p>
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-y border-zinc-200/80 dark:border-zinc-800">
                        {q.rubric.map((crit, rIdx) => {
                          const selectedCredit =
                            rubricScores[q.id]?.[rIdx] ?? 'partial';
                          return (
                            <div
                              key={crit.en}
                              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
                            >
                              <div className="text-fluid-option space-y-0.5 min-w-0 break-words">
                                <p className="text-zinc-900 dark:text-zinc-100 font-medium">
                                  {crit.en}
                                </p>
                                <p
                                  lang="ne"
                                  className="text-zinc-500 dark:text-zinc-400"
                                >
                                  {crit.ne}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                {(
                                  [
                                    { id: 'full', label: 'Full (100%)' },
                                    { id: 'partial', label: 'Partial (60%)' },
                                    { id: 'missed', label: 'Missed (0%)' },
                                  ] as const
                                ).map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() =>
                                      setRubricScores((prev) => ({
                                        ...prev,
                                        [q.id]: {
                                          ...(prev[q.id] ?? {}),
                                          [rIdx]: opt.id,
                                        },
                                      }))
                                    }
                                    className={`min-h-8 px-2 sm:px-2.5 rounded-md text-[11px] sm:text-xs font-medium border transition-colors whitespace-nowrap ${
                                      selectedCredit === opt.id
                                        ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 dark:border-blue-500'
                                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/75 flex flex-wrap items-center justify-between gap-2.5">
          {phase === 'sitting' ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={qIndex === 0}
                  onClick={() => setQIndex((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 disabled:opacity-40 whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev Q</span>
                </button>

                {qIndex < sittingQuestions.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setQIndex((i) =>
                        Math.min(sittingQuestions.length - 1, i + 1)
                      )
                    }
                    className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 text-xs font-medium whitespace-nowrap"
                  >
                    <span>Next Q</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => finishSitting(scripts, secondsLeft)}
                className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="sm:hidden">Submit &amp; Grade</span>
                <span className="hidden sm:inline">
                  Submit Booklet &amp; Self-Grade
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetakePaper}
                className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Paper</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecordScore}
                  disabled={runSaved}
                  className={`inline-flex items-center gap-1.5 h-10 sm:h-9 px-4 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    runSaved
                      ? 'bg-emerald-700 text-white'
                      : 'bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {runSaved ? 'Saved to History' : 'Record Hall Score'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center h-10 sm:h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ============================================================================
// PUBLIC MODAL SHELL
// ============================================================================

export interface ExamSimulationDialogProps {
  open: boolean;
  simulationType: 'omr-hall' | 'written-hall';
  omrPreset: OmrPreset;
  writtenPreset: WrittenHallPreset;
  rollNumber: string;
  bookletKey: BookletKey;
  onBookletKeyChange: (key: BookletKey) => void;
  initialWrittenLang: WrittenLanguageMode;
  onClose: () => void;
}

export function ExamSimulationDialog({
  open,
  simulationType,
  omrPreset,
  writtenPreset,
  rollNumber,
  bookletKey,
  onBookletKeyChange,
  initialWrittenLang,
  onClose,
}: ExamSimulationDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-sim-dialog-title"
        >
          {simulationType === 'omr-hall' ? (
            <OmrHallDialogInner
              key={`omr-${omrPreset.id}`}
              preset={omrPreset}
              rollNumber={rollNumber}
              bookletKey={bookletKey}
              onBookletKeyChange={onBookletKeyChange}
              onClose={onClose}
            />
          ) : (
            <WrittenHallDialogInner
              key={`written-${writtenPreset.id}`}
              preset={writtenPreset}
              rollNumber={rollNumber}
              initialLang={initialWrittenLang}
              onClose={onClose}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
