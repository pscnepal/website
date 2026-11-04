import { useMemo } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  FileText,
  Moon,
  PenLine,
  Play,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { PdfUpload } from '../components/home/PdfUpload';
import { PdfUrlInput } from '../components/home/PdfUrlInput';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  ALL_SYLLABUS_UNITS,
  getCadreSyllabusById,
  getCadreUnitIds,
  PSC_CADRE_SYLLABI,
  type PscCadreId,
} from '../data/pscSyllabusData';
import { ALL_QUIZ_QUESTIONS, QUIZ_DECKS } from '../data/quizData';
import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import { WRITTEN_QUESTIONS } from '../data/writtenQuestionsData';
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

const PAIRED_STUDY_TRACKS = [
  {
    id: 'track-nepal',
    code: 'Track 01',
    title: 'Nepal Parichaya: Geography, History & Federalism',
    summary:
      'Study physical belts, river basins, dynasties, heritage, and federal inter-relations, then practice objective quizzes and bilingual written answers.',
    syllabusHref: '/syllabus/section-officer',
    readHref: '/materials/nepal-parichaya',
    readLabel: 'Read 4 Volumes',
    quizHref: '/quiz/nepal-parichaya',
    quizLabel: '20-Min Quiz',
    writtenHref: '/written/PSC-WR-202',
    writtenLabel: 'Written Q&A (EN/ने)',
  },
  {
    id: 'track-constitution',
    code: 'Track 02',
    title: 'Constitution (2072), Civil Service & Governance Acts',
    summary:
      'Review Fundamental Rights, Civil Service Act 2049, Right to Information, and Good Governance provisions alongside MCQs and 10-mark answers.',
    syllabusHref: '/syllabus/section-officer',
    readHref: '/materials/laws-and-acts',
    readLabel: 'Read 4 Statutes',
    quizHref: '/quiz/laws-and-constitution',
    quizLabel: '20-Min Quiz',
    writtenHref: '/written/PSC-WR-201',
    writtenLabel: 'Written Q&A (EN/ने)',
  },
  {
    id: 'track-psc-mock',
    code: 'Track 03',
    title: 'Official PSC Syllabi, Case Study & Hall Simulation',
    summary:
      'Inspect original Lok Sewa Aayog syllabus PDFs for Section Officer, Nayab Subba & Kharidar, sit a 30-question OMR screening hall exam, and solve Paper IV case studies.',
    syllabusHref: '/syllabus/section-officer',
    readHref: '/materials/official-psc-syllabi',
    readLabel: '6 Official PSC PDFs',
    quizHref: '/simulate?preset=so-phase1-omr&launch=1',
    quizLabel: 'OMR Hall Sim',
    writtenHref: '/written/PSC-WR-403',
    writtenLabel: 'Case Study (EN/ने)',
  },
  {
    id: 'track-plan-iq',
    code: 'Track 04',
    title: '16th Periodic Plan, Governance Statutes & Aptitude',
    summary:
      'Master FY 2081/82–2085/86 targets, Local Government Operation Act 2074, Anti-Corruption & Public Procurement laws, and quantitative IQ.',
    syllabusHref: '/syllabus/nayab-subba',
    readHref: '/materials/planning-and-governance-statutes',
    readLabel: 'Read Plan & Acts',
    quizHref: '/quiz/psc-and-planning',
    quizLabel: '20-Min Plan & IQ',
    writtenHref: '/written/PSC-WR-301',
    writtenLabel: '16th Plan Q&A',
  },
] as const;

export function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme = useAppSelector((state) => state.settings.theme);
  const defaultReadingMode = useAppSelector(
    (state) => state.settings.defaultReadingMode
  );
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

  const totalCatalogCount = READING_MATERIAL_CATEGORIES.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );
  const totalQuizQuestions = ALL_QUIZ_QUESTIONS.length;
  const totalWrittenQuestions = WRITTEN_QUESTIONS.length;
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
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Dominant Anchor */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    PSC Nepal
                  </span>{' '}
                  · लोक सेवा आयोग (Lok Sewa Aayog) · Unified Study &amp; Exam
                  Workspace
                </p>

                <h1 className="font-serif text-fluid-display font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  Your central command hub for Lok Sewa PSC preparation.
                </h1>

                <p className="text-fluid-lead text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Track official Section Officer, Nayab Subba, and Kharidar
                  syllabi unit by unit, read statutes in two-page flipbooks,
                  drill Paper I MCQs, write bilingual Papers II–IV answers
                  (English &amp; नेपाली), and sit timed OMR hall simulations
                  with -20% negative marking.
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

        {/* 6-Pillar Central PSC Workspace Architecture */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Six Integrated Preparation Pillars
            </h2>
            <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
              Every syllabus unit links directly to its reference statute PDF,
              objective question bank, bilingual written model answer, and timed
              simulation hall.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              to="/syllabus"
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    01
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>3 cadres · {totalSyllabusUnits} units</span>
                </div>
                <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                  <span>Official PSC Syllabus</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </h3>
                <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Inspect exact Stage I–III weightages and attached original
                  Lok Sewa Aayog PDFs for Section Officer, Nayab Subba, and
                  Kharidar.
                </p>
              </div>
            </Link>

            <Link
              to="/materials"
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    02
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{totalCatalogCount} curated PDFs</span>
                </div>
                <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                  <span>Study Books &amp; Statutes</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </h3>
                <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Read Official PSC Syllabi, Nepal Parichaya, Constitution
                  (2072), Civil Service, LGOA, Anti-Corruption, Procurement &amp;
                  16th Plan PDFs in two-page spreads.
                </p>
              </div>
            </Link>

            <Link
              to="/quiz"
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    03
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {QUIZ_DECKS.length} decks · {totalQuizQuestions} MCQs
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                  <span>Paper I Objective Quizzes</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </h3>
                <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Filter questions by subject, topic, subtopic, and difficulty
                  with instant study explanations or 1-min/question timers.
                </p>
              </div>
            </Link>

            <Link
              to="/written"
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    04
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{totalWrittenQuestions} long Q&amp;As · EN/नेपाली</span>
                </div>
                <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                  <span>Written Papers II–IV</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </h3>
                <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Master 5 &amp; 10-mark analytical questions and administrative
                  case studies in side-by-side English and नेपाली.
                </p>
              </div>
            </Link>

            <Link
              to="/simulate"
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    05
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>OMR Sheet · Written Hall · Merit Lab</span>
                </div>
                <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                  <span>Exam Hall Simulator</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </h3>
                <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Practice shading digital OMR bubbles under -20% negative
                  marking, sit timed subjective papers, and simulate merit math.
                </p>
              </div>
            </Link>

            <Link
              to="/progress"
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                  <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                    06
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Mastery &amp; study analytics</span>
                </div>
                <h3 className="mt-2 font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-2">
                  <span>Readiness &amp; Progress</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </h3>
                <p className="mt-1.5 text-fluid-body text-zinc-600 dark:text-zinc-400">
                  Audit syllabus unit completion, weak MCQ recovery sets,
                  written rubric progress, and cumulative study hours.
                </p>
              </div>
            </Link>
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

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                  <th className="py-3.5 px-4 font-medium">Stage / Paper</th>
                  <th className="py-3.5 px-4 font-medium">Subject &amp; Format</th>
                  <th className="py-3.5 px-4 font-medium text-right">
                    Full / Pass
                  </th>
                  <th className="py-3.5 px-4 font-medium text-right">
                    Duration
                  </th>
                  <th className="py-3.5 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
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
                      <tr
                        key={paper.id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono tabular-nums text-xs font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          Phase {phase.phaseNumber} · {paper.code}
                        </td>
                        <td className="py-3.5 px-4">
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
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs whitespace-nowrap">
                          {paper.fullMarks}M /{' '}
                          {paper.passMarks !== null
                            ? `${paper.passMarks}M`
                            : 'Merit'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                          {paper.durationLabel}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            to={actionHref}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline"
                          >
                            <span>{actionLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Integrated Read + Practice Study Tracks */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Integrated Read, Quiz &amp; Written Study Tracks
              </h2>
              <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
                Move directly from primary reference PDFs into timed objective
                mocks and bilingual long-answer practice.
              </p>
            </div>
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              <span>View Curriculum Checklist</span>
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
                Open Any Custom PDF Handout or Gazette
              </h2>
              <p className="mt-1 text-fluid-body text-zinc-600 dark:text-zinc-400">
                Load any external PDF URL or drop your own local Lok Sewa notes
                directly into the two-page flipbook reader.
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
              PSC Nepal &amp; Lok Sewa Exam Rules Reference
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Essential rules and platform coverage for Nepal Public Service
              Commission (लोक सेवा आयोग) candidates.
            </p>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-sm">
            <details className="group py-4">
              <summary className="flex items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-100 list-none">
                <span>
                  Which Nepal Lok Sewa Aayog syllabi are covered on PSC Nepal?
                </span>
                <span className="font-mono text-xs text-zinc-400 group-open:rotate-45 transition-transform shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
                PSC Nepal covers the official Public Service Commission (Lok
                Sewa Aayog) non-technical curricula for Gazetted Class III{' '}
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">
                  Section Officer
                </strong>
                , Non-Gazetted Class I{' '}
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">
                  Nayab Subba
                </strong>
                , and Non-Gazetted Class II{' '}
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">
                  Kharidar
                </strong>{' '}
                across {totalSyllabusUnits} structured syllabus units with
                chapter-level topic briefs and attached original PSC PDFs.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-100 list-none">
                <span>
                  How are Lok Sewa Paper I objective mock exams scored on PSC
                  Nepal?
                </span>
                <span className="font-mono text-xs text-zinc-400 group-open:rotate-45 transition-transform shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
                Objective OMR simulations enforce official Nepal PSC examination
                rules: a strict reverse countdown timer,{' '}
                <span className="font-mono tabular-nums">-20%</span> negative
                marking deducted per wrong response, and a{' '}
                <span className="font-mono tabular-nums">45%</span> qualifying
                pass threshold in Stage I screening (with Stage I marks treated
                as screening-only where prescribed by the unified scheme).
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-100 list-none">
                <span>
                  Are written exam model answers available in both English and
                  Nepali?
                </span>
                <span className="font-mono text-xs text-zinc-400 group-open:rotate-45 transition-transform shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
                Yes. PSC Nepal provides {totalWrittenQuestions} structured{' '}
                <span className="font-mono tabular-nums">5-mark</span> and{' '}
                <span className="font-mono tabular-nums">10-mark</span> written
                Papers II–IV questions with side-by-side English and नेपाली
                introductions, analytical bullet points, statutory citations,
                and way-forward conclusions.
              </p>
            </details>
          </div>
        </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
