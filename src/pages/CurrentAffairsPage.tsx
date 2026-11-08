import { useId, useMemo, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Flame,
  Landmark,
  Lightbulb,
  Newspaper,
  Printer,
  RefreshCw,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionButton } from '../components/common/ActionButton';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  CURRENT_AFFAIRS_CATEGORIES,
  CURRENT_AFFAIRS_ITEMS,
  type CurrentAffairCategory,
  type CurrentAffairItem,
} from '../data/currentAffairsData';

const STORAGE_KEY_LIKES = 'psc_affairs_likes_v1';
const STORAGE_KEY_DISLIKES = 'psc_affairs_dislikes_v1';
const STORAGE_KEY_BOOKMARKS = 'psc_affairs_bookmarks_v1';

export function CurrentAffairsPage() {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CurrentAffairCategory | 'all'>('all');
  const [selectedCadre, setSelectedCadre] = useState<'all' | 'section-officer' | 'nayab-subba' | 'kharidar'>('all');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Local storage state for user engagement (Likes, Dislikes, Bookmarks)
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userDislikes, setUserDislikes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DISLIKES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleLike = (id: string) => {
    setUserLikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(next));
      } catch {}
      return next;
    });
    // Remove dislike if like is enabled
    if (!userLikes[id] && userDislikes[id]) {
      setUserDislikes((prev) => {
        const next = { ...prev, [id]: false };
        try {
          localStorage.setItem(STORAGE_KEY_DISLIKES, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  const handleToggleDislike = (id: string) => {
    setUserDislikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_DISLIKES, JSON.stringify(next));
      } catch {}
      return next;
    });
    // Remove like if dislike is enabled
    if (!userDislikes[id] && userLikes[id]) {
      setUserLikes((prev) => {
        const next = { ...prev, [id]: false };
        try {
          localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyCitation = (item: CurrentAffairItem) => {
    const text = `[PSC Nepal Samasamayik] ${item.titleNe} (${item.titleEn})\nमिति: ${item.dateBS} / ${item.dateAD}\nस्रोत: ${item.source}\nप्रमुख बुँदाहरू:\n${item.keyFacts.map((f) => `• ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = useMemo(() => {
    return CURRENT_AFFAIRS_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCadre !== 'all' && !item.cadreRelevance.includes(selectedCadre)) {
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
        const inEn = item.titleEn.toLowerCase().includes(q) || item.summaryEn.toLowerCase().includes(q);
        const inNe = item.titleNe.toLowerCase().includes(q) || item.summaryNe.toLowerCase().includes(q);
        const inFacts = item.keyFacts.some((f) => f.toLowerCase().includes(q));
        const inRelevance = item.paperRelevance.toLowerCase().includes(q);
        if (!inEn && !inNe && !inFacts && !inRelevance) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedCadre, onlyPinned, onlyBookmarked, searchQuery, bookmarkedIds]);

  const bookmarkCount = Object.values(bookmarkedIds).filter(Boolean).length;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />

        <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          {/* Breadcrumb Header */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-zinc-800 dark:text-zinc-200 font-medium">
                Current Affairs &amp; Samasamayik (समसामयिक)
              </li>
            </ol>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-900 via-blue-950 to-zinc-950 text-white p-6 sm:p-8 mb-8 overflow-hidden border border-blue-800/40 shadow-xl">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-20 -bottom-16 w-80 h-80 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-medium mb-3">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Lok Sewa 2081/82 Samasamayik Capsule</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  समसामयिक विषयवस्तु तथा घटनाक्रम
                </h1>
                <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
                  Bilingual current affairs, national pride developments, economic indicators, and statutory reforms
                  curated strictly for Nepal Lok Sewa Paper I objective MCQs &amp; Papers II–IV analytical written questions.
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
                <ActionButton
                  icon={Printer}
                  label="Monthly Digest"
                  title="Open clean printable monthly Samasamayik digest"
                  color="blue"
                  variant="solid"
                  size="md"
                  onClick={() => setIsDigestModalOpen(true)}
                  className="w-full justify-center"
                />
                <ActionButton
                  icon={BookOpen}
                  label="Practice MCQ Drills"
                  title="Practice 120+ timed Lok Sewa MCQs"
                  color="crimson"
                  variant="solid"
                  size="md"
                  to="/quiz"
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 pt-5 border-t border-blue-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-blue-900/40 p-2.5 rounded-lg border border-blue-700/40">
                <div className="text-blue-300 font-medium">Curated Topics</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">{CURRENT_AFFAIRS_ITEMS.length} Major Milestones</div>
              </div>
              <div className="bg-blue-900/40 p-2.5 rounded-lg border border-blue-700/40">
                <div className="text-blue-300 font-medium">Cadre Coverage</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">SO, Na.Su. &amp; Kharidar</div>
              </div>
              <div className="bg-blue-900/40 p-2.5 rounded-lg border border-blue-700/40">
                <div className="text-blue-300 font-medium">Paper Relevance</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">Paper I, II, III &amp; IV</div>
              </div>
              <div className="bg-blue-900/40 p-2.5 rounded-lg border border-blue-700/40">
                <div className="text-blue-300 font-medium">Saved Bookmarks</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">{bookmarkCount} Topics Saved</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs mb-8 space-y-4">
            {/* Top row: Search and Quick Toggles */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor={searchInputId} className="sr-only">
                  Search Current Affairs
                </label>
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search current affairs (e.g., 16th Plan, Fast Track, COP29, CPI, Budget 2081)..."
                  className="w-full pl-9 pr-9 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2 shrink-0">
                <ActionButton
                  icon={Flame}
                  label="High Yield Only"
                  title="Show top pinned and most frequent exam topics"
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

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
                Categories:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-700 text-white dark:bg-blue-600'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                All Topics ({CURRENT_AFFAIRS_ITEMS.length})
              </button>
              {CURRENT_AFFAIRS_CATEGORIES.map((cat) => {
                const count = CURRENT_AFFAIRS_ITEMS.filter((i) => i.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium transition-colors ${
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
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0">Target Cadre:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Cadres' },
                  { id: 'section-officer', label: 'Section Officer (अधिकृत)' },
                  { id: 'nayab-subba', label: 'Nayab Subba (ना.सु.)' },
                  { id: 'kharidar', label: 'Kharidar (खरिदार)' },
                ].map((cadre) => (
                  <button
                    key={cadre.id}
                    type="button"
                    onClick={() => setSelectedCadre(cadre.id as any)}
                    className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
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

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4 px-1">
            <span>
              Showing <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{filteredItems.length}</strong> of{' '}
              {CURRENT_AFFAIRS_ITEMS.length} current affairs entries
            </span>
            {(searchQuery || selectedCategory !== 'all' || selectedCadre !== 'all' || onlyPinned || onlyBookmarked) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCadre('all');
                  setOnlyPinned(false);
                  setOnlyBookmarked(false);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
                No current affairs matched your search
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                Try searching with other terms like "Plan", "Budget", "Climate", "BIMSTEC", or clearing filters.
              </p>
              <ActionButton
                label="Clear All Filters"
                title="Reset filters to view all topics"
                color="blue"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCadre('all');
                  setOnlyPinned(false);
                  setOnlyBookmarked(false);
                }}
              />
            </div>
          ) : (
            <div className="space-y-5">
              {filteredItems.map((item) => {
                const isExpanded = expandedItemId === item.id;
                const isBookmarked = Boolean(bookmarkedIds[item.id]);
                const isLiked = Boolean(userLikes[item.id]);
                const isDisliked = Boolean(userDislikes[item.id]);

                // Calculate interactive counts
                const displayLikes = item.likes + (isLiked ? 1 : 0);
                const displayDislikes = item.dislikes + (isDisliked ? 1 : 0);

                return (
                  <article
                    key={item.id}
                    className={`bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                      item.pinned
                        ? 'border-amber-300 dark:border-amber-900/60 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="p-5 sm:p-6">
                      {/* Top Meta Line: Category, Date, Cadre Tags, Pinned Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.pinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                              <Flame className="w-3 h-3 text-amber-500" />
                              High Yield Topic
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
                            {item.categoryLabelNe} / {item.categoryLabelEn}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            {item.dateBS} ({item.dateAD})
                          </span>
                        </div>

                        {/* Paper & Cadre Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono">
                            {item.paperRelevance.split(',')[0]}
                          </span>
                        </div>
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

                      {/* Summary */}
                      <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 mb-4 leading-relaxed bg-zinc-50/70 dark:bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
                        <p>{item.summaryNe}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">{item.summaryEn}</p>
                      </div>

                      {/* Key Examination Points (Always visible or expand) */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            महत्त्वपूर्ण परीक्षा बुँदाहरू (Key Examination Facts):
                          </span>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {item.keyFacts.length} verified facts
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {(isExpanded ? item.keyFacts : item.keyFacts.slice(0, 3)).map((fact, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                        {item.keyFacts.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" /> Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" /> Show {item.keyFacts.length - 3} more examination points &amp; exam tip
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded Section: Exam Tip & Citation */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                          <div className="bg-amber-50/70 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 text-xs">
                            <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              Exam Writing Strategy Tip (परीक्षा तयारी सुझाव):
                            </div>
                            <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">{item.examTip}</p>
                          </div>

                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">आधिकारिक स्रोत (Source):</span>
                            <span>{item.source}</span>
                          </div>
                        </div>
                      )}

                      {/* Bottom Action Footer with Shared Action Buttons, Likes, Dislikes, View */}
                      <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        {/* Engagement: Likes, Dislikes, Views */}
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          {/* Like Button */}
                          <ActionButton
                            icon={ThumbsUp}
                            label={String(displayLikes)}
                            title={isLiked ? 'Remove like' : 'Like this current affair'}
                            color={isLiked ? 'blue' : 'zinc'}
                            variant={isLiked ? 'subtle' : 'ghost'}
                            size="xs"
                            onClick={() => handleToggleLike(item.id)}
                            className={isLiked ? 'font-bold' : ''}
                          />

                          {/* Dislike Button */}
                          <ActionButton
                            icon={ThumbsDown}
                            label={String(displayDislikes)}
                            title={isDisliked ? 'Remove dislike' : 'Dislike this current affair'}
                            color={isDisliked ? 'red' : 'zinc'}
                            variant={isDisliked ? 'subtle' : 'ghost'}
                            size="xs"
                            onClick={() => handleToggleDislike(item.id)}
                            className={isDisliked ? 'font-bold' : ''}
                          />

                          {/* View Count */}
                          <span className="text-[11px] text-zinc-400 ml-1">
                            {item.views.toLocaleString()} views
                          </span>
                        </div>

                        {/* Actions: Copy, Bookmark, Toggle expand */}
                        <div className="flex items-center gap-2">
                          <ActionButton
                            icon={copiedId === item.id ? Check : Copy}
                            label={copiedId === item.id ? 'Copied' : 'Copy Citation'}
                            title="Copy formatted citation and bullet points for notes"
                            color={copiedId === item.id ? 'emerald' : 'zinc'}
                            variant="outline"
                            size="xs"
                            onClick={() => handleCopyCitation(item)}
                          />

                          <ActionButton
                            icon={BookMarked}
                            label={isBookmarked ? 'Saved' : 'Bookmark'}
                            title={isBookmarked ? 'Remove from saved' : 'Bookmark for revision'}
                            color={isBookmarked ? 'purple' : 'zinc'}
                            variant={isBookmarked ? 'solid' : 'outline'}
                            size="xs"
                            onClick={() => handleToggleBookmark(item.id)}
                          />

                          <ActionButton
                            icon={isExpanded ? ChevronUp : ChevronDown}
                            label={isExpanded ? 'Collapse' : 'Details'}
                            title={isExpanded ? 'Collapse card' : 'View full facts and exam strategy'}
                            color="zinc"
                            variant="ghost"
                            size="xs"
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Quick Study Navigation Deck */}
          <div className="mt-12 p-6 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif text-base font-semibold text-blue-900 dark:text-blue-200">
                Ready to test your Current Affairs retention?
              </h3>
              <p className="text-xs text-blue-800/80 dark:text-blue-300/80">
                Practice 120+ timed Lok Sewa Paper I General Knowledge MCQs with strict negative marking.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ActionButton
                icon={BookOpen}
                label="Launch Quiz Hall"
                title="Practice MCQs on Current Affairs"
                color="blue"
                variant="solid"
                size="md"
                to="/quiz"
              />
              <ActionButton
                icon={Landmark}
                label="Written Answers"
                title="Review subjective model answers on contemporary issues"
                color="zinc"
                variant="outline"
                size="md"
                to="/written"
              />
            </div>
          </div>
        </main>

        {/* Clean Printable Monthly Digest Modal */}
        {isDigestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800">
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    PSC Nepal Monthly Samasamayik Digest (समसामयिक सारसङ्ग्रह)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Printable examination reference sheet for Lok Sewa 2081/82
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDigestModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Printable Digest */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-800 dark:text-zinc-200 print:text-black">
                <div className="text-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="font-serif text-xl font-bold text-blue-900 dark:text-blue-300">
                    नेपाल लोक सेवा आयोग — समसामयिक विषयवस्तु तथा वस्तुगत तथ्य सङ्ग्रह
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    शाखा अधिकृत, नायब सुब्बा तथा खरिदार प्रथम पत्र (GK) तथा द्वितीय/तृतीय पत्रका लागि विशेष संकलन
                  </div>
                </div>

                <div className="space-y-4">
                  {CURRENT_AFFAIRS_ITEMS.map((item, i) => (
                    <div key={item.id} className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-blue-800 dark:text-blue-300">
                        <span>{i + 1}. {item.titleNe}</span>
                        <span className="font-mono text-[11px] text-zinc-500">{item.dateBS}</span>
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
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-b-2xl">
                <span className="text-xs text-zinc-500">
                  Total {CURRENT_AFFAIRS_ITEMS.length} high-yield topics compiled
                </span>
                <div className="flex items-center gap-2">
                  <ActionButton
                    icon={Printer}
                    label="Print / Save PDF"
                    title="Print or save digest as PDF"
                    color="blue"
                    variant="solid"
                    size="sm"
                    onClick={() => window.print()}
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

        <Footer />
      </div>
    </PageTransition>
  );
}
