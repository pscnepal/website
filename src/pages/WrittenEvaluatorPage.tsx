import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Maximize2,
  Minimize2,
  PenLine,
  Play,
  Printer,
  RefreshCw,
  Scale,
  Sparkles,
  Trash2,
  Trophy,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { QuizAuthGate } from '../components/auth/QuizAuthGate';
import { ActionButton } from '../components/common/ActionButton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import {
  EVALUATOR_AUTH_GATE_CONTENT,
  EVALUATOR_DRAFT_PLACEHOLDERS,
  EVALUATOR_HERO_CONTENT,
  EVALUATOR_PRESET_RATIOS,
  WRITTEN_RUBRIC_DIMENSIONS,
  getWrittenMeritLevel,
  type RubricDimensionKey,
} from '../data/evaluatorContentData';
import type { WrittenQuestion } from '../data/writtenQuestionsData';
import {
  addWrittenEvaluation,
  clearWrittenEvaluations,
  deleteWrittenEvaluation,
} from '../features/workspace/workspaceSlice';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../services/questionStorageService';
import type { WrittenEvaluationRecord } from '../services/storageService';
import { toast } from '../services/toastService';
import { copyWithToast } from '../utils/clipboardHelpers';
import { formatUserFriendlyError } from '../utils/errorHelpers';

export function WrittenEvaluatorPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const suppressNextQuestionResetRef = useRef(false);
  const [writtenQuestions, setWrittenQuestions] = useState<WrittenQuestion[]>(
    () => questionStorageService.loadWrittenQuestions()
  );
  const initialQId =
    searchParams.get('q') || writtenQuestions[0]?.id || '';
  const customNotesId = useId();

  useEffect(() => {
    const syncWritten = () => {
      setWrittenQuestions(questionStorageService.loadWrittenQuestions());
    };
    window.addEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, syncWritten);
    window.addEventListener('storage', syncWritten);
    return () => {
      window.removeEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, syncWritten);
      window.removeEventListener('storage', syncWritten);
    };
  }, []);

  // State
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(initialQId);
  const [stage, setStage] = useState<'write' | 'evaluate' | 'report'>('write');
  const [userDraft, setUserDraft] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const [isClearDraftConfirmOpen, setIsClearDraftConfirmOpen] = useState<boolean>(false);
  const [isClearHistoryConfirmOpen, setIsClearHistoryConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    const queryQ = searchParams.get('q');
    if (queryQ && writtenQuestions.some((q) => q.id === queryQ)) {
      setSelectedQuestionId(queryQ);
    }
  }, [searchParams, writtenQuestions]);

  // Timer state
  const selectedQuestion = useMemo(() => {
    return (
      writtenQuestions.find((q) => q.id === selectedQuestionId) ||
      writtenQuestions[0]
    );
  }, [writtenQuestions, selectedQuestionId]);

  const totalRecommendedSeconds = (selectedQuestion?.marks || 10) * 108; // 1.8 mins/mark = 108 seconds per mark
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalRecommendedSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasStartedWriting, setHasStartedWriting] = useState<boolean>(false);

  // Rubric Scores (Max: Intro 1.5/0.75, Core 5.5/2.75, Statutes 1.5/0.75, Conclusion 1.5/0.75)
  const is10M = (selectedQuestion?.marks || 10) === 10;
  const maxIntro = is10M ? 1.5 : 0.75;
  const maxCore = is10M ? 5.5 : 2.75;
  const maxStatutes = is10M ? 1.5 : 0.75;
  const maxConclusion = is10M ? 1.5 : 0.75;

  const [scoreIntro, setScoreIntro] = useState<number>(maxIntro * 0.7);
  const [scoreCore, setScoreCore] = useState<number>(maxCore * 0.7);
  const [scoreStatutes, setScoreStatutes] = useState<number>(maxStatutes * 0.7);
  const [scoreConclusion, setScoreConclusion] = useState<number>(maxConclusion * 0.7);
  const [evaluatorNotes, setEvaluatorNotes] = useState<string>('');

  // Evaluation history synced via Redux workspaceSlice & Firestore
  const evalHistory = useAppSelector(
    (state) => state.workspace.writtenEvaluations
  );

  // Reset timer & editor on question change (unless inspecting a saved scorecard)
  useEffect(() => {
    const sec = (selectedQuestion?.marks || 10) * 108;
    setRemainingSeconds(sec);
    setIsTimerRunning(false);
    setHasStartedWriting(false);
    if (suppressNextQuestionResetRef.current) {
      suppressNextQuestionResetRef.current = false;
      return;
    }
    setUserDraft('');
    setStage('write');
  }, [selectedQuestionId, selectedQuestion?.marks]);

  // Close auth modal automatically once signed in; stop timer on sign-out
  useEffect(() => {
    if (user) {
      setShowAuthGate(false);
    } else {
      setIsTimerRunning(false);
    }
  }, [user]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, remainingSeconds]);

  const handleStartTimer = () => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    setIsTimerRunning(true);
    setHasStartedWriting(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRemainingSeconds((selectedQuestion?.marks || 10) * 108);
  };

  const wordCount = useMemo(() => {
    return userDraft.trim() ? userDraft.trim().split(/\s+/).length : 0;
  }, [userDraft]);

  const estimatedPages = useMemo(() => {
    return Math.max(0.2, Number((wordCount / 140).toFixed(1)));
  }, [wordCount]);

  const totalScore = Number((scoreIntro + scoreCore + scoreStatutes + scoreConclusion).toFixed(2));
  const maxMarks = selectedQuestion?.marks || 10;
  const scorePercentage = Math.round((totalScore / maxMarks) * 100);
  const currentMerit = getWrittenMeritLevel(scorePercentage);

  const dimensionValues: Record<
    RubricDimensionKey,
    { score: number; max: number; setter: (val: number) => void }
  > = {
    intro: { score: scoreIntro, max: maxIntro, setter: setScoreIntro },
    core: { score: scoreCore, max: maxCore, setter: setScoreCore },
    statutes: {
      score: scoreStatutes,
      max: maxStatutes,
      setter: setScoreStatutes,
    },
    conclusion: {
      score: scoreConclusion,
      max: maxConclusion,
      setter: setScoreConclusion,
    },
  };

  const handleSaveEvaluation = () => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    const nowIso = new Date().toISOString();
    const record: WrittenEvaluationRecord = {
      id: `eval-${Date.now()}`,
      questionId: selectedQuestion.id,
      questionTitleNe: selectedQuestion.ne.title,
      questionTitleEn: selectedQuestion.en.title,
      marks: selectedQuestion.marks,
      date: new Date().toLocaleDateString('ne-NP'),
      evaluatedAt: nowIso,
      scoreIntro,
      scoreCore,
      scoreStatutes,
      scoreConclusion,
      totalScore,
      timeSpentSeconds: totalRecommendedSeconds - remainingSeconds,
      wordCount,
      userDraft,
      feedbackNotes: evaluatorNotes,
    };

    dispatch(addWrittenEvaluation(record));
    toast.success('Evaluation scorecard saved & synced to your history.');
    setStage('report');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLoadModelAnswer = () => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    const q = selectedQuestion;
    const sectionsText = q.ne.sections
      .map((s) => `२. ${s.heading}:\n${s.points.map((p) => `• ${p}`).join('\n')}`)
      .join('\n\n');
    const fullText = `१. परिचय तथा पृष्ठभूमि:\n${q.ne.introduction}\n\n${sectionsText}\n\n३. निष्कर्ष तथा भावी मार्गचित्र:\n${q.ne.conclusion}`;
    setUserDraft(fullText);
    setHasStartedWriting(true);
    toast.info('Loaded official model answer draft into editor.');
  };

  const handleCopyDraft = async () => {
    if (!userDraft) return;
    const ok = await copyWithToast(
      userDraft,
      'Practice answer draft copied to clipboard.'
    );
    if (ok) {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  const handleClearDraft = () => {
    if (!userDraft) return;
    setIsClearDraftConfirmOpen(true);
  };

  const confirmClearDraft = () => {
    setUserDraft('');
    setHasStartedWriting(false);
    setIsClearDraftConfirmOpen(false);
    toast.info('Draft cleared.');
  };

  const handleSetPresetScores = (ratio: number) => {
    setScoreIntro(Number((maxIntro * ratio).toFixed(2)));
    setScoreCore(Number((maxCore * ratio).toFixed(2)));
    setScoreStatutes(Number((maxStatutes * ratio).toFixed(2)));
    setScoreConclusion(Number((maxConclusion * ratio).toFixed(2)));
  };

  const handleExportMarkdown = () => {
    try {
      const content = [
        `# लोक सेवा आयोग - लिखित उत्तर मूल्याङ्कन प्रतिवेदन (PSC Answer Evaluation Report)`,
        `**Question ID**: ${selectedQuestion.id}`,
        `**Paper**: ${selectedQuestion.paper} | **Marks**: ${selectedQuestion.marks}M`,
        `**Date**: ${new Date().toLocaleDateString('ne-NP')}`,
        `**Question (नेपाली)**: ${selectedQuestion.ne.question}`,
        `**Question (English)**: ${selectedQuestion.en.question}`,
        '',
        `## मूल्याङ्कन नतिजा (Evaluation Summary)`,
        `- कुल प्राप्ताङ्क: ${totalScore} / ${maxMarks} (${scorePercentage}%)`,
        `- मेरिट स्तर: ${currentMerit.labelNe} (${currentMerit.labelEn})`,
        `- शब्द संख्या: ${wordCount} words (Est. ${estimatedPages} pages)`,
        `- समय: ${formatTimer(totalRecommendedSeconds - remainingSeconds)} खर्च`,
        '',
        `### ४-आयामी रुब्रिक प्राप्ताङ्क (Rubric Breakdown)`,
        ...WRITTEN_RUBRIC_DIMENSIONS.map((dim, idx) => {
          const entry = dimensionValues[dim.id];
          return `${idx + 1}. ${dim.titleNe} (${dim.weightPercentNe}): ${entry.score} / ${entry.max}`;
        }),
        '',
        evaluatorNotes ? `### परीक्षकको सुझाव (Evaluator Feedback)\n${evaluatorNotes}\n` : '',
        `## परीक्षार्थीको उत्तर (Candidate's Drafted Answer)`,
        userDraft || '_No answer provided._',
      ].filter(Boolean).join('\n');

      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PSC_Evaluation_${selectedQuestion.id}_${Date.now()}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Evaluation report exported as Markdown.');
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to export evaluation report.')
      );
    }
  };

  const handleDeleteHistoryRecord = (id: string) => {
    dispatch(deleteWrittenEvaluation(id));
    toast.info('Removed evaluation record.');
  };

  const handleClearAllHistory = () => {
    if (evalHistory.length === 0) return;
    setIsClearHistoryConfirmOpen(true);
  };

  const confirmClearAllHistory = () => {
    dispatch(clearWrittenEvaluations());
    setIsClearHistoryConfirmOpen(false);
    toast.info('Cleared all evaluation records.');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />

        <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/written" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Written Q&amp;A
                </Link>
              </li>
              <li>/</li>
              <li className="text-zinc-800 dark:text-zinc-200 font-medium">
                {EVALUATOR_HERO_CONTENT.breadcrumbLabel}
              </li>
            </ol>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-crimson-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 mb-8 overflow-hidden border border-crimson-900/40 shadow-xl">
            <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-28 -top-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/20 text-crimson-300 border border-crimson-400/30 text-xs font-medium mb-3">
                  <Scale className="w-3.5 h-3.5 text-crimson-400" />
                  <span>{EVALUATOR_HERO_CONTENT.badge}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  {EVALUATOR_HERO_CONTENT.headlineNe}
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {EVALUATOR_HERO_CONTENT.description}
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
                <ActionButton
                  icon={BookOpen}
                  label="Browse Model Answers"
                  title="View full bilingual written answers"
                  color="blue"
                  variant="solid"
                  size="md"
                  to="/written"
                  className="w-full justify-center"
                />
                <ActionButton
                  icon={Printer}
                  label="Print Marks Card"
                  title="Print clean evaluation scorecard"
                  color="zinc"
                  variant="outline"
                  size="md"
                  onClick={() => window.print()}
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {EVALUATOR_HERO_CONTENT.quickMetrics.map((metric) => {
                const valueColor =
                  metric.tone === 'amber'
                    ? 'text-amber-400'
                    : metric.tone === 'blue'
                      ? 'text-blue-400'
                      : 'text-white';
                return (
                  <div
                    key={metric.label}
                    className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800"
                  >
                    <div className="text-zinc-400 font-medium">{metric.label}</div>
                    <div className={`text-base sm:text-lg font-bold ${valueColor} mt-0.5`}>
                      {metric.value}
                    </div>
                  </div>
                );
              })}
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Evaluations Completed</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">{evalHistory.length} Answers Graded</div>
              </div>
            </div>
          </div>

          {/* 3-Step Guided Stage Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStage('write')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                stage === 'write'
                  ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <PenLine className="w-4 h-4" />
              <span>१. उत्तर लेखन (Draft Answer)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setShowAuthGate(true);
                  return;
                }
                setStage('evaluate');
              }}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                stage === 'evaluate'
                  ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>२. रुब्रिक स्कोरर (Self Score)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setShowAuthGate(true);
                  return;
                }
                setStage('report');
              }}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                stage === 'report'
                  ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>३. रिपोर्ट कार्ड (Scorecard)</span>
            </button>
          </div>

          {/* Question Selector Row */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs mb-8 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Select Question to Practice &amp; Evaluate:
                </label>
                <div className="text-sm font-serif font-bold text-zinc-950 dark:text-zinc-50">
                  {selectedQuestion
                    ? `${selectedQuestion.ne.title} (${selectedQuestion.marks} Marks · ${selectedQuestion.paper})`
                    : 'No written questions available'}
                </div>
              </div>

              <SharedSearchSelect
                value={selectedQuestion?.id ?? ''}
                onChange={setSelectedQuestionId}
                options={writtenQuestions.map((q) => ({
                  value: q.id,
                  label: `[${q.id}] ${q.marks}M: ${q.ne.title}`,
                  description: `${q.paper} · ${q.en.title}`,
                }))}
                size="sm"
                className="w-full sm:w-80"
                popoverWidth="w-80 sm:w-96"
                ariaLabel="Select Question to Practice & Evaluate"
                searchPlaceholder="Search written questions..."
              />
            </div>

            {selectedQuestion ? (
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5">
                <div className="font-semibold text-blue-900 dark:text-blue-300">
                  प्रश्न: {selectedQuestion.ne.question}
                </div>
                <div className="text-zinc-500 italic">
                  Question: {selectedQuestion.en.question}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                No written questions are currently available in the question bank.
              </div>
            )}
          </div>

          {/* STAGE 1: Answer Writing Desk */}
          {selectedQuestion && stage === 'write' && (
            <div className="space-y-6">
              {/* Timer Bar & Controls */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`font-mono text-2xl sm:text-3xl font-bold px-4 py-1.5 rounded-xl border ${
                      remainingSeconds <= 120
                        ? 'bg-crimson-50 text-crimson-700 border-crimson-300 dark:bg-crimson-950 dark:text-crimson-400 dark:border-crimson-800 animate-pulse'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {formatTimer(remainingSeconds)}
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {isTimerRunning ? 'Exam Countdown Active' : 'Timer Paused'}
                    </div>
                    <div className="text-zinc-400">
                      Standard: {selectedQuestion.marks} Marks = {selectedQuestion.recommendedMinutes} Minutes
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center gap-2">
                  {!isTimerRunning ? (
                    <ActionButton
                      icon={Play}
                      label={hasStartedWriting ? 'Resume Timer' : 'Start Exam Timer'}
                      title="Start official countdown"
                      color="blue"
                      variant="solid"
                      size="sm"
                      onClick={handleStartTimer}
                    />
                  ) : (
                    <ActionButton
                      icon={Clock}
                      label="Pause Timer"
                      title="Pause countdown"
                      color="amber"
                      variant="solid"
                      size="sm"
                      onClick={handlePauseTimer}
                    />
                  )}

                  <ActionButton
                    icon={RefreshCw}
                    label="Reset Time"
                    title="Reset countdown back to start"
                    color="zinc"
                    variant="outline"
                    size="sm"
                    onClick={handleResetTimer}
                  />

                  <ActionButton
                    icon={isFullscreen ? Minimize2 : Maximize2}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Writing Desk'}
                    color="zinc"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen((prev) => !prev)}
                  />
                </div>
              </div>

              {/* Distraction-Free Digital Writing Desk */}
              <div className={`space-y-3 ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-white dark:bg-zinc-950 overflow-y-auto' : ''}`}>
                <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                  <div className="flex items-center gap-3">
                    <span>
                      Words: <strong className="text-zinc-800 dark:text-zinc-200">{wordCount}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Est. Pages: <strong className="text-zinc-800 dark:text-zinc-200">{estimatedPages} pgs</strong> (approx 140 w/pg)
                    </span>
                  </div>

                  {remainingSeconds === 0 && (
                    <span className="text-crimson-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Time Up! Submit for evaluation.
                    </span>
                  )}
                </div>

                {/* Draft Utility Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-100 dark:bg-zinc-800/60 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleLoadModelAnswer}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                      title="Quickly fill with official model answer to test rubric"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>नमुना उत्तर लोड गर्नुहोस् (Load Model Draft)</span>
                    </button>
                    {userDraft && (
                      <>
                        <button
                          type="button"
                          onClick={handleCopyDraft}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedDraft ? 'Copied' : 'Copy Draft'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClearDraft}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md text-crimson-600 dark:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGuideOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-xs text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>रुब्रिक निर्देशिका (Rubric Criteria Guide)</span>
                    {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isGuideOpen && (
                  <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-3">
                    <h4 className="font-serif font-bold text-blue-950 dark:text-blue-100 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>लोक सेवा आयोग उत्तरपुस्तिका मूल्याङ्कन मानक (Official Marking Rubric Guidelines)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-700 dark:text-zinc-300">
                      {WRITTEN_RUBRIC_DIMENSIONS.map((dim) => (
                        <div
                          key={dim.id}
                          className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40"
                        >
                          <strong className="text-zinc-900 dark:text-zinc-100 block mb-0.5">
                            {dim.shortTitleNe}:
                          </strong>
                          {dim.guideSummaryNe}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
                      <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <p className="leading-relaxed">
                        Sign in with Google before starting the timed countdown or drafting your subjective answer for rubric evaluation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAuthGate(true)}
                      className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Sign In to Write</span>
                    </button>
                  </div>
                )}

                <textarea
                  rows={isFullscreen ? 24 : 14}
                  readOnly={!user}
                  value={userDraft}
                  onFocus={() => {
                    if (!user) {
                      setShowAuthGate(true);
                    }
                  }}
                  onClick={() => {
                    if (!user) {
                      setShowAuthGate(true);
                    }
                  }}
                  onChange={(e) => {
                    if (!user) {
                      setShowAuthGate(true);
                      return;
                    }
                    setUserDraft(e.target.value);
                    if (!hasStartedWriting) setHasStartedWriting(true);
                  }}
                  placeholder={
                    user
                      ? EVALUATOR_DRAFT_PLACEHOLDERS.authenticated
                      : EVALUATOR_DRAFT_PLACEHOLDERS.guest
                  }
                  className="w-full p-4 sm:p-5 text-sm sm:text-base font-sans rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed resize-y shadow-inner"
                />

                {/* Submit to Evaluation Action */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-400">
                    Drafted answers auto-save during your session.
                  </span>

                  <ActionButton
                    icon={CheckCircle2}
                    iconPosition="right"
                    label="Proceed to Rubric Scoring (Step 2)"
                    title="Grade your draft against official PSC criteria"
                    color="blue"
                    variant="solid"
                    size="md"
                    disabled={!user || !userDraft.trim()}
                    onClick={() => {
                      if (!user) {
                        setShowAuthGate(true);
                        return;
                      }
                      setIsTimerRunning(false);
                      setStage('evaluate');
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: 4-Dimension Rubric Scoring Engine */}
          {selectedQuestion && stage === 'evaluate' && (
            <div className="space-y-6">
              {/* Draft Preview Accordion */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Your Drafted Answer Preview:</span>
                  <button
                    type="button"
                    onClick={() => setStage('write')}
                    className="text-blue-600 hover:underline"
                  >
                    Edit Draft
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans border border-zinc-200 dark:border-zinc-800">
                  {userDraft || 'No draft provided.'}
                </div>
              </div>

              {/* 4 Rubric Sliders */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    आधिकारिक लोक सेवा ४-आयामी मूल्याङ्कन रुब्रिक (Official PSC Scoring Matrix)
                  </h3>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-zinc-400 text-[11px] font-medium mr-1">Presets:</span>
                    {EVALUATOR_PRESET_RATIOS.map((preset) => {
                      const toneClasses =
                        preset.tone === 'emerald'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                          : preset.tone === 'blue'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 hover:bg-blue-200'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200';
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleSetPresetScores(preset.ratio)}
                          className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${toneClasses}`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {WRITTEN_RUBRIC_DIMENSIONS.map((dim) => {
                  const entry = dimensionValues[dim.id];
                  return (
                    <div
                      key={dim.id}
                      className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                            {dim.orderNe}. {dim.titleNe} ({dim.titleEn})
                          </h4>
                          <p className="text-xs text-zinc-500">
                            {dim.descriptionNe}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-400">
                            {entry.score} / {entry.max}
                          </span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max={entry.max}
                        step={is10M ? '0.25' : '0.1'}
                        value={entry.score}
                        onChange={(e) => entry.setter(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />

                      <div className="text-[11px] text-zinc-500 grid grid-cols-3 text-center">
                        {dim.tierLabels.map((tierLabel) => (
                          <span key={tierLabel}>{tierLabel}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Evaluator Notes */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <label htmlFor={customNotesId} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                    परीक्षकको टिप्पणी तथा सुझावहरू (Evaluator / Self Feedback Notes):
                  </label>
                  <textarea
                    id={customNotesId}
                    rows={3}
                    value={evaluatorNotes}
                    onChange={(e) => setEvaluatorNotes(e.target.value)}
                    placeholder="e.g., परिचय राम्रो छ, तर धारा २३२ को उल्लेख गर्न छुटेको; समय व्यवस्थापन १५ मिनेटमा सीमित गर्नुपर्ने..."
                    className="w-full p-3 text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Total Score Summary Box */}
                <div className="p-5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-blue-800 dark:text-blue-300 font-medium">कुल प्राप्ताङ्क (Calculated Total):</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-950 dark:text-blue-100">
                      {totalScore} <span className="text-sm font-normal text-zinc-500">/ {maxMarks} Marks ({scorePercentage}%)</span>
                    </div>
                  </div>

                  <ActionButton
                    icon={Trophy}
                    label="Generate Scorecard & Compare with Model Answer (Step 3)"
                    title="Finish evaluation and generate report"
                    color="blue"
                    variant="solid"
                    size="md"
                    onClick={handleSaveEvaluation}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: Scorecard & Side-by-Side Model Comparison */}
          {selectedQuestion && stage === 'report' && (
            <div className="space-y-8">
              {/* Report Header Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                      PSC Nepal Official Evaluation Report Card
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950 dark:text-zinc-50">
                      {selectedQuestion.ne.title}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Paper: {selectedQuestion.paper} · Full Marks: {selectedQuestion.marks}M
                    </p>
                  </div>

                  {/* Big Total Grade */}
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center shrink-0">
                    <div className="text-xs text-zinc-500">Your Evaluated Score</div>
                    <div className="text-3xl font-bold font-mono text-blue-700 dark:text-blue-400">
                      {totalScore} <span className="text-base text-zinc-400">/ {maxMarks}</span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 mt-1">
                      {scorePercentage}% Performance
                    </div>
                  </div>
                </div>

                {/* Merit Level Classification */}
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs text-zinc-500">Merit Benchmark Grade:</div>
                      <div className="text-base font-serif font-bold text-blue-950 dark:text-blue-200">
                        {currentMerit.labelNe}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ActionButton
                      icon={Download}
                      label="Download Report (.md)"
                      title="Download evaluation report as Markdown file"
                      color="zinc"
                      variant="outline"
                      size="sm"
                      onClick={handleExportMarkdown}
                    />
                    <ActionButton
                      icon={Printer}
                      label="Print Scorecard"
                      title="Print evaluation card"
                      color="blue"
                      variant="solid"
                      size="sm"
                      onClick={() => window.print()}
                    />
                  </div>
                </div>

                {/* Score Breakdown Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {WRITTEN_RUBRIC_DIMENSIONS.map((dim) => {
                    const entry = dimensionValues[dim.id];
                    return (
                      <div
                        key={dim.id}
                        className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="text-zinc-500">{dim.shortTitleNe}</div>
                        <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                          {entry.score} / {entry.max}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {evaluatorNotes && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                    <strong className="text-amber-900 dark:text-amber-300 block">Evaluator Notes / आत्म-सुझाव:</strong>
                    <p className="text-amber-800 dark:text-amber-200 leading-relaxed">{evaluatorNotes}</p>
                  </div>
                )}
              </div>

              {/* Side-by-Side Comparison: Student Draft vs Official Model Answer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    तुलनात्मक विश्लेषण (Side-by-Side Model Comparison)
                  </h3>
                  <ActionButton
                    icon={ExternalLink}
                    label="Open Full Model Answer Studio"
                    title="Open model answer in full view"
                    color="blue"
                    variant="outline"
                    size="xs"
                    to={`/written/${selectedQuestion.id}`}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Candidate Draft */}
                  <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500">
                      <span>तपाईंको उत्तर (Your Drafted Answer)</span>
                      <span>{wordCount} Words · {estimatedPages} Pgs</span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                      {userDraft || 'No text written.'}
                    </div>
                  </div>

                  {/* Right: Official Bilingual Model Answer */}
                  <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-blue-200 dark:border-blue-900/60 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-blue-700 dark:text-blue-400">
                      <span>आधिकारिक नमुना उत्तर (PSC Nepal Model Answer)</span>
                      <span>Bilingual English &amp; नेपाली</span>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 max-h-[500px] overflow-y-auto pr-2">
                      {/* Model Intro */}
                      <div className="space-y-1">
                        <strong className="text-blue-900 dark:text-blue-300 text-xs uppercase block">१. परिचय (Introduction):</strong>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                          {selectedQuestion.ne.introduction}
                        </p>
                      </div>

                      {/* Model Sections */}
                      {selectedQuestion.ne.sections.map((sec, i) => (
                        <div key={i} className="space-y-1.5">
                          <strong className="text-zinc-900 dark:text-zinc-100 text-xs block font-serif font-bold">
                            {sec.heading}
                          </strong>
                          <ul className="space-y-1 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-xs">
                            {sec.points.map((pt, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Model Conclusion */}
                      <div className="space-y-1">
                        <strong className="text-blue-900 dark:text-blue-300 text-xs uppercase block">४. निष्कर्ष (Conclusion):</strong>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                          {selectedQuestion.ne.conclusion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons to Re-attempt */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <ActionButton
                  icon={RefreshCw}
                  label="Evaluate Another Question"
                  title="Practice another subjective question"
                  color="zinc"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setStage('write');
                    setUserDraft('');
                  }}
                />

                <ActionButton
                  icon={PenLine}
                  label="Re-attempt This Question (New Timed Sitting)"
                  title="Draft a revised version based on model answer"
                  color="blue"
                  variant="solid"
                  size="md"
                  onClick={() => {
                    setStage('write');
                    setUserDraft('');
                    setRemainingSeconds((selectedQuestion.marks || 10) * 108);
                  }}
                />
              </div>
            </div>
          )}

          {/* Saved Evaluation Log (अभिलेख तथा विगतका मूल्याङ्कनहरू) */}
          <div className="mt-12 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>विगतका मूल्याङ्कन अभिलेखहरू (Saved Evaluated Attempts)</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Total {evalHistory.length} evaluated attempts saved in your attempt log.
                </p>
              </div>

              {evalHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="inline-flex items-center gap-1.5 text-xs text-crimson-600 dark:text-crimson-400 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All History</span>
                </button>
              )}
            </div>

            {evalHistory.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs space-y-1">
                <p>हालसम्म कुनै पनि उत्तर मूल्याङ्कन रेकर्ड गरिएको छैन।</p>
                <p>माथि उत्तर लेखेर रुब्रिक अनुसार आफ्नो पहिलो प्राप्ताङ्क जोड्नुहोस्!</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {evalHistory.map((rec) => {
                  const pct = Math.round((rec.totalScore / rec.marks) * 100);
                  const merit = getWrittenMeritLevel(pct);
                  return (
                    <div key={rec.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                            {rec.questionId}
                          </span>
                          <span className="text-zinc-400">·</span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate">
                            {rec.questionTitleNe}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {rec.marks}M
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2 flex-wrap">
                          <span>{rec.date}</span>
                          <span>·</span>
                          <span>{rec.wordCount} words</span>
                          <span>·</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {rec.totalScore}/{rec.marks} ({pct}%)
                          </span>
                          <span>·</span>
                          <span className="text-zinc-600 dark:text-zinc-400">{merit.labelNe}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (rec.questionId !== selectedQuestionId) {
                              suppressNextQuestionResetRef.current = true;
                              setSelectedQuestionId(rec.questionId);
                            }
                            setUserDraft(rec.userDraft);
                            setScoreIntro(rec.scoreIntro);
                            setScoreCore(rec.scoreCore);
                            setScoreStatutes(rec.scoreStatutes);
                            setScoreConclusion(rec.scoreConclusion);
                            setEvaluatorNotes(rec.feedbackNotes);
                            setStage('report');
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          View Scorecard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHistoryRecord(rec.id)}
                          className="p-1 text-zinc-400 hover:text-crimson-600 transition-colors cursor-pointer"
                          title="Delete attempt"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />

        <ConfirmDialog
          isOpen={isClearDraftConfirmOpen}
          title="Clear Current Answer Draft?"
          description="के तपाईं हाल लेखिएको मस्यौदा खाली गर्न चाहनुहुन्छ? Any unsaved text in the current editor will be cleared."
          confirmLabel="Clear Draft"
          confirmColor="crimson"
          onConfirm={confirmClearDraft}
          onClose={() => setIsClearDraftConfirmOpen(false)}
        />

        <ConfirmDialog
          isOpen={isClearHistoryConfirmOpen}
          title="Delete All Evaluation History?"
          description="के तपाईं सबै मूल्याङ्कन अभिलेखहरू मेटाउन चाहनुहुन्छ? This will permanently remove all saved rubric scorecards from your workspace and synced account."
          confirmLabel="Delete History"
          confirmColor="crimson"
          onConfirm={confirmClearAllHistory}
          onClose={() => setIsClearHistoryConfirmOpen(false)}
        />

        <AnimatePresence>
          {showAuthGate && selectedQuestion && (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quiz-dialog-title"
            >
              <QuizAuthGate
                title={selectedQuestion.en.title}
                subtitle={`${selectedQuestion.paper} · ${selectedQuestion.subject}`}
                metaItems={[
                  selectedQuestion.id,
                  `${selectedQuestion.marks} Marks`,
                  `${selectedQuestion.recommendedMinutes} Min Limit`,
                ]}
                description={EVALUATOR_AUTH_GATE_CONTENT.description}
                benefits={[...EVALUATOR_AUTH_GATE_CONTENT.benefits]}
                actionLabel={EVALUATOR_AUTH_GATE_CONTENT.actionLabel}
                onClose={() => setShowAuthGate(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
