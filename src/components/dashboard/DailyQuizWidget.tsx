import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Flame,
  Newspaper,
  RefreshCw,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { saveQuizAttemptToFirestore, useAuth } from '../../context/AuthContext';
import { isBilingualQuizQuestion, isQuestionCorrect } from '../../data/quizData';
import { recordQuizAttempt } from '../../features/quiz/quizSlice';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../../services/questionStorageService';
import { offlineDbService } from '../../services/offlineDbService';
import { toast } from '../../services/toastService';
import type {
  DailyQuizLanguageMode,
  DailyQuizPersistedState,
  DailyQuizWidgetProps,
  QuestionOutcome,
  QuizAttemptRecord,
  QuizOptionKey,
  QuizQuestion,
} from '../../types';
import { formatUserFriendlyError } from '../../utils/errorHelpers';
import { resolveSampleUrl } from '../../utils/urlHelpers';
import { ActionButton } from '../common/ActionButton';

const DAILY_QUIZ_STORAGE_KEY = 'psc_nepal_daily_quiz_v1';

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getEpochDayFromKey(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) {
    return Math.floor(Date.now() / 86_400_000);
  }
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createMulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deterministicShuffle<T>(items: T[], seedInput: string): T[] {
  const copy = [...items];
  const rand = createMulberry32(hashString(seedInput));
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function selectDailyRotatingQuestions(
  pool: QuizQuestion[],
  dateKey: string,
  rotationOffset: number,
  count: number
): QuizQuestion[] {
  if (pool.length === 0) return [];
  const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  const targetCount = Math.min(count, sorted.length);
  const epochDay = getEpochDayFromKey(dateKey);
  const slotIndex = Math.max(0, epochDay + rotationOffset);
  const cycleIndex = Math.floor((slotIndex * targetCount) / sorted.length);
  const shuffled = deterministicShuffle(
    sorted,
    `psc-daily-ca-cycle-${cycleIndex}`
  );
  const start = (slotIndex * targetCount) % shuffled.length;

  const picked: QuizQuestion[] = [];
  for (let i = 0; i < targetCount; i += 1) {
    picked.push(shuffled[(start + i) % shuffled.length]);
  }
  return picked;
}

function isCurrentAffairsMcq(q: QuizQuestion): boolean {
  const subj = q.subject.trim().toLowerCase();
  const topic = q.topic.trim().toLowerCase();
  return (
    subj.includes('current affair') ||
    subj.includes('samasamayik') ||
    subj.includes('contemporary') ||
    topic.includes('current affair') ||
    q.id.startsWith('PSC-CA-')
  );
}

function readDailyState(todayKey: string): DailyQuizPersistedState {
  const empty: DailyQuizPersistedState = {
    dateKey: todayKey,
    rotationOffset: 0,
    selectedAnswers: {},
    revealedIds: {},
    savedRotations: {},
  };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(DAILY_QUIZ_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<DailyQuizPersistedState>;
    if (!parsed || parsed.dateKey !== todayKey) {
      return empty;
    }
    return {
      dateKey: todayKey,
      rotationOffset:
        typeof parsed.rotationOffset === 'number' && parsed.rotationOffset >= 0
          ? Math.floor(parsed.rotationOffset)
          : 0,
      selectedAnswers:
        parsed.selectedAnswers && typeof parsed.selectedAnswers === 'object'
          ? parsed.selectedAnswers
          : {},
      revealedIds:
        parsed.revealedIds && typeof parsed.revealedIds === 'object'
          ? parsed.revealedIds
          : {},
      savedRotations:
        parsed.savedRotations && typeof parsed.savedRotations === 'object'
          ? parsed.savedRotations
          : {},
    };
  } catch {
    return empty;
  }
}

function writeDailyState(state: DailyQuizPersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DAILY_QUIZ_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Graceful no-op under storage restrictions
  }
  void offlineDbService.putProgressRecord('daily_quiz', state);
}

function computeDailyStreak(attempts: QuizAttemptRecord[], todayKey: string): number {
  const dailyDates = new Set<string>();
  for (const att of attempts) {
    if (att.deckId === 'daily-current-affairs' && att.completedAt) {
      const d = new Date(att.completedAt);
      if (!Number.isNaN(d.getTime())) {
        dailyDates.add(getLocalDateKey(d));
      }
    }
  }
  if (dailyDates.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  const todayDone = dailyDates.has(todayKey);
  if (!todayDone) {
    cursor.setDate(cursor.getDate() - 1);
  }

  for (let i = 0; i < 60; i += 1) {
    const key = getLocalDateKey(cursor);
    if (dailyDates.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function DailyQuizWidget({ maxQuestions = 5 }: DailyQuizWidgetProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const quizAttempts = useAppSelector((state) => state.quiz.attempts);

  const [todayKey] = useState<string>(() => getLocalDateKey());
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>(() =>
    questionStorageService.loadQuizQuestions()
  );
  const [langMode, setLangMode] = useState<DailyQuizLanguageMode>('bilingual');
  const [persistedState, setPersistedState] = useState<DailyQuizPersistedState>(
    () => readDailyState(getLocalDateKey())
  );
  const [isSavingScore, setIsSavingScore] = useState(false);
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const syncQuiz = () => {
      setAllQuestions(questionStorageService.loadQuizQuestions());
    };
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, syncQuiz);
    window.addEventListener('storage', syncQuiz);
    return () => {
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, syncQuiz);
      window.removeEventListener('storage', syncQuiz);
    };
  }, []);

  useEffect(() => {
    writeDailyState(persistedState);
  }, [persistedState]);

  const currentAffairsPool = useMemo(() => {
    const caOnly = allQuestions.filter(isCurrentAffairsMcq);
    return caOnly.length >= maxQuestions ? caOnly : allQuestions;
  }, [allQuestions, maxQuestions]);

  const dailyQuestions = useMemo(
    () =>
      selectDailyRotatingQuestions(
        currentAffairsPool,
        todayKey,
        persistedState.rotationOffset,
        maxQuestions
      ),
    [currentAffairsPool, todayKey, persistedState.rotationOffset, maxQuestions]
  );

  const rotationKey = `${todayKey}:set-${persistedState.rotationOffset}`;
  const isCurrentRotationSaved = Boolean(persistedState.savedRotations[rotationKey]);

  const stats = useMemo(() => {
    let answeredCount = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let totalMarks = 0;
    let correctMarks = 0;
    let wrongMarks = 0;
    const outcomes: Record<string, QuestionOutcome> = {};

    for (const q of dailyQuestions) {
      const qMarks = q.marks || 1;
      totalMarks += qMarks;
      const revealed = Boolean(persistedState.revealedIds[q.id]);
      const chosen = (persistedState.selectedAnswers[q.id] ?? []) as QuizOptionKey[];

      if (revealed && chosen.length > 0) {
        answeredCount += 1;
        if (isQuestionCorrect(q, chosen)) {
          correctCount += 1;
          correctMarks += qMarks;
          outcomes[q.id] = 'correct';
        } else {
          wrongCount += 1;
          wrongMarks += qMarks;
          outcomes[q.id] = 'wrong';
        }
      } else {
        outcomes[q.id] = 'skipped';
      }
    }

    const total = dailyQuestions.length;
    const unansweredCount = Math.max(0, total - answeredCount);
    const accuracyPercent =
      total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const rawNet = correctMarks - wrongMarks * 0.2;
    const pscNetScore = Math.max(
      0,
      Math.min(totalMarks, Number(rawNet.toFixed(2)))
    );

    return {
      total,
      totalMarks,
      answeredCount,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracyPercent,
      pscNetScore,
      outcomes,
      allAnswered: total > 0 && answeredCount === total,
    };
  }, [dailyQuestions, persistedState.revealedIds, persistedState.selectedAnswers]);

  const streakCount = useMemo(
    () => computeDailyStreak(quizAttempts, todayKey),
    [quizAttempts, todayKey]
  );

  const totalSetsCount = Math.max(
    1,
    Math.ceil(currentAffairsPool.length / Math.max(1, maxQuestions))
  );

  const persistDailyAttempt = useCallback(
    async (
      nextSelected: Record<string, string[]>,
      nextRevealed: Record<string, boolean>,
      rotKey: string,
      rotOffset: number
    ) => {
      if (persistedState.savedRotations[rotKey] || dailyQuestions.length === 0) {
        return;
      }

      let correctCount = 0;
      let wrongCount = 0;
      let totalMarks = 0;
      let correctMarks = 0;
      let wrongMarks = 0;
      const outcomes: Record<string, QuestionOutcome> = {};

      for (const q of dailyQuestions) {
        const qMarks = q.marks || 1;
        totalMarks += qMarks;
        const chosen = (nextSelected[q.id] ?? []) as QuizOptionKey[];
        if (nextRevealed[q.id] && chosen.length > 0) {
          if (isQuestionCorrect(q, chosen)) {
            correctCount += 1;
            correctMarks += qMarks;
            outcomes[q.id] = 'correct';
          } else {
            wrongCount += 1;
            wrongMarks += qMarks;
            outcomes[q.id] = 'wrong';
          }
        } else {
          outcomes[q.id] = 'skipped';
        }
      }

      const totalQuestions = dailyQuestions.length;
      const unansweredCount = Math.max(
        0,
        totalQuestions - (correctCount + wrongCount)
      );
      const accuracyPercent = Math.round(
        (correctCount / Math.max(1, totalQuestions)) * 100
      );
      const pscNetScore = Math.max(
        0,
        Math.min(
          totalMarks,
          Number((correctMarks - wrongMarks * 0.2).toFixed(2))
        )
      );
      const elapsedSeconds = Math.max(
        1,
        Math.min(3600, Math.round((Date.now() - sessionStartRef.current) / 1000))
      );

      const attemptRecord: QuizAttemptRecord = {
        id: `daily-ca-${todayKey.replace(/-/g, '')}-s${rotOffset}-${Date.now().toString(36)}`,
        deckId: 'daily-current-affairs',
        deckTitle: `Daily Current Affairs Quiz (${todayKey})`,
        mode: 'study',
        totalQuestions,
        totalMarks,
        correctCount,
        wrongCount,
        unansweredCount,
        accuracyPercent,
        pscNetScore,
        durationSeconds: elapsedSeconds,
        deadlineSeconds: totalQuestions * 60,
        timedOut: false,
        completedAt: new Date().toISOString(),
        questionOutcomes: outcomes,
      };

      setIsSavingScore(true);
      dispatch(recordQuizAttempt(attemptRecord));
      setPersistedState((prev) => ({
        ...prev,
        savedRotations: {
          ...prev.savedRotations,
          [rotKey]: true,
        },
      }));

      try {
        if (user && user.emailVerified) {
          await saveQuizAttemptToFirestore(user, attemptRecord);
          toast.success(
            `Daily Quiz recorded: ${correctCount}/${totalQuestions} (${accuracyPercent}%).`,
            { id: 'daily-quiz-saved', title: 'Daily Quiz Logged' }
          );
        } else {
          toast.success(
            `Daily Quiz saved locally: ${correctCount}/${totalQuestions} (${accuracyPercent}%).`,
            { id: 'daily-quiz-saved', title: 'Daily Quiz Logged' }
          );
        }
      } catch (err) {
        console.error('Failed to persist Daily Quiz attempt:', err);
        toast.error(
          formatUserFriendlyError(
            err,
            'Saved locally, but cloud sync failed.'
          ),
          { id: 'daily-quiz-sync-err' }
        );
      } finally {
        setIsSavingScore(false);
      }
    },
    [
      dailyQuestions,
      dispatch,
      persistedState.savedRotations,
      todayKey,
      user,
    ]
  );

  const checkAutoSave = (
    nextSelected: Record<string, string[]>,
    nextRevealed: Record<string, boolean>
  ) => {
    const completedAll =
      dailyQuestions.length > 0 &&
      dailyQuestions.every(
        (q) =>
          Boolean(nextRevealed[q.id]) &&
          (nextSelected[q.id]?.length ?? 0) > 0
      );
    if (completedAll && !isCurrentRotationSaved) {
      void persistDailyAttempt(
        nextSelected,
        nextRevealed,
        rotationKey,
        persistedState.rotationOffset
      );
    }
  };

  const handleSelectOption = (q: QuizQuestion, key: QuizOptionKey) => {
    if (persistedState.revealedIds[q.id]) return;

    if (!q.is_multi_select) {
      const nextSelected = {
        ...persistedState.selectedAnswers,
        [q.id]: [key],
      };
      const nextRevealed = {
        ...persistedState.revealedIds,
        [q.id]: true,
      };
      setPersistedState((prev) => ({
        ...prev,
        selectedAnswers: nextSelected,
        revealedIds: nextRevealed,
      }));
      checkAutoSave(nextSelected, nextRevealed);
      return;
    }

    setPersistedState((prev) => {
      const current = prev.selectedAnswers[q.id] ?? [];
      const nextForQuestion = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return {
        ...prev,
        selectedAnswers: {
          ...prev.selectedAnswers,
          [q.id]: nextForQuestion,
        },
      };
    });
  };

  const handleCheckMultiSelect = (qId: string) => {
    const chosen = persistedState.selectedAnswers[qId] ?? [];
    if (chosen.length === 0) return;
    const nextRevealed = {
      ...persistedState.revealedIds,
      [qId]: true,
    };
    setPersistedState((prev) => ({
      ...prev,
      revealedIds: nextRevealed,
    }));
    checkAutoSave(persistedState.selectedAnswers, nextRevealed);
  };

  const handleRotateSet = () => {
    sessionStartRef.current = Date.now();
    setPersistedState((prev) => ({
      ...prev,
      rotationOffset: (prev.rotationOffset + 1) % Math.max(totalSetsCount, 3),
    }));
  };

  const handleResetCurrentSet = () => {
    sessionStartRef.current = Date.now();
    const idsInSet = new Set(dailyQuestions.map((q) => q.id));
    setPersistedState((prev) => {
      const nextSelected = { ...prev.selectedAnswers };
      const nextRevealed = { ...prev.revealedIds };
      const nextSaved = { ...prev.savedRotations };
      for (const id of idsInSet) {
        delete nextSelected[id];
        delete nextRevealed[id];
      }
      delete nextSaved[rotationKey];
      return {
        ...prev,
        selectedAnswers: nextSelected,
        revealedIds: nextRevealed,
        savedRotations: nextSaved,
      };
    });
  };

  const scrollToQuestion = (qId: string) => {
    const el = document.getElementById(`daily-quiz-q-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section
      aria-labelledby="daily-quiz-heading"
      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400">
              <CalendarDays className="w-3.5 h-3.5" />
              Daily Quiz · {todayKey}
            </span>
            <span aria-hidden="true">·</span>
            <span>{dailyQuestions.length} Current Affairs MCQs</span>
            <span aria-hidden="true">·</span>
            <span>
              Rotation Set {(persistedState.rotationOffset % totalSetsCount) + 1}/
              {totalSetsCount}
            </span>
            {streakCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {streakCount}-Day Streak
                </span>
              </>
            )}
          </div>
          <h3
            id="daily-quiz-heading"
            className="font-serif text-lg sm:text-xl font-bold text-zinc-950 dark:text-zinc-50"
          >
            Daily Current Affairs Practice (दैनिक समसामयिक क्विज · ५ प्रश्न)
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Automatically rotates 5 bilingual Samasamayik MCQs every day from the live Current Affairs bank to keep retention sharp.
          </p>
        </div>

        {/* Interactive Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div
            role="group"
            aria-label="Daily quiz display language"
            className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs"
          >
            {(
              [
                { id: 'bilingual', label: 'EN + ने' },
                { id: 'en', label: 'EN' },
                { id: 'ne', label: 'नेपाली' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setLangMode(mode.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  langMode === mode.id
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <ActionButton
            icon={RefreshCw}
            label="Rotate 5"
            title="Cycle to the next rotating set of 5 Current Affairs questions"
            color="zinc"
            variant="outline"
            size="sm"
            onClick={handleRotateSet}
          />

          <ActionButton
            icon={BookOpen}
            label="Full CA Deck"
            title="Open the complete timed Current Affairs & Samasamayik quiz deck"
            color="crimson"
            variant="solid"
            size="sm"
            to="/quiz/current-affairs"
          />
        </div>
      </div>

      {/* 5-Question Tracker & Scoreboard Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mr-1">
            Today&apos;s Set:
          </span>
          {dailyQuestions.map((q, index) => {
            const revealed = Boolean(persistedState.revealedIds[q.id]);
            const chosen = (persistedState.selectedAnswers[q.id] ?? []) as QuizOptionKey[];
            const correct = revealed && chosen.length > 0 && isQuestionCorrect(q, chosen);
            const wrong = revealed && chosen.length > 0 && !correct;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => scrollToQuestion(q.id)}
                title={`Jump to Question ${index + 1}: ${q.topic}`}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono tabular-nums font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                  correct
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : wrong
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
                      : chosen.length > 0
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                }`}
              >
                <span>Q{index + 1}</span>
                {correct && <CheckCircle2 className="w-3 h-3" />}
                {wrong && <XCircle className="w-3 h-3" />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-300">
          <span>
            Done:{' '}
            <strong className="text-zinc-950 dark:text-zinc-50">
              {stats.answeredCount}/{stats.total}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            Score: {stats.correctCount}/{stats.total} ({stats.accuracyPercent}%)
          </span>
          <span aria-hidden="true">·</span>
          <span>
            PSC Net:{' '}
            <strong className="text-blue-700 dark:text-blue-400">
              {stats.pscNetScore}
            </strong>
            /{stats.totalMarks}
          </span>
        </div>
      </div>

      {/* Empty Fallback if Question Repository Empty */}
      {dailyQuestions.length === 0 ? (
        <div className="py-10 text-center text-xs text-zinc-500 dark:text-zinc-400">
          No Current Affairs MCQs are currently available in the question bank.
        </div>
      ) : (
        /* 5 Rotating Current Affairs MCQ Rows */
        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
          {dailyQuestions.map((q, index) => {
            const chosen = (persistedState.selectedAnswers[q.id] ?? []) as QuizOptionKey[];
            const isRevealed = Boolean(persistedState.revealedIds[q.id]);
            const isCorrect =
              isRevealed && chosen.length > 0 && isQuestionCorrect(q, chosen);
            const hasNe = isBilingualQuizQuestion(q);

            return (
              <div
                key={q.id}
                id={`daily-quiz-q-${q.id}`}
                className="py-4 first:pt-1 last:pb-1 space-y-3"
              >
                {/* Question Metadata & State Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-zinc-950 dark:text-zinc-100 tabular-nums">
                      Q{index + 1} · {q.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{q.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.difficulty}</span>
                    {q.is_multi_select && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          Multi-Select ({q.correct_options.length})
                        </span>
                      </>
                    )}
                  </div>

                  {isRevealed ? (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Correct: {q.correct_options.join(', ')}
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      {q.is_multi_select
                        ? `Select ${q.correct_options.length} options`
                        : 'Select 1 option'}
                    </span>
                  )}
                </div>

                {/* Bilingual Question Prompt */}
                <div className="space-y-1">
                  {(langMode === 'bilingual' || langMode === 'en' || !hasNe) && (
                    <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 leading-snug">
                      {q.question}
                    </p>
                  )}
                  {(langMode === 'bilingual' || langMode === 'ne') &&
                    q.questionNe && (
                      <p
                        className={`leading-snug ${
                          langMode === 'ne'
                            ? 'text-sm font-semibold text-zinc-950 dark:text-zinc-50'
                            : 'text-xs text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        {q.questionNe}
                      </p>
                    )}
                </div>

                {/* Option Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = chosen.includes(opt.key);
                    const isCorrectOpt = q.correct_options.includes(opt.key);

                    let optionStyle =
                      'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 hover:border-blue-500/60 text-zinc-800 dark:text-zinc-200';
                    if (isRevealed) {
                      if (isCorrectOpt) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100';
                      } else if (isSelected && !isCorrectOpt) {
                        optionStyle =
                          'border-red-500 bg-red-50/80 dark:bg-red-950/50 text-red-950 dark:text-red-100';
                      } else {
                        optionStyle =
                          'border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/40 dark:bg-zinc-950/30 text-zinc-500 dark:text-zinc-500';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100';
                    }

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={isRevealed}
                        onClick={() => handleSelectOption(q, opt.key)}
                        className={`min-h-[40px] px-3 py-2 rounded-lg border text-left transition-colors flex items-start gap-2 cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${optionStyle}`}
                      >
                        <span className="font-mono font-bold text-xs mt-0.5 shrink-0">
                          {opt.key}.
                        </span>
                        <div className="text-xs space-y-0.5 min-w-0">
                          {(langMode === 'bilingual' ||
                            langMode === 'en' ||
                            !opt.textNe) && (
                            <div className="font-medium leading-snug">
                              {opt.text}
                            </div>
                          )}
                          {(langMode === 'bilingual' || langMode === 'ne') &&
                            opt.textNe && (
                              <div
                                className={`leading-snug ${
                                  langMode === 'ne'
                                    ? 'font-medium'
                                    : 'text-zinc-600 dark:text-zinc-400'
                                }`}
                              >
                                {opt.textNe}
                              </div>
                            )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Multi-select Confirm Action */}
                {q.is_multi_select && !isRevealed && (
                  <div>
                    <ActionButton
                      label="Check Selection"
                      title="Verify your multi-select choices"
                      color="blue"
                      variant="solid"
                      size="xs"
                      disabled={chosen.length === 0}
                      onClick={() => handleCheckMultiSelect(q.id)}
                    />
                  </div>
                )}

                {/* Explanation & Source Link */}
                {isRevealed && (
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-1.5">
                    {(langMode === 'bilingual' ||
                      langMode === 'en' ||
                      !q.explanationNe) && (
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <strong className="text-zinc-950 dark:text-zinc-100">
                          Explanation:
                        </strong>{' '}
                        {q.explanation}
                      </p>
                    )}
                    {(langMode === 'bilingual' || langMode === 'ne') &&
                      q.explanationNe && (
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <strong className="text-zinc-800 dark:text-zinc-200">
                            व्याख्या:
                          </strong>{' '}
                          {q.explanationNe}
                        </p>
                      )}
                    {q.sourcePath && (
                      <div className="pt-1 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                        <span className="font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-md">
                          Ref: {q.sourceTitle ?? 'Official Source'}
                        </span>
                        <Link
                          to={`/read?url=${encodeURIComponent(
                            resolveSampleUrl(q.sourcePath)
                          )}`}
                          className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
                        >
                          <BookOpen className="w-3 h-3" />
                          Open Source PDF
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Engagement & Score Persistence Strip */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          {stats.allAnswered ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Completed {stats.total}/{stats.total} · Score{' '}
              <span className="font-mono tabular-nums font-bold">
                {stats.correctCount}/{stats.total} ({stats.accuracyPercent}%)
              </span>
              {isCurrentRotationSaved && ' · Logged to History'}
            </span>
          ) : (
            <span>
              Complete all {stats.total} questions to record today&apos;s Current Affairs score.
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stats.answeredCount > 0 && (
            <ActionButton
              icon={RotateCcw}
              label="Reset Set"
              title="Clear answers in this 5-question set"
              color="zinc"
              variant="outline"
              size="xs"
              onClick={handleResetCurrentSet}
            />
          )}

          {stats.allAnswered && !isCurrentRotationSaved && (
            <ActionButton
              icon={Check}
              label={isSavingScore ? 'Saving...' : 'Save Score'}
              title="Log Daily Quiz attempt to your preparation history and Firestore"
              color="emerald"
              variant="solid"
              size="xs"
              disabled={isSavingScore}
              onClick={() =>
                void persistDailyAttempt(
                  persistedState.selectedAnswers,
                  persistedState.revealedIds,
                  rotationKey,
                  persistedState.rotationOffset
                )
              }
            />
          )}

          <ActionButton
            icon={Newspaper}
            label="Samasamayik Hub"
            title="Open full Current Affairs briefings, MCQs, Written Q&As & PDFs"
            color="blue"
            variant="subtle"
            size="xs"
            to="/current-affairs"
          />
        </div>
      </div>
    </section>
  );
}
