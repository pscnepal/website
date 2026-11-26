import { useEffect, useId, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Flame,
  HelpCircle,
  Landmark,
  Layers,
  Lightbulb,
  Newspaper,
  PenLine,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { GoogleAdUnit } from '../components/ads/GoogleAdUnit';
import { ActionButton } from '../components/common/ActionButton';
import { ReactionButtons } from '../components/common/ReactionButtons';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { BookCoverVector } from '../components/vectors/BookCoverVector';
import {
  CURATED_CURRENT_AFFAIRS_MATERIAL_IDS,
  CURATED_CURRENT_AFFAIRS_WRITTEN_IDS,
  CURRENT_AFFAIRS_CADENCES,
  CURRENT_AFFAIRS_CATEGORIES,
  CURRENT_AFFAIRS_ITEMS,
  type CurrentAffairCadence,
  type CurrentAffairCategory,
  type CurrentAffairItem,
} from '../data/currentAffairsData';
import { recordView } from '../features/reactions/reactionsSlice';
import { toggleAffairBookmark } from '../features/workspace/workspaceSlice';
import {
  MATERIAL_EVENTS,
  materialStorageService,
} from '../services/materialStorageService';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../services/questionStorageService';
import type {
  QuizDifficultyFilter,
  QuizOptionKey,
  QuizQuestion,
  ReadingMaterialCategory,
  ReadingMaterialItem,
  WrittenMarksFilter,
  WrittenQuestion,
} from '../types';
import { copyWithToast } from '../utils/clipboardHelpers';
import { createBookIdFromUrl, resolveSampleUrl } from '../utils/urlHelpers';

type CurrentAffairsWorkspaceTab = 'feed' | 'quiz' | 'written' | 'materials';
type CadenceFilter = 'all' | CurrentAffairCadence;
type CadreFilter =
  | 'all'
  | 'section-officer'
  | 'nayab-subba'
  | 'kharidar'
  | 'ntc-computer-engineer-7';
type PracticeLangMode = 'bilingual' | 'en' | 'ne';
type MaterialGroupFilter = 'all' | 'briefings' | 'economy' | 'oversight';

const VALID_TABS: ReadonlySet<string> = new Set([
  'feed',
  'quiz',
  'written',
  'materials',
]);

const VALID_CADENCES: ReadonlySet<string> = new Set([
  'all',
  'daily',
  'weekly',
  'monthly',
]);

function getCadenceLabel(cadence: CurrentAffairCadence): {
  en: string;
  ne: string;
} {
  if (cadence === 'daily') {
    return { en: 'Daily Brief', ne: 'दैनिक' };
  }
  if (cadence === 'weekly') {
    return { en: 'Weekly Roundup', ne: 'साप्ताहिक' };
  }
  return { en: 'Monthly Compendium', ne: 'मासिक' };
}

function getBookThemeColor(
  id: string
): 'navy' | 'crimson' | 'emerald' | 'amber' {
  if (
    id.includes('budget') ||
    id.includes('cabinet') ||
    id.includes('parichaya') ||
    id.includes('mofa')
  ) {
    return 'crimson';
  }
  if (
    id.includes('nrb') ||
    id.includes('oag') ||
    id.includes('ciaa') ||
    id.includes('procurement')
  ) {
    return 'navy';
  }
  if (
    id.includes('plan') ||
    id.includes('nlss') ||
    id.includes('npc') ||
    id.includes('sdg')
  ) {
    return 'emerald';
  }
  return 'amber';
}

export function CurrentAffairsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputId = useId();
  const materialSearchId = useId();

  // Live synced repositories (respects Firestore/Admin overrides)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    questionStorageService.loadQuizQuestions()
  );
  const [writtenQuestions, setWrittenQuestions] = useState<WrittenQuestion[]>(
    () => questionStorageService.loadWrittenQuestions()
  );
  const [materialCategories, setMaterialCategories] = useState<
    ReadingMaterialCategory[]
  >(() => materialStorageService.loadMaterialCategories());

  useEffect(() => {
    const syncQuiz = () =>
      setQuizQuestions(questionStorageService.loadQuizQuestions());
    const syncWritten = () =>
      setWrittenQuestions(questionStorageService.loadWrittenQuestions());
    const syncMaterials = () =>
      setMaterialCategories(materialStorageService.loadMaterialCategories());

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

  // URL-backed primary workspace state
  const rawTab = searchParams.get('tab') || 'feed';
  const activeTab: CurrentAffairsWorkspaceTab = VALID_TABS.has(rawTab)
    ? (rawTab as CurrentAffairsWorkspaceTab)
    : 'feed';

  const rawCadence = searchParams.get('cadence') || 'all';
  const selectedCadence: CadenceFilter = VALID_CADENCES.has(rawCadence)
    ? (rawCadence as CadenceFilter)
    : 'all';

  const setActiveTab = (nextTab: CurrentAffairsWorkspaceTab) => {
    const next = new URLSearchParams(searchParams);
    if (nextTab === 'feed') {
      next.delete('tab');
    } else {
      next.set('tab', nextTab);
    }
    setSearchParams(next, { replace: true });
  };

  const setSelectedCadence = (nextCadence: CadenceFilter) => {
    const next = new URLSearchParams(searchParams);
    if (nextCadence === 'all') {
      next.delete('cadence');
    } else {
      next.set('cadence', nextCadence);
    }
    next.delete('tab');
    setSearchParams(next, { replace: true });
  };

  // Feed filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    CurrentAffairCategory | 'all'
  >('all');
  const [selectedCadre, setSelectedCadre] = useState<CadreFilter>('all');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);
  const [digestCadence, setDigestCadence] = useState<CadenceFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline Quiz Practice state
  const [quizTopicFilter, setQuizTopicFilter] = useState<string>('all');
  const [quizDifficulty, setQuizDifficulty] =
    useState<QuizDifficultyFilter>('All');
  const [quizLang, setQuizLang] = useState<PracticeLangMode>('bilingual');
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, QuizOptionKey[]>
  >({});
  const [revealedQuizIds, setRevealedQuizIds] = useState<
    Record<string, boolean>
  >({});

  // Written tab state
  const [writtenMarksFilter, setWrittenMarksFilter] =
    useState<WrittenMarksFilter>('all');
  const [writtenLang, setWrittenLang] = useState<PracticeLangMode>('bilingual');
  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null);

  // Reading Materials tab state
  const [materialQuery, setMaterialQuery] = useState('');
  const [materialGroup, setMaterialGroup] =
    useState<MaterialGroupFilter>('all');

  // Redux Store Selectors
  const bookmarkedIds = useAppSelector(
    (state) => state.workspace.affairBookmarks
  );
  const readingProgress = useAppSelector(
    (state) => state.library.readingProgress
  );
  const quizAttempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);

  // Resolved Current Affairs MCQs
  const currentAffairsMcqs = useMemo(() => {
    return quizQuestions.filter((q) => {
      const s = q.subject.trim().toLowerCase();
      return (
        s.includes('current affair') ||
        s.includes('samasamayik') ||
        s.includes('contemporary')
      );
    });
  }, [quizQuestions]);

  // Resolved Current Affairs Written Q&As
  const currentAffairsWritten = useMemo(() => {
    const byId = new Map<string, WrittenQuestion>();
    const curatedSet = new Set(CURATED_CURRENT_AFFAIRS_WRITTEN_IDS);
    for (const q of writtenQuestions) {
      const subj = q.subject.toLowerCase();
      if (
        curatedSet.has(q.id) ||
        subj.includes('contemporary') ||
        subj.includes('fiscal') ||
        subj.includes('diplomacy') ||
        subj.includes('digital governance') ||
        subj.includes('ldc')
      ) {
        byId.set(q.id, q);
      }
    }
    return CURATED_CURRENT_AFFAIRS_WRITTEN_IDS.map((id) => byId.get(id))
      .filter((item): item is WrittenQuestion => Boolean(item))
      .concat(
        Array.from(byId.values()).filter(
          (q) => !curatedSet.has(q.id)
        )
      );
  }, [writtenQuestions]);

  // Resolved Current Affairs Reading Materials
  const { caMaterials, materialById } = useMemo(() => {
    const allById = new Map<string, ReadingMaterialItem>();
    for (const cat of materialCategories) {
      for (const item of cat.items) {
        allById.set(item.id, item);
      }
    }

    const picked = new Map<string, ReadingMaterialItem>();
    const dedicatedCategory = materialCategories.find(
      (c) => c.id === 'current-affairs-samasamayik'
    );
    if (dedicatedCategory) {
      for (const item of dedicatedCategory.items) {
        picked.set(item.id, item);
      }
    }
    for (const curatedId of CURATED_CURRENT_AFFAIRS_MATERIAL_IDS) {
      const found = allById.get(curatedId);
      if (found && !picked.has(found.id)) {
        picked.set(found.id, found);
      }
    }

    return {
      caMaterials: Array.from(picked.values()),
      materialById: allById,
    };
  }, [materialCategories]);

  const quizById = useMemo(
    () => new Map(quizQuestions.map((q) => [q.id, q])),
    [quizQuestions]
  );
  const writtenById = useMemo(
    () => new Map(writtenQuestions.map((q) => [q.id, q])),
    [writtenQuestions]
  );

  // Linked question counts per sourcePath for the Materials tab
  const { quizCountBySourcePath, writtenCountBySourcePath } = useMemo(() => {
    const quizMap: Record<string, number> = {};
    const writtenMap: Record<string, number> = {};
    for (const q of quizQuestions) {
      if (q.sourcePath) {
        quizMap[q.sourcePath] = (quizMap[q.sourcePath] ?? 0) + 1;
        const resolved = resolveSampleUrl(q.sourcePath);
        if (resolved && resolved !== q.sourcePath) {
          quizMap[resolved] = (quizMap[resolved] ?? 0) + 1;
        }
      }
    }
    for (const q of writtenQuestions) {
      if (q.sourcePath) {
        writtenMap[q.sourcePath] = (writtenMap[q.sourcePath] ?? 0) + 1;
        const resolved = resolveSampleUrl(q.sourcePath);
        if (resolved && resolved !== q.sourcePath) {
          writtenMap[resolved] = (writtenMap[resolved] ?? 0) + 1;
        }
      }
    }
    return { quizCountBySourcePath: quizMap, writtenCountBySourcePath: writtenMap };
  }, [quizQuestions, writtenQuestions]);

  // Cadence counts
  const cadenceCounts = useMemo(() => {
    const counts: Record<CurrentAffairCadence, number> = {
      daily: 0,
      weekly: 0,
      monthly: 0,
    };
    for (const item of CURRENT_AFFAIRS_ITEMS) {
      counts[item.cadence] += 1;
    }
    return counts;
  }, []);

  const latestByCadence = useMemo(() => {
    const result: Partial<Record<CurrentAffairCadence, CurrentAffairItem>> = {};
    for (const item of CURRENT_AFFAIRS_ITEMS) {
      if (!result[item.cadence]) {
        result[item.cadence] = item;
      }
    }
    return result;
  }, []);

  // Filtered Feed Items
  const filteredItems = useMemo(() => {
    return CURRENT_AFFAIRS_ITEMS.filter((item) => {
      if (selectedCadence !== 'all' && item.cadence !== selectedCadence) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (
        selectedCadre !== 'all' &&
        !item.cadreRelevance.includes(selectedCadre)
      ) {
        return false;
      }
      if (onlyPinned && !item.pinned) {
        return false;
      }
      if (onlyBookmarked && !bookmarkedIds[item.id]) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inEn =
          item.titleEn.toLowerCase().includes(q) ||
          item.summaryEn.toLowerCase().includes(q);
        const inNe =
          item.titleNe.toLowerCase().includes(q) ||
          item.summaryNe.toLowerCase().includes(q);
        const inFacts = item.keyFacts.some((f) => f.toLowerCase().includes(q));
        const inRelevance = item.paperRelevance.toLowerCase().includes(q);
        const inPeriod =
          (item.periodLabelEn ?? '').toLowerCase().includes(q) ||
          (item.periodLabelNe ?? '').toLowerCase().includes(q);
        if (!inEn && !inNe && !inFacts && !inRelevance && !inPeriod) {
          return false;
        }
      }
      return true;
    });
  }, [
    selectedCadence,
    selectedCategory,
    selectedCadre,
    onlyPinned,
    onlyBookmarked,
    searchQuery,
    bookmarkedIds,
  ]);

  const digestItems = useMemo(() => {
    if (digestCadence === 'all') return CURRENT_AFFAIRS_ITEMS;
    return CURRENT_AFFAIRS_ITEMS.filter((i) => i.cadence === digestCadence);
  }, [digestCadence]);

  // Quiz Topics & Filtered Practice MCQs
  const quizTopics = useMemo(() => {
    const unique = new Set<string>();
    for (const q of currentAffairsMcqs) {
      if (q.topic) unique.add(q.topic);
    }
    return Array.from(unique);
  }, [currentAffairsMcqs]);

  const filteredPracticeMcqs = useMemo(() => {
    return currentAffairsMcqs.filter((q) => {
      if (quizTopicFilter !== 'all' && q.topic !== quizTopicFilter) {
        return false;
      }
      if (quizDifficulty !== 'All' && q.difficulty !== quizDifficulty) {
        return false;
      }
      return true;
    });
  }, [currentAffairsMcqs, quizTopicFilter, quizDifficulty]);

  const quizPracticeStats = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    for (const q of currentAffairsMcqs) {
      if (!revealedQuizIds[q.id]) continue;
      const chosen = selectedAnswers[q.id] ?? [];
      if (chosen.length === 0) continue;
      attempted += 1;
      const sortedChosen = [...chosen].sort().join(',');
      const sortedCorrect = [...q.correct_options].sort().join(',');
      if (sortedChosen === sortedCorrect) {
        correct += 1;
      }
    }
    const accuracy =
      attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    return { attempted, correct, accuracy };
  }, [currentAffairsMcqs, revealedQuizIds, selectedAnswers]);

  const caDeckAttempts = useMemo(
    () => quizAttempts.filter((a) => a.deckId === 'current-affairs'),
    [quizAttempts]
  );

  // Filtered Written Q&As
  const filteredWritten = useMemo(() => {
    return currentAffairsWritten.filter((q) => {
      if (writtenMarksFilter !== 'all' && String(q.marks) !== writtenMarksFilter) {
        return false;
      }
      return true;
    });
  }, [currentAffairsWritten, writtenMarksFilter]);

  // Filtered Reading Materials
  const filteredMaterials = useMemo(() => {
    const q = materialQuery.trim().toLowerCase();
    return caMaterials.filter((item) => {
      if (materialGroup === 'briefings') {
        if (!item.id.startsWith('ca-') && !item.id.includes('parichaya')) {
          return false;
        }
      } else if (materialGroup === 'economy') {
        if (
          !item.id.includes('budget') &&
          !item.id.includes('eco-survey') &&
          !item.id.includes('nrb') &&
          !item.id.includes('plan') &&
          !item.id.includes('nlss')
        ) {
          return false;
        }
      } else if (materialGroup === 'oversight') {
        if (
          !item.id.includes('oag') &&
          !item.id.includes('ciaa') &&
          !item.id.includes('mofa') &&
          !item.id.includes('nso')
        ) {
          return false;
        }
      }

      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.authority.toLowerCase().includes(q) ||
        item.codeOrEdition.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [caMaterials, materialGroup, materialQuery]);

  const bookmarkCount = Object.values(bookmarkedIds).filter(Boolean).length;

  const handleToggleBookmark = (id: string) => {
    dispatch(toggleAffairBookmark(id));
  };

  const handleToggleExpand = (id: string) => {
    const isOpening = expandedItemId !== id;
    if (isOpening) {
      dispatch(recordView({ itemId: id, itemType: 'affair' }));
    }
    setExpandedItemId(isOpening ? id : null);
  };

  const handleCopyCitation = (item: CurrentAffairItem) => {
    const cadenceInfo = getCadenceLabel(item.cadence);
    const text = `[PSC Nepal Samasamayik · ${cadenceInfo.ne}] ${item.titleNe} (${item.titleEn})\nमिति: ${item.dateBS} / ${item.dateAD}\nस्रोत: ${item.source}\nप्रमुख बुँदाहरू:\n${item.keyFacts.map((f) => `• ${f}`).join('\n')}`;
    void copyWithToast(text, 'Briefing citation copied to clipboard.').then(
      (ok) => {
        if (ok) {
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
        }
      }
    );
  };

  const handleOpenMaterial = (item: ReadingMaterialItem) => {
    dispatch(recordView({ itemId: item.id, itemType: 'material' }));
    const fullUrl = resolveSampleUrl(item.path);
    navigate(`/read?url=${encodeURIComponent(fullUrl)}`, {
      state: {
        from: `${location.pathname}${location.search}`,
        fromLabel: 'Back to Current Affairs',
      },
    });
  };

  const handleSelectOption = (question: QuizQuestion, key: QuizOptionKey) => {
    if (revealedQuizIds[question.id]) return;

    if (!question.is_multi_select) {
      setSelectedAnswers((prev) => ({ ...prev, [question.id]: [key] }));
      setRevealedQuizIds((prev) => ({ ...prev, [question.id]: true }));
      return;
    }

    setSelectedAnswers((prev) => {
      const current = prev[question.id] ?? [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { ...prev, [question.id]: next };
    });
  };

  const handleRevealMultiSelect = (questionId: string) => {
    if ((selectedAnswers[questionId] ?? []).length === 0) return;
    setRevealedQuizIds((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuizPractice = () => {
    setSelectedAnswers({});
    setRevealedQuizIds({});
  };

  const hasActiveFeedFilters =
    Boolean(searchQuery) ||
    selectedCadence !== 'all' ||
    selectedCategory !== 'all' ||
    selectedCadre !== 'all' ||
    onlyPinned ||
    onlyBookmarked;

  const resetAllFeedFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCadre('all');
    setOnlyPinned(false);
    setOnlyBookmarked(false);
    if (selectedCadence !== 'all') {
      setSelectedCadence('all');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Breadcrumb Header */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 text-xs text-zinc-500 dark:text-zinc-400"
          >
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-zinc-800 dark:text-zinc-200 font-medium">
                Current Affairs &amp; Samasamayik (समसामयिक)
              </li>
            </ol>
          </nav>

          {/* Editorial Hero Banner */}
          <section className="rounded-2xl bg-gradient-to-br from-blue-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 mb-6 border border-blue-900/50 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-blue-300 mb-3">
                  <span className="font-semibold text-amber-300">
                    Lok Sewa 2082/83 – 2083/84
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Daily · Weekly · Monthly Samasamayik Desk</span>
                </div>
                <h1 className="font-serif text-fluid-h1 font-bold tracking-tight text-white [text-wrap:balance] mb-2.5">
                  समसामयिक विषयवस्तु तथा घटनाक्रम
                </h1>
                <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Dedicated Lok Sewa Current Affairs command center combining Daily Briefs, Weekly Roundups, Monthly Compendiums, bilingual MCQs, Paper III analytical written model answers, and official Government of Nepal reading PDFs.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0">
                <ActionButton
                  icon={BookOpen}
                  label={`Start Timed CA Quiz (${currentAffairsMcqs.length} Qs)`}
                  title="Launch dedicated timed Current Affairs MCQ exam deck"
                  color="crimson"
                  variant="solid"
                  size="md"
                  to="/quiz/current-affairs"
                  className="w-full justify-center"
                />
                <ActionButton
                  icon={FileText}
                  label="Quick Digest"
                  title="Open compiled Daily/Weekly/Monthly Samasamayik digest"
                  color="blue"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setDigestCadence(selectedCadence);
                    setIsDigestModalOpen(true);
                  }}
                  className="w-full justify-center !bg-white/10 !border-blue-400/40 !text-white hover:!bg-white/20"
                />
              </div>
            </div>

            {/* 4-Column Tabular Proof Strip */}
            <div className="mt-6 pt-5 border-t border-blue-800/60 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/50">
                <div className="text-blue-300 font-medium">
                  Cadence Briefings
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono tabular-nums">
                  {CURRENT_AFFAIRS_ITEMS.length} Topics
                </div>
                <div className="text-[11px] text-blue-200/80 font-mono tabular-nums mt-0.5">
                  {cadenceCounts.daily} Daily · {cadenceCounts.weekly} Weekly ·{' '}
                  {cadenceCounts.monthly} Monthly
                </div>
              </div>

              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/50">
                <div className="text-blue-300 font-medium">
                  Current Affairs Quiz
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono tabular-nums">
                  {currentAffairsMcqs.length} Bilingual MCQs
                </div>
                <div className="text-[11px] text-blue-200/80 mt-0.5">
                  Paper I Objective + Multi-Select
                </div>
              </div>

              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/50">
                <div className="text-blue-300 font-medium">
                  Written Answers
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono tabular-nums">
                  {currentAffairsWritten.length} Analytical Q&amp;As
                </div>
                <div className="text-[11px] text-blue-200/80 mt-0.5">
                  5 &amp; 10 Marks (EN &amp; नेपाली)
                </div>
              </div>

              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/50">
                <div className="text-blue-300 font-medium">
                  Reading Materials
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono tabular-nums">
                  {caMaterials.length} Official PDFs
                </div>
                <div className="text-[11px] text-blue-200/80 mt-0.5">
                  Verified .gov.np Briefs &amp; Reports
                </div>
              </div>
            </div>
          </section>

          {/* Primary Workspace Mode Switcher */}
          <div
            role="tablist"
            aria-label="Current Affairs Sections"
            className="flex items-center gap-1 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs mb-6 overflow-x-auto no-scrollbar"
          >
            {(
              [
                {
                  id: 'feed',
                  label: 'Daily / Weekly / Monthly Feed',
                  count: CURRENT_AFFAIRS_ITEMS.length,
                  icon: Newspaper,
                },
                {
                  id: 'quiz',
                  label: 'Quiz & Practice MCQs',
                  count: currentAffairsMcqs.length,
                  icon: HelpCircle,
                },
                {
                  id: 'written',
                  label: 'Written Q&As (Paper III)',
                  count: currentAffairsWritten.length,
                  icon: PenLine,
                },
                {
                  id: 'materials',
                  label: 'Official Reading Materials',
                  count: caMaterials.length,
                  icon: FileText,
                },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono tabular-nums text-[11px] ${
                      isActive
                        ? 'text-blue-100'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* TAB 1: DAILY / WEEKLY / MONTHLY BRIEFINGS FEED                 */}
          {/* ============================================================== */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Daily / Weekly / Monthly Quick Snapshot Strip when All Feeds active without search filters */}
              {selectedCadence === 'all' && !hasActiveFeedFilters && (
                <section
                  aria-label="Daily, Weekly and Monthly Current Affairs Overview"
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {CURRENT_AFFAIRS_CADENCES.map((cad) => {
                    const latest = latestByCadence[cad.id];
                    const count = cadenceCounts[cad.id];
                    return (
                      <div
                        key={cad.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-blue-700 dark:text-blue-400">
                              {cad.labelNe}
                            </span>
                            <span>{count} Briefs</span>
                          </div>
                          <h2 className="mt-1.5 font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                            {cad.labelEn}
                          </h2>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            {cad.subtitleEn}
                          </p>
                          {latest && (
                            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                                Featured · {latest.dateBS}
                              </div>
                              <p className="mt-0.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                                {latest.titleNe}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedCadence(cad.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer self-start pt-1"
                        >
                          <span>View {cad.labelEn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </section>
              )}

              {/* Search, Cadence & Category Filter Deck */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
                {/* Cadence Segmented Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mr-1 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Schedule:
                    </span>
                    {(
                      [
                        {
                          id: 'all',
                          label: `All Feeds (${CURRENT_AFFAIRS_ITEMS.length})`,
                        },
                        {
                          id: 'daily',
                          label: `Daily · दैनिक (${cadenceCounts.daily})`,
                        },
                        {
                          id: 'weekly',
                          label: `Weekly · साप्ताहिक (${cadenceCounts.weekly})`,
                        },
                        {
                          id: 'monthly',
                          label: `Monthly · मासिक (${cadenceCounts.monthly})`,
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedCadence(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono tabular-nums whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                          selectedCadence === opt.id
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Quick Highlight Toggles */}
                  <div className="flex items-center gap-2 shrink-0">
                    <ActionButton
                      icon={Flame}
                      label="High Yield Only"
                      title="Show top pinned and high-probability exam topics"
                      color={onlyPinned ? 'amber' : 'zinc'}
                      variant={onlyPinned ? 'solid' : 'outline'}
                      size="sm"
                      onClick={() => setOnlyPinned((prev) => !prev)}
                    />
                    <ActionButton
                      icon={BookMarked}
                      label={`Saved (${bookmarkCount})`}
                      title="Filter by your bookmarked current affairs"
                      color={onlyBookmarked ? 'purple' : 'zinc'}
                      variant={onlyBookmarked ? 'solid' : 'outline'}
                      size="sm"
                      onClick={() => setOnlyBookmarked((prev) => !prev)}
                    />
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <label htmlFor={searchInputId} className="sr-only">
                    Search Current Affairs
                  </label>
                  <input
                    id={searchInputId}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search daily, weekly, or monthly affairs (e.g., NRB Monetary, OAG 63rd, NLSS-IV, LDC 2026, 16th Plan)..."
                    className="w-full pl-9 pr-9 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                      aria-label="Clear search query"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1 shrink-0">
                    Topics:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-blue-700 text-white dark:bg-blue-600'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    All Topics ({CURRENT_AFFAIRS_ITEMS.length})
                  </button>
                  {CURRENT_AFFAIRS_CATEGORIES.map((cat) => {
                    const count = CURRENT_AFFAIRS_ITEMS.filter(
                      (i) => i.category === cat.id
                    ).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer shrink-0 ${
                          selectedCategory === cat.id
                            ? 'bg-blue-700 text-white dark:bg-blue-600'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {cat.labelNe} / {cat.labelEn} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Cadre Filter Row */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs flex-wrap">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                    Target Cadre:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: 'all', label: 'All Cadres' },
                        {
                          id: 'section-officer',
                          label: 'Section Officer (अधिकृत)',
                        },
                        { id: 'nayab-subba', label: 'Nayab Subba (ना.सु.)' },
                        { id: 'kharidar', label: 'Kharidar (खरिदार)' },
                        {
                          id: 'ntc-computer-engineer-7',
                          label: 'NTC Comp. Eng. (L7)',
                        },
                      ] as const
                    ).map((cadre) => (
                      <button
                        key={cadre.id}
                        type="button"
                        onClick={() => setSelectedCadre(cadre.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedCadre === cadre.id
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        {cadre.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Count Bar */}
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 font-mono tabular-nums">
                <span>
                  Showing{' '}
                  <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">
                    {filteredItems.length}
                  </strong>{' '}
                  of {CURRENT_AFFAIRS_ITEMS.length} current affairs entries
                </span>
                {hasActiveFeedFilters && (
                  <button
                    type="button"
                    onClick={resetAllFeedFilters}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-sans cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset filters
                  </button>
                )}
              </div>

              {/* Current Affairs Items Feed */}
              {filteredItems.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
                  <Newspaper className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                    No current affairs matched your selection
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                    Try clearing the cadence, category, or search term filters to view all Daily, Weekly, and Monthly briefings.
                  </p>
                  <ActionButton
                    label="Clear All Filters"
                    title="Reset filters to view all topics"
                    color="blue"
                    variant="outline"
                    size="sm"
                    onClick={resetAllFeedFilters}
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredItems.map((item) => {
                    const isExpanded = expandedItemId === item.id;
                    const isBookmarked = Boolean(bookmarkedIds[item.id]);
                    const cadenceInfo = getCadenceLabel(item.cadence);
                    const primaryMaterial = item.linkedMaterialIds
                      ?.map((mid) => materialById.get(mid))
                      .find((m): m is ReadingMaterialItem => Boolean(m));
                    const primaryWritten = item.linkedWrittenIds
                      ?.map((wid) => writtenById.get(wid))
                      .find((w): w is WrittenQuestion => Boolean(w));
                    const linkedQuizList = (item.linkedQuizIds ?? [])
                      .map((qid) => quizById.get(qid))
                      .filter((q): q is QuizQuestion => Boolean(q));

                    return (
                      <article
                        key={item.id}
                        id={item.id}
                        className={`bg-white dark:bg-zinc-900 rounded-xl border transition-colors ${
                          item.pinned
                            ? 'border-amber-300 dark:border-amber-900/60 shadow-2xs'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="p-5 sm:p-6">
                          {/* Clean Unboxed Metadata Row (Zero Pill Sandwich) */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-blue-700 dark:text-blue-400">
                                {cadenceInfo.en} ({cadenceInfo.ne})
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {item.categoryLabelNe} / {item.categoryLabelEn}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">
                                {item.dateBS} ({item.dateAD})
                              </span>
                              {item.pinned && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                                    <Flame className="w-3 h-3 text-amber-500" />
                                    High Yield
                                  </span>
                                </>
                              )}
                            </div>

                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {item.paperRelevance}
                            </span>
                          </div>

                          {/* Headings */}
                          <div className="mb-3">
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-zinc-950 dark:text-zinc-50 leading-snug mb-1">
                              {item.titleNe}
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                              {item.titleEn}
                            </p>
                          </div>

                          {/* Bilingual Summary */}
                          <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 mb-4 leading-relaxed bg-zinc-50/80 dark:bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800/80">
                            <p>{item.summaryNe}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {item.summaryEn}
                            </p>
                          </div>

                          {/* Key Examination Facts */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                महत्त्वपूर्ण परीक्षा बुँदाहरू (Key Examination Facts)
                              </span>
                              <span className="text-[11px] font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                                {item.keyFacts.length} verified facts
                              </span>
                            </div>
                            <ul className="space-y-1.5">
                              {(isExpanded
                                ? item.keyFacts
                                : item.keyFacts.slice(0, 3)
                              ).map((fact, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 shrink-0" />
                                  <span>{fact}</span>
                                </li>
                              ))}
                            </ul>
                            {item.keyFacts.length > 3 && (
                              <button
                                type="button"
                                onClick={() => handleToggleExpand(item.id)}
                                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" /> Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" /> Show{' '}
                                    {item.keyFacts.length - 3} more points &amp;
                                    exam tip
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Cross-Linked Quiz, Written Q&A & PDF Strip */}
                          {(primaryMaterial ||
                            primaryWritten ||
                            linkedQuizList.length > 0) && (
                            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                              {primaryMaterial && (
                                <ActionButton
                                  icon={BookOpen}
                                  label="Read Official PDF"
                                  title={`Open ${primaryMaterial.title} in Two-Page Reader`}
                                  color="blue"
                                  variant="subtle"
                                  size="xs"
                                  onClick={() =>
                                    handleOpenMaterial(primaryMaterial)
                                  }
                                />
                              )}
                              {linkedQuizList.length > 0 && (
                                <ActionButton
                                  icon={HelpCircle}
                                  label={`Quiz (${linkedQuizList.length} MCQ)`}
                                  title="Open Current Affairs Quiz tab to practice linked MCQs"
                                  color="crimson"
                                  variant="subtle"
                                  size="xs"
                                  onClick={() => {
                                    setQuizTopicFilter('all');
                                    setActiveTab('quiz');
                                  }}
                                />
                              )}
                              {primaryWritten && (
                                <ActionButton
                                  icon={PenLine}
                                  label={`Written Q&A (${primaryWritten.marks}M)`}
                                  title={primaryWritten.en.title}
                                  color="emerald"
                                  variant="subtle"
                                  size="xs"
                                  to={`/written/${primaryWritten.id}`}
                                />
                              )}
                            </div>
                          )}

                          {/* Expanded Section: Exam Strategy Tip & Citation */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                              <div className="bg-amber-50/70 dark:bg-amber-950/40 p-3.5 rounded-lg border border-amber-200 dark:border-amber-800/60 text-xs">
                                <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                  Exam Writing Strategy Tip (परीक्षा तयारी सुझाव)
                                </div>
                                <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                                  {item.examTip}
                                </p>
                              </div>

                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                  आधिकारिक स्रोत (Source):
                                </span>
                                <span>{item.source}</span>
                              </div>
                            </div>
                          )}

                          {/* Bottom Action Footer */}
                          <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <ReactionButtons
                              itemId={item.id}
                              itemType="affair"
                              size="xs"
                            />

                            <div className="flex items-center gap-2">
                              <ActionButton
                                icon={copiedId === item.id ? Check : Copy}
                                label={
                                  copiedId === item.id ? 'Copied' : 'Copy Citation'
                                }
                                title="Copy formatted citation and bullet points"
                                color={copiedId === item.id ? 'emerald' : 'zinc'}
                                variant="outline"
                                size="xs"
                                onClick={() => handleCopyCitation(item)}
                              />

                              <ActionButton
                                icon={BookMarked}
                                label={isBookmarked ? 'Saved' : 'Bookmark'}
                                title={
                                  isBookmarked
                                    ? 'Remove from saved'
                                    : 'Bookmark for revision'
                                }
                                color={isBookmarked ? 'purple' : 'zinc'}
                                variant={isBookmarked ? 'solid' : 'outline'}
                                size="xs"
                                onClick={() => handleToggleBookmark(item.id)}
                              />

                              <ActionButton
                                icon={isExpanded ? ChevronUp : ChevronDown}
                                label={isExpanded ? 'Collapse' : 'Details'}
                                title={
                                  isExpanded
                                    ? 'Collapse card'
                                    : 'View all facts and exam tip'
                                }
                                color="zinc"
                                variant="ghost"
                                size="xs"
                                onClick={() => handleToggleExpand(item.id)}
                              />
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CURRENT AFFAIRS QUIZ & INLINE PRACTICE MCQS             */}
          {/* ============================================================== */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {/* Timed Mock Deck Banner */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                      Dedicated Timed Quiz Deck
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {currentAffairsMcqs.length} Bilingual Questions
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>-20% Negative Marking</span>
                    {caDeckAttempts.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                          {caDeckAttempts.length} Attempts · Best{' '}
                          {Math.max(
                            ...caDeckAttempts.map((a) => a.accuracyPercent)
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif text-xl font-bold text-zinc-950 dark:text-zinc-50">
                    Current Affairs &amp; Samasamayik (समसामयिक) Mock Exam
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Launch the full timed exam-hall mode with score logging and flagged-question sync, or practice individual questions below with instant explanations and direct links to source .gov.np PDFs.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
                  <ActionButton
                    icon={BookOpen}
                    label="Launch Timed CA Quiz"
                    title="Start full timed quiz session for Current Affairs & Samasamayik"
                    color="crimson"
                    variant="solid"
                    size="md"
                    to="/quiz/current-affairs"
                  />
                  <ActionButton
                    icon={Layers}
                    label="All Quiz Decks"
                    title="View all 6 PSC quiz decks"
                    color="zinc"
                    variant="outline"
                    size="md"
                    to="/quiz"
                  />
                </div>
              </div>

              {/* Inline Practice Controls */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-300">
                    <span>
                      Showing{' '}
                      <strong className="text-zinc-950 dark:text-zinc-50">
                        {filteredPracticeMcqs.length}
                      </strong>{' '}
                      / {currentAffairsMcqs.length} MCQs
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Answered:{' '}
                      <strong className="text-zinc-950 dark:text-zinc-50">
                        {quizPracticeStats.attempted}
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Correct: {quizPracticeStats.correct} (
                      {quizPracticeStats.accuracy}%)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
                      {(
                        [
                          { id: 'bilingual', label: 'EN + ने' },
                          { id: 'en', label: 'English' },
                          { id: 'ne', label: 'नेपाली' },
                        ] as const
                      ).map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setQuizLang(mode.id)}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            quizLang === mode.id
                              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                              : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>

                    {quizPracticeStats.attempted > 0 && (
                      <ActionButton
                        icon={RotateCcw}
                        label="Reset Practice"
                        title="Clear your inline practice responses"
                        color="zinc"
                        variant="outline"
                        size="sm"
                        onClick={handleResetQuizPractice}
                      />
                    )}
                  </div>
                </div>

                {/* Topic & Difficulty Filter Rows */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                      Topic:
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuizTopicFilter('all')}
                      className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                        quizTopicFilter === 'all'
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      All Topics
                    </button>
                    {quizTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setQuizTopicFilter(topic)}
                        className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                          quizTopicFilter === topic
                            ? 'bg-blue-700 text-white dark:bg-blue-600'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                      Level:
                    </span>
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setQuizDifficulty(diff)}
                        className={`px-2.5 py-1 rounded-md cursor-pointer whitespace-nowrap ${
                          quizDifficulty === diff
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inline Practice MCQ Cards */}
              {filteredPracticeMcqs.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-10 text-center border border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    No Current Affairs MCQs match these filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizTopicFilter('all');
                      setQuizDifficulty('All');
                    }}
                    className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Reset MCQ Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPracticeMcqs.map((q, idx) => {
                    const chosen = selectedAnswers[q.id] ?? [];
                    const isRevealed = Boolean(revealedQuizIds[q.id]);
                    const sortedChosen = [...chosen].sort().join(',');
                    const sortedCorrect = [...q.correct_options].sort().join(',');
                    const isCorrect =
                      isRevealed && sortedChosen === sortedCorrect;

                    return (
                      <article
                        key={q.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                              Q{idx + 1} · {q.id}
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
                          {isRevealed && (
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
                                  Answer: {q.correct_options.join(', ')}
                                </>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Question Stem */}
                        <div className="space-y-1.5">
                          {(quizLang === 'bilingual' || quizLang === 'en') && (
                            <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 leading-snug">
                              {q.question}
                            </h3>
                          )}
                          {(quizLang === 'bilingual' || quizLang === 'ne') &&
                            q.questionNe && (
                              <p
                                className={`leading-snug ${
                                  quizLang === 'ne'
                                    ? 'text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50'
                                    : 'text-xs sm:text-sm text-zinc-600 dark:text-zinc-300'
                                }`}
                              >
                                {q.questionNe}
                              </p>
                            )}
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt) => {
                            const isSelected = chosen.includes(opt.key);
                            const isCorrectOpt = q.correct_options.includes(
                              opt.key
                            );

                            let stateClasses =
                              'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 hover:border-blue-400 dark:hover:border-blue-600 text-zinc-800 dark:text-zinc-200';
                            if (isRevealed) {
                              if (isCorrectOpt) {
                                stateClasses =
                                  'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100';
                              } else if (isSelected && !isCorrectOpt) {
                                stateClasses =
                                  'border-red-500 bg-red-50/80 dark:bg-red-950/50 text-red-950 dark:text-red-100';
                              } else {
                                stateClasses =
                                  'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 text-zinc-500 dark:text-zinc-500';
                              }
                            } else if (isSelected) {
                              stateClasses =
                                'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100';
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                disabled={isRevealed}
                                onClick={() => handleSelectOption(q, opt.key)}
                                className={`text-left p-3 rounded-lg border transition-colors flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${stateClasses}`}
                              >
                                <span className="font-mono font-bold text-xs mt-0.5 shrink-0">
                                  {opt.key}.
                                </span>
                                <div className="text-xs sm:text-[13px] space-y-0.5">
                                  {(quizLang === 'bilingual' ||
                                    quizLang === 'en') && (
                                    <div className="font-medium">{opt.text}</div>
                                  )}
                                  {(quizLang === 'bilingual' ||
                                    quizLang === 'ne') &&
                                    opt.textNe && (
                                      <div
                                        className={
                                          quizLang === 'ne'
                                            ? 'font-medium'
                                            : 'text-zinc-600 dark:text-zinc-400'
                                        }
                                      >
                                        {opt.textNe}
                                      </div>
                                    )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {q.is_multi_select && !isRevealed && (
                          <div>
                            <ActionButton
                              label="Check Multi-Select Answer"
                              title="Verify selected options"
                              color="blue"
                              variant="solid"
                              size="sm"
                              disabled={chosen.length === 0}
                              onClick={() => handleRevealMultiSelect(q.id)}
                            />
                          </div>
                        )}

                        {isRevealed && (
                          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                            {(quizLang === 'bilingual' ||
                              quizLang === 'en') && (
                              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                <strong className="text-zinc-950 dark:text-zinc-100">
                                  Explanation:
                                </strong>{' '}
                                {q.explanation}
                              </p>
                            )}
                            {(quizLang === 'bilingual' || quizLang === 'ne') &&
                              q.explanationNe && (
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                  <strong className="text-zinc-800 dark:text-zinc-200">
                                    व्याख्या:
                                  </strong>{' '}
                                  {q.explanationNe}
                                </p>
                              )}
                            {q.sourcePath && (
                              <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                                  Ref: {q.sourceTitle ?? 'Official Source'}
                                </span>
                                <Link
                                  to={`/read?url=${encodeURIComponent(
                                    resolveSampleUrl(q.sourcePath)
                                  )}`}
                                  className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                                >
                                  <BookOpen className="w-3 h-3" />
                                  Open Source PDF
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CURRENT AFFAIRS WRITTEN Q&As (PAPER III)                */}
          {/* ============================================================== */}
          {activeTab === 'written' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-zinc-950 dark:text-zinc-50">
                    Contemporary Issues &amp; Paper III Analytical Q&amp;As
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Bilingual 5-mark and 10-mark structured answers integrating macro-fiscal policy, Nov 2026 LDC graduation, NLSS-IV poverty data, and Digital Public Infrastructure.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
                    {(
                      [
                        { id: 'all', label: 'All Marks' },
                        { id: '10', label: '10 Marks' },
                        { id: '5', label: '5 Marks' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWrittenMarksFilter(m.id)}
                        className={`px-2.5 py-1 rounded-md font-medium cursor-pointer whitespace-nowrap ${
                          writtenMarksFilter === m.id
                            ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
                    {(
                      [
                        { id: 'bilingual', label: 'EN + ने' },
                        { id: 'en', label: 'English' },
                        { id: 'ne', label: 'नेपाली' },
                      ] as const
                    ).map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setWrittenLang(l.id)}
                        className={`px-2.5 py-1 rounded-md font-medium cursor-pointer whitespace-nowrap ${
                          writtenLang === l.id
                            ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>

                  <ActionButton
                    icon={Landmark}
                    label="Full Written Bank"
                    title="Browse all 54+ PSC written questions"
                    color="zinc"
                    variant="outline"
                    size="sm"
                    to="/written"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredWritten.map((q) => {
                  const record = writtenRecords[q.id];
                  const status = record?.status ?? 'unseen';
                  const isRubricOpen = expandedRubricId === q.id;

                  return (
                    <article
                      key={q.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-blue-700 dark:text-blue-400">
                            {q.id}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{q.paper}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-semibold text-zinc-800 dark:text-zinc-200">
                            {q.marks} Marks
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="w-3 h-3" />
                            {q.recommendedMinutes} min
                          </span>
                        </div>

                        <span
                          className={`font-semibold ${
                            status === 'mastered'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : status === 'practicing'
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          {status === 'mastered'
                            ? 'Mastered'
                            : status === 'practicing'
                              ? 'In Practice'
                              : 'Not Practiced'}
                        </span>
                      </div>

                      {(writtenLang === 'bilingual' || writtenLang === 'en') && (
                        <div className="space-y-1">
                          <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
                            {q.en.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {q.en.question}
                          </p>
                        </div>
                      )}

                      {(writtenLang === 'bilingual' || writtenLang === 'ne') && (
                        <div className="space-y-1 pt-1">
                          <h4 className="font-serif text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {q.ne.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {q.ne.question}
                          </p>
                        </div>
                      )}

                      {isRubricOpen && q.rubric.length > 0 && (
                        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                            Marking Rubric Checklist ({q.rubric.length} points)
                          </div>
                          <ul className="space-y-1">
                            {q.rubric.map((pt, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300"
                              >
                                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 shrink-0">
                                  {i + 1}.
                                </span>
                                <span>
                                  {writtenLang === 'ne' ? pt.ne : pt.en}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-md">
                          Source: {q.sourceTitle}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <ActionButton
                            icon={isRubricOpen ? ChevronUp : ChevronDown}
                            label={isRubricOpen ? 'Hide Rubric' : 'Rubric'}
                            title="Preview bilingual marking criteria"
                            color="zinc"
                            variant="outline"
                            size="xs"
                            onClick={() =>
                              setExpandedRubricId(isRubricOpen ? null : q.id)
                            }
                          />
                          {q.sourcePath && (
                            <ActionButton
                              icon={BookOpen}
                              label="Source PDF"
                              title="Open source document in two-page reader"
                              color="zinc"
                              variant="outline"
                              size="xs"
                              to={`/read?url=${encodeURIComponent(
                                resolveSampleUrl(q.sourcePath)
                              )}`}
                            />
                          )}
                          <ActionButton
                            icon={PenLine}
                            label="Open Model Answer"
                            title="Write draft and inspect side-by-side EN/Nepali model answer"
                            color="blue"
                            variant="solid"
                            size="xs"
                            to={`/written/${q.id}`}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: OFFICIAL CURRENT AFFAIRS READING MATERIALS              */}
          {/* ============================================================== */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-950 dark:text-zinc-50">
                      Official Government Reading Materials (समसामयिक PDFs)
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Verified .gov.np bimonthly digests, Cabinet decisions, OPMCM procedures, Budget speeches, NRB Monetary Policy, and OAG/CIAA/NSO reports ready for two-page flipbook reading.
                    </p>
                  </div>
                  <ActionButton
                    icon={Layers}
                    label="Full Materials Catalog"
                    title="Browse all 9 categories and 117 official documents"
                    color="zinc"
                    variant="outline"
                    size="sm"
                    to="/materials/current-affairs-samasamayik"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <label htmlFor={materialSearchId} className="sr-only">
                      Filter Current Affairs Reading Materials
                    </label>
                    <input
                      id={materialSearchId}
                      type="text"
                      value={materialQuery}
                      onChange={(e) => setMaterialQuery(e.target.value)}
                      placeholder="Filter PDFs by title, ministry, edition, or topic..."
                      className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {materialQuery && (
                      <button
                        type="button"
                        onClick={() => setMaterialQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        aria-label="Clear material search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0">
                    {(
                      [
                        { id: 'all', label: 'All PDFs' },
                        { id: 'briefings', label: 'DoIB & Cabinet' },
                        { id: 'economy', label: 'Budget, NRB & Plan' },
                        { id: 'oversight', label: 'OAG, CIAA & NSO' },
                      ] as const
                    ).map((grp) => (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => setMaterialGroup(grp.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                          materialGroup === grp.id
                            ? 'bg-blue-700 text-white dark:bg-blue-600'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {grp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMaterials.map((item) => {
                  const fullUrl = resolveSampleUrl(item.path);
                  const bookId = createBookIdFromUrl(fullUrl);
                  const savedProgress = readingProgress[bookId];
                  const pct =
                    savedProgress && savedProgress.totalPages > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (savedProgress.lastPage / savedProgress.totalPages) *
                              100
                          )
                        )
                      : 0;
                  const linkedQuizCount =
                    (quizCountBySourcePath[item.path] ?? 0) ||
                    (quizCountBySourcePath[fullUrl] ?? 0);
                  const linkedWrittenCount =
                    (writtenCountBySourcePath[item.path] ?? 0) ||
                    (writtenCountBySourcePath[fullUrl] ?? 0);

                  return (
                    <article
                      key={item.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between gap-4 hover:border-blue-600/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <BookCoverVector
                          title={item.title}
                          codeOrEdition={item.codeOrEdition}
                          themeColor={getBookThemeColor(item.id)}
                          aspectRatio="compact"
                        />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-blue-700 dark:text-blue-400">
                              {item.codeOrEdition}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{item.pages}p</span>
                            {linkedQuizCount > 0 && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums text-crimson-700 dark:text-crimson-400">
                                  {linkedQuizCount} MCQs
                                </span>
                              </>
                            )}
                            {linkedWrittenCount > 0 && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums text-emerald-700 dark:text-emerald-400">
                                  {linkedWrittenCount} Written Q&amp;As
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {item.authority}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {pct > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                            <span>Reading Progress</span>
                            <span>
                              p. {savedProgress.lastPage}/
                              {savedProgress.totalPages} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                        <ReactionButtons
                          itemId={item.id}
                          itemType="material"
                          size="xs"
                        />

                        <div className="flex items-center gap-2">
                          <ActionButton
                            icon={ExternalLink}
                            label="Source"
                            title="Open official government PDF URL"
                            color="zinc"
                            variant="outline"
                            size="xs"
                            href={fullUrl}
                            target="_blank"
                          />
                          <ActionButton
                            icon={BookOpen}
                            label={pct > 0 ? 'Continue Reading' : 'Open Reader'}
                            title="Open document in two-page flipbook reader"
                            color="blue"
                            variant="solid"
                            size="xs"
                            onClick={() => handleOpenMaterial(item)}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cross-Format Bottom Navigation Strip */}
          <div className="mt-12 p-6 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif text-base font-semibold text-blue-950 dark:text-blue-100">
                Complete the Current Affairs Study Loop
              </h3>
              <p className="text-xs text-blue-900/80 dark:text-blue-300/80">
                Read the official PDF brief, drill timed Paper I Current Affairs MCQs with -20% negative marking, and verify Paper III analytical structures.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <ActionButton
                icon={BookOpen}
                label="Timed CA Quiz"
                title="Practice Current Affairs & Samasamayik timed quiz deck"
                color="blue"
                variant="solid"
                size="md"
                to="/quiz/current-affairs"
              />
              <ActionButton
                icon={Landmark}
                label="Written Bank"
                title="Review bilingual Paper III written answers"
                color="zinc"
                variant="outline"
                size="md"
                to="/written"
              />
            </div>
          </div>

          <GoogleAdUnit variant="horizontal" className="pt-6" />
          </div>
        </main>

        <Footer />
      </PageTransition>

        {/* Compiled Daily / Weekly / Monthly Digest Modal */}
        {isDigestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    PSC Nepal Samasamayik Digest (समसामयिक सारसङ्ग्रह)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Compiled Daily, Weekly &amp; Monthly examination reference summary
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
                    {(
                      [
                        { id: 'all', label: 'All' },
                        { id: 'daily', label: 'Daily' },
                        { id: 'weekly', label: 'Weekly' },
                        { id: 'monthly', label: 'Monthly' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDigestCadence(opt.id)}
                        className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                          digestCadence === opt.id
                            ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDigestModalOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-sm text-zinc-800 dark:text-zinc-200">
                <div className="text-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="font-serif text-xl font-bold text-blue-900 dark:text-blue-300">
                    नेपाल लोक सेवा आयोग — समसामयिक विषयवस्तु तथा वस्तुगत तथ्य सङ्ग्रह
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    दैनिक, साप्ताहिक तथा मासिक परीक्षा विशेष संकलन (शाखा अधिकृत, ना.सु. र खरिदार)
                  </div>
                </div>

                <div className="space-y-4">
                  {digestItems.map((item, i) => {
                    const cadenceInfo = getCadenceLabel(item.cadence);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                          <span>
                            {i + 1}. {item.titleNe}
                          </span>
                          <span className="font-mono text-[11px] text-zinc-500 shrink-0">
                            {cadenceInfo.ne} · {item.dateBS}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                          {item.titleEn}
                        </div>
                        <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {item.summaryNe}
                        </div>
                        <ul className="list-disc list-inside text-xs text-zinc-700 dark:text-zinc-300 space-y-0.5 pt-1">
                          {item.keyFacts.slice(0, 3).map((fact, idx) => (
                            <li key={idx}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-b-2xl">
                <span className="text-xs font-mono tabular-nums text-zinc-500">
                  {digestItems.length} topics compiled
                </span>
                <div className="flex items-center gap-2">
                  <ActionButton
                    icon={Copy}
                    label="Copy Digest"
                    title="Copy compiled Samasamayik digest notes to clipboard"
                    color="blue"
                    variant="solid"
                    size="sm"
                    onClick={() => {
                      const text = digestItems
                        .map(
                          (item, i) =>
                            `${i + 1}. ${item.titleNe} (${item.titleEn}) [${item.dateBS}]\n${item.summaryNe}\n${item.keyFacts
                              .slice(0, 3)
                              .map((f) => `• ${f}`)
                              .join('\n')}`
                        )
                        .join('\n\n');
                      void copyWithToast(
                        text,
                        'Samasamayik digest copied to clipboard.'
                      );
                    }}
                  />
                  <ActionButton
                    label="Close"
                    title="Close digest modal"
                    color="zinc"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDigestModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
