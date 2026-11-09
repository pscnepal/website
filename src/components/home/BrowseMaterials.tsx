import { useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  PenLine,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ALL_QUIZ_QUESTIONS } from '../../data/quizData';
import {
  READING_MATERIAL_CATEGORIES,
  type ReadingMaterialCategory,
  type ReadingMaterialItem,
} from '../../data/readingMaterials';
import { WRITTEN_QUESTIONS } from '../../data/writtenQuestionsData';
import { createBookIdFromUrl, resolveSampleUrl } from '../../utils/urlHelpers';
import { ReactionButtons } from '../common/ReactionButtons';
import { BookCoverVector } from '../vectors/BookCoverVector';
import studyParichayaDeskImg from '../../assets/images/study_parichaya_desk_1793889771100.jpg';

export function BrowseMaterials() {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const readingProgress = useAppSelector((state) => state.library.readingProgress);

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quizCountBySourcePath = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of ALL_QUIZ_QUESTIONS) {
      if (q.sourcePath) {
        map[q.sourcePath] = (map[q.sourcePath] ?? 0) + 1;
      }
    }
    return map;
  }, []);

  const writtenCountBySourcePath = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of WRITTEN_QUESTIONS) {
      if (q.sourcePath) {
        map[q.sourcePath] = (map[q.sourcePath] ?? 0) + 1;
      }
    }
    return map;
  }, []);

  const selectedCategory: ReadingMaterialCategory | null = useMemo(
    () =>
      categoryId
        ? READING_MATERIAL_CATEGORIES.find((cat) => cat.id === categoryId) ??
          null
        : null,
    [categoryId]
  );

  const isUnknownCategory = Boolean(categoryId && !selectedCategory);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return selectedCategory.items;

    return selectedCategory.items.filter((item) => {
      const fullUrl = resolveSampleUrl(item.path).toLowerCase();
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.authority.toLowerCase().includes(normalized) ||
        item.codeOrEdition.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        fullUrl.includes(normalized)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectCategory = (nextCategoryId: string) => {
    setSearchQuery('');
    navigate(`/materials/${nextCategoryId}`);
  };

  const handleBackToCategories = () => {
    setSearchQuery('');
    navigate('/materials');
  };

  const handleOpenMaterial = (item: ReadingMaterialItem) => {
    const fullUrl = resolveSampleUrl(item.path);
    navigate(`/read?url=${encodeURIComponent(fullUrl)}`, {
      state: {
        from: location.pathname,
        fromLabel: `Back to ${selectedCategory?.name ?? 'Materials'}`,
      },
    });
  };

  const handlePracticeMaterialQuiz = (
    event: MouseEvent<HTMLButtonElement>,
    item: ReadingMaterialItem
  ) => {
    event.stopPropagation();
    navigate(`/quiz/custom?source=${encodeURIComponent(item.path)}`);
  };

  const handlePracticeMaterialWritten = (
    event: MouseEvent<HTMLButtonElement>,
    item: ReadingMaterialItem
  ) => {
    event.stopPropagation();
    navigate(`/written?source=${encodeURIComponent(item.path)}`);
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    action: () => void
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleCopyUrl = async (
    event: MouseEvent<HTMLButtonElement>,
    fullUrl: string,
    itemId: string
  ) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(itemId);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === itemId ? null : prev));
      }, 1800);
    } catch {
      // Clipboard may be restricted in some iframe contexts; fail silently
    }
  };

  const transitionProps = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Page Header & Breadcrumb Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
            <Link
              to="/"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            {selectedCategory ? (
              <>
                <Link
                  to="/materials"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Browse Materials
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                  {selectedCategory.name}
                </span>
              </>
            ) : (
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                Browse Materials
              </span>
            )}
          </div>

          <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
            {selectedCategory
              ? selectedCategory.name
              : 'Browse Books & Reading Materials'}
          </h1>
          <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
            {selectedCategory
              ? selectedCategory.description
              : 'Explore curated Nepal PSC PDF collections—including Official Lok Sewa Aayog Original Syllabi, Structured Syllabus Digests, Nepal Parichaya, Core Laws & Acts, and the 16th Plan & Governance Statutes. Open any document in Flipbook or Standard PDF mode, or download the original PDF.'}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <div className="max-w-full overflow-x-auto inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <Link
              to="/materials"
              aria-current="page"
              className="px-3 py-1.5 rounded-md font-medium bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs whitespace-nowrap shrink-0"
            >
              PSC Study Catalog
            </Link>
            <Link
              to="/library"
              className="px-3 py-1.5 rounded-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors whitespace-nowrap shrink-0"
            >
              Personal Library
            </Link>
            <Link
              to="/read"
              className="px-3 py-1.5 rounded-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors whitespace-nowrap shrink-0"
            >
              Open Reader
            </Link>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
            {selectedCategory ? (
              <span>
                {filteredItems.length} of {selectedCategory.items.length} URLs shown
              </span>
            ) : (
              <span>
                {READING_MATERIAL_CATEGORIES.length} collections ·{' '}
                {READING_MATERIAL_CATEGORIES.reduce(
                  (acc, cat) => acc + cat.items.length,
                  0
                )}{' '}
                documents
              </span>
            )}
          </div>
        </div>
      </div>

      {isUnknownCategory ? (
        <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Collection not found
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            The requested reading collection does not exist. Choose one of the available sections below.
          </p>
          <button
            type="button"
            onClick={handleBackToCategories}
            className="mt-5 inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View All Collections</span>
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {!selectedCategory ? (
            <motion.div
              key="category-grid"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
              transition={transitionProps}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {READING_MATERIAL_CATEGORIES.map((category, index) => {
                const totalCategoryPages = category.items.reduce(
                  (sum, item) => sum + item.pages,
                  0
                );
                const categoryQuizCount = category.items.reduce(
                  (sum, item) => sum + (quizCountBySourcePath[item.path] ?? 0),
                  0
                );
                const categoryWrittenCount = category.items.reduce(
                  (sum, item) =>
                    sum + (writtenCountBySourcePath[item.path] ?? 0),
                  0
                );
                const startedInCategory = category.items.filter((item) => {
                  const id = createBookIdFromUrl(resolveSampleUrl(item.path));
                  return Boolean(readingProgress[id]);
                }).length;
                const sampleTitles = category.items
                  .slice(0, 3)
                  .map((item) => item.title.replace(/^Nepal Parichaya:\s*/i, ''))
                  .join(' · ');

                return (
                  <article
                    key={category.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${category.name} reading materials`}
                    onClick={() => handleSelectCategory(category.id)}
                    onKeyDown={(e) =>
                      handleCardKeyDown(e, () =>
                        handleSelectCategory(category.id)
                      )
                    }
                    className="group flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <div>
                      {/* Quiet unboxed metadata with typographic separators */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <span className="font-semibold text-crimson-700 dark:text-crimson-400">
                          0{index + 1}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{category.items.length} documents</span>
                        <span aria-hidden="true">·</span>
                        <span>{totalCategoryPages} pages</span>
                        {categoryQuizCount > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{categoryQuizCount} quiz Qs</span>
                          </>
                        )}
                        {categoryWrittenCount > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{categoryWrittenCount} written Qs</span>
                          </>
                        )}
                        {startedInCategory > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-blue-700 dark:text-blue-400">
                              {startedInCategory}/{category.items.length} opened
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="mt-3 font-serif text-fluid-h2 font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h2>

                      <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {category.subtitle}
                      </p>

                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {category.description}
                      </p>

                      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          Includes:
                        </span>{' '}
                        {sampleTitles}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
                        View {category.items.length} Document URLs
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </article>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key={`category-detail-${selectedCategory.id}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
              transition={transitionProps}
              className="space-y-6"
            >
              {/* Interactive Section Switcher & Search Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBackToCategories}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Collections</span>
                  </button>

                  <div
                    role="group"
                    aria-label="Reading material collections"
                    className="max-w-full overflow-x-auto flex items-center gap-1 p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                  >
                    {READING_MATERIAL_CATEGORIES.map((cat) => {
                      const isActive = cat.id === selectedCategory.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                            isActive
                              ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-xs'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search Filter */}
                <div className="relative w-full lg:w-72 shrink-0">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Filter ${selectedCategory.name}...`}
                    aria-label={`Filter ${selectedCategory.name} documents`}
                    className="w-full h-9 pl-8 pr-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear filter"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Showcase Banner for Nepal Parichaya / Official Compendiums */}
              {selectedCategory.id === 'nepal-parichaya' && (
                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col sm:flex-row items-stretch">
                  <div className="sm:w-2/5 relative h-48 sm:h-auto min-h-[160px] overflow-hidden">
                    <img
                      src={studyParichayaDeskImg || '/images/study_parichaya_desk_1793889771100.jpg'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/study_parichaya_desk_1793889771100.jpg';
                      }}
                      alt="Official Nepal Parichaya Compendiums on Study Desk"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-transparent to-transparent sm:from-transparent" />
                  </div>
                  <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60">
                          Complete 13-Edition Compendium
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">२०६९ — २०८२</span>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
                        नेपाल परिचय (Nepal Parichaya) Official Library
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Published by the Department of Information and Broadcasting (सूचना तथा प्रसारण विभाग), Government of Nepal. Every edition from the 1st revised (२०६९) to the latest 13th edition (२०८२) indexed for comprehensive civil service revision.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tabular-nums pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span>13 Official Editions</span>
                      <span aria-hidden="true">·</span>
                      <span>4 Curated Study Digests</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-700 dark:text-blue-400 font-medium">3D Flipbook &amp; PDF</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Document URL Cards List */}
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    No documents matched &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Try clearing the search filter or switching to another reading section.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 inline-flex items-center justify-center h-8 px-3.5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredItems.map((item) => {
                    const fullUrl = resolveSampleUrl(item.path);
                    const bookId = createBookIdFromUrl(fullUrl);
                    const savedProgress = readingProgress[bookId];
                    const linkedQuestions = quizCountBySourcePath[item.path] ?? 0;
                    const linkedWritten =
                      writtenCountBySourcePath[item.path] ?? 0;
                    const completionPct =
                      savedProgress && savedProgress.totalPages > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (savedProgress.lastPage /
                                savedProgress.totalPages) *
                                100
                            )
                          )
                        : 0;
                    const isCopied = copiedId === item.id;

                    return (
                      <article
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${item.title} in Read Mode`}
                        onClick={() => handleOpenMaterial(item)}
                        onKeyDown={(e) =>
                          handleCardKeyDown(e, () => handleOpenMaterial(item))
                        }
                        className="group flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <BookCoverVector
                            title={item.title}
                            codeOrEdition={item.codeOrEdition}
                            themeColor={
                              item.id.includes('13th') || item.id.includes('constitution')
                                ? 'crimson'
                                : item.id.includes('12th') || item.id.includes('geography')
                                  ? 'navy'
                                  : item.id.includes('11th') || item.id.includes('local-government')
                                    ? 'emerald'
                                    : 'amber'
                            }
                            aspectRatio="compact"
                            className="hidden xs:flex sm:flex"
                          />
                          <div className="min-w-0 flex-1">
                            {/* Unboxed metadata row */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                              <span>{item.authority}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.codeOrEdition}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                {item.pages} pages
                              </span>
                              {linkedQuestions > 0 && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums">
                                    {linkedQuestions} quiz Qs
                                  </span>
                                </>
                              )}
                              {linkedWritten > 0 && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums">
                                    {linkedWritten} written Qs
                                  </span>
                                </>
                              )}
                              {savedProgress ? (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums text-blue-700 dark:text-blue-400">
                                    Page {savedProgress.lastPage}/{savedProgress.totalPages} ({completionPct}%)
                                  </span>
                                </>
                              ) : null}
                            </div>

                            {/* Display Name */}
                            <h2 className="mt-2.5 font-serif text-fluid-h3 font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h2>

                            {/* Document Details */}
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3.5">
                          {savedProgress && (
                            <div className="h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 dark:bg-blue-400 transition-transform duration-300 origin-left"
                                style={{
                                  transform: `scaleX(${completionPct / 100})`,
                                }}
                              />
                            </div>
                          )}

                          {/* Explicit Document URL & Direct Download Row */}
                          <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                                Document PDF URL
                              </span>
                              <div className="flex flex-wrap items-center gap-2.5">
                                {item.externalSourceUrl && (
                                  <a
                                    href={item.externalSourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-blue-700 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                                  >
                                    <span>
                                      {item.externalSourceUrl.includes('doib.gov.np')
                                        ? 'doib.gov.np'
                                        : item.externalSourceUrl.includes('giwmscdnone.gov.np')
                                          ? 'giwms.gov.np'
                                          : item.externalSourceUrl.includes('psc.gov.np')
                                            ? 'psc.gov.np'
                                            : 'Official Source'}
                                    </span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                <a
                                  href={fullUrl}
                                  download
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  aria-label={`Download PDF for ${item.title}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleCopyUrl(e, fullUrl, item.id)
                                  }
                                  onKeyDown={(e) => e.stopPropagation()}
                                  aria-label={`Copy PDF URL for ${item.title}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                      <span className="text-emerald-600 dark:text-emerald-400">
                                        Copied
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy URL</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <p
                              title={fullUrl}
                              className="font-mono text-xs text-zinc-600 dark:text-zinc-300 truncate"
                            >
                              {fullUrl}
                            </p>
                          </div>

                          {/* Read + Practice Quiz & Written Q&A Actions Footer */}
                          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <ReactionButtons
                                itemId={item.id}
                                itemType="material"
                                size="sm"
                              />

                              {linkedQuestions > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handlePracticeMaterialQuiz(e, item)
                                  }
                                  onKeyDown={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                >
                                  <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                                  <span>Quiz ({linkedQuestions})</span>
                                </button>
                              )}

                              {linkedWritten > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handlePracticeMaterialWritten(e, item)
                                  }
                                  onKeyDown={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                >
                                  <PenLine className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                                  <span>Written ({linkedWritten})</span>
                                </button>
                              )}

                              {linkedQuestions === 0 && linkedWritten === 0 && (
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {savedProgress && savedProgress.lastPage > 1
                                    ? `Resume from page ${savedProgress.lastPage}`
                                    : 'Flipbook or Standard PDF view'}
                                </span>
                              )}
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ml-auto">
                              <span>
                                {savedProgress && savedProgress.lastPage > 1
                                  ? `Resume p.${savedProgress.lastPage}`
                                  : 'Open in Read Mode'}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
