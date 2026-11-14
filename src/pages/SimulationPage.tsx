import { useEffect, useMemo, useState } from 'react';
import {
  Play,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { AssessmentFormatNav } from '../components/quiz/AssessmentFormatNav';
import { SharedTable } from '../components/common/SharedTable';
import { formatReverseClock } from '../components/quiz/QuizSessionDialog';
import {
  ExamSimulationDialog,
  OMR_PRESETS,
  WRITTEN_PRESETS,
  type BookletKey,
} from '../components/simulation/ExamSimulationDialog';
import type { PscCadreId } from '../data/pscSyllabusData';
import {
  WRITTEN_QUESTIONS,
  type WrittenQuestion,
} from '../data/writtenQuestionsData';
import { clearSimulationHistory } from '../features/psc/pscSlice';
import type { WrittenLanguageMode } from '../features/written/writtenSlice';
import {
  formatCompactDuration,
  formatRelativeDate,
} from '../utils/pdfHelpers';

type SimulatorTab = 'omr-hall' | 'written-hall' | 'merit-lab';

export function SimulationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);
  const simulationHistory = useAppSelector(
    (state) => state.psc.simulationHistory
  );

  const presetParam = searchParams.get('preset') ?? '';
  const modeParam = searchParams.get('mode');
  const launchParam = searchParams.get('launch') === '1';

  const derivedTab = useMemo<SimulatorTab>(() => {
    if (
      modeParam === 'omr-hall' ||
      modeParam === 'written-hall' ||
      modeParam === 'merit-lab'
    ) {
      return modeParam;
    }
    if (presetParam.startsWith('written-')) {
      return 'written-hall';
    }
    return 'omr-hall';
  }, [modeParam, presetParam]);

  const [activeTab, setActiveTab] = useState<SimulatorTab>(derivedTab);

  useEffect(() => {
    setActiveTab(derivedTab);
  }, [derivedTab]);

  // ---------------- CANDIDATE SETUP & PRESETS ----------------
  const defaultOmrPresetId = useMemo(() => {
    if (OMR_PRESETS.some((p) => p.id === presetParam)) {
      return presetParam;
    }
    if (targetCadreId === 'nayab-subba') return 'nasu-phase1-omr';
    if (targetCadreId === 'kharidar') return 'kharidar-phase1-omr';
    return 'so-phase1-omr';
  }, [presetParam, targetCadreId]);

  const defaultWrittenPresetId = useMemo(() => {
    if (WRITTEN_PRESETS.some((p) => p.id === presetParam)) {
      return presetParam;
    }
    return WRITTEN_PRESETS[0].id;
  }, [presetParam]);

  const [selectedOmrPresetId, setSelectedOmrPresetId] =
    useState<string>(defaultOmrPresetId);
  const [selectedWrittenPresetId, setSelectedWrittenPresetId] =
    useState<string>(defaultWrittenPresetId);
  const [rollNumber, setRollNumber] = useState<string>('PSC-83-40291');
  const [bookletKey, setBookletKey] = useState<BookletKey>('A');
  const [writtenLang, setWrittenLang] =
    useState<WrittenLanguageMode>('bilingual');

  // Sync selected preset if deep-link presetParam changes
  useEffect(() => {
    if (OMR_PRESETS.some((p) => p.id === presetParam)) {
      setSelectedOmrPresetId(presetParam);
    } else if (WRITTEN_PRESETS.some((p) => p.id === presetParam)) {
      setSelectedWrittenPresetId(presetParam);
    }
  }, [presetParam]);

  // Dialog open state & active simulation type
  const [dialogSession, setDialogSession] = useState<{
    open: boolean;
    type: 'omr-hall' | 'written-hall';
  }>(() => {
    if (launchParam) {
      return {
        open: true,
        type: presetParam.startsWith('written-') ? 'written-hall' : 'omr-hall',
      };
    }
    return { open: false, type: 'omr-hall' };
  });

  // Open dialog if navigated with ?launch=1
  useEffect(() => {
    if (launchParam) {
      setDialogSession({
        open: true,
        type: presetParam.startsWith('written-') ? 'written-hall' : 'omr-hall',
      });
    }
  }, [launchParam, presetParam]);

  const selectedOmrPreset = useMemo(
    () =>
      OMR_PRESETS.find((p) => p.id === selectedOmrPresetId) ?? OMR_PRESETS[0],
    [selectedOmrPresetId]
  );

  const selectedWrittenPreset = useMemo(
    () =>
      WRITTEN_PRESETS.find((p) => p.id === selectedWrittenPresetId) ??
      WRITTEN_PRESETS[0],
    [selectedWrittenPresetId]
  );

  const openOmrDialog = (presetId?: string, nextKey?: BookletKey) => {
    const resolvedId = presetId ?? selectedOmrPreset.id;
    setSelectedOmrPresetId(resolvedId);
    if (nextKey) {
      setBookletKey(nextKey);
    }
    setDialogSession({ open: true, type: 'omr-hall' });
    setSearchParams(
      { mode: 'omr-hall', preset: resolvedId, launch: '1' },
      { replace: true }
    );
  };

  const openWrittenDialog = (presetId?: string) => {
    const resolvedId = presetId ?? selectedWrittenPreset.id;
    setSelectedWrittenPresetId(resolvedId);
    setDialogSession({ open: true, type: 'written-hall' });
    setSearchParams(
      { mode: 'written-hall', preset: resolvedId, launch: '1' },
      { replace: true }
    );
  };

  const closeSimulationDialog = () => {
    setDialogSession((prev) => ({ ...prev, open: false }));
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('launch');
    setSearchParams(nextParams, { replace: true });
  };

  const switchSimulatorTab = (next: SimulatorTab) => {
    setActiveTab(next);
    setSearchParams({ mode: next }, { replace: true });
  };

  // ---------------- MERIT & NEGATIVE-MARKING STRATEGY LAB STATE ----------------
  const [labCadre, setLabCadre] = useState<PscCadreId>(targetCadreId);
  const [confidentCount, setConfidentCount] = useState<number>(
    targetCadreId === 'section-officer' ? 56 : 28
  );
  const [educatedGuesses, setEducatedGuesses] = useState<number>(
    targetCadreId === 'section-officer' ? 18 : 10
  );
  const [blindGuesses, setBlindGuesses] = useState<number>(4);
  const [paper2Score, setPaper2Score] = useState<number>(58);
  const [paper3Score, setPaper3Score] = useState<number>(61);
  const [paper4Score, setPaper4Score] = useState<number>(59);
  const [practicalScore, setPracticalScore] = useState<number>(8);
  const [groupTestScore, setGroupTestScore] = useState<number>(7);
  const [interviewScore, setInterviewScore] = useState<number>(
    targetCadreId === 'section-officer' ? 26 : 21
  );

  const handleSelectLabCadre = (next: PscCadreId) => {
    setLabCadre(next);
    if (next === 'section-officer') {
      setConfidentCount(56);
      setEducatedGuesses(18);
      setBlindGuesses(4);
      setGroupTestScore(7);
      setInterviewScore(26);
    } else {
      setConfidentCount(28);
      setEducatedGuesses(10);
      setBlindGuesses(4);
      setInterviewScore(21);
    }
  };

  const meritSimulation = useMemo(() => {
    const totalQuestions = labCadre === 'section-officer' ? 100 : 50;
    const marksPerQ = labCadre === 'section-officer' ? 1 : 2;
    const penaltyPerWrong = marksPerQ * 0.2;

    const safeConfident = Math.min(totalQuestions, confidentCount);
    const remainingAfterConf = Math.max(0, totalQuestions - safeConfident);
    const safeEducated = Math.min(remainingAfterConf, educatedGuesses);
    const remainingAfterEdu = Math.max(0, remainingAfterConf - safeEducated);
    const safeBlind = Math.min(remainingAfterEdu, blindGuesses);
    const skipped = Math.max(
      0,
      totalQuestions - safeConfident - safeEducated - safeBlind
    );

    const expCorrect =
      safeConfident * 0.92 + safeEducated * 0.5 + safeBlind * 0.25;
    const expWrong =
      safeConfident * 0.08 + safeEducated * 0.5 + safeBlind * 0.75;

    const expGross = expCorrect * marksPerQ;
    const expPenalty = expWrong * penaltyPerWrong;
    const expNet = Math.max(0, Math.round((expGross - expPenalty) * 100) / 100);

    const floorCorrect =
      safeConfident * 0.88 + safeEducated * 0.35 + safeBlind * 0.1;
    const floorWrong =
      safeConfident * 0.12 + safeEducated * 0.65 + safeBlind * 0.9;
    const floorNet = Math.max(
      0,
      Math.round(
        (floorCorrect * marksPerQ - floorWrong * penaltyPerWrong) * 100
      ) / 100
    );

    const writtenTotal =
      labCadre === 'section-officer'
        ? paper2Score + paper3Score + paper4Score
        : paper2Score + paper3Score;
    const writtenMax = labCadre === 'section-officer' ? 300 : 200;

    const groupBonus = labCadre === 'section-officer' ? groupTestScore : 0;
    const interviewMax = labCadre === 'section-officer' ? 40 : 30;
    const clampedInterview = Math.min(interviewMax, interviewScore);
    const phase3Total = practicalScore + groupBonus + clampedInterview;
    const phase3Max = labCadre === 'section-officer' ? 60 : 40;

    const finalMeritTotal = writtenTotal + phase3Total;
    const finalMeritMax = writtenMax + phase3Max;
    const finalMeritPct =
      Math.round((finalMeritTotal / finalMeritMax) * 1000) / 10;

    const writtenAllPass =
      paper2Score >= 40 &&
      paper3Score >= 40 &&
      (labCadre !== 'section-officer' || paper4Score >= 40);

    return {
      totalQuestions,
      marksPerQ,
      penaltyPerWrong,
      safeConfident,
      safeEducated,
      safeBlind,
      skipped,
      expGross: Math.round(expGross * 100) / 100,
      expPenalty: Math.round(expPenalty * 100) / 100,
      expNet,
      floorNet,
      phase1Clears: expNet >= 45,
      writtenAllPass,
      writtenTotal,
      writtenMax,
      phase3Total,
      phase3Max,
      groupBonus,
      interviewMax,
      clampedInterview,
      finalMeritTotal,
      finalMeritMax,
      finalMeritPct,
      evEducatedPerQ:
        Math.round((0.5 * marksPerQ - 0.5 * penaltyPerWrong) * 100) / 100,
      evBlindPerQ:
        Math.round((0.25 * marksPerQ - 0.75 * penaltyPerWrong) * 100) / 100,
    };
  }, [
    labCadre,
    confidentCount,
    educatedGuesses,
    blindGuesses,
    paper2Score,
    paper3Score,
    paper4Score,
    practicalScore,
    groupTestScore,
    interviewScore,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
            {/* Top Breadcrumb & Unified PSC Format Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Link
                  to="/"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  PSC Hub
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Exam Simulator
                </span>
              </div>

              <AssessmentFormatNav active="simulate" />
            </div>

            {/* Simulator Header & Mode Selector */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2.5">
                <h1 className="font-serif text-fluid-h1 font-semibold text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  PSC Examination Hall &amp; Merit Simulator
                </h1>
                <p className="text-fluid-lead text-zinc-600 dark:text-zinc-400">
                  Configure your candidate desk and launch a distraction-free
                  Lok Sewa OMR screening dialog (-20% negative marking), sit timed
                  bilingual written papers with examiner rubrics, or model your
                  Phase I–III merit strategy.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Simulation workspace mode"
                className="max-w-full overflow-x-auto inline-flex flex-nowrap sm:flex-wrap items-center gap-1 p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs shrink-0"
              >
                {(
                  [
                    { id: 'omr-hall', label: 'Phase I · OMR Hall' },
                    { id: 'written-hall', label: 'Phase II · Written Hall' },
                    { id: 'merit-lab', label: 'Merit & Penalty Lab' },
                  ] as const
                ).map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => switchSimulatorTab(tab.id)}
                      className={`relative min-h-9 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isSelected
                          ? 'text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="simulator-mode-active-pill"
                          aria-hidden="true"
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                          }
                          className="absolute inset-0 rounded-md bg-blue-700 dark:bg-blue-600 shadow-2xs"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 1, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        y: -4,
                        transition: { duration: 0.1, ease: [0.4, 0, 1, 1] },
                      }
                }
              >
                {/* =============================================================== */}
                {/* MODE 1: PHASE I OMR SCREENING HALL LOBBY                        */}
                {/* =============================================================== */}
                {activeTab === 'omr-hall' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Preset Cards */}
              <div className="lg:col-span-8 space-y-3.5">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  1. Select Official Examination Preset
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OMR_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedOmrPreset.id;
                    const fullMarks =
                      preset.questionCount * preset.marksPerQuestion;
                    const passMarks = (fullMarks * preset.passPercent) / 100;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedOmrPresetId(preset.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedOmrPresetId(preset.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        className={`text-left p-5 rounded-xl border transition-colors flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-900 border-blue-700 dark:border-blue-400 ring-1 ring-blue-700/15 dark:ring-blue-400/20'
                            : 'bg-white/75 dark:bg-zinc-900/55 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {preset.cadreLabel}
                          </p>
                          <h3 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                            {preset.title}
                          </h3>
                          <p
                            lang="ne"
                            className="text-xs text-zinc-600 dark:text-zinc-400"
                          >
                            {preset.nepaliTitle}
                          </p>
                          <p className="pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {preset.blueprintSummary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                            <span>{preset.questionCount} Qs</span>
                            <span aria-hidden="true">·</span>
                            <span>{fullMarks}M</span>
                            <span aria-hidden="true">·</span>
                            <span>Pass {passMarks}M</span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {formatReverseClock(preset.allocatedSeconds)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openOmrDialog(preset.id);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-crimson-700 dark:text-crimson-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                          >
                            <Play className="w-3 h-3" />
                            <span>Launch Hall</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Desk Configuration */}
              <div className="lg:col-span-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-5">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  2. Candidate OMR Setup
                </h2>

                <div className="space-y-1.5">
                  <label
                    htmlFor="candidate-roll-input"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Candidate Roll Number
                  </label>
                  <input
                    id="candidate-roll-input"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    maxLength={20}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono tabular-nums text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Question Booklet Key (Mandatory on PSC OMR)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setBookletKey(k)}
                        className={`h-11 rounded-lg font-mono text-xs font-semibold border transition-colors whitespace-nowrap ${
                          bookletKey === k
                            ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 dark:text-white dark:border-blue-500'
                            : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        Key {k}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Lok Sewa Hall Rules Active in Dialog:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 leading-relaxed">
                    <li>
                      Opens in a distraction-free modal examination hall.
                    </li>
                    <li>
                      20% marks (-
                      {(
                        selectedOmrPreset.marksPerQuestion *
                        selectedOmrPreset.negativeRate
                      ).toFixed(2)}
                      M) deducted per wrong answer.
                    </li>
                    <li>
                      Unanswered (blank) bubbles carry zero deduction.
                    </li>
                    <li>
                      Minimum {selectedOmrPreset.passPercent}% net score
                      required to qualify.
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openOmrDialog(selectedOmrPreset.id)}
                  className="w-full h-11 rounded-xl bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 shadow-2xs text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Play className="w-4 h-4" />
                  <span>Enter Examination Hall</span>
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE 2: TIMED WRITTEN PAPER HALL LOBBY                          */}
          {/* =============================================================== */}
          {activeTab === 'written-hall' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-3.5">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  1. Select Subjective Written Paper Sitting
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WRITTEN_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedWrittenPreset.id;
                    const qItems = preset.questionIds
                      .map((id) => WRITTEN_QUESTIONS.find((q) => q.id === id))
                      .filter((q): q is WrittenQuestion => Boolean(q));
                    const totalM = qItems.reduce((s, q) => s + q.marks, 0);

                    return (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedWrittenPresetId(preset.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedWrittenPresetId(preset.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        className={`text-left p-5 rounded-xl border transition-colors flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-900 border-blue-700 dark:border-blue-400 ring-1 ring-blue-700/15 dark:ring-blue-400/20'
                            : 'bg-white/75 dark:bg-zinc-900/55 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {preset.paperCode}
                          </p>
                          <h3 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                            {preset.title}
                          </h3>
                          <p
                            lang="ne"
                            className="text-xs text-zinc-600 dark:text-zinc-400"
                          >
                            {preset.nepaliTitle}
                          </p>
                          <p className="pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {preset.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                            <span>{qItems.length} Qs</span>
                            <span aria-hidden="true">·</span>
                            <span>{totalM} Marks</span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {formatReverseClock(preset.allocatedSeconds)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openWrittenDialog(preset.id);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-crimson-700 dark:text-crimson-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                          >
                            <Play className="w-3 h-3" />
                            <span>Launch Paper</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-5">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  2. Written Booklet Setup
                </h2>

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Question Prompt Language
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'bilingual', label: 'EN + नेपाली' },
                        { id: 'en', label: 'English' },
                        { id: 'ne', label: 'नेपाली' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setWrittenLang(opt.id)}
                        className={`h-10 px-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                          writtenLang === opt.id
                            ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-600 dark:text-white dark:border-blue-500'
                            : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-3 border-t border-zinc-200 dark:border-zinc-800 leading-relaxed">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Answer Booklet Protocol:
                  </p>
                  <p>
                    Model answers remain sealed inside the examination dialog
                    during the timed sitting. Structure each script with an
                    Introduction, numbered Analytical Headings, and a
                    forward-looking Conclusion.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openWrittenDialog(selectedWrittenPreset.id)}
                  className="w-full h-11 rounded-xl bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 shadow-2xs text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Timed Written Paper</span>
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE 3: INTERACTIVE NEGATIVE-MARKING & MERIT STRATEGY LAB       */}
          {/* =============================================================== */}
          {activeTab === 'merit-lab' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Visual Stage */}
              <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                      Live PSC Score &amp; Merit Projection
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Models -20% OMR negative penalty and Phase II + III merit
                      standing
                    </p>
                  </div>

                  <div className="max-w-full overflow-x-auto inline-flex flex-nowrap items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
                    {(
                      [
                        { id: 'section-officer', label: 'Section Officer' },
                        { id: 'nayab-subba', label: 'Nayab Subba' },
                        { id: 'kharidar', label: 'Kharidar' },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectLabCadre(c.id)}
                        className={`min-h-8 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                          labCadre === c.id
                            ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phase I Screening Simulation */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Phase I · OMR Screening Gate (Pass Cutoff: 45.0 / 100)
                    </span>
                    <span
                      className={`font-semibold ${
                        meritSimulation.phase1Clears
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {meritSimulation.phase1Clears
                        ? 'Clears 45% Screening Gate'
                        : 'Below 45% Screening Gate'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-4 py-3 border-y border-zinc-100 dark:border-zinc-800 font-mono tabular-nums">
                    <div>
                      <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400">
                        Expected Gross
                      </p>
                      <p className="mt-0.5 text-fluid-kpi font-semibold text-zinc-900 dark:text-zinc-100">
                        +{meritSimulation.expGross.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400">
                        -20% Penalty
                      </p>
                      <p className="mt-0.5 text-fluid-kpi font-semibold text-red-600 dark:text-red-400">
                        -{meritSimulation.expPenalty.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400">
                        Expected Net
                      </p>
                      <p className="mt-0.5 text-fluid-kpi font-semibold text-emerald-700 dark:text-emerald-400">
                        {meritSimulation.expNet.toFixed(1)}
                        <span className="text-xs font-normal text-zinc-400">
                          /100
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Comparative Bar with 45% Marker */}
                  <div className="space-y-1.5">
                    <div className="relative h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-150 ${
                          meritSimulation.phase1Clears
                            ? 'bg-emerald-600 dark:bg-emerald-400'
                            : 'bg-red-600 dark:bg-red-400'
                        }`}
                        style={{
                          width: `${Math.min(100, meritSimulation.expNet)}%`,
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute top-0 bottom-0 left-[45%] w-0.5 bg-zinc-950 dark:bg-white"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                      <span>0</span>
                      <span>45.0 Cutoff</span>
                      <span>
                        Floor: {meritSimulation.floorNet.toFixed(1)}
                      </span>
                      <span>100</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <strong>Mathematical Strategy Insight:</strong> On a{' '}
                    {meritSimulation.marksPerQ}-mark question, eliminating 2
                    wrong options (50/50 guess) yields{' '}
                    <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      +{meritSimulation.evEducatedPerQ.toFixed(2)}M
                    </span>{' '}
                    expected value per question, whereas pure 4-option blind
                    guessing yields only{' '}
                    <span className="font-mono font-semibold">
                      +{meritSimulation.evBlindPerQ.toFixed(2)}M
                    </span>{' '}
                    with high downside risk near the 45-mark cutoff.
                  </p>
                </div>

                {/* Phase II + III Final Merit Table */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      Final Selection Merit Aggregate (Phase II + Final Stage)
                    </h3>
                    <span className="font-mono tabular-nums text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {meritSimulation.finalMeritTotal} /{' '}
                      {meritSimulation.finalMeritMax} (
                      {meritSimulation.finalMeritPct}%)
                    </span>
                  </div>

                  {/* Mobile Responsive View (< 640px): Key metrics in justify-between cards */}
                  <div className="sm:hidden divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-xs">
                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans font-medium text-zinc-800 dark:text-zinc-200">
                          Phase II Written Papers
                        </span>
                        <span className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                          {meritSimulation.writtenTotal} /{' '}
                          {meritSimulation.writtenMax}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Main written papers (0% Stage I Carryover)
                      </p>
                    </div>

                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans font-medium text-zinc-800 dark:text-zinc-200">
                          Final Stage Assessment
                        </span>
                        <span className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                          {meritSimulation.phase3Total} /{' '}
                          {meritSimulation.phase3Max}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Computer
                        {labCadre === 'section-officer'
                          ? ', Group Test'
                          : ''}{' '}
                        &amp; Oral Interview
                      </p>
                    </div>

                    <div className="py-2.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans font-medium text-zinc-800 dark:text-zinc-200">
                          Standing Assessment
                        </span>
                        <span className="font-sans font-semibold text-xs text-zinc-900 dark:text-zinc-100 text-right">
                          {!meritSimulation.phase1Clears
                            ? 'Filtered at Phase I (<45%)'
                            : !meritSimulation.writtenAllPass
                              ? 'Below 40M Written Minimum'
                              : meritSimulation.finalMeritPct >= 66
                                ? 'Strong Merit Contender'
                                : meritSimulation.finalMeritPct >= 56
                                  ? 'Competitive Selection Zone'
                                  : 'Pass Zone — Raise Depth'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop / Tablet View (>= 640px): SharedTable */}
                  <div className="hidden sm:block">
                    <SharedTable
                      hideHeader
                      compact
                      hoverable={false}
                      caption="Merit simulation breakdown summary"
                      keyExtractor={(row) => row.id}
                      data={[
                        {
                          id: 'written-total',
                          label:
                            'Phase II Main Written Papers Total (0% Stage I Carryover)',
                          value: `${meritSimulation.writtenTotal} / ${meritSimulation.writtenMax}`,
                          isText: false,
                        },
                        {
                          id: 'final-stage',
                          label: `Final Stage Computer${
                            labCadre === 'section-officer' ? ', Group Test' : ''
                          } & Oral Interview`,
                          value: `${meritSimulation.phase3Total} / ${meritSimulation.phase3Max}`,
                          isText: false,
                        },
                        {
                          id: 'standing',
                          label: 'Competitive Standing Assessment',
                          value: !meritSimulation.phase1Clears
                            ? 'Filtered at Phase I (<45%)'
                            : !meritSimulation.writtenAllPass
                              ? 'Below 40M Written Paper Minimum'
                              : meritSimulation.finalMeritPct >= 66
                                ? 'Strong Merit List Contender'
                                : meritSimulation.finalMeritPct >= 56
                                  ? 'Competitive Selection Zone'
                                  : 'Pass Zone — Raise Written Depth',
                          isText: true,
                        },
                      ]}
                      columns={[
                        {
                          id: 'metric',
                          header: 'Metric',
                          className: 'font-sans text-zinc-600 dark:text-zinc-400',
                          render: (row) => row.label,
                        },
                        {
                          id: 'value',
                          header: 'Value',
                          align: 'right',
                          className:
                            'font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap',
                          render: (row) => (
                            <span
                              className={
                                row.isText ? 'font-sans' : 'font-mono tabular-nums'
                              }
                            >
                              {row.value}
                            </span>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Right Parameter Sliders Deck */}
              <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                  <h2 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    Simulation Parameters
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono tabular-nums">
                      <label
                        htmlFor="slider-confident"
                        className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        Confident Answers
                      </label>
                      <span>
                        {meritSimulation.safeConfident} /{' '}
                        {meritSimulation.totalQuestions} Qs
                      </span>
                    </div>
                    <input
                      id="slider-confident"
                      type="range"
                      min={0}
                      max={meritSimulation.totalQuestions}
                      value={meritSimulation.safeConfident}
                      onChange={(e) =>
                        setConfidentCount(Number(e.target.value))
                      }
                      className="w-full accent-crimson-700 dark:accent-crimson-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono tabular-nums">
                      <label
                        htmlFor="slider-educated"
                        className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        2-Option Elimination Guesses (50/50)
                      </label>
                      <span>{meritSimulation.safeEducated} Qs</span>
                    </div>
                    <input
                      id="slider-educated"
                      type="range"
                      min={0}
                      max={Math.max(
                        0,
                        meritSimulation.totalQuestions -
                          meritSimulation.safeConfident
                      )}
                      value={meritSimulation.safeEducated}
                      onChange={(e) =>
                        setEducatedGuesses(Number(e.target.value))
                      }
                      className="w-full accent-crimson-700 dark:accent-crimson-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono tabular-nums">
                      <label
                        htmlFor="slider-blind"
                        className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        Blind 4-Option Guesses (25%)
                      </label>
                      <span>
                        {meritSimulation.safeBlind} Qs (Blank:{' '}
                        {meritSimulation.skipped})
                      </span>
                    </div>
                    <input
                      id="slider-blind"
                      type="range"
                      min={0}
                      max={Math.max(
                        0,
                        meritSimulation.totalQuestions -
                          meritSimulation.safeConfident -
                          meritSimulation.safeEducated
                      )}
                      value={meritSimulation.safeBlind}
                      onChange={(e) => setBlindGuesses(Number(e.target.value))}
                      className="w-full accent-crimson-700 dark:accent-crimson-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono tabular-nums">
                        <label
                          htmlFor="slider-p2"
                          className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          Paper II Written Score
                        </label>
                        <span>{paper2Score} / 100 Marks</span>
                      </div>
                      <input
                        id="slider-p2"
                        type="range"
                        min={20}
                        max={85}
                        value={paper2Score}
                        onChange={(e) => setPaper2Score(Number(e.target.value))}
                        className="w-full accent-crimson-700 dark:accent-crimson-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-mono tabular-nums">
                        <label
                          htmlFor="slider-p3"
                          className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          Paper III Written Score
                        </label>
                        <span>{paper3Score} / 100 Marks</span>
                      </div>
                      <input
                        id="slider-p3"
                        type="range"
                        min={20}
                        max={85}
                        value={paper3Score}
                        onChange={(e) => setPaper3Score(Number(e.target.value))}
                        className="w-full accent-crimson-700 dark:accent-crimson-500"
                      />
                    </div>

                    {labCadre === 'section-officer' && (
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono tabular-nums">
                          <label
                            htmlFor="slider-p4"
                            className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                          >
                            Paper IV Service Delivery &amp; Case Score
                          </label>
                          <span>{paper4Score} / 100 Marks</span>
                        </div>
                        <input
                          id="slider-p4"
                          type="range"
                          min={20}
                          max={85}
                          value={paper4Score}
                          onChange={(e) =>
                            setPaper4Score(Number(e.target.value))
                          }
                          className="w-full accent-crimson-700 dark:accent-crimson-500"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex justify-between font-mono tabular-nums">
                        <label
                          htmlFor="slider-prac"
                          className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          IT / Computer Skill Test Score
                        </label>
                        <span>{practicalScore} / 10 Marks</span>
                      </div>
                      <input
                        id="slider-prac"
                        type="range"
                        min={4}
                        max={10}
                        value={practicalScore}
                        onChange={(e) =>
                          setPracticalScore(Number(e.target.value))
                        }
                        className="w-full accent-crimson-700 dark:accent-crimson-500"
                      />
                    </div>

                    {labCadre === 'section-officer' && (
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono tabular-nums">
                          <label
                            htmlFor="slider-group"
                            className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                          >
                            Group Test Score (Samuhik Parikshan)
                          </label>
                          <span>{groupTestScore} / 10 Marks</span>
                        </div>
                        <input
                          id="slider-group"
                          type="range"
                          min={4}
                          max={10}
                          value={groupTestScore}
                          onChange={(e) =>
                            setGroupTestScore(Number(e.target.value))
                          }
                          className="w-full accent-crimson-700 dark:accent-crimson-500"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex justify-between font-mono tabular-nums">
                        <label
                          htmlFor="slider-viva"
                          className="font-sans font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          Oral Interview Score
                        </label>
                        <span>
                          {meritSimulation.clampedInterview} /{' '}
                          {meritSimulation.interviewMax} Marks
                        </span>
                      </div>
                      <input
                        id="slider-viva"
                        type="range"
                        min={10}
                        max={meritSimulation.interviewMax}
                        value={meritSimulation.clampedInterview}
                        onChange={(e) =>
                          setInterviewScore(Number(e.target.value))
                        }
                        className="w-full accent-crimson-700 dark:accent-crimson-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
              </motion.div>
            </AnimatePresence>

          {/* Recent Simulation History Log */}
          {simulationHistory.length > 0 && (
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Recent Hall Simulation Sittings
                </h2>
                <button
                  type="button"
                  onClick={() => dispatch(clearSimulationHistory())}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Log</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                {simulationHistory.slice(0, 8).map((run) => (
                  <div
                    key={run.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {run.presetTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <span>
                          {run.simulationType === 'omr-hall'
                            ? `OMR Key ${run.bookletKey}`
                            : 'Written Hall'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Net {run.netMarks.toFixed(2)}/{run.fullMarks} (
                          {run.percentage}%)
                        </span>
                        {run.negativeDeduction > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-red-600 dark:text-red-400">
                              -{run.negativeDeduction.toFixed(2)}M penalty
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{formatCompactDuration(run.durationSeconds)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">
                          {formatRelativeDate(run.completedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`font-semibold font-mono tabular-nums whitespace-nowrap ${
                          run.passed
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {run.passed
                          ? `Qualified (>=${Math.round(
                              (run.passMarks / Math.max(1, run.fullMarks)) * 100
                            )}%)`
                          : `Below ${Math.round(
                              (run.passMarks / Math.max(1, run.fullMarks)) * 100
                            )}%`}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (run.simulationType === 'omr-hall') {
                            const validKey =
                              run.bookletKey === 'A' ||
                              run.bookletKey === 'B' ||
                              run.bookletKey === 'C' ||
                              run.bookletKey === 'D'
                                ? run.bookletKey
                                : 'A';
                            openOmrDialog(run.presetId, validKey);
                          } else {
                            openWrittenDialog(run.presetId);
                          }
                        }}
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        </main>

        <Footer />
      </PageTransition>

      {/* Responsive Modal Examination Hall Dialog */}
      <ExamSimulationDialog
        open={dialogSession.open}
        simulationType={dialogSession.type}
        omrPreset={selectedOmrPreset}
        writtenPreset={selectedWrittenPreset}
        rollNumber={rollNumber}
        bookletKey={bookletKey}
        onBookletKeyChange={setBookletKey}
        initialWrittenLang={writtenLang}
        onClose={closeSimulationDialog}
      />
    </div>
  );
}
