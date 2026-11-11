import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  Grid,
  RotateCcw,
  Square,
  CheckSquare,
  X,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import {
  getDeckTotalMarks,
  getQuizDeadlineSeconds,
  isQuestionCorrect,
  QUIZ_OPTION_KEYS,
  type QuizDeck,
  type QuizDifficulty,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import {
  recordQuizAttempt,
  setPreferredQuizMode,
  type QuestionOutcome,
  type QuizPlayMode,
} from '../../features/quiz/quizSlice';
import { resolveSampleUrl } from '../../utils/urlHelpers';
import { storageService } from '../../services/storageService';
import { ReactionButtons } from '../common/ReactionButtons';
import { recordView } from '../../features/reactions/reactionsSlice';

type ReviewFilter = 'all' | 'incorrect' | 'unanswered' | 'correct' | 'flagged';

export function formatReverseClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getDifficultyTone(difficulty: QuizDifficulty): string {
  if (difficulty === 'Easy') {
    return 'text-emerald-700 dark:text-emerald-400';
  }
  if (difficulty === 'Hard') {
    return 'text-red-600 dark:text-red-400';
  }
  return 'text-amber-700 dark:text-amber-400';
}

function formatOptionList(
  question: QuizQuestion,
  keys: QuizOptionKey[]
): string {
  return keys
    .map((key) => {
      const match = question.options.find((opt) => opt.key === key);
      return match ? `${match.key}. ${match.text}` : key;
    })
    .join(' · ');
}

interface RadialCountdownProps {
  ratio: number;
  size?: number;
  strokeWidth?: number;
  urgency: 'normal' | 'low' | 'critical';
  children?: ReactNode;
}

function RadialCountdown({
  ratio,
  size = 84,
  strokeWidth = 5,
  urgency,
  children,
}: RadialCountdownProps) {
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
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

interface AnimatedScoreGaugeProps {
  percent: number;
  reduceMotion: boolean;
}

function AnimatedScoreGauge({
  percent,
  reduceMotion,
}: AnimatedScoreGaugeProps) {
  const [displayValue, setDisplayValue] = useState(
    reduceMotion ? percent : 0
  );

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(percent);
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const duration = 680;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * percent));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [percent, reduceMotion]);

  const size = 112;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset =
    circumference * (1 - Math.min(1, Math.max(0, percent / 100)));

  let accentStroke = 'text-blue-600 dark:text-blue-400';
  if (percent >= 75) {
    accentStroke = 'text-emerald-600 dark:text-emerald-400';
  } else if (percent < 45) {
    accentStroke = 'text-amber-600 dark:text-amber-400';
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
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: reduceMotion ? targetOffset : circumference,
          }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
          }
          className={accentStroke}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono tabular-nums text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {displayValue}%
        </span>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Accuracy
        </span>
      </div>
    </div>
  );
}

interface QuizSessionDialogProps {
  open: boolean;
  deck: QuizDeck | null;
  initialMode: QuizPlayMode;
  onClose: () => void;
}

interface QuizDialogInnerProps {
  deck: QuizDeck;
  initialMode: QuizPlayMode;
  onClose: () => void;
}

function QuizDialogInner({
  deck,
  initialMode,
  onClose,
}: QuizDialogInnerProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const totalQuestions = deck.questions.length;
  const totalMarks = useMemo(
    () => getDeckTotalMarks(deck.questions),
    [deck.questions]
  );
  // Strict 1 question = 1 minute rule (e.g. 15 questions => 15:00 reverse timer)
  const deadlineSeconds = getQuizDeadlineSeconds(totalQuestions);

  const [mode, setMode] = useState<QuizPlayMode>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, QuizOptionKey[]>
  >({});
  const [revealedStudyIds, setRevealedStudyIds] = useState<
    Record<string, boolean>
  >({});
  const [flaggedIds, setFlaggedIds] = useState<Record<string, boolean>>(() => {
    const saved = storageService.loadFlaggedQuestions();
    const map: Record<string, boolean> = {};
    for (const qId of Object.keys(saved)) {
      map[qId] = true;
    }
    return map;
  });
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    deadlineSeconds
  );

  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const deadlineTimestampRef = useRef<number>(
    Date.now() + deadlineSeconds * 1000
  );
  const submittedOnceRef = useRef(false);
  const latestAnswersRef = useRef<Record<string, QuizOptionKey[]>>({});

  useEffect(() => {
    latestAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  const currentQuestion = deck.questions[currentIndex];

  useEffect(() => {
    if (currentQuestion?.id) {
      dispatch(recordView({ itemId: currentQuestion.id }));
    }
  }, [currentQuestion?.id, dispatch]);

  const answeredCount = useMemo(
    () =>
      Object.values(selectedAnswers).filter((keys) => keys && keys.length > 0)
        .length,
    [selectedAnswers]
  );
  const flaggedCount = useMemo(
    () => Object.values(flaggedIds).filter(Boolean).length,
    [flaggedIds]
  );
  const elapsedSeconds = Math.max(0, deadlineSeconds - remainingSeconds);

  const goToQuestion = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(totalQuestions - 1, nextIndex));
      setMobileNavOpen(false);
      if (clamped === currentIndex) return;
      setDirection(clamped > currentIndex ? 1 : -1);
      setCurrentIndex(clamped);
      if (bodyScrollRef.current && bodyScrollRef.current.scrollTop > 120) {
        bodyScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [currentIndex, totalQuestions]
  );

  const toggleFlagCurrent = useCallback(() => {
    if (isSubmitted || !currentQuestion) return;
    const isNowFlagged = storageService.toggleFlaggedQuestion(currentQuestion.id, {
      source: 'quiz',
      deckTitle: deck.title,
    });
    setFlaggedIds((prev) => ({
      ...prev,
      [currentQuestion.id]: isNowFlagged,
    }));
  }, [isSubmitted, currentQuestion, deck.title]);

  const handleClearCurrentSelection = useCallback(() => {
    if (isSubmitted || !currentQuestion) return;
    if (mode === 'study' && revealedStudyIds[currentQuestion.id]) return;
    setSelectedAnswers((prev) => {
      if (!prev[currentQuestion.id]) return prev;
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  }, [isSubmitted, mode, currentQuestion, revealedStudyIds]);

  const requestClose = useCallback(() => {
    const hasAnyAnswer = Object.values(latestAnswersRef.current).some(
      (keys) => keys && keys.length > 0
    );
    if (isSubmitted || !hasAnyAnswer) {
      onClose();
      return;
    }
    setConfirmingExit(true);
  }, [isSubmitted, onClose]);

  const finalizeQuiz = useCallback(
    (
      finalAnswers: Record<string, QuizOptionKey[]>,
      finalRemaining: number,
      didTimeOut: boolean
    ) => {
      if (submittedOnceRef.current) return;
      submittedOnceRef.current = true;

      let correctCount = 0;
      let wrongCount = 0;
      let unansweredCount = 0;
      let earnedMarks = 0;
      let deductedMarks = 0;
      const questionOutcomes: Record<string, QuestionOutcome> = {};

      for (const q of deck.questions) {
        const picked = finalAnswers[q.id];
        if (!picked || picked.length === 0) {
          unansweredCount += 1;
          questionOutcomes[q.id] = 'skipped';
        } else if (isQuestionCorrect(q, picked)) {
          correctCount += 1;
          earnedMarks += q.marks;
          questionOutcomes[q.id] = 'correct';
        } else {
          wrongCount += 1;
          deductedMarks += q.marks * 0.2;
          questionOutcomes[q.id] = 'wrong';
        }
      }

      const accuracyPercent =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;
      const pscNetScore =
        Math.round(Math.max(0, earnedMarks - deductedMarks) * 100) / 100;
      const usedSeconds = didTimeOut
        ? deadlineSeconds
        : Math.max(1, deadlineSeconds - finalRemaining);

      dispatch(
        recordQuizAttempt({
          id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          deckId: deck.id,
          deckTitle: deck.title,
          mode,
          totalQuestions,
          totalMarks,
          correctCount,
          wrongCount,
          unansweredCount,
          accuracyPercent,
          pscNetScore,
          durationSeconds: usedSeconds,
          deadlineSeconds,
          timedOut: didTimeOut,
          completedAt: new Date().toISOString(),
          questionOutcomes,
        })
      );

      setConfirmingExit(false);
      setReviewFilter('all');
      setRemainingSeconds(didTimeOut ? 0 : finalRemaining);
      setTimedOut(didTimeOut);
      setIsSubmitted(true);
      bodyScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [deck, mode, totalQuestions, totalMarks, deadlineSeconds, dispatch]
  );

  // Wall-clock reverse countdown timer starting at N:00 (1 minute per question)
  useEffect(() => {
    if (isSubmitted) return;

    const tick = () => {
      const msLeft = deadlineTimestampRef.current - Date.now();
      if (msLeft <= 0) {
        setRemainingSeconds(0);
        finalizeQuiz(latestAnswersRef.current, 0, true);
        return;
      }
      const nextSecs = Math.min(deadlineSeconds, Math.ceil(msLeft / 1000));
      setRemainingSeconds(nextSecs);
    };

    tick();
    const intervalId = window.setInterval(tick, 250);
    return () => window.clearInterval(intervalId);
  }, [isSubmitted, deadlineSeconds, finalizeQuiz]);

  const handleSelectOption = useCallback(
    (optionKey: QuizOptionKey) => {
      if (isSubmitted || !currentQuestion) return;
      const qId = currentQuestion.id;
      if (mode === 'study' && revealedStudyIds[qId]) {
        return;
      }

      if (!currentQuestion.is_multi_select) {
        setSelectedAnswers((prev) => ({
          ...prev,
          [qId]: [optionKey],
        }));
        if (mode === 'study') {
          setRevealedStudyIds((prev) => ({
            ...prev,
            [qId]: true,
          }));
        }
        return;
      }

      // Multi-select toggle behavior
      setSelectedAnswers((prev) => {
        const existing = prev[qId] ?? [];
        const hasKey = existing.includes(optionKey);
        const updated = hasKey
          ? existing.filter((k) => k !== optionKey)
          : QUIZ_OPTION_KEYS.filter(
              (k) => k === optionKey || existing.includes(k)
            );

        const next = { ...prev };
        if (updated.length === 0) {
          delete next[qId];
        } else {
          next[qId] = updated;
        }
        return next;
      });
    },
    [isSubmitted, currentQuestion, mode, revealedStudyIds]
  );

  const handleRevealCurrentStudyAnswer = useCallback(() => {
    if (!currentQuestion || mode !== 'study') return;
    const picked = selectedAnswers[currentQuestion.id];
    if (!picked || picked.length === 0) return;
    setRevealedStudyIds((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  }, [currentQuestion, mode, selectedAnswers]);

  const handleResetSession = (nextMode: QuizPlayMode = mode) => {
    submittedOnceRef.current = false;
    deadlineTimestampRef.current = Date.now() + deadlineSeconds * 1000;
    setMode(nextMode);
    dispatch(setPreferredQuizMode(nextMode));
    setDirection(1);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setRevealedStudyIds({});
    const savedFlags = storageService.loadFlaggedQuestions();
    const reloadedFlags: Record<string, boolean> = {};
    for (const qId of Object.keys(savedFlags)) {
      reloadedFlags[qId] = true;
    }
    setFlaggedIds(reloadedFlags);
    setReviewFilter('all');
    setTimedOut(false);
    setConfirmingExit(false);
    setIsSubmitted(false);
    setRemainingSeconds(deadlineSeconds);
    bodyScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSourcePdf = (sourcePath: string) => {
    const fullUrl = resolveSampleUrl(sourcePath);
    navigate(`/read?url=${encodeURIComponent(fullUrl)}`, {
      state: {
        from: `${location.pathname}${location.search}`,
        fromLabel: `Back to ${deck.title}`,
      },
    });
  };

  const pickedKeys: QuizOptionKey[] = currentQuestion
    ? selectedAnswers[currentQuestion.id] ?? []
    : [];
  const hasCurrentSelection = pickedKeys.length > 0;
  const isCurrentFlagged = currentQuestion
    ? Boolean(flaggedIds[currentQuestion.id])
    : false;
  const isRevealedInStudy = Boolean(
    currentQuestion && mode === 'study' && revealedStudyIds[currentQuestion.id]
  );

  // Keyboard shortcuts (Escape, 1-4 / A-D, Enter to check multi-select in study mode, F to flag, Backspace to clear, Left/Right arrows)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (confirmingExit) {
          setConfirmingExit(false);
        } else {
          requestClose();
        }
        return;
      }

      if (isSubmitted || confirmingExit) return;

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
        handleSelectOption('A');
      } else if (key === '2' || key === 'b') {
        handleSelectOption('B');
      } else if (key === '3' || key === 'c') {
        handleSelectOption('C');
      } else if (key === '4' || key === 'd') {
        handleSelectOption('D');
      } else if (
        event.key === 'Enter' &&
        mode === 'study' &&
        currentQuestion?.is_multi_select &&
        !isRevealedInStudy &&
        hasCurrentSelection
      ) {
        event.preventDefault();
        handleRevealCurrentStudyAnswer();
      } else if (key === 'f') {
        event.preventDefault();
        toggleFlagCurrent();
      } else if (
        (event.key === 'Backspace' || event.key === 'Delete') &&
        !isRevealedInStudy
      ) {
        handleClearCurrentSelection();
      } else if (
        event.key === 'ArrowRight' &&
        currentIndex < totalQuestions - 1
      ) {
        goToQuestion(currentIndex + 1);
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        goToQuestion(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isSubmitted,
    confirmingExit,
    currentIndex,
    totalQuestions,
    mode,
    currentQuestion,
    isRevealedInStudy,
    hasCurrentSelection,
    handleSelectOption,
    handleRevealCurrentStudyAnswer,
    toggleFlagCurrent,
    handleClearCurrentSelection,
    goToQuestion,
    requestClose,
  ]);

  const resultsSummary = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let earnedMarks = 0;
    let deductedMarks = 0;

    const bySubjectMap = new Map<
      string,
      {
        subject: string;
        total: number;
        correct: number;
        totalMarks: number;
        netMarks: number;
      }
    >();

    for (const q of deck.questions) {
      const picked = selectedAnswers[q.id];
      const isUnans = !picked || picked.length === 0;
      const isCorr = !isUnans && isQuestionCorrect(q, picked);

      const subjEntry = bySubjectMap.get(q.subject) ?? {
        subject: q.subject,
        total: 0,
        correct: 0,
        totalMarks: 0,
        netMarks: 0,
      };
      subjEntry.total += 1;
      subjEntry.totalMarks += q.marks;

      if (isUnans) {
        unansweredCount += 1;
      } else if (isCorr) {
        correctCount += 1;
        earnedMarks += q.marks;
        subjEntry.correct += 1;
        subjEntry.netMarks += q.marks;
      } else {
        wrongCount += 1;
        const penalty = q.marks * 0.2;
        deductedMarks += penalty;
        subjEntry.netMarks -= penalty;
      }

      bySubjectMap.set(q.subject, subjEntry);
    }

    const accuracyPercent =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;
    const pscNetScore =
      Math.round(Math.max(0, earnedMarks - deductedMarks) * 100) / 100;

    const subjectBreakdown = Array.from(bySubjectMap.values()).map((item) => ({
      ...item,
      netMarks: Math.round(Math.max(0, item.netMarks) * 100) / 100,
    }));

    return {
      correctCount,
      wrongCount,
      unansweredCount,
      accuracyPercent,
      pscNetScore,
      subjectBreakdown,
    };
  }, [deck.questions, selectedAnswers, totalQuestions]);

  const filteredReviewQuestions = useMemo(() => {
    return deck.questions
      .map((q, index) => ({ q, index }))
      .filter(({ q }) => {
        const picked = selectedAnswers[q.id];
        const isUnans = !picked || picked.length === 0;
        const isCorr = !isUnans && isQuestionCorrect(q, picked);

        if (reviewFilter === 'incorrect') {
          return !isUnans && !isCorr;
        }
        if (reviewFilter === 'unanswered') {
          return isUnans;
        }
        if (reviewFilter === 'correct') {
          return isCorr;
        }
        if (reviewFilter === 'flagged') {
          return Boolean(flaggedIds[q.id]);
        }
        return true;
      });
  }, [deck.questions, selectedAnswers, flaggedIds, reviewFilter]);

  const nextUnansweredIndex = useMemo(() => {
    for (let i = 1; i <= totalQuestions; i++) {
      const candidate = (currentIndex + i) % totalQuestions;
      const ans = selectedAnswers[deck.questions[candidate].id];
      if (!ans || ans.length === 0) {
        return candidate;
      }
    }
    return null;
  }, [currentIndex, deck.questions, selectedAnswers, totalQuestions]);

  const nextFlaggedIndex = useMemo(() => {
    for (let i = 1; i <= totalQuestions; i++) {
      const candidate = (currentIndex + i) % totalQuestions;
      if (flaggedIds[deck.questions[candidate].id]) {
        return candidate;
      }
    }
    if (currentQuestion && flaggedIds[currentQuestion.id]) {
      return currentIndex;
    }
    return null;
  }, [currentIndex, currentQuestion, deck.questions, flaggedIds, totalQuestions]);

  const remainingRatio =
    deadlineSeconds > 0
      ? Math.min(1, Math.max(0, remainingSeconds / deadlineSeconds))
      : 0;

  const isFinalMinute = !isSubmitted && remainingSeconds <= 60;
  const isLowTime =
    !isSubmitted &&
    !isFinalMinute &&
    remainingSeconds <= 120 &&
    deadlineSeconds > 120;

  const urgencyState: 'normal' | 'low' | 'critical' = isFinalMinute
    ? 'critical'
    : isLowTime
      ? 'low'
      : 'normal';

  let timerTextColor = 'text-zinc-900 dark:text-zinc-100';
  let timerBarColor = 'bg-blue-600 dark:bg-blue-400';
  let timerUrgencyLabel: string | null = null;

  if (isFinalMinute) {
    timerTextColor = 'text-red-600 dark:text-red-400';
    timerBarColor = 'bg-red-600 dark:bg-red-500';
    timerUrgencyLabel = 'Final minute';
  } else if (isLowTime) {
    timerTextColor = 'text-amber-700 dark:text-amber-400';
    timerBarColor = 'bg-amber-600 dark:bg-amber-400';
    timerUrgencyLabel = 'Under 2 min left';
  }

  const questionSlideVariants = {
    enter: (dir: 1 | -1) =>
      shouldReduceMotion
        ? { opacity: 1, x: 0 }
        : { opacity: 0, x: dir * 20 },
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) =>
      shouldReduceMotion
        ? { opacity: 0, x: 0 }
        : { opacity: 0, x: dir * -16 },
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
        className="fixed inset-0 bg-zinc-950/60 dark:bg-black/75 backdrop-blur-xs"
        onClick={requestClose}
      />

      {/* Modal Surface */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, scale: 0.965, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.975, y: 8 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }
        }
        className="relative z-10 w-full h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] sm:max-w-5xl flex flex-col rounded-none sm:rounded-2xl bg-white dark:bg-zinc-900 border-0 sm:border border-zinc-200/90 dark:border-zinc-800 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)] dark:shadow-[0_28px_80px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
      >
        {/* Sticky Dialog Header */}
        <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95">
          <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <span>{totalQuestions} Qs</span>
                <span aria-hidden="true">·</span>
                <span>{totalMarks}M</span>
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span className="hidden sm:inline">
                  {totalQuestions} min limit (1m / Q)
                </span>
                <span aria-hidden="true" className="hidden md:inline">
                  ·
                </span>
                <span className="hidden md:inline font-sans">
                  {deck.subtitle}
                </span>
              </div>
              <h2
                id="quiz-dialog-title"
                className="mt-0.5 font-serif text-fluid-h3 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 truncate"
              >
                {deck.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
              {!isSubmitted && (
                <>
                  {/* Live Radial Ring + Reverse Countdown Readout */}
                  <div
                    aria-live="off"
                    className={`inline-flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-mono tabular-nums font-semibold ${timerTextColor}`}
                  >
                    <RadialCountdown
                      ratio={remainingRatio}
                      size={26}
                      strokeWidth={2.75}
                      urgency={urgencyState}
                    >
                      {isFinalMinute || isLowTime ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                      )}
                    </RadialCountdown>

                    <div className="flex items-baseline gap-1">
                      <motion.span
                        key={isFinalMinute ? remainingSeconds : 'steady'}
                        initial={
                          isFinalMinute && !shouldReduceMotion
                            ? { scale: 1.08 }
                            : false
                        }
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {formatReverseClock(remainingSeconds)}
                      </motion.span>
                      <span className="hidden sm:inline text-xs font-normal text-zinc-400 dark:text-zinc-500">
                        / {formatReverseClock(deadlineSeconds)}
                      </span>
                    </div>

                    {timerUrgencyLabel && (
                      <span className="hidden md:inline font-sans text-xs font-medium">
                        · {timerUrgencyLabel}
                      </span>
                    )}
                  </div>

                  {/* Mobile Question Navigator Drawer Button (< 1024px) */}
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen((v) => !v)}
                    aria-pressed={mobileNavOpen}
                    className={`lg:hidden min-h-8 px-2.5 rounded-lg border text-xs font-mono tabular-nums font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                      mobileNavOpen
                        ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    <span>
                      {answeredCount}/{totalQuestions}
                    </span>
                  </button>

                  {/* Spring Format Switcher */}
                  <div
                    role="group"
                    aria-label="Quiz mode"
                    className="hidden sm:inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/70 text-xs"
                  >
                    {(['exam', 'study'] as const).map((tabMode) => {
                      const active = mode === tabMode;
                      return (
                        <button
                          key={tabMode}
                          type="button"
                          onClick={() => {
                            if (mode !== tabMode) handleResetSession(tabMode);
                          }}
                          className={`relative px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            active
                              ? 'text-zinc-950 dark:text-zinc-50'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="quiz-dialog-mode-indicator"
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : {
                                      type: 'spring',
                                      stiffness: 500,
                                      damping: 36,
                                    }
                              }
                              className="absolute inset-0 rounded-md bg-white dark:bg-zinc-900 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60"
                            />
                          )}
                          <span className="relative z-10">
                            {tabMode === 'exam' ? 'Real Quiz' : 'Study Hints'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={requestClose}
                aria-label="Close quiz dialog"
                className="min-h-10 min-w-10 sm:min-h-9 sm:min-w-9 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Depleting Reverse Countdown Hairline Bar */}
          {!isSubmitted && (
            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800/90 overflow-hidden">
              <div
                className={`h-full ${timerBarColor} transition-transform duration-300 ease-out origin-left`}
                style={{ transform: `scaleX(${remainingRatio})` }}
              />
            </div>
          )}

          {/* Animated Inline Safe-Exit Confirmation Strip */}
          <AnimatePresence initial={false}>
            {confirmingExit && !isSubmitted && (
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
                }
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="px-5 sm:px-6 py-3 bg-amber-50/90 dark:bg-amber-950/40 border-t border-amber-200/80 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Leave this timed quiz? You have answered {answeredCount} of{' '}
                    {totalQuestions} questions.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmingExit(false)}
                    className="h-8 px-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Continue Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      finalizeQuiz(selectedAnswers, remainingSeconds, false)
                    }
                    className="h-8 px-3 rounded-lg bg-crimson-700 text-white font-medium hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Submit &amp; Score
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-8 px-3 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Exit Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable Dialog Body */}
        <div ref={bodyScrollRef} className="flex-1 overflow-y-auto">
          {isSubmitted ? (
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 sm:p-8 space-y-6 sm:space-y-8"
            >
              {/* Hero Score Summary Split */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-7 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <AnimatedScoreGauge
                  percent={resultsSummary.accuracyPercent}
                  reduceMotion={shouldReduceMotion}
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    <span>
                      {mode === 'exam' ? 'Real Quiz Mode' : 'Study Hints Mode'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {timedOut
                        ? 'Auto-submitted at 00:00'
                        : `Finished with ${formatReverseClock(remainingSeconds)} remaining`}
                    </span>
                  </div>

                  <h3 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {timedOut
                      ? 'Time Expired — Quiz Submitted'
                      : resultsSummary.accuracyPercent >= 80
                        ? 'Strong Exam Readiness'
                        : resultsSummary.accuracyPercent >= 50
                          ? 'Assessment Complete'
                          : 'Foundation Review Recommended'}
                  </h3>

                  <p className="text-fluid-body text-zinc-600 dark:text-zinc-400 max-w-2xl">
                    You answered{' '}
                    <span className="font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-200">
                      {resultsSummary.correctCount}
                    </span>{' '}
                    of{' '}
                    <span className="font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-200">
                      {totalQuestions}
                    </span>{' '}
                    questions correctly for a Lok Sewa PSC net score of{' '}
                    <span className="font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-200">
                      {resultsSummary.pscNetScore.toFixed(2)} / {totalMarks}
                    </span>{' '}
                    marks (after -20% negative marking on incorrect responses).
                  </p>
                </div>
              </div>

              {/* Unboxed Quantitative Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 pb-7 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Correct Answers
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-emerald-700 dark:text-emerald-400">
                    {resultsSummary.correctCount}
                    <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                      /{totalQuestions}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Incorrect / Skipped
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                    {resultsSummary.wrongCount}
                    <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                      {' '}
                      / {resultsSummary.unansweredCount}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    PSC Net Marks (-20%)
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                    {resultsSummary.pscNetScore.toFixed(2)}
                    <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                      /{totalMarks}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Time Used / Limit
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatReverseClock(
                      timedOut ? deadlineSeconds : Math.max(1, elapsedSeconds)
                    )}
                    <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                      /{formatReverseClock(deadlineSeconds)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Subject-wise Performance Breakdown */}
              {resultsSummary.subjectBreakdown.length > 1 && (
                <div className="space-y-3 pb-7 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <h4 className="font-serif text-fluid-h3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Subject-Wise Breakdown
                  </h4>
                  <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 border-y border-zinc-200/80 dark:border-zinc-800/80">
                    {resultsSummary.subjectBreakdown.map((row) => {
                      const pct =
                        row.total > 0
                          ? Math.round((row.correct / row.total) * 100)
                          : 0;
                      return (
                        <div
                          key={row.subject}
                          className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {row.subject}
                          </span>
                          <div className="flex items-center gap-2.5 font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400">
                            <span>
                              {row.correct}/{row.total} correct ({pct}%)
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                              {row.netMarks.toFixed(2)}/{row.totalMarks} marks
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Answer Key & Interactive Filter Tabs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="font-serif text-fluid-h3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Answer Key &amp; Source References
                  </h4>

                  <div
                    role="group"
                    aria-label="Filter reviewed questions"
                    className="max-w-full overflow-x-auto inline-flex flex-nowrap sm:flex-wrap items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/70 text-xs"
                  >
                    {(
                      [
                        {
                          id: 'all',
                          label: `All (${totalQuestions})`,
                          show: true,
                        },
                        {
                          id: 'incorrect',
                          label: `Incorrect (${resultsSummary.wrongCount})`,
                          show: true,
                        },
                        {
                          id: 'unanswered',
                          label: `Skipped (${resultsSummary.unansweredCount})`,
                          show: resultsSummary.unansweredCount > 0,
                        },
                        {
                          id: 'correct',
                          label: `Correct (${resultsSummary.correctCount})`,
                          show: true,
                        },
                        {
                          id: 'flagged',
                          label: `Flagged (${flaggedCount})`,
                          show: flaggedCount > 0,
                        },
                      ] as const
                    )
                      .filter((item) => item.show)
                      .map((item) => {
                        const active = reviewFilter === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setReviewFilter(item.id)}
                            className={`relative px-2.5 py-1 rounded-md font-mono tabular-nums font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              active
                                ? 'text-zinc-950 dark:text-zinc-50'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="quiz-review-filter-indicator"
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : {
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 36,
                                      }
                                }
                                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-900 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60"
                              />
                            )}
                            <span className="relative z-10">{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {filteredReviewQuestions.length === 0 ? (
                  <div className="py-10 text-center border-y border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
                    No questions match this filter.{' '}
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className="font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                    >
                      Show all questions
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                    {filteredReviewQuestions.map(({ q, index }) => {
                      const picked = selectedAnswers[q.id] ?? [];
                      const isUnanswered = picked.length === 0;
                      const isCorrect =
                        !isUnanswered && isQuestionCorrect(q, picked);
                      const wasFlagged = Boolean(flaggedIds[q.id]);
                      const wrongPenalty = (q.marks * 0.2).toFixed(2);

                      return (
                        <motion.article
                          key={`${q.id}-${index}`}
                          initial={
                            shouldReduceMotion
                              ? false
                              : { opacity: 0, y: 6 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.16,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="py-5 space-y-2.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                Q{String(index + 1).padStart(2, '0')}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{q.id}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-sans">
                                {q.subject} / {q.topic} / {q.subtopic}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={`font-sans font-medium ${getDifficultyTone(
                                  q.difficulty
                                )}`}
                              >
                                {q.difficulty}
                              </span>
                              {wasFlagged && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="inline-flex items-center gap-1 font-sans text-amber-700 dark:text-amber-400">
                                    <Flag className="w-3 h-3" />
                                    <span>Flagged</span>
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <ReactionButtons
                                itemId={q.id}
                                itemType="question"
                                size="xs"
                              />

                              {isCorrect ? (
                                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums font-medium text-emerald-700 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Correct (+{q.marks.toFixed(2)})</span>
                                </span>
                              ) : isUnanswered ? (
                                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums font-medium text-zinc-500 dark:text-zinc-400">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Skipped (0.00)</span>
                                </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-mono tabular-nums font-medium text-red-600 dark:text-red-400">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Incorrect (-{wrongPenalty})</span>
                              </span>
                            )}
                          </div>
                        </div>

                          <h5 className="font-serif text-fluid-h3 font-semibold text-zinc-900 dark:text-zinc-100">
                            {q.question}
                          </h5>

                          <div className="space-y-1 text-fluid-option break-words">
                            {!isUnanswered && !isCorrect && (
                              <p className="text-red-700 dark:text-red-400">
                                <span className="font-semibold">
                                  Your choice:
                                </span>{' '}
                                {formatOptionList(q, picked)}
                              </p>
                            )}
                            <p className="text-emerald-700 dark:text-emerald-400">
                              <span className="font-semibold">
                                Correct answer:
                              </span>{' '}
                              {formatOptionList(q, q.correct_options)}
                            </p>
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
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <span>Read source PDF: {q.sourceTitle}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : currentQuestion ? (
            /* Two-Zone Split Divided by Hairline Border (Zero Nested Cards) */
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:divide-x divide-zinc-200 dark:divide-zinc-800 min-h-full">
              {/* Left Zone: Interactive Question Stage */}
              <div
                className={`lg:col-span-8 p-4 sm:p-6 lg:p-8 flex-col ${
                  mobileNavOpen ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {/* Interactive Segmented Question Progress Strip */}
                <div
                  className={`grid mb-6 ${
                    totalQuestions > 20 ? 'gap-1' : 'gap-1 sm:gap-1.5'
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))`,
                  }}
                  aria-label="Question progress segments"
                >
                  {deck.questions.map((q, idx) => {
                    const isCurrent = idx === currentIndex;
                    const ans = selectedAnswers[q.id];
                    const hasAns = Boolean(ans && ans.length > 0);
                    const isFlagged = Boolean(flaggedIds[q.id]);
                    const isStudyRevealed = Boolean(
                      mode === 'study' && revealedStudyIds[q.id]
                    );

                    let barTone =
                      'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700';
                    if (isCurrent) {
                      barTone = 'bg-crimson-700 dark:bg-crimson-500';
                    } else if (isFlagged && !hasAns) {
                      barTone = 'bg-amber-500/80 dark:bg-amber-400/80';
                    } else if (hasAns) {
                      if (isStudyRevealed) {
                        barTone = isQuestionCorrect(q, ans)
                          ? 'bg-emerald-600 dark:bg-emerald-500'
                          : 'bg-red-500 dark:bg-red-500';
                      } else {
                        barTone = 'bg-blue-600 dark:bg-blue-400';
                      }
                    }

                    return (
                      <button
                        key={`${q.id}-${idx}`}
                        type="button"
                        onClick={() => goToQuestion(idx)}
                        aria-label={`Go to question ${idx + 1}`}
                        className="py-1.5 group cursor-pointer focus-visible:outline-none"
                      >
                        <span
                          className={`block h-1.5 w-full rounded-full transition-colors duration-150 ${barTone}`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Directional Question Transition Stage */}
                <div className="flex-1 overflow-x-hidden">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={`${currentQuestion.id}-${currentIndex}`}
                      custom={direction}
                      variants={questionSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.17, ease: [0.16, 1, 0.3, 1] }
                      }
                    >
                      {/* Unboxed Question Metadata + Flag Toggle (Zero-Pill Discipline) */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              Question{' '}
                              {String(currentIndex + 1).padStart(2, '0')} of{' '}
                              {String(totalQuestions).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{currentQuestion.id}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={`font-sans font-medium ${getDifficultyTone(
                                currentQuestion.difficulty
                              )}`}
                            >
                              {currentQuestion.difficulty}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              +{currentQuestion.marks.toFixed(2)} / -
                              {(currentQuestion.marks * 0.2).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <ReactionButtons
                              itemId={currentQuestion.id}
                              itemType="question"
                              size="xs"
                            />

                            <button
                              type="button"
                              onClick={toggleFlagCurrent}
                              aria-pressed={isCurrentFlagged}
                              className={`inline-flex items-center gap-1.5 py-1 px-2 -mr-2 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                isCurrentFlagged
                                  ? 'text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40'
                                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                              }`}
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>
                                {isCurrentFlagged ? 'Flagged' : 'Flag for review'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Subject / Topic / Subtopic Taxonomy Breadcrumb */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {currentQuestion.subject}
                          </span>
                          <span aria-hidden="true">/</span>
                          <span>{currentQuestion.topic}</span>
                          <span aria-hidden="true">/</span>
                          <span>{currentQuestion.subtopic}</span>
                          {currentQuestion.is_multi_select && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-blue-700 dark:text-blue-400">
                                Select all correct options
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Question Stem */}
                      <h3 className="mt-3.5 font-serif text-fluid-question font-semibold text-zinc-950 dark:text-zinc-50 text-balance">
                        {currentQuestion.question}
                      </h3>

                      {/* Tactile Answer Options (Single-Select Radio or Multi-Select Checkbox) */}
                      <div
                        className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5"
                        role={
                          currentQuestion.is_multi_select
                            ? 'group'
                            : 'radiogroup'
                        }
                        aria-label="Answer options"
                      >
                        {currentQuestion.options.map((option) => {
                          const isPicked = pickedKeys.includes(option.key);
                          const isCorrectChoice =
                            currentQuestion.correct_options.includes(
                              option.key
                            );
                          const isParagraph =
                            option.text.length > 55 ||
                            option.text.includes('\n');

                          let rowClasses =
                            'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/40 dark:bg-zinc-950/35 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100';
                          let keycapClasses =
                            'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-500';
                          let statusLabel: ReactNode = null;

                          if (isRevealedInStudy) {
                            if (isCorrectChoice) {
                              rowClasses =
                                'border-emerald-600/75 dark:border-emerald-500/75 bg-emerald-50/75 dark:bg-emerald-950/30 text-zinc-950 dark:text-zinc-50';
                              keycapClasses =
                                'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-zinc-950';
                              statusLabel = (
                                <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="sr-only sm:not-sr-only">
                                    {isPicked ? 'Correct' : 'Correct option'}
                                  </span>
                                </span>
                              );
                            } else if (isPicked) {
                              rowClasses =
                                'border-red-500/75 dark:border-red-500/75 bg-red-50/75 dark:bg-red-950/30 text-zinc-950 dark:text-zinc-50';
                              keycapClasses =
                                'bg-red-600 border-red-600 text-white dark:bg-red-500 dark:border-red-500';
                              statusLabel = (
                                <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 whitespace-nowrap shrink-0">
                                  <XCircle className="w-4 h-4" />
                                  <span className="sr-only sm:not-sr-only">
                                    Incorrect
                                  </span>
                                </span>
                              );
                            } else {
                              rowClasses =
                                'border-zinc-200/70 dark:border-zinc-800/70 opacity-60 text-zinc-600 dark:text-zinc-400';
                              keycapClasses =
                                'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500';
                            }
                          } else if (isPicked) {
                            rowClasses =
                              'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/35 text-zinc-950 dark:text-zinc-50 shadow-2xs';
                            keycapClasses =
                              'bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500';
                            statusLabel = (
                              <motion.span
                                initial={
                                  shouldReduceMotion
                                    ? false
                                    : { opacity: 0, scale: 0.9 }
                                }
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.14,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap shrink-0"
                              >
                                {currentQuestion.is_multi_select ? (
                                  <CheckSquare className="w-3.5 h-3.5" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span className="sr-only sm:not-sr-only">
                                  Selected
                                </span>
                              </motion.span>
                            );
                          } else if (currentQuestion.is_multi_select) {
                            statusLabel = (
                              <span className="mt-0.5 inline-flex items-center text-zinc-400 dark:text-zinc-500 shrink-0">
                                <Square className="w-3.5 h-3.5" />
                              </span>
                            );
                          }

                          return (
                            <motion.button
                              key={option.key}
                              type="button"
                              role={
                                currentQuestion.is_multi_select
                                  ? 'checkbox'
                                  : 'radio'
                              }
                              aria-checked={isPicked}
                              disabled={isRevealedInStudy}
                              onClick={() => handleSelectOption(option.key)}
                              whileHover={
                                isRevealedInStudy || shouldReduceMotion
                                  ? undefined
                                  : { x: 2 }
                              }
                              whileTap={
                                isRevealedInStudy || shouldReduceMotion
                                  ? undefined
                                  : { scale: 0.993 }
                              }
                              transition={{
                                duration: 0.12,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className={`group w-full min-h-10 sm:min-h-11 text-left px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border transition-colors flex items-start justify-between gap-2.5 sm:gap-3 ${
                                isParagraph ? 'sm:col-span-2' : 'sm:col-span-1'
                              } ${
                                isRevealedInStudy
                                  ? 'cursor-default'
                                  : 'cursor-pointer'
                              } ${rowClasses} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                                <span
                                  className={`mt-0.5 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-md sm:rounded-lg border font-mono tabular-nums text-[11px] sm:text-xs font-semibold inline-flex items-center justify-center transition-colors shrink-0 ${keycapClasses}`}
                                >
                                  {option.key}
                                </span>
                                <span className="text-fluid-option pt-0.5 min-w-0 break-words leading-snug">
                                  {option.text}
                                </span>
                              </div>
                              {statusLabel}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Multi-Select Study Hints Check Action */}
                      {mode === 'study' &&
                        currentQuestion.is_multi_select &&
                        !isRevealedInStudy && (
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              Select all applicable options, then verify your
                              answer.
                            </span>
                            <button
                              type="button"
                              disabled={!hasCurrentSelection}
                              onClick={handleRevealCurrentStudyAnswer}
                              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Check Selected Options</span>
                            </button>
                          </div>
                        )}

                      {/* Study Hints Instant Explanation Callout (All-around hairline, zero border-l-4) */}
                      <AnimatePresence initial={false}>
                        {isRevealedInStudy && (
                          <motion.div
                            initial={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0, y: 8 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.18,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="mt-6 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50 space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span
                                className={`inline-flex items-center gap-1.5 font-semibold ${
                                  isQuestionCorrect(currentQuestion, pickedKeys)
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : 'text-zinc-900 dark:text-zinc-100'
                                }`}
                              >
                                {isQuestionCorrect(
                                  currentQuestion,
                                  pickedKeys
                                ) ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Correct — Study Explanation</span>
                                  </>
                                ) : (
                                  <span>
                                    Correct{' '}
                                    {currentQuestion.correct_options.length > 1
                                      ? 'Options'
                                      : 'Option'}
                                    :{' '}
                                    {currentQuestion.correct_options.join(', ')}
                                  </span>
                                )}
                              </span>
                              <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                                {currentQuestion.topicId} ·{' '}
                                {currentQuestion.subtopicId}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {currentQuestion.explanation}
                            </p>

                            {currentQuestion.sourcePath &&
                              currentQuestion.sourceTitle && (
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenSourcePdf(
                                        currentQuestion.sourcePath!
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                                  >
                                    <span>
                                      Open source PDF:{' '}
                                      {currentQuestion.sourceTitle}
                                    </span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Zone: Radial Reverse Deadline, Question Navigator & PSC Specification */}
              <aside
                className={`lg:col-span-4 p-4 sm:p-6 bg-zinc-50/55 dark:bg-zinc-950/35 flex-col justify-between space-y-6 ${
                  mobileNavOpen ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <div className="space-y-5">
                  {/* Mobile Mode Switcher (< 640px) */}
                  <div
                    role="group"
                    aria-label="Quiz mode"
                    className="sm:hidden grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/70 text-xs"
                  >
                    {(['exam', 'study'] as const).map((tabMode) => {
                      const active = mode === tabMode;
                      return (
                        <button
                          key={tabMode}
                          type="button"
                          onClick={() => {
                            if (mode !== tabMode) handleResetSession(tabMode);
                          }}
                          className={`min-h-8 px-2.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                            active
                              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                              : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {tabMode === 'exam' ? 'Real Quiz' : 'Study Hints'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Radial Reverse Countdown Widget */}
                  <div className="pb-5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-4">
                    <RadialCountdown
                      ratio={remainingRatio}
                      size={76}
                      strokeWidth={5}
                      urgency={urgencyState}
                    >
                      <span className="font-mono tabular-nums text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {Math.round(remainingRatio * 100)}%
                      </span>
                    </RadialCountdown>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Reverse Deadline</span>
                        <span className="font-mono tabular-nums">
                          {totalQuestions}m
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 font-mono tabular-nums text-2xl sm:text-3xl font-semibold tracking-tight ${timerTextColor}`}
                      >
                        {formatReverseClock(remainingSeconds)}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        {timerUrgencyLabel
                          ? `${timerUrgencyLabel} · auto-submits`
                          : `Started at ${formatReverseClock(deadlineSeconds)}`}
                      </p>
                    </div>
                  </div>

                  {/* Question Navigator Header */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Question Navigator
                      </h4>
                      <span className="font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400">
                        {answeredCount}/{totalQuestions} answered
                      </span>
                    </div>

                    <div
                      className={`grid max-h-52 overflow-y-auto p-0.5 -m-0.5 ${
                        totalQuestions > 20
                          ? 'grid-cols-6 gap-1.5'
                          : 'grid-cols-5 gap-2'
                      }`}
                    >
                      {deck.questions.map((q, idx) => {
                        const ans = selectedAnswers[q.id];
                        const hasAns = Boolean(ans && ans.length > 0);
                        const isCurrent = idx === currentIndex;
                        const isFlagged = Boolean(flaggedIds[q.id]);
                        const isStudyRevealed = Boolean(
                          mode === 'study' && revealedStudyIds[q.id]
                        );

                        let btnStyle =
                          'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600';

                        if (isCurrent) {
                          btnStyle =
                            'border-blue-700 dark:border-blue-500 bg-blue-700 text-white dark:bg-blue-600 dark:text-white font-semibold';
                        } else if (hasAns) {
                          if (isStudyRevealed) {
                            btnStyle = isQuestionCorrect(q, ans)
                              ? 'border-emerald-600/60 text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 font-medium'
                              : 'border-red-500/60 text-red-600 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30 font-medium';
                          } else {
                            btnStyle =
                              'border-blue-600/60 text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30 font-medium';
                          }
                        } else if (isFlagged) {
                          btnStyle =
                            'border-amber-500/70 text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 font-medium';
                        }

                        return (
                          <button
                            key={`${q.id}-${idx}`}
                            type="button"
                            onClick={() => goToQuestion(idx)}
                            aria-label={`Jump to question ${idx + 1}${isFlagged ? ' (flagged)' : ''}`}
                            aria-current={isCurrent ? 'step' : undefined}
                            className={`relative ${
                              totalQuestions > 20 ? 'h-8' : 'h-9'
                            } rounded-lg border font-mono tabular-nums text-xs transition-colors cursor-pointer ${btnStyle} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
                          >
                            {isCurrent && (
                              <motion.span
                                layoutId="quiz-nav-active-outline"
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : {
                                        type: 'spring',
                                        stiffness: 480,
                                        damping: 35,
                                      }
                                }
                                className="absolute -inset-0.5 rounded-[9px] ring-2 ring-blue-700/25 dark:ring-blue-400/30 pointer-events-none"
                              />
                            )}
                            <span>{idx + 1}</span>
                            {isFlagged && (
                              <Flag
                                aria-hidden="true"
                                className={`w-2.5 h-2.5 absolute top-1 right-1 ${
                                  isCurrent
                                    ? 'text-amber-300 dark:text-amber-600'
                                    : 'text-amber-600 dark:text-amber-400'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Jump Helpers */}
                    {(nextUnansweredIndex !== null ||
                      nextFlaggedIndex !== null) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs">
                        {nextUnansweredIndex !== null &&
                          answeredCount > 0 &&
                          answeredCount < totalQuestions && (
                            <button
                              type="button"
                              onClick={() => goToQuestion(nextUnansweredIndex)}
                              className="font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                            >
                              Next unanswered (Q{nextUnansweredIndex + 1})
                            </button>
                          )}
                        {nextFlaggedIndex !== null && flaggedCount > 0 && (
                          <button
                            type="button"
                            onClick={() => goToQuestion(nextFlaggedIndex)}
                            className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Flag className="w-3 h-3" />
                            <span>Review flagged ({flaggedCount})</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Structured PSC Item Classification (Unboxed, Hairline Separated) */}
                  <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 text-xs">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Item Classification
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-snug">
                      <span className="text-zinc-400 dark:text-zinc-500">
                        Paper:
                      </span>{' '}
                      {currentQuestion.paper} · {currentQuestion.group}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-snug">
                      <span className="text-zinc-400 dark:text-zinc-500">
                        Target:
                      </span>{' '}
                      {currentQuestion.post}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-snug">
                      <span className="text-zinc-400 dark:text-zinc-500">
                        Level:
                      </span>{' '}
                      {currentQuestion.level} · {currentQuestion.service}
                    </p>
                  </div>
                </div>

                {/* Keyboard Shortcuts & Session Controls */}
                <div className="space-y-4">
                  <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <p>
                      {mode === 'exam'
                        ? 'Real Quiz hides feedback until submission or when the reverse clock hits 00:00.'
                        : 'Study Hints reveals explanations while keeping the 1-min-per-question timer.'}
                    </p>
                    <p className="font-mono text-[11px] leading-relaxed">
                      1–4 / A–D pick · F flag · ← / → move · Esc close
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleResetSession(mode)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Timer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        finalizeQuiz(selectedAnswers, remainingSeconds, false)
                      }
                      className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Submit Quiz Now
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          ) : null}
        </div>

        {/* Sticky Dialog Footer */}
        <div className="shrink-0 px-3.5 sm:px-6 py-2.5 sm:py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/85 dark:bg-zinc-950/65 flex items-center justify-between gap-3">
          {isSubmitted ? (
            <>
              <button
                type="button"
                onClick={() => handleResetSession(mode)}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz ({formatReverseClock(deadlineSeconds)})</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
                className="inline-flex items-center gap-1.5 min-h-10 sm:h-9 px-3 sm:px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="sm:hidden">Prev</span>
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <span>
                  {answeredCount} of {totalQuestions} answered
                </span>
                {!isRevealedInStudy && hasCurrentSelection && (
                  <>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={handleClearCurrentSelection}
                      className="font-sans font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Clear choice
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5">
                {!isRevealedInStudy && hasCurrentSelection && (
                  <button
                    type="button"
                    onClick={handleClearCurrentSelection}
                    className="sm:hidden min-h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Clear
                  </button>
                )}

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => goToQuestion(currentIndex + 1)}
                    className="inline-flex items-center gap-1.5 min-h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className="sm:hidden">Next</span>
                    <span className="hidden sm:inline">Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      finalizeQuiz(selectedAnswers, remainingSeconds, false)
                    }
                    className="inline-flex items-center gap-1.5 min-h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className="sm:hidden">Submit Quiz</span>
                    <span className="hidden sm:inline">
                      Finish &amp; Score Quiz
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}

export function QuizSessionDialog({
  open,
  deck,
  initialMode,
  onClose,
}: QuizSessionDialogProps) {
  useEffect(() => {
    if (!open || !deck) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, deck]);

  return (
    <AnimatePresence>
      {open && deck && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-dialog-title"
        >
          <QuizDialogInner
            key={deck.id}
            deck={deck}
            initialMode={initialMode}
            onClose={onClose}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
