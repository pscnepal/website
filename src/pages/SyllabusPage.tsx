import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  PenLine,
  Play,
  RotateCcw,
  Search,
  Target,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { AssessmentFormatNav } from '../components/quiz/AssessmentFormatNav';
import {
  getActivePhasePapers,
  getCadreSyllabusById,
  getCadreSyllabusStats,
  getCadreUnitIds,
  getChapterTopicIds,
  getPaperTopicIds,
  getUnitTopicIds,
  PSC_CADRE_SYLLABI,
  type PscCadreId,
  type PscSyllabusChapter,
  type PscSyllabusPaper,
  type PscSyllabusTopic,
  type PscSyllabusUnit,
} from '../data/pscSyllabusData';
import {
  setPaperUnitsCompleted,
  setSyllabusTopicsCompleted,
  setTargetCadre,
  toggleSyllabusTopicCompleted,
  toggleSyllabusUnitBookmarked,
  toggleSyllabusUnitCompleted,
} from '../features/psc/pscSlice';
import { resolveSampleUrl } from '../utils/urlHelpers';

type PhaseFilter = 'all' | '1' | '2' | '3';
type UnitStatusFilter = 'all' | 'remaining' | 'completed' | 'bookmarked';
type DetailMode = 'detailed' | 'compact';

function topicMatchesQuery(topic: PscSyllabusTopic, q: string): boolean {
  if (
    topic.code.toLowerCase().includes(q) ||
    topic.topic.toLowerCase().includes(q) ||
    (topic.nepaliTopic?.toLowerCase().includes(q) ?? false) ||
    topic.brief.toLowerCase().includes(q)
  ) {
    return true;
  }
  return (
    topic.subtopics?.some(
      (sub) =>
        sub.code.toLowerCase().includes(q) ||
        sub.subtopic.toLowerCase().includes(q) ||
        (sub.nepaliSubtopic?.toLowerCase().includes(q) ?? false) ||
        sub.brief.toLowerCase().includes(q)
    ) ?? false
  );
}

export function SyllabusPage() {
  const { cadreId: routeCadreId } = useParams<{ cadreId?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);
  const completedUnitIds = useAppSelector(
    (state) => state.psc.completedUnitIds
  );
  const completedTopicIds = useAppSelector(
    (state) => state.psc.completedTopicIds
  );
  const bookmarkedUnitIds = useAppSelector(
    (state) => state.psc.bookmarkedUnitIds
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const [statusFilter, setStatusFilter] = useState<UnitStatusFilter>('all');
  const [detailMode, setDetailMode] = useState<DetailMode>('detailed');
  const [selectedStreamByPhase, setSelectedStreamByPhase] = useState<
    Record<string, string>
  >({});
  const [collapsedChapterIds, setCollapsedChapterIds] = useState<
    Record<string, boolean>
  >({});
  const [expandedCompactTopicIds, setExpandedCompactTopicIds] = useState<
    Record<string, boolean>
  >({});

  const activeCadre = useMemo(() => {
    if (routeCadreId) {
      return getCadreSyllabusById(routeCadreId) ?? PSC_CADRE_SYLLABI[0];
    }
    return getCadreSyllabusById(targetCadreId) ?? PSC_CADRE_SYLLABI[0];
  }, [routeCadreId, targetCadreId]);

  const completedUnitSet = useMemo(
    () => new Set(completedUnitIds),
    [completedUnitIds]
  );
  const completedTopicSet = useMemo(
    () => new Set(completedTopicIds),
    [completedTopicIds]
  );
  const bookmarkedSet = useMemo(
    () => new Set(bookmarkedUnitIds),
    [bookmarkedUnitIds]
  );

  const syllabusStats = useMemo(
    () => getCadreSyllabusStats(activeCadre, selectedStreamByPhase),
    [activeCadre, selectedStreamByPhase]
  );

  const cadreProgress = useMemo(() => {
    const activeUnits: PscSyllabusUnit[] = activeCadre.phases.flatMap((phase) =>
      getActivePhasePapers(phase, selectedStreamByPhase[phase.id]).flatMap(
        (p) => p.units
      )
    );
    const activeUnitIds = activeUnits.map((u) => u.id);
    const completedUnitsCount = activeUnitIds.filter((id) =>
      completedUnitSet.has(id)
    ).length;
    const bookmarkedCount = activeUnitIds.filter((id) =>
      bookmarkedSet.has(id)
    ).length;

    const completedTopicsCount = syllabusStats.topicIds.filter((id) =>
      completedTopicSet.has(id)
    ).length;

    const topicPct =
      syllabusStats.topicIds.length > 0
        ? Math.round(
            (completedTopicsCount / syllabusStats.topicIds.length) * 100
          )
        : 0;
    const unitPct =
      activeUnitIds.length > 0
        ? Math.round((completedUnitsCount / activeUnitIds.length) * 100)
        : 0;

    let meritMarks = 0;
    let totalPapers = 0;
    for (const phase of activeCadre.phases) {
      const papers = getActivePhasePapers(
        phase,
        selectedStreamByPhase[phase.id]
      );
      for (const paper of papers) {
        totalPapers += 1;
        if (paper.countsTowardFinalMerit) {
          meritMarks += paper.fullMarks;
        }
      }
      // Foreign Service carries 50M Viva (+10M over standard 40M Viva in Final Stage)
      if (
        activeCadre.id === 'section-officer' &&
        phase.phaseNumber === 3 &&
        selectedStreamByPhase['so-phase-2'] === 'so-stream-foreign'
      ) {
        meritMarks += 10;
      }
    }

    return {
      totalUnits: activeUnitIds.length,
      completedUnitsCount,
      bookmarkedCount,
      unitPct,
      totalTopics: syllabusStats.totalTopics,
      completedTopicsCount,
      topicPct,
      meritMarks,
      totalPapers,
    };
  }, [
    activeCadre,
    selectedStreamByPhase,
    completedUnitSet,
    completedTopicSet,
    bookmarkedSet,
    syllabusStats,
  ]);

  const allActiveChapterIds = useMemo(() => {
    return activeCadre.phases.flatMap((phase) =>
      getActivePhasePapers(phase, selectedStreamByPhase[phase.id]).flatMap(
        (paper) =>
          paper.units.flatMap((unit) => unit.chapters.map((ch) => ch.id))
      )
    );
  }, [activeCadre, selectedStreamByPhase]);

  const filteredPhases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return activeCadre.phases
      .filter((phase) => {
        if (
          phaseFilter !== 'all' &&
          String(phase.phaseNumber) !== phaseFilter
        ) {
          return false;
        }
        return true;
      })
      .map((phase) => {
        const activePapers = getActivePhasePapers(
          phase,
          selectedStreamByPhase[phase.id]
        );

        const papers = activePapers
          .map((paper) => {
            const paperSelfMatches =
              q.length > 0 &&
              (paper.code.toLowerCase().includes(q) ||
                paper.title.toLowerCase().includes(q) ||
                paper.nepaliTitle.toLowerCase().includes(q));

            const units = paper.units
              .map((unit) => {
                const isDone = completedUnitSet.has(unit.id);
                const isPinned = bookmarkedSet.has(unit.id);

                if (statusFilter === 'completed' && !isDone) return null;
                if (statusFilter === 'remaining' && isDone) return null;
                if (statusFilter === 'bookmarked' && !isPinned) return null;

                if (!q || paperSelfMatches) {
                  return unit;
                }

                const unitSelfMatches =
                  unit.unitCode.toLowerCase().includes(q) ||
                  unit.title.toLowerCase().includes(q) ||
                  unit.nepaliTitle.toLowerCase().includes(q) ||
                  unit.keyReferences.toLowerCase().includes(q) ||
                  (unit.branchSummary?.toLowerCase().includes(q) ?? false) ||
                  unit.subtopics.some((sub) => sub.toLowerCase().includes(q));

                const filteredChapters = unit.chapters
                  .map((ch) => {
                    const chSelfMatches =
                      ch.code.toLowerCase().includes(q) ||
                      ch.chapterName.toLowerCase().includes(q) ||
                      (ch.nepaliChapterName?.toLowerCase().includes(q) ??
                        false) ||
                      (ch.chapterBrief?.toLowerCase().includes(q) ?? false);

                    if (unitSelfMatches || chSelfMatches) {
                      return ch;
                    }

                    const matchingTopics = ch.topics.filter((t) =>
                      topicMatchesQuery(t, q)
                    );
                    if (matchingTopics.length === 0) return null;

                    return {
                      ...ch,
                      topics: matchingTopics,
                    };
                  })
                  .filter((ch): ch is PscSyllabusChapter => ch !== null);

                if (!unitSelfMatches && filteredChapters.length === 0) {
                  return null;
                }

                return {
                  ...unit,
                  chapters:
                    filteredChapters.length > 0
                      ? filteredChapters
                      : unit.chapters,
                };
              })
              .filter((u): u is PscSyllabusUnit => u !== null);

            return {
              ...paper,
              units,
            };
          })
          .filter((paper) => paper.units.length > 0);

        return {
          ...phase,
          activePapers: papers,
        };
      })
      .filter(
        (phase) =>
          phase.activePapers.length > 0 ||
          (phase.serviceStreams &&
            phase.serviceStreams.length > 0 &&
            !searchQuery.trim() &&
            statusFilter === 'all')
      );
  }, [
    activeCadre,
    phaseFilter,
    statusFilter,
    searchQuery,
    selectedStreamByPhase,
    completedUnitSet,
    bookmarkedSet,
  ]);

  const visibleUnitCount = useMemo(
    () =>
      filteredPhases.reduce(
        (sum, phase) =>
          sum +
          phase.activePapers.reduce((pSum, p) => pSum + p.units.length, 0),
        0
      ),
    [filteredPhases]
  );

  const visibleTopicCount = useMemo(
    () =>
      filteredPhases.reduce(
        (sum, phase) =>
          sum +
          phase.activePapers.reduce(
            (pSum, p) =>
              pSum +
              p.units.reduce(
                (uSum, u) =>
                  uSum +
                  u.chapters.reduce((cSum, ch) => cSum + ch.topics.length, 0),
                0
              ),
            0
          ),
        0
      ),
    [filteredPhases]
  );

  const hasFilters =
    searchQuery.trim().length > 0 ||
    phaseFilter !== 'all' ||
    statusFilter !== 'all';

  const anyChapterCollapsed = useMemo(
    () => allActiveChapterIds.some((id) => Boolean(collapsedChapterIds[id])),
    [allActiveChapterIds, collapsedChapterIds]
  );

  const handleSelectCadre = (nextId: PscCadreId) => {
    navigate(`/syllabus/${nextId}`);
  };

  const handleSetTargetCadre = (cadreId: PscCadreId) => {
    dispatch(setTargetCadre(cadreId));
  };

  const handleOpenPdf = (path: string, backLabel: string) => {
    const fullUrl = resolveSampleUrl(path);
    navigate(`/read?url=${encodeURIComponent(fullUrl)}`, {
      state: {
        from: `/syllabus/${activeCadre.id}`,
        fromLabel: `Back to ${backLabel}`,
      },
    });
  };

  const handleToggleWholePaper = (paper: PscSyllabusPaper) => {
    const unitIds = paper.units.map((u) => u.id);
    const topicIds = getPaperTopicIds(paper);
    const allDone = unitIds.every((id) => completedUnitSet.has(id));
    dispatch(setPaperUnitsCompleted({ unitIds, completed: !allDone }));
    if (topicIds.length > 0) {
      dispatch(setSyllabusTopicsCompleted({ topicIds, completed: !allDone }));
    }
  };

  const handleToggleUnit = (unit: PscSyllabusUnit) => {
    const isCompleted = completedUnitSet.has(unit.id);
    const topicIds = getUnitTopicIds(unit);
    dispatch(toggleSyllabusUnitCompleted(unit.id));
    if (topicIds.length > 0) {
      dispatch(
        setSyllabusTopicsCompleted({ topicIds, completed: !isCompleted })
      );
    }
  };

  const handleToggleWholeChapter = (chapter: PscSyllabusChapter) => {
    const topicIds = getChapterTopicIds(chapter);
    if (topicIds.length === 0) return;
    const allDone = topicIds.every((id) => completedTopicSet.has(id));
    dispatch(setSyllabusTopicsCompleted({ topicIds, completed: !allDone }));
  };

  const handleToggleChapterCollapse = (chapterId: string) => {
    setCollapsedChapterIds((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleExpandOrCollapseAllChapters = () => {
    if (anyChapterCollapsed) {
      setCollapsedChapterIds({});
    } else {
      const next: Record<string, boolean> = {};
      for (const id of allActiveChapterIds) {
        next[id] = true;
      }
      setCollapsedChapterIds(next);
    }
  };

  const handleToggleCompactTopic = (topicId: string) => {
    setExpandedCompactTopicIds((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPhaseFilter('all');
    setStatusFilter('all');
  };

  const isTargetCadre = targetCadreId === activeCadre.id;
  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
          {/* Breadcrumb & Unified PSC Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link
                to="/"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                PSC Hub
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                Syllabus Explorer
              </span>
              <span aria-hidden="true">/</span>
              <span>{activeCadre.shortTitle}</span>
            </div>

            <AssessmentFormatNav active="syllabus" />
          </div>

          {/* Hero & Cadre Selector */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-2.5">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activeCadre.rankClassification} · {activeCadre.serviceScope}{' '}
                  · {activeCadre.effectiveFromBs}
                </p>
                <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  {activeCadre.title} Curriculum
                </h1>
                <p
                  lang="ne"
                  className="text-fluid-body font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {activeCadre.nepaliTitle}
                </p>
                <p className="text-fluid-body text-zinc-600 dark:text-zinc-400">
                  {activeCadre.eligibilitySummary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSetTargetCadre(activeCadre.id)}
                  aria-pressed={isTargetCadre}
                  className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isTargetCadre
                      ? 'bg-blue-700 text-white dark:bg-blue-600 dark:text-white'
                      : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {isTargetCadre ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Target Post</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-3.5 h-3.5" />
                      <span>Set as Target Post</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenPdf(
                      activeCadre.syllabusPdfPath,
                      `${activeCadre.shortTitle} Syllabus`
                    )
                  }
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Official PSC PDF</span>
                </button>

                <Link
                  to={`/simulate?preset=${encodeURIComponent(
                    activeCadre.defaultSimulationPreset
                  )}&launch=1`}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Phase I Hall</span>
                </Link>
              </div>
            </div>

            {/* Cadre Rank Switcher Tabs */}
            <div
              role="tablist"
              aria-label="Select PSC examination cadre"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
            >
              {PSC_CADRE_SYLLABI.map((cadre) => {
                const isSelected = cadre.id === activeCadre.id;
                const cUnitIds = getCadreUnitIds(cadre);
                const cStats = getCadreSyllabusStats(cadre);
                const cDone = cUnitIds.filter((id) =>
                  completedUnitSet.has(id)
                ).length;
                const cPct =
                  cUnitIds.length > 0
                    ? Math.round((cDone / cUnitIds.length) * 100)
                    : 0;

                return (
                  <button
                    key={cadre.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCadre(cadre.id)}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-900 border-crimson-700 dark:border-crimson-500 ring-1 ring-crimson-700/15 dark:ring-crimson-500/20 shadow-xs'
                        : 'bg-white/60 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 whitespace-nowrap">
                        {cadre.shortTitle}
                      </span>
                      <span className="font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {cDone}/{cUnitIds.length} ({cPct}%)
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {cadre.rankClassification} ·{' '}
                      <span className="font-mono tabular-nums">
                        {cStats.totalChapters} ch · {cStats.totalTopics} topics
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCadre.id}
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
              className="space-y-10"
            >
              {/* Unboxed Quantitative Blueprint & Topic Coverage Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 py-6 border-y border-zinc-200/80 dark:border-zinc-800/80">
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Topics & Units Covered
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {cadreProgress.completedTopicsCount}
                <span className="text-xs sm:text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  /{cadreProgress.totalTopics}
                </span>
              </p>
              <div className="w-full max-w-[190px] h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400 transition-transform duration-200 origin-left"
                  style={{
                    transform: `scaleX(${
                      Math.max(cadreProgress.topicPct, cadreProgress.unitPct) /
                      100
                    })`,
                  }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {cadreProgress.completedUnitsCount}/{cadreProgress.totalUnits}{' '}
                sections · {cadreProgress.bookmarkedCount} pinned
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official Syllabus Granularity
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {syllabusStats.totalChapters}
                <span className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
                  {' '}
                  Chapters
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                {syllabusStats.totalTopics} topics
                {syllabusStats.totalSubtopics > 0
                  ? ` · ${syllabusStats.totalSubtopics} subtopics`
                  : ''}{' '}
                with briefs
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Phase I Screening Gate
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {activeCadre.screeningPassPercent}%
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                -{activeCadre.negativeMarkingPercent}% penalty per wrong MCQ
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Final Merit Aggregate
              </p>
              <p className="font-mono tabular-nums text-fluid-kpi font-semibold text-zinc-950 dark:text-zinc-50">
                {cadreProgress.meritMarks}
                <span className="text-sm font-sans font-normal text-zinc-500 dark:text-zinc-400">
                  {' '}
                  Marks
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                Across {cadreProgress.totalPapers} active stages/papers
              </p>
            </div>
          </div>

          {/* Official Lok Sewa Aayog Original Syllabus PDFs */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Official Lok Sewa Aayog Original Syllabus PDFs
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Authentic curriculum gazettes published by the Public Service
                  Commission of Nepal (<span className="font-mono">psc.gov.np</span>
                  )—open directly in the Flipbook reader or download the original
                  Nepali PDFs.
                </p>
              </div>
              <Link
                to="/materials/official-psc-syllabi"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>All 6 Official PSC PDFs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCadre.officialPscPdfs.map((pdf) => {
                const resolvedPdfUrl = resolveSampleUrl(pdf.localPdfPath);
                return (
                  <div
                    key={pdf.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {pdf.phaseLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Approved {pdf.approvedDateBs}</span>
                      </div>
                      <h3 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                        {pdf.title}
                      </h3>
                      <p
                        lang="ne"
                        className="text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        {pdf.nepaliTitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenPdf(
                            pdf.localPdfPath,
                            `${activeCadre.shortTitle} Syllabus`
                          )
                        }
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read in Flipbook</span>
                      </button>

                      <a
                        href={resolvedPdfUrl}
                        download
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                        <span>Download PDF</span>
                      </a>

                      <a
                        href={pdf.officialPscUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <span>psc.gov.np</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Merit Calculation Note & Official Lok Sewa Directives */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-4">
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="font-semibold text-zinc-950 dark:text-zinc-100">
                  Official Merit Rule:{' '}
                </span>
                {activeCadre.meritCalculationNote}
              </div>
              <Link
                to="/simulate?mode=merit-lab"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Open Merit Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeCadre.generalExamRules.length > 0 && (
              <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Mandatory Lok Sewa Aayog Examination Directives (द्रष्टव्य):
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-4 marker:text-zinc-400">
                  {activeCadre.generalExamRules.map((rule) => (
                    <li key={rule} className="leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Search, View Mode & Interactive Filters */}
          <div className="space-y-3">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters, topic codes (1.1, 2.3.1), Acts, briefs, or नेपाली..."
                  aria-label="Search syllabus chapters, topics, subtopics, and explanations"
                  className="w-full h-10 pl-10 pr-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear syllabus search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Phase Segmented Filter */}
                <div
                  role="group"
                  aria-label="Filter by examination phase"
                  className="max-w-full overflow-x-auto inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  {(
                    [
                      { id: 'all', label: 'All Phases' },
                      { id: '1', label: 'Phase I' },
                      { id: '2', label: 'Phase II' },
                      { id: '3', label: 'Phase III' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPhaseFilter(opt.id)}
                      className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        phaseFilter === opt.id
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Unit Completion Filter */}
                <div
                  role="group"
                  aria-label="Filter by completion status"
                  className="max-w-full overflow-x-auto inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'remaining', label: 'Remaining' },
                      { id: 'completed', label: 'Completed' },
                      { id: 'bookmarked', label: 'Pinned' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStatusFilter(opt.id)}
                      className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        statusFilter === opt.id
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Brief Detail Toggle */}
                <div
                  role="group"
                  aria-label="Select topic explanation display density"
                  className="max-w-full overflow-x-auto inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  {(
                    [
                      { id: 'detailed', label: 'Detailed Briefs' },
                      { id: 'compact', label: 'Compact Outline' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDetailMode(opt.id)}
                      className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        detailMode === opt.id
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleExpandOrCollapseAllChapters}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>
                    {anyChapterCollapsed
                      ? 'Expand Chapters'
                      : 'Collapse Chapters'}
                  </span>
                </button>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {isSearchActive && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                Showing {visibleTopicCount} matching topic
                {visibleTopicCount === 1 ? '' : 's'} across {visibleUnitCount}{' '}
                section{visibleUnitCount === 1 ? '' : 's'} for “
                {searchQuery.trim()}”
              </p>
            )}
          </div>

          {/* Phase & Paper Curriculum Breakdown */}
          {visibleUnitCount === 0 ? (
            <div className="py-16 px-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white/50 dark:bg-zinc-900/40">
              <p className="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                No syllabus topics match your current filter
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Try clearing the search query or switching back to all phases
                and statuses to view the full {activeCadre.shortTitle}{' '}
                curriculum.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All Syllabus Topics</span>
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredPhases.map((phase) => {
                const activeStream =
                  phase.serviceStreams && phase.serviceStreams.length > 0
                    ? (phase.serviceStreams.find(
                        (s) => s.id === selectedStreamByPhase[phase.id]
                      ) ?? phase.serviceStreams[0])
                    : undefined;

                return (
                  <div key={phase.id} className="space-y-6">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                            {phase.title}
                          </h2>
                          <span
                            lang="ne"
                            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                          >
                            {phase.nepaliTitle}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
                          {phase.summary}
                        </p>
                      </div>

                      {phase.officialPdfPath && (
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenPdf(
                                phase.officialPdfPath!,
                                `${activeCadre.shortTitle} Syllabus`
                              )
                            }
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                            <span>Official Stage PDF</span>
                          </button>
                          <a
                            href={resolveSampleUrl(phase.officialPdfPath)}
                            download
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                            <span>Download</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Stage II Service-Group Stream Switcher */}
                    {phase.serviceStreams &&
                      phase.serviceStreams.length > 1 &&
                      activeStream && (
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                              Select Target Service / Group Stream (सेवा–समूह
                              छनोट गर्नुहोस्):
                            </p>
                            {activeStream.meritNote && (
                              <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                                {activeStream.meritNote}
                              </p>
                            )}
                          </div>

                          <div
                            role="tablist"
                            aria-label="Select Stage II service group stream"
                            className="flex flex-wrap items-center gap-2"
                          >
                            {phase.serviceStreams.map((stream) => {
                              const isStreamSelected =
                                stream.id === activeStream.id;
                              return (
                                <button
                                  key={stream.id}
                                  type="button"
                                  role="tab"
                                  aria-selected={isStreamSelected}
                                  onClick={() =>
                                    setSelectedStreamByPhase((prev) => ({
                                      ...prev,
                                      [phase.id]: stream.id,
                                    }))
                                  }
                                  className={`h-9 px-3.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                    isStreamSelected
                                      ? 'bg-blue-700 border-blue-700 text-white dark:bg-blue-600 dark:border-blue-500 dark:text-white'
                                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                                  }`}
                                >
                                  {stream.shortLabel}
                                </button>
                              );
                            })}
                          </div>

                          <div className="pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              {activeStream.serviceName}
                            </span>{' '}
                            <span lang="ne">
                              ({activeStream.nepaliServiceName})
                            </span>
                          </div>
                        </div>
                      )}

                    <div className="space-y-8">
                      {phase.activePapers.map((paper) => {
                        const paperUnitIds = paper.units.map((u) => u.id);
                        const paperTopicIds = getPaperTopicIds(paper);
                        const paperDoneCount = paperUnitIds.filter((id) =>
                          completedUnitSet.has(id)
                        ).length;
                        const paperTopicsDoneCount = paperTopicIds.filter(
                          (id) => completedTopicSet.has(id)
                        ).length;
                        const allPaperUnitsDone =
                          paperUnitIds.length > 0 &&
                          paperDoneCount === paperUnitIds.length;

                        return (
                          <div
                            key={paper.id}
                            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                          >
                            {/* Paper Header */}
                            <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    {paper.code}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-sans">
                                    {paper.examFormat}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>Full Marks: {paper.fullMarks}</span>
                                  {paper.passMarks !== null && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span>Pass Marks: {paper.passMarks}</span>
                                    </>
                                  )}
                                  <span aria-hidden="true">·</span>
                                  <span>{paper.durationLabel}</span>
                                </div>

                                <h3 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                                  {paper.title}{' '}
                                  <span
                                    lang="ne"
                                    className="font-sans text-xs sm:text-sm font-normal text-zinc-600 dark:text-zinc-400"
                                  >
                                    ({paper.nepaliTitle})
                                  </span>
                                </h3>

                                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                  {paper.questionBreakdown} ·{' '}
                                  {paper.scoringRule}
                                </p>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0">
                                <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                  {paperTopicsDoneCount}/{paperTopicIds.length}{' '}
                                  topics · {paperDoneCount}/
                                  {paper.units.length} sections
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleWholePaper(paper)}
                                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>
                                    {allPaperUnitsDone
                                      ? 'Unmark Paper'
                                      : 'Mark Paper Covered'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Paper Units / Branches List */}
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                              {paper.units.map((unit) => {
                                const isCompleted = completedUnitSet.has(
                                  unit.id
                                );
                                const isBookmarked = bookmarkedSet.has(unit.id);
                                const unitTopicIds = getUnitTopicIds(unit);
                                const unitTopicsDone = unitTopicIds.filter(
                                  (id) => completedTopicSet.has(id)
                                ).length;

                                return (
                                  <div
                                    key={unit.id}
                                    className={`p-4 sm:p-6 space-y-5 transition-colors ${
                                      isCompleted
                                        ? 'bg-emerald-50/25 dark:bg-emerald-950/10'
                                        : ''
                                    }`}
                                  >
                                    {/* Unit / Branch Header Row */}
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleUnit(unit)}
                                          aria-pressed={isCompleted}
                                          aria-label={
                                            isCompleted
                                              ? `Mark ${unit.title} as incomplete`
                                              : `Mark ${unit.title} as covered`
                                          }
                                          className={`mt-0.5 min-h-10 min-w-10 rounded-lg border inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                            isCompleted
                                              ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-zinc-950'
                                              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-transparent hover:border-zinc-500 dark:hover:border-zinc-500'
                                          }`}
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>

                                        <div className="min-w-0 flex-1 space-y-1.5">
                                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                              {unit.unitCode}
                                            </span>
                                            <span aria-hidden="true">·</span>
                                            <span>
                                              Weightage: {unit.marksWeight}{' '}
                                              Marks
                                            </span>
                                            <span aria-hidden="true">·</span>
                                            <span>
                                              {unitTopicsDone}/
                                              {unitTopicIds.length} topics
                                            </span>
                                            <span aria-hidden="true">·</span>
                                            <span className="font-sans">
                                              {unit.keyReferences}
                                            </span>
                                            {isCompleted && (
                                              <>
                                                <span aria-hidden="true">
                                                  ·
                                                </span>
                                                <span className="font-sans font-medium text-emerald-700 dark:text-emerald-400">
                                                  Section Covered
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          <div>
                                            <h4 className="text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                                              {unit.title}
                                            </h4>
                                            <p
                                              lang="ne"
                                              className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400"
                                            >
                                              {unit.nepaliTitle}
                                            </p>
                                          </div>

                                          {unit.branchSummary && (
                                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                              {unit.branchSummary}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Unit Action Controls */}
                                      <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-13 lg:pl-0 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            dispatch(
                                              toggleSyllabusUnitBookmarked(
                                                unit.id
                                              )
                                            )
                                          }
                                          aria-pressed={isBookmarked}
                                          aria-label={
                                            isBookmarked
                                              ? 'Remove revision pin'
                                              : 'Pin unit for revision'
                                          }
                                          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                            isBookmarked
                                              ? 'border-amber-400/80 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
                                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                          }`}
                                        >
                                          <Bookmark
                                            className={`w-3.5 h-3.5 ${
                                              isBookmarked ? 'fill-current' : ''
                                            }`}
                                          />
                                          <span>
                                            {isBookmarked ? 'Pinned' : 'Pin'}
                                          </span>
                                        </button>

                                        {unit.materialPath && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleOpenPdf(
                                                unit.materialPath!,
                                                `${activeCadre.shortTitle} Syllabus`
                                              )
                                            }
                                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                          >
                                            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                                            <span>Read PDF</span>
                                            <ArrowUpRight className="w-3 h-3 opacity-60" />
                                          </button>
                                        )}

                                        {unit.quizHref && (
                                          <Link
                                            to={unit.quizHref}
                                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                          >
                                            <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                                            <span>
                                              {unit.quizLabel ?? 'Drill MCQs'}
                                            </span>
                                          </Link>
                                        )}

                                        {unit.writtenHref && (
                                          <Link
                                            to={unit.writtenHref}
                                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                          >
                                            <PenLine className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                                            <span>
                                              {unit.writtenLabel ??
                                                'Written Q&A'}
                                            </span>
                                          </Link>
                                        )}

                                        {unit.simulatePresetId && (
                                          <Link
                                            to={`/simulate?preset=${encodeURIComponent(
                                              unit.simulatePresetId
                                            )}&launch=1`}
                                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                          >
                                            <Play className="w-3 h-3" />
                                            <span>Simulate</span>
                                          </Link>
                                        )}
                                      </div>
                                    </div>

                                    {/* Detailed Chapters, Topics, Subtopics & PSC Study Briefs */}
                                    {unit.chapters.length > 0 && (
                                      <div className="pl-0 lg:pl-13 space-y-4">
                                        {unit.chapters.map((chapter) => {
                                          const chapterTopicIds =
                                            getChapterTopicIds(chapter);
                                          const chapterDoneCount =
                                            chapterTopicIds.filter((id) =>
                                              completedTopicSet.has(id)
                                            ).length;
                                          const allChapterDone =
                                            chapterTopicIds.length > 0 &&
                                            chapterDoneCount ===
                                              chapterTopicIds.length;
                                          const isChapterOpen =
                                            isSearchActive ||
                                            !collapsedChapterIds[chapter.id];

                                          return (
                                            <div
                                              key={chapter.id}
                                              className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/50 overflow-hidden"
                                            >
                                              {/* Chapter Header */}
                                              <div className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/80">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleToggleChapterCollapse(
                                                      chapter.id
                                                    )
                                                  }
                                                  aria-expanded={isChapterOpen}
                                                  className="flex items-start gap-2.5 text-left min-w-0 flex-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                                                >
                                                  {isChapterOpen ? (
                                                    <ChevronDown className="w-4 h-4 mt-0.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                                  ) : (
                                                    <ChevronRight className="w-4 h-4 mt-0.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                                  )}
                                                  <div className="min-w-0 space-y-0.5">
                                                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                                                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                        {chapter.code}
                                                      </span>
                                                      {chapter.marksAllocation && (
                                                        <>
                                                          <span aria-hidden="true">
                                                            ·
                                                          </span>
                                                          <span>
                                                            {
                                                              chapter.marksAllocation
                                                            }
                                                          </span>
                                                        </>
                                                      )}
                                                      <span aria-hidden="true">
                                                        ·
                                                      </span>
                                                      <span>
                                                        {chapter.topics.length}{' '}
                                                        {chapter.topics
                                                          .length === 1
                                                          ? 'topic'
                                                          : 'topics'}
                                                      </span>
                                                    </div>
                                                    <h5 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50">
                                                      {chapter.chapterName}
                                                    </h5>
                                                    {chapter.nepaliChapterName && (
                                                      <p
                                                        lang="ne"
                                                        className="text-xs text-zinc-600 dark:text-zinc-400"
                                                      >
                                                        {
                                                          chapter.nepaliChapterName
                                                        }
                                                      </p>
                                                    )}
                                                  </div>
                                                </button>

                                                <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                                                  <span className="font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                                    {chapterDoneCount}/
                                                    {chapterTopicIds.length}{' '}
                                                    done
                                                  </span>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleToggleWholeChapter(
                                                        chapter
                                                      )
                                                    }
                                                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                                  >
                                                    <Check className="w-3 h-3" />
                                                    <span>
                                                      {allChapterDone
                                                        ? 'Unmark'
                                                        : 'Mark Ch.'}
                                                    </span>
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Chapter Body: Topics & Briefs */}
                                              {isChapterOpen && (
                                                <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900/70">
                                                  {chapter.chapterBrief && (
                                                    <div className="px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-950/40 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                      {chapter.chapterBrief}
                                                    </div>
                                                  )}

                                                  {chapter.topics.map(
                                                    (topic) => {
                                                      const isTopicDone =
                                                        completedTopicSet.has(
                                                          topic.id
                                                        );
                                                      const showTopicBrief =
                                                        detailMode ===
                                                          'detailed' ||
                                                        isSearchActive ||
                                                        Boolean(
                                                          expandedCompactTopicIds[
                                                            topic.id
                                                          ]
                                                        );

                                                      return (
                                                        <div
                                                          key={topic.id}
                                                          className={`px-4 py-3.5 transition-colors ${
                                                            isTopicDone
                                                              ? 'bg-emerald-50/25 dark:bg-emerald-950/10'
                                                              : ''
                                                          }`}
                                                        >
                                                          <div className="flex items-start gap-3">
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                dispatch(
                                                                  toggleSyllabusTopicCompleted(
                                                                    topic.id
                                                                  )
                                                                )
                                                              }
                                                              aria-pressed={
                                                                isTopicDone
                                                              }
                                                              aria-label={
                                                                isTopicDone
                                                                  ? `Mark topic ${topic.code} ${topic.topic} as incomplete`
                                                                  : `Mark topic ${topic.code} ${topic.topic} as covered`
                                                              }
                                                              className={`mt-0.5 h-5 w-5 rounded border inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                                                isTopicDone
                                                                  ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-zinc-950'
                                                                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-transparent hover:border-zinc-500'
                                                              }`}
                                                            >
                                                              <Check className="w-3 h-3" />
                                                            </button>

                                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                              <div className="flex flex-wrap items-start justify-between gap-2">
                                                                <div className="space-y-0.5 min-w-0 flex-1">
                                                                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                                                    <span className="font-mono tabular-nums text-xs font-semibold text-blue-700 dark:text-blue-400 shrink-0">
                                                                      {
                                                                        topic.code
                                                                      }
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                                                                      {
                                                                        topic.topic
                                                                      }
                                                                    </span>
                                                                    {topic.marksHint && (
                                                                      <span className="font-mono tabular-nums text-xs text-zinc-500 dark:text-zinc-400">
                                                                        ·{' '}
                                                                        {
                                                                          topic.marksHint
                                                                        }
                                                                      </span>
                                                                    )}
                                                                  </div>
                                                                  {topic.nepaliTopic && (
                                                                    <p
                                                                      lang="ne"
                                                                      className="text-xs text-zinc-600 dark:text-zinc-400"
                                                                    >
                                                                      {
                                                                        topic.nepaliTopic
                                                                      }
                                                                    </p>
                                                                  )}
                                                                </div>

                                                                {detailMode ===
                                                                  'compact' &&
                                                                  !isSearchActive && (
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleToggleCompactTopic(
                                                                          topic.id
                                                                        )
                                                                      }
                                                                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer whitespace-nowrap shrink-0"
                                                                    >
                                                                      {showTopicBrief
                                                                        ? 'Hide brief'
                                                                        : 'View brief'}
                                                                    </button>
                                                                  )}
                                                              </div>

                                                              {showTopicBrief && (
                                                                <>
                                                                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                                                    {
                                                                      topic.brief
                                                                    }
                                                                  </p>

                                                                  {topic.subtopics &&
                                                                    topic
                                                                      .subtopics
                                                                      .length >
                                                                      0 && (
                                                                      <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5 pl-2 sm:pl-3">
                                                                        {topic.subtopics.map(
                                                                          (
                                                                            sub
                                                                          ) => (
                                                                            <div
                                                                              key={
                                                                                sub.id
                                                                              }
                                                                              className="space-y-0.5"
                                                                            >
                                                                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                                                                <span className="font-mono tabular-nums text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                                                                  {
                                                                                    sub.code
                                                                                  }
                                                                                </span>
                                                                                <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                                                  {
                                                                                    sub.subtopic
                                                                                  }
                                                                                </span>
                                                                                {sub.nepaliSubtopic && (
                                                                                  <span
                                                                                    lang="ne"
                                                                                    className="text-xs text-zinc-500 dark:text-zinc-400"
                                                                                  >
                                                                                    (
                                                                                    {
                                                                                      sub.nepaliSubtopic
                                                                                    }
                                                                                    )
                                                                                  </span>
                                                                                )}
                                                                              </div>
                                                                              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                                                {
                                                                                  sub.brief
                                                                                }
                                                                              </p>
                                                                            </div>
                                                                          )
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
            </motion.div>
          </AnimatePresence>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
