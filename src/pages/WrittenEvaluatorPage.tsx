import { useEffect, useId, useMemo, useState } from 'react';
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
import { Link, useSearchParams } from 'react-router-dom';
import { ActionButton } from '../components/common/ActionButton';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { WRITTEN_QUESTIONS } from '../data/writtenQuestionsData';

interface EvaluationRecord {
  id: string;
  questionId: string;
  questionTitleNe: string;
  questionTitleEn: string;
  marks: 5 | 10;
  date: string;
  scoreIntro: number;
  scoreCore: number;
  scoreStatutes: number;
  scoreConclusion: number;
  totalScore: number;
  timeSpentSeconds: number;
  wordCount: number;
  userDraft: string;
  feedbackNotes: string;
}

const STORAGE_KEY_EVALUATIONS = 'psc_written_evaluations_v2';

export function WrittenEvaluatorPage() {
  const [searchParams] = useSearchParams();
  const initialQId = searchParams.get('q') || WRITTEN_QUESTIONS[0].id;
  const customNotesId = useId();

  // State
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(initialQId);
  const [stage, setStage] = useState<'write' | 'evaluate' | 'report'>('write');
  const [userDraft, setUserDraft] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Timer state
  const selectedQuestion = useMemo(() => {
    return WRITTEN_QUESTIONS.find((q) => q.id === selectedQuestionId) || WRITTEN_QUESTIONS[0];
  }, [selectedQuestionId]);

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

  // Evaluation history
  const [evalHistory, setEvalHistory] = useState<EvaluationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVALUATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reset timer on question change
  useEffect(() => {
    const sec = (selectedQuestion?.marks || 10) * 108;
    setRemainingSeconds(sec);
    setIsTimerRunning(false);
    setHasStartedWriting(false);
    setUserDraft('');
    setStage('write');
  }, [selectedQuestionId, selectedQuestion?.marks]);

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

  const getMeritLevel = (pct: number) => {
    if (pct >= 75) {
      return {
        labelNe: 'टपर / उत्कृष्ट मेरिट स्तर (Merit Ranker Level)',
        labelEn: 'Topper / Outstanding Competitive Grade',
        color: 'emerald',
      };
    }
    if (pct >= 60) {
      return {
        labelNe: 'प्रतिस्पर्धात्मक उत्तीर्ण (Competitive Pass)',
        labelEn: 'Competitive Passing Tier',
        color: 'blue',
      };
    }
    if (pct >= 45) {
      return {
        labelNe: 'सामान्य उत्तीर्ण स्तर (Average Qualifying)',
        labelEn: 'Average Qualifying Tier',
        color: 'amber',
      };
    }
    return {
      labelNe: 'सुधार आवश्यक (Needs Remediation)',
      labelEn: 'Below Qualifying Threshold',
      color: 'crimson',
    };
  };

  const handleSaveEvaluation = () => {
    const record: EvaluationRecord = {
      id: `eval-${Date.now()}`,
      questionId: selectedQuestion.id,
      questionTitleNe: selectedQuestion.ne.title,
      questionTitleEn: selectedQuestion.en.title,
      marks: selectedQuestion.marks,
      date: new Date().toLocaleDateString('ne-NP'),
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

    const next = [record, ...evalHistory.slice(0, 19)];
    setEvalHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(next));
    } catch {}
    setStage('report');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLoadModelAnswer = () => {
    const q = selectedQuestion;
    const sectionsText = q.ne.sections
      .map((s) => `२. ${s.heading}:\n${s.points.map((p) => `• ${p}`).join('\n')}`)
      .join('\n\n');
    const fullText = `१. परिचय तथा पृष्ठभूमि:\n${q.ne.introduction}\n\n${sectionsText}\n\n३. निष्कर्ष तथा भावी मार्गचित्र:\n${q.ne.conclusion}`;
    setUserDraft(fullText);
    setHasStartedWriting(true);
  };

  const handleCopyDraft = async () => {
    if (!userDraft) return;
    try {
      await navigator.clipboard.writeText(userDraft);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleClearDraft = () => {
    if (window.confirm('के तपाईं हाल लेखिएको मस्यौदा खाली गर्न चाहनुहुन्छ? (Clear draft?)')) {
      setUserDraft('');
      setHasStartedWriting(false);
    }
  };

  const handleSetPresetScores = (ratio: number) => {
    setScoreIntro(Number((maxIntro * ratio).toFixed(2)));
    setScoreCore(Number((maxCore * ratio).toFixed(2)));
    setScoreStatutes(Number((maxStatutes * ratio).toFixed(2)));
    setScoreConclusion(Number((maxConclusion * ratio).toFixed(2)));
  };

  const handleExportMarkdown = () => {
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
      `- मेरिट स्तर: ${getMeritLevel(scorePercentage).labelNe} (${getMeritLevel(scorePercentage).labelEn})`,
      `- शब्द संख्या: ${wordCount} words (Est. ${estimatedPages} pages)`,
      `- समय: ${formatTimer(totalRecommendedSeconds - remainingSeconds)} खर्च`,
      '',
      `### ४-आयामी रुब्रिक प्राप्ताङ्क (Rubric Breakdown)`,
      `1. परिचय तथा अवधारणागत स्पष्टता (१५%): ${scoreIntro} / ${maxIntro}`,
      `2. मुख्य विषयवस्तुको बुँदागत विश्लेषण (५५%): ${scoreCore} / ${maxCore}`,
      `3. संवैधानिक तथा कानुनी आधार (१५%): ${scoreStatutes} / ${maxStatutes}`,
      `4. सन्तुलित निष्कर्ष तथा भावी मार्गचित्र (१५%): ${scoreConclusion} / ${maxConclusion}`,
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
  };

  const handleDeleteHistoryRecord = (id: string) => {
    const next = evalHistory.filter((item) => item.id !== id);
    setEvalHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(next));
    } catch {}
  };

  const handleClearAllHistory = () => {
    if (window.confirm('के तपाईं सबै मूल्याङ्कन अभिलेखहरू मेटाउन चाहनुहुन्छ? (Delete all history?)')) {
      setEvalHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY_EVALUATIONS);
      } catch {}
    }
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
                Answer Evaluator &amp; Rubric Scorer (उत्तर लेखन स्व-मूल्याङ्कन)
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
                  <span>Official 1.8 Min/Mark Rubric Engine</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  उत्तर लेखन स्व-मूल्याङ्कन तथा रुब्रिक स्कोरर
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  Draft subjective answers under authentic exam hall countdowns (9 mins for 5M, 18 mins for 10M),
                  grade against official Lok Sewa 4-dimensional rubrics, and benchmark against top rankers.
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
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Standard Time Pacing</div>
                <div className="text-base sm:text-lg font-bold text-amber-400 mt-0.5">१.८ मिनेट / अङ्क</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Evaluation Dimensions</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">४ अनिवार्य खण्डहरू</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Target Word Density</div>
                <div className="text-base sm:text-lg font-bold text-blue-400 mt-0.5">१४०–१५० शब्द / पृष्ठ</div>
              </div>
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
              onClick={() => setStage('evaluate')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
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
              onClick={() => setStage('report')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
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
                  {selectedQuestion.ne.title} ({selectedQuestion.marks} Marks · {selectedQuestion.paper})
                </div>
              </div>

              <SharedSearchSelect
                value={selectedQuestionId}
                onChange={setSelectedQuestionId}
                options={WRITTEN_QUESTIONS.map((q) => ({
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

            {/* Question Details Banner */}
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="font-semibold text-blue-900 dark:text-blue-300">
                प्रश्न: {selectedQuestion.ne.question}
              </div>
              <div className="text-zinc-500 italic">
                Question: {selectedQuestion.en.question}
              </div>
            </div>
          </div>

          {/* STAGE 1: Answer Writing Desk */}
          {stage === 'write' && (
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
                      <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-0.5">१. परिचय (१५%):</strong>
                        विषयवस्तुको शाब्दिक अर्थ, अवधारणा, नेपालको सन्दर्भमा सान्दर्भिकता र स्पष्ट सुरुवात (३-४ वाक्य)।
                      </div>
                      <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-0.5">२. मुख्य विश्लेषण (५५%):</strong>
                        प्रश्नको माग अनुसार उपशीर्षक, सकारात्मक/नकारात्मक पक्ष, समस्याका कारण, बुँदागत स्पष्टता वा तुलनात्मक तालिका।
                      </div>
                      <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-0.5">३. कानुनी तथा नीतिगत आधार (१५%):</strong>
                        नेपालको संविधानका सम्बन्धित धाराहरू, आवधिक योजना, सम्बन्धित ऐन तथा नियमावलीको सटिक उद्धरण।
                      </div>
                      <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-0.5">४. निष्कर्ष तथा मार्गचित्र (१५%):</strong>
                        समस्या समाधानका व्यावहारिक उपाय, सकारात्मक सन्देश र दूरदर्शी प्रशासनिक दृष्टिकोण सहितको टुंग्याउनी।
                      </div>
                    </div>
                  </div>
                )}

                <textarea
                  rows={isFullscreen ? 24 : 14}
                  value={userDraft}
                  onChange={(e) => {
                    setUserDraft(e.target.value);
                    if (!hasStartedWriting) setHasStartedWriting(true);
                  }}
                  placeholder="यहाँ आफ्नो उत्तर टाइप गर्नुहोस् (Type your answer here in Nepali or English)...&#10;&#10;१. परिचय / अवधारणा (Introduction)&#10;२. मुख्य विषयवस्तु र बुँदागत विश्लेषण (Core Analytical Arguments)&#10;३. कानुनी तथा नीतिगत व्यवस्थाहरू (Statutory Provisions)&#10;४. निष्कर्ष तथा भावी कार्यदिशा (Balanced Conclusion)"
                  className="w-full p-4 sm:p-5 text-sm sm:text-base font-sans rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed resize-y shadow-inner"
                />

                {/* Submit to Evaluation Action */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-400">
                    Drafted answers stay strictly in your browser (local-first storage).
                  </span>

                  <ActionButton
                    icon={CheckCircle2}
                    iconPosition="right"
                    label="Proceed to Rubric Scoring (Step 2)"
                    title="Grade your draft against official PSC criteria"
                    color="blue"
                    variant="solid"
                    size="md"
                    disabled={!userDraft.trim()}
                    onClick={() => {
                      setIsTimerRunning(false);
                      setStage('evaluate');
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: 4-Dimension Rubric Scoring Engine */}
          {stage === 'evaluate' && (
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
                    <button
                      type="button"
                      onClick={() => handleSetPresetScores(0.8)}
                      className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium hover:bg-emerald-200 transition-colors cursor-pointer"
                    >
                      Topper (80%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPresetScores(0.65)}
                      className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      Pass (65%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPresetScores(0.5)}
                      className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      Average (50%)
                    </button>
                  </div>
                </div>

                {/* Dimension 1: Intro */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                        १. परिचय तथा अवधारणागत स्पष्टता (Introduction &amp; Framing)
                      </h4>
                      <p className="text-xs text-zinc-500">
                        विषयवस्तुको छोटो परिभाषा, पृष्ठभूमि, र स्पष्ट थालनी (भार: १५%)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-400">
                        {scoreIntro} / {maxIntro}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={maxIntro}
                    step={is10M ? '0.25' : '0.1'}
                    value={scoreIntro}
                    onChange={(e) => setScoreIntro(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="text-[11px] text-zinc-500 grid grid-cols-3 text-center">
                    <span>कमजोर (अस्पष्ट परिभाषा)</span>
                    <span>मध्यम (साधारण परिचय)</span>
                    <span>उत्कृष्ट (स्पष्ट, सटिक र प्रभावकारी)</span>
                  </div>
                </div>

                {/* Dimension 2: Core Body */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                        २. मुख्य विषयवस्तुको बुँदागत विश्लेषण (Core Arguments &amp; Depth)
                      </h4>
                      <p className="text-xs text-zinc-500">
                        बोल्ड शीर्षक, स्पष्ट तर्क, सकारात्मक/नकारात्मक पक्ष र प्रस्तुति (भार: ५५%)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-400">
                        {scoreCore} / {maxCore}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={maxCore}
                    step={is10M ? '0.25' : '0.1'}
                    value={scoreCore}
                    onChange={(e) => setScoreCore(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="text-[11px] text-zinc-500 grid grid-cols-3 text-center">
                    <span>सतही बुँदाहरू</span>
                    <span>सन्तोषजनक तर्क र बुँदाहरू</span>
                    <span>गहन विश्लेषण, तालिका वा संरचना</span>
                  </div>
                </div>

                {/* Dimension 3: Legal Citations */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                        ३. संवैधानिक तथा कानुनी आधार (Statutory &amp; Legal Citations)
                      </h4>
                      <p className="text-xs text-zinc-500">
                        संविधानका धारा, सम्बन्धित ऐन, नियम, तथा नीतिगत व्यवस्थाहरूको उल्लेख (भार: १५%)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-400">
                        {scoreStatutes} / {maxStatutes}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={maxStatutes}
                    step={is10M ? '0.25' : '0.1'}
                    value={scoreStatutes}
                    onChange={(e) => setScoreStatutes(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="text-[11px] text-zinc-500 grid grid-cols-3 text-center">
                    <span>कानुनी उल्लेख नभएको</span>
                    <span>सामान्य ऐनको नाम मात्र</span>
                    <span>सटिक धारा, दफा र नीतिको उद्धरण</span>
                  </div>
                </div>

                {/* Dimension 4: Conclusion */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                        ४. सन्तुलित निष्कर्ष तथा भावी मार्गचित्र (Forward-Looking Conclusion)
                      </h4>
                      <p className="text-xs text-zinc-500">
                        समस्याको व्यावहारिक समाधान र सकारात्मक भावी कार्यदिशा (भार: १५%)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-400">
                        {scoreConclusion} / {maxConclusion}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={maxConclusion}
                    step={is10M ? '0.25' : '0.1'}
                    value={scoreConclusion}
                    onChange={(e) => setScoreConclusion(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="text-[11px] text-zinc-500 grid grid-cols-3 text-center">
                    <span>निष्कर्ष नभएको वा दोहोरो</span>
                    <span>सामान्य निष्कर्ष</span>
                    <span>सकारात्मक, दूरदर्शी र व्यावहारिक मार्गचित्र</span>
                  </div>
                </div>

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
          {stage === 'report' && (
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
                        {getMeritLevel(scorePercentage).labelNe}
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
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500">१. परिचय (१५%)</div>
                    <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{scoreIntro} / {maxIntro}</div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500">२. मुख्य विश्लेषण (५५%)</div>
                    <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{scoreCore} / {maxCore}</div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500">३. कानुनी आधार (१५%)</div>
                    <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{scoreStatutes} / {maxStatutes}</div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500">४. निष्कर्ष (१५%)</div>
                    <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{scoreConclusion} / {maxConclusion}</div>
                  </div>
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
                  Total {evalHistory.length} attempts recorded in your browser local storage.
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
                  const merit = getMeritLevel(pct);
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
                            setSelectedQuestionId(rec.questionId);
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
      </div>
    </PageTransition>
  );
}
