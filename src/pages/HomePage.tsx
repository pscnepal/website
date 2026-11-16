import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  FileText,
  Flame,
  LayoutDashboard,
  Moon,
  PenLine,
  Play,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ActionButton } from '../components/common/ActionButton';
import { SharedTable } from '../components/common/SharedTable';
import { PdfUpload } from '../components/home/PdfUpload';
import { PdfUrlInput } from '../components/home/PdfUrlInput';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import singhaDurbarImg from '../assets/images/nepal_singha_durbar_1793889770945.jpg';
import {
  ALL_SYLLABUS_UNITS,
  getCadreSyllabusById,
  getCadreUnitIds,
  PSC_CADRE_SYLLABI,
  type PscCadreId,
} from '../data/pscSyllabusData';
import type { QuizQuestion } from '../data/quizData';
import {
  MATERIAL_EVENTS,
  materialStorageService,
} from '../services/materialStorageService';
import type { WrittenQuestion } from '../data/writtenQuestionsData';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../services/questionStorageService';
import { setTargetCadre } from '../features/psc/pscSlice';
import {
  setReadingMode,
  setSoundEnabled,
} from '../features/reader/readerSlice';
import {
  setDefaultReadingMode,
  setDefaultSoundEnabled,
  setTheme,
} from '../features/settings/settingsSlice';
import { soundService } from '../services/soundService';
import { formatCompactDuration } from '../utils/pdfHelpers';
import { HimalayanLandscapeVector } from '../components/vectors/HimalayanLandscapeVector';
import {
  HOME_FAQ_HEADER,
  HOME_FAQS,
  HOME_HERO_CONTENT,
  HOME_HERITAGE_BANNER,
  HOME_PILLAR_ITEMS,
  HOME_PILLARS_HEADER,
  HOME_READER_SECTION_CONTENT,
  HOME_TRACKS_HEADER,
  PAIRED_STUDY_TRACKS,
} from '../data/homeContentData';
import { SITE_CONFIG } from '../data/siteConfig';

export function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme = useAppSelector((state) => state.settings.theme);
  const defaultReadingMode = useAppSelector(
    (state) => state.settings.defaultReadingMode
  );
  const { isDashboardAdmin } = useAuth();
  const soundEnabled = useAppSelector((state) => state.reader.soundEnabled);
  const recentBooks = useAppSelector((state) => state.library.recentBooks);
  const readingStats = useAppSelector((state) => state.library.readingStats);
  const attempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);
  const completedUnitIds = useAppSelector(
    (state) => state.psc.completedUnitIds
  );
  const simulationHistory = useAppSelector(
    (state) => state.psc.simulationHistory
  );

  const activeCadre = useMemo(
    () => getCadreSyllabusById(targetCadreId) ?? PSC_CADRE_SYLLABI[0],
    [targetCadreId]
  );

  const completedUnitSet = useMemo(
    () => new Set(completedUnitIds),
    [completedUnitIds]
  );

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    questionStorageService.loadQuizQuestions()
  );
  const [writtenQuestions, setWrittenQuestions] = useState<WrittenQuestion[]>(
    () => questionStorageService.loadWrittenQuestions()
  );
  const [totalCatalogCount, setTotalCatalogCount] = useState<number>(() =>
    materialStorageService.loadAllMaterialsFlat().length
  );

  useEffect(() => {
    const syncQuiz = () =>
      setQuizQuestions(questionStorageService.loadQuizQuestions());
    const syncWritten = () =>
      setWrittenQuestions(questionStorageService.loadWrittenQuestions());
    const syncMaterials = () =>
      setTotalCatalogCount(materialStorageService.loadAllMaterialsFlat().length);
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, syncQuiz);
    window.addEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, syncWritten);
    window.addEventListener(MATERIAL_EVENTS.CHANGED, syncMaterials);
    window.addEventListener('storage', syncQuiz);
    window.addEventListener('storage', syncWritten);
    window.addEventListener('storage', syncMaterials);
    return () => {
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, syncQuiz);
      window.removeEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, syncWritten);
      window.removeEventListener(MATERIAL_EVENTS.CHANGED, syncMaterials);
      window.removeEventListener('storage', syncQuiz);
      window.removeEventListener('storage', syncWritten);
      window.removeEventListener('storage', syncMaterials);
    };
  }, []);

  const hydratedDecks = useMemo(
    () => questionStorageService.hydrateQuizDecks(quizQuestions),
    [quizQuestions]
  );

  const totalQuizQuestions = quizQuestions.length;
  const totalWrittenQuestions = writtenQuestions.length;
  const totalSyllabusUnits = ALL_SYLLABUS_UNITS.length;

  const activeCadreUnitStats = useMemo(() => {
    const ids = getCadreUnitIds(activeCadre);
    const done = ids.filter((id) => completedUnitSet.has(id)).length;
    const pct = ids.length > 0 ? Math.round((done / ids.length) * 100) : 0;
    return { total: ids.length, done, pct };
  }, [activeCadre, completedUnitSet]);

  const liveSnapshot = useMemo(() => {
    const masteredSet = new Set<string>();
    let bestAcc = 0;
    let quizSeconds = 0;

    for (const att of attempts) {
      quizSeconds += att.durationSeconds;
      if (att.accuracyPercent > bestAcc) {
        bestAcc = att.accuracyPercent;
      }
      if (att.questionOutcomes) {
        for (const [qId, outcome] of Object.entries(att.questionOutcomes)) {
          if (outcome === 'correct') masteredSet.add(qId);
        }
      }
    }

    let readSeconds = 0;
    let pagesTurned = 0;
    for (const st of Object.values(readingStats)) {
      readSeconds += st.totalReadingSeconds;
      pagesTurned += st.pagesReadCount;
    }

    let writtenMasteredCount = 0;
    let writtenSeconds = 0;
    for (const rec of Object.values(writtenRecords)) {
      if (rec.status === 'mastered') writtenMasteredCount += 1;
      writtenSeconds += rec.timeSpentSeconds;
    }

    const latestUrlBook = recentBooks.find(
      (b) => b.sourceType === 'url' && b.url
    );

    return {
      hasActivity:
        recentBooks.length > 0 ||
        attempts.length > 0 ||
        Object.keys(writtenRecords).length > 0 ||
        completedUnitIds.length > 0 ||
        simulationHistory.length > 0,
      booksCount: recentBooks.length,
      pagesTurned,
      masteredCount: masteredSet.size,
      writtenMasteredCount,
      syllabusDoneCount: completedUnitIds.length,
      simulationCount: simulationHistory.length,
      attemptsCount: attempts.length,
      bestAcc,
      totalStudySeconds: readSeconds + quizSeconds + writtenSeconds,
      latestUrlBook,
    };
  }, [
    recentBooks,
    readingStats,
    attempts,
    writtenRecords,
    completedUnitIds,
    simulationHistory,
  ]);

  const handleSelectDefaultMode = (mode: 'flipbook' | 'standard') => {
    dispatch(setDefaultReadingMode(mode));
    dispatch(setReadingMode(mode));
  };

  const handleSelectSound = (enabled: boolean) => {
    dispatch(setDefaultSoundEnabled(enabled));
    dispatch(setSoundEnabled(enabled));
    if (enabled) {
      soundService.playPageTurn('full');
    }
  };

  const handleSelectCadre = (cadreId: PscCadreId) => {
    dispatch(setTargetCadre(cadreId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1 flex flex-col justify-between">
        {/* Hero & Target Post Command Section */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 space-y-10 overflow-hidden">
          {/* Ambient Topographic Himalayan Mountain Silhouette Vector */}
          <div className="absolute top-0 left-0 right-0 h-44 sm:h-56 pointer-events-none opacity-30 dark:opacity-15 text-zinc-900 dark:text-zinc-100 overflow-hidden -z-10">
            <HimalayanLandscapeVector variant="subtle" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Dominant Anchor */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    {SITE_CONFIG.brandName}
                  </span>{' '}
                  · {SITE_CONFIG.brandNepaliName} · {SITE_CONFIG.workspaceLabel}
                </p>

                <h1 className="font-serif text-fluid-display font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  {HOME_HERO_CONTENT.headline}
                </h1>

                <p className="text-fluid-lead text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  {HOME_HERO_CONTENT.lead}
                </p>
              </div>

              {/* Single Dominant Primary CTA + Secondary Syllabus Action */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to={`/simulate?preset=${encodeURIComponent(
                    activeCadre.defaultSimulationPreset
                  )}&launch=1`}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 shadow-2xs text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Play className="w-4 h-4" />
                  <span>
                    Simulate {activeCadre.shortTitle} Hall
                  </span>
                </Link>

                <Link
                  to={`/syllabus/${activeCadre.id}`}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-50/70 dark:hover:bg-blue-950/50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span>Explore {activeCadre.shortTitle} Syllabus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/current-affairs"
                  className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-sm font-medium text-amber-900 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{HOME_HERO_CONTENT.affairsButtonLabel}</span>
                </Link>

                {isDashboardAdmin && (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{HOME_HERO_CONTENT.dashboardButtonLabel}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Active Target Post Deck */}
            <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Target Examination Cadre
                  </p>
                  <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {activeCadreUnitStats.done}/{activeCadreUnitStats.total}{' '}
                    units ({activeCadreUnitStats.pct}%)
                  </span>
                </div>

                <div className="w-full h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-crimson-600 dark:bg-crimson-500 transition-transform duration-200 origin-left"
                    style={{
                      transform: `scaleX(${Math.max(0.04, activeCadreUnitStats.pct / 100)})`,
                    }}
                  />
                </div>

                {/* Cadre Switcher Buttons */}
                <div
                  role="group"
                  aria-label="Target PSC cadre"
                  className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs"
                >
                  {PSC_CADRE_SYLLABI.map((cadre) => {
                    const isSelected = cadre.id === activeCadre.id;
                    return (
                      <button
                        key={cadre.id}
                        type="button"
                        onClick={() => handleSelectCadre(cadre.id)}
                        aria-pressed={isSelected}
                        className={`py-2 px-2 rounded-md font-medium transition-colors whitespace-nowrap truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          isSelected
                            ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        {cadre.shortTitle}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1 space-y-1">
                  <h2 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    {activeCadre.title}
                  </h2>
                  <p
                    lang="ne"
                    className="text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    {activeCadre.nepaliTitle}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                {activeCadre.phases.map((phase) => (
                  <div
                    key={phase.id}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {phase.title}
                    </span>
                    <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap shrink-0">
                      {phase.papers.reduce((s, p) => s + p.fullMarks, 0)} Marks
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                <span>
                  Gate: {activeCadre.screeningPassPercent}% · -
                  {activeCadre.negativeMarkingPercent}% wrong MCQ
                </span>
                <Link
                  to="/simulate?mode=merit-lab"
                  className="font-sans font-medium text-crimson-700 dark:text-crimson-400 hover:underline whitespace-nowrap"
                >
                  Merit Calculator →
                </Link>
              </div>
            </div>
          </div>

          {/* Architectural Heritage & Civil Service Anchor Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white shadow-sm">
            <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden">
              <img
                src={singhaDurbarImg || HOME_HERITAGE_BANNER.fallbackImagePath}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    HOME_HERITAGE_BANNER.fallbackImagePath;
                }}
                alt={HOME_HERITAGE_BANNER.imageAlt}
                className="w-full h-full object-cover object-center filter brightness-[0.88] hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <span>{HOME_HERITAGE_BANNER.nepaliLocation}</span>
                    <span aria-hidden="true">·</span>
                    <span>{HOME_HERITAGE_BANNER.elevationLabel}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight">
                    {HOME_HERITAGE_BANNER.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {HOME_HERITAGE_BANNER.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/simulate?preset=${encodeURIComponent(
                      activeCadre.defaultSimulationPreset
                    )}&launch=1`}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{HOME_HERITAGE_BANNER.ctaLabel}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Live Study Continuation Banner (visible once user starts studying) */}
          {liveSnapshot.hasActivity && (
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Active PSC Preparation Snapshot
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono tabular-nums text-zinc-800 dark:text-zinc-200">
                  <span>
                    {liveSnapshot.syllabusDoneCount}/{totalSyllabusUnits}{' '}
                    syllabus units
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {liveSnapshot.masteredCount}/{totalQuizQuestions} MCQs
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {liveSnapshot.writtenMasteredCount}/{totalWrittenQuestions}{' '}
                    written
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{liveSnapshot.simulationCount} hall sittings</span>
                  {liveSnapshot.totalStudySeconds > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {formatCompactDuration(liveSnapshot.totalStudySeconds)}{' '}
                        logged
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {liveSnapshot.latestUrlBook && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/read?url=${encodeURIComponent(
                          liveSnapshot.latestUrlBook!.url
                        )}`,
                        { state: { from: '/', fromLabel: 'Back to PSC Hub' } }
                      )
                    }
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>
                      Resume PDF p.{liveSnapshot.latestUrlBook.lastPage}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                <Link
                  to="/progress"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Open Readiness Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 7-Pillar Central PSC Workspace Architecture */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {HOME_PILLARS_HEADER.title}
            </h2>
            <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
              {HOME_PILLARS_HEADER.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOME_PILLAR_ITEMS.map((pillar) => {
              const badgeById: Record<string, string> = {
                syllabus: `3 cadres · ${totalSyllabusUnits} units`,
                materials: `${totalCatalogCount} curated PDFs`,
                quiz: `${hydratedDecks.length} decks · ${totalQuizQuestions} MCQs`,
                written: `${totalWrittenQuestions} long Q&As · EN/नेपाली`,
                simulate: 'OMR Sheet · Written Hall · Merit Lab',
                progress: 'Mastery & study analytics',
                'current-affairs': '16th Plan, Budget 2081/82, Fast Track, COP29',
              };

              if (pillar.spanWide) {
                return (
                  <Link
                    key={pillar.id}
                    to={pillar.to}
                    className="group rounded-xl border border-amber-300 dark:border-amber-900/60 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-amber-500 dark:hover:border-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:col-span-2 lg:col-span-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {pillar.order}
                          </span>
                          <span aria-hidden="true">·</span>
                          {pillar.metaTag && (
                            <>
                              <span className="text-amber-700 dark:text-amber-300 font-medium">
                                {pillar.metaTag}
                              </span>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span>{badgeById[pillar.id]}</span>
                        </div>
                        <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                          <span>{pillar.title}</span>
                          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                        </h3>
                        <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400 max-w-3xl">
                          {pillar.description}
                        </p>
                      </div>
                      {pillar.ctaLabel && (
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
                            <span>{pillar.ctaLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={pillar.id}
                  to={pillar.to}
                  className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                        {pillar.order}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{badgeById[pillar.id]}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                      <span>{pillar.title}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </h3>
                    <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                      {pillar.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Active Target Cadre Paper-by-Paper Blueprint Table */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {activeCadre.shortTitle} Examination Blueprint
              </h2>
              <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
                Paper-by-paper examination scheme for {activeCadre.title}.
              </p>
            </div>
            <Link
              to={`/syllabus/${activeCadre.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open Full Unit Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            {/* Mobile Responsive View (< 768px): Stage/Paper + Marks top justify-between, Subject/Format, Duration & Action vertical */}
            <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
              {activeCadre.phases.flatMap((phase) =>
                phase.papers.map((paper) => {
                  const actionHref =
                    paper.examFormat === 'Objective MCQ (OMR)'
                      ? `/simulate?preset=${encodeURIComponent(
                          activeCadre.defaultSimulationPreset
                        )}&launch=1`
                      : paper.examFormat === 'Subjective Analytical & Case'
                        ? '/written'
                        : `/syllabus/${activeCadre.id}`;
                  const actionLabel =
                    paper.examFormat === 'Objective MCQ (OMR)'
                      ? 'Simulate OMR'
                      : paper.examFormat === 'Subjective Analytical & Case'
                        ? 'Practice Written'
                        : 'View Units';

                  return (
                    <div
                      key={`mob-${paper.id}`}
                      className="p-4 space-y-3 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Top: Stage / Paper + Full / Pass marks in justify-between */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                          Phase {phase.phaseNumber} · {paper.code}
                        </span>
                        <span className="font-mono tabular-nums text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {paper.fullMarks}M /{' '}
                          {paper.passMarks !== null
                            ? `${paper.passMarks}M`
                            : 'Merit'}
                        </span>
                      </div>

                      {/* Middle: Subject / Format */}
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                          {paper.title}{' '}
                          <span
                            lang="ne"
                            className="text-xs font-normal text-zinc-500 dark:text-zinc-400"
                          >
                            ({paper.nepaliTitle})
                          </span>
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {paper.examFormat} · {paper.questionBreakdown}
                        </p>
                      </div>

                      {/* Bottom: Duration and Action Vertically */}
                      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>Duration:</span>
                          <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                            {paper.durationLabel}
                          </span>
                        </div>
                        <div>
                          <ActionButton
                            to={actionHref}
                            title={`${actionLabel} for ${paper.title}`}
                            label={actionLabel}
                            color="blue"
                            variant="subtle"
                            size="md"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full justify-between"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop / Tablet View (>= 768px): SharedTable */}
            <div className="hidden md:block">
              <SharedTable
                className="border-0 rounded-none shadow-none"
                data={activeCadre.phases.flatMap((phase) =>
                  phase.papers.map((paper) => ({
                    phase,
                    paper,
                  }))
                )}
              keyExtractor={({ paper }) => paper.id}
              caption={`${activeCadre.title} exam syllabus and papers`}
              columns={[
                {
                  id: 'stagePaper',
                  header: 'Stage / Paper',
                  className: 'font-mono tabular-nums text-xs font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap',
                  render: ({ phase, paper }) =>
                    `Phase ${phase.phaseNumber} · ${paper.code}`,
                },
                {
                  id: 'subjectFormat',
                  header: 'Subject & Format',
                  render: ({ paper }) => (
                    <>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {paper.title}{' '}
                        <span
                          lang="ne"
                          className="text-xs font-normal text-zinc-500 dark:text-zinc-400"
                        >
                          ({paper.nepaliTitle})
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {paper.examFormat} · {paper.questionBreakdown}
                      </p>
                    </>
                  ),
                },
                {
                  id: 'marks',
                  header: 'Full / Pass',
                  align: 'right',
                  className: 'font-mono tabular-nums text-xs whitespace-nowrap',
                  render: ({ paper }) =>
                    `${paper.fullMarks}M / ${
                      paper.passMarks !== null ? `${paper.passMarks}M` : 'Merit'
                    }`,
                },
                {
                  id: 'duration',
                  header: 'Duration',
                  align: 'right',
                  className: 'font-mono tabular-nums text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap',
                  render: ({ paper }) => paper.durationLabel,
                },
                {
                  id: 'action',
                  header: 'Action',
                  align: 'right',
                  className: 'whitespace-nowrap',
                  render: ({ paper }) => {
                    const actionHref =
                      paper.examFormat === 'Objective MCQ (OMR)'
                        ? `/simulate?preset=${encodeURIComponent(
                            activeCadre.defaultSimulationPreset
                          )}&launch=1`
                        : paper.examFormat === 'Subjective Analytical & Case'
                          ? '/written'
                          : `/syllabus/${activeCadre.id}`;
                    const actionLabel =
                      paper.examFormat === 'Objective MCQ (OMR)'
                        ? 'Simulate OMR'
                        : paper.examFormat === 'Subjective Analytical & Case'
                          ? 'Practice Written'
                          : 'View Units';

                    return (
                      <ActionButton
                        to={actionHref}
                        title={`${actionLabel} for ${paper.title}`}
                        label={actionLabel}
                        color="blue"
                        variant="outline"
                        size="xs"
                        icon={ArrowRight}
                        iconPosition="right"
                      />
                    );
                  },
                },
              ]}
              />
            </div>
          </div>
        </section>

        {/* Integrated Read + Practice Study Tracks */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {HOME_TRACKS_HEADER.title}
              </h2>
              <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
                {HOME_TRACKS_HEADER.subtitle}
              </p>
            </div>
            <Link
              to={HOME_TRACKS_HEADER.ctaHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              <span>{HOME_TRACKS_HEADER.ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PAIRED_STUDY_TRACKS.map((track) => (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6"
              >
                <div>
                  <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {track.code}
                  </p>
                  <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-fluid-body text-zinc-600 dark:text-zinc-400">
                    {track.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-2">
                  <Link
                    to={track.readHref}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>{track.readLabel}</span>
                  </Link>

                  <Link
                    to={track.quizHref}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{track.quizLabel}</span>
                  </Link>

                  <Link
                    to={track.writtenHref}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <PenLine className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>{track.writtenLabel}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PDF Flipbook Reader Intake & Personal Shelf Section */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {HOME_READER_SECTION_CONTENT.title}
              </h2>
              <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
                {HOME_READER_SECTION_CONTENT.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
              <Link
                to="/library"
                className="text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                Personal Library ({recentBooks.length}) →
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <PdfUrlInput />
            <PdfUpload />
          </div>

          {/* Quiet Reading Preferences Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2.5">
              <span>Default view:</span>
              <div
                role="group"
                aria-label="Default reading mode"
                className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <button
                  type="button"
                  onClick={() => handleSelectDefaultMode('flipbook')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    defaultReadingMode === 'flipbook'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Flipbook</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDefaultMode('standard')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    defaultReadingMode === 'standard'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Standard PDF</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span>Page sound:</span>
              <div
                role="group"
                aria-label="Page-turn sound"
                className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <button
                  type="button"
                  onClick={() => handleSelectSound(true)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    soundEnabled
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>On</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSound(false)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    !soundEnabled
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Muted</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span>Appearance:</span>
              <div
                role="group"
                aria-label="Color theme"
                className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <button
                  type="button"
                  onClick={() => dispatch(setTheme('light'))}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    theme === 'light'
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setTheme('dark'))}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    theme === 'dark'
                      ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Semantic Lok Sewa Preparation FAQ Section (Aligned with FAQPage JSON-LD) */}
        <section
          aria-labelledby="psc-nepal-faq-heading"
          className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6"
        >
          <div className="max-w-2xl">
            <h2
              id="psc-nepal-faq-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              {HOME_FAQ_HEADER.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {HOME_FAQ_HEADER.subtitle}
            </p>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-sm">
            {HOME_FAQS.map((faq) => (
              <details key={faq.id} className="group py-4">
                <summary className="flex items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-100 list-none">
                  <span>{faq.question}</span>
                  <span className="font-mono text-xs text-zinc-400 group-open:rotate-45 transition-transform shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
                  {faq.getPlainAnswer({
                    totalSyllabusUnits,
                    totalWrittenQuestions,
                  })}
                </p>
              </details>
            ))}
          </div>
        </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
