import { useId, useMemo, useState } from 'react';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  History,
  Lightbulb,
  Play,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { ActionButton } from '../components/common/ActionButton';
import { ReactionButtons } from '../components/common/ReactionButtons';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  PYQ_QUESTION_ENTRIES,
  PYQ_RECURRING_TOPIC_STATS,
  type PyqQuestion,
} from '../data/pyqData';
import { recordView } from '../features/reactions/reactionsSlice';

export type PyqPageTab = 'archive' | 'heatmap' | 'challenge';

const STORAGE_KEY_PYQ_BOOKMARKS = 'psc_pyq_bookmarks_v1';

export function PyqArchivePage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputId = useId();

  const activeTab: PyqPageTab = (searchParams.get('tab') as PyqPageTab) || 'archive';

  const handleTabChange = (tab: PyqPageTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  // Archive filters
  const [selectedCadre, setSelectedCadre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedPaper, setSelectedPaper] = useState<string>('all');
  const [onlyHighYield, setOnlyHighYield] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Bookmarking state
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PYQ_BOOKMARKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_PYQ_BOOKMARKS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyQuestion = (q: PyqQuestion) => {
    const text = `[लोक सेवा आयोग विगतको प्रश्न (${q.yearBS} - ${q.cadreLabelNe})]\nपत्र: ${q.paperNameNe} (${q.marks} अङ्क)\n\nप्रश्न:\n${q.questionNe}\n(${q.questionEn})\n\nउत्तर संरचना बुँदाहरू:\n${q.outlineHintsNe.map((h) => `• ${h}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return PYQ_QUESTION_ENTRIES.filter((q) => {
      if (selectedCadre !== 'all' && q.cadre !== selectedCadre) {
        return false;
      }
      if (selectedYear !== 'all' && q.yearBS !== selectedYear) {
        return false;
      }
      if (selectedPaper !== 'all' && q.paper !== selectedPaper) {
        return false;
      }
      if (onlyHighYield && !q.recurringFrequencyBadge.includes('7+')) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inNe = q.questionNe.toLowerCase().includes(query);
        const inEn = q.questionEn.toLowerCase().includes(query);
        const inHints = q.outlineHintsNe.some((h) => h.toLowerCase().includes(query));
        const inCategory = q.topicCategoryLabelNe.toLowerCase().includes(query);
        if (!inNe && !inEn && !inHints && !inCategory) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCadre, selectedYear, selectedPaper, onlyHighYield, searchQuery]);

  const bookmarkCount = Object.values(bookmarkedIds).filter(Boolean).length;

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
              <li className="text-zinc-800 dark:text-zinc-200 font-medium">
                Past Years Questions &amp; Frequency Analysis (विगतका प्रश्नहरू)
              </li>
            </ol>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 mb-8 overflow-hidden border border-blue-900/40 shadow-xl">
            <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-28 -top-16 w-64 h-64 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-medium mb-3">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span>विगतका वास्तविक परीक्षा प्रश्नहरू (२०७५–२०८० BS)</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  विगतका प्रश्न सङ्ग्रह तथा पुनरावृत्ति विश्लेषण
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  Authentic Lok Sewa past exam questions, high-yield recurrence trend analysis, bilingual model answer hints,
                  and strategic advice from top rankers for Section Officer, Na.Su., and Kharidar.
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
                <ActionButton
                  icon={BarChart3}
                  label="Frequency Heatmap"
                  title="View top repeated exam themes"
                  color="blue"
                  variant="solid"
                  size="md"
                  onClick={() => handleTabChange('heatmap')}
                  className="w-full justify-center"
                />
                <ActionButton
                  icon={BookOpen}
                  label="Written Model Answers"
                  title="Explore full bilingual model answers"
                  color="crimson"
                  variant="solid"
                  size="md"
                  to="/written"
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-blue-300 font-medium">Exam Cycles</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">२०७५ देखि २०८० BS</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-blue-300 font-medium">Cadre Coverage</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">SO, Na.Su. &amp; Kharidar</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-blue-300 font-medium">Top Recurring Themes</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">६ Evergreen Topics</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-blue-300 font-medium">Saved Questions</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">{bookmarkCount} Questions Saved</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleTabChange('archive')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'archive'
                  ? 'border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Questions Archive (विगतका प्रश्नहरू)</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {PYQ_QUESTION_ENTRIES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('heatmap')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'heatmap'
                  ? 'border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Frequency Trend Heatmap (पुनरावृत्ति म्याप)</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                High Yield
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('challenge')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'challenge'
                  ? 'border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Mock PYQ Challenge (विगतका सेट अभ्यास)</span>
            </button>
          </div>

          {/* TAB 1: Questions Archive */}
          {activeTab === 'archive' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                {/* Search & High Yield Toggle */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <label htmlFor={searchInputId} className="sr-only">
                      Search Questions
                    </label>
                    <input
                      id={searchInputId}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search past questions (e.g., सुशासन, नागरिक बडापत्र, संघीयता, विप्रेषण, टिप्पणी)..."
                      className="w-full pl-9 pr-9 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <ActionButton
                    icon={Flame}
                    label="Tested 7+ Times Only"
                    title="Filter questions that appear repeatedly"
                    color={onlyHighYield ? 'amber' : 'zinc'}
                    variant={onlyHighYield ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setOnlyHighYield((prev) => !prev)}
                  />
                </div>

                {/* Cadre & Year Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  {/* Cadre Filter */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-zinc-500 uppercase mr-1">Cadre:</span>
                    {[
                      { id: 'all', label: 'All Cadres' },
                      { id: 'section-officer', label: 'Section Officer (अधिकृत)' },
                      { id: 'nayab-subba', label: 'Nayab Subba (ना.सु.)' },
                      { id: 'kharidar', label: 'Kharidar (खरिदार)' },
                    ].map((cadre) => (
                      <button
                        key={cadre.id}
                        type="button"
                        onClick={() => setSelectedCadre(cadre.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedCadre === cadre.id
                            ? 'bg-blue-700 text-white dark:bg-blue-600'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {cadre.label}
                      </button>
                    ))}
                  </div>

                  {/* Year & Paper Dropdown */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-500 text-xs">Year:</span>
                      <SharedSearchSelect
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={[
                          { label: 'All Years (सबै वर्ष)', value: 'all' },
                          { label: '२०८० BS', value: '२०८०' },
                          { label: '२०७९ BS', value: '२०७९' },
                          { label: '२०७८ BS', value: '२०७८' },
                          { label: '२०७७ BS', value: '२०७७' },
                        ]}
                        enableSearch={false}
                        size="xs"
                        popoverWidth="w-44"
                        ariaLabel="Filter by examination year"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-500 text-xs">Paper:</span>
                      <SharedSearchSelect
                        value={selectedPaper}
                        onChange={setSelectedPaper}
                        options={[
                          { label: 'All Papers (सबै पत्र)', value: 'all' },
                          { label: 'Paper II (Governance)', value: 'Paper II' },
                          { label: 'Paper III (Contemporary)', value: 'Paper III' },
                          { label: 'Paper IV (Service Rules)', value: 'Paper IV' },
                        ]}
                        enableSearch={false}
                        size="xs"
                        popoverWidth="w-52"
                        ariaLabel="Filter by paper"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Feed */}
              <div className="space-y-4">
                {filteredQuestions.map((q) => {
                  const isExpanded = expandedQuestionId === q.id;
                  const isBookmarked = Boolean(bookmarkedIds[q.id]);

                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                    >
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* Top Badges Line */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {q.yearBS} BS · {q.cadreLabelNe}
                            </span>
                            <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                              {q.paper} ({q.marks} Marks)
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                              <Flame className="w-3 h-3 text-amber-500" />
                              {q.recurringFrequencyBadge}
                            </span>
                          </div>

                          <div className="text-zinc-500 font-medium">
                            {q.topicCategoryLabelNe}
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-950 dark:text-zinc-50 leading-relaxed">
                            {q.questionNe}
                          </h3>
                          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic">
                            {q.questionEn}
                          </p>
                        </div>

                        {/* Expandable Answer Outline Hints */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-3.5 rounded-lg border border-blue-200 dark:border-blue-900/60 text-xs sm:text-[13px] space-y-2">
                              <div className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>आदर्श उत्तर संरचना तथा परीक्षा बुँदाहरू (Model Answer Outline):</span>
                              </div>
                              <ul className="space-y-1.5 text-zinc-800 dark:text-zinc-200">
                                {q.outlineHintsNe.map((hint, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                                    <span>{hint}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Bottom Action Footer */}
                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <ReactionButtons
                            itemId={q.linkedWrittenQuestionId || q.id}
                            itemType="question"
                            size="xs"
                          />

                          <div className="flex items-center gap-2">
                            {q.linkedWrittenQuestionId ? (
                              <ActionButton
                                icon={ExternalLink}
                                label="View Full Model Answer"
                                title="Read complete bilingual model answer with marking rubric"
                                color="blue"
                                variant="solid"
                                size="xs"
                                to={`/written/${q.linkedWrittenQuestionId}`}
                              />
                            ) : (
                              <ActionButton
                                icon={Play}
                                label="Practice Answer"
                                title="Open written simulation notepad"
                                color="blue"
                                variant="outline"
                                size="xs"
                                to="/simulate"
                              />
                            )}

                            <ActionButton
                              icon={copiedId === q.id ? Check : Copy}
                              label={copiedId === q.id ? 'Copied' : 'Copy'}
                              title="Copy question text and outline hints"
                              color="zinc"
                              variant="outline"
                              size="xs"
                              onClick={() => handleCopyQuestion(q)}
                            />

                            <ActionButton
                              icon={BookMarked}
                              label={isBookmarked ? 'Saved' : 'Bookmark'}
                              title={isBookmarked ? 'Remove bookmark' : 'Save question for revision'}
                              color={isBookmarked ? 'purple' : 'zinc'}
                              variant={isBookmarked ? 'solid' : 'outline'}
                              size="xs"
                              onClick={() => handleToggleBookmark(q.id)}
                            />

                            <ActionButton
                              icon={isExpanded ? ChevronUp : ChevronDown}
                              label={isExpanded ? 'Hide Outline' : 'Answer Outline'}
                              title={isExpanded ? 'Hide outline hints' : 'View model answer outline'}
                              color="zinc"
                              variant="ghost"
                              size="xs"
                              onClick={() => {
                                if (!isExpanded) {
                                  dispatch(
                                    recordView({
                                      itemId: q.linkedWrittenQuestionId || q.id,
                                      itemType: 'question',
                                    })
                                  );
                                }
                                setExpandedQuestionId(isExpanded ? null : q.id);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Frequency Trend Heatmap */}
          {activeTab === 'heatmap' && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs sm:text-sm text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-serif font-bold text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>लोक सेवा परीक्षा उच्च पुनरावृत्ति विश्लेषण (High-Yield Topic Matrix)</span>
                </div>
                <p className="text-blue-800/80 dark:text-blue-300/80">
                  A retrospective analysis of the last 10 examination cycles (२०७१–२०८० BS). Topics below appear almost
                  every single year across Paper II &amp; Paper III. Master their legal provisions and structured templates first.
                </p>
              </div>

              {/* Recurring Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PYQ_RECURRING_TOPIC_STATS.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-xs"
                  >
                    {/* Header: Topic Title & Recurrence Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-zinc-500 uppercase tracking-wide">
                          {topic.trend === 'evergreen' ? 'Evergreen High Yield' : 'Rising Trend Topic'}
                        </span>
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          {topic.frequencyScore}/10 Exam Cycles ({topic.recurrencePercentage}%)
                        </span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                        {topic.topicNameNe}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{topic.topicNameEn}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                        style={{ width: `${topic.recurrencePercentage}%` }}
                      />
                    </div>

                    {/* Why it repeats */}
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
                      <strong className="text-zinc-900 dark:text-zinc-100 block">किन बारम्बार सोधिन्छ? (Why it Repeats):</strong>
                      <p className="leading-relaxed">{topic.whyItRepeatsNe}</p>
                    </div>

                    {/* Ranker Strategy Tip */}
                    <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 space-y-1">
                      <strong className="font-semibold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        टपर / सफल परीक्षार्थीको रणनीति (Ranker Strategy):
                      </strong>
                      <p className="leading-relaxed">{topic.rankerTipNe}</p>
                    </div>

                    {/* Mandatory Statutory Citations */}
                    <div className="text-xs">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                        अनिवार्य उल्लेख गर्नुपर्ने कानुनी व्यवस्थाहरू (Statutes):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.suggestedStatutes.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Mock PYQ Challenge */}
          {activeTab === 'challenge' && (
            <div className="space-y-6">
              <div className="bg-zinc-900 text-white p-6 rounded-xl space-y-2 border border-zinc-800">
                <h3 className="font-serif text-lg font-bold">
                  विगतका वास्तविक प्रश्नपत्रबाट नमुना परीक्षा (Full Past Exam Sittings)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                  Test your real examination hall preparedness by taking an authentic past Lok Sewa examination paper
                  under strict countdown timers and negative marking rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    cadre: 'Section Officer (शाखा अधिकृत)',
                    year: '२०८० Paper I & II',
                    duration: '90 Mins / 3 Hours',
                    desc: 'Complete 2080 Section Officer Stage I screening MCQ test and Stage II Governance paper.',
                    preset: 'Section Officer (Paper I)',
                  },
                  {
                    cadre: 'Nayab Subba (नायब सुब्बा)',
                    year: '२०८० Paper I & II',
                    duration: '45 Mins / 2.5 Hours',
                    desc: 'Full 2080 Na.Su. general knowledge and contemporary service management test.',
                    preset: 'Nayab Subba (Paper I)',
                  },
                  {
                    cadre: 'Kharidar (खरिदार)',
                    year: '२०८० Paper I & II',
                    duration: '45 Mins / 2.5 Hours',
                    desc: 'Authentic 2080 Kharidar objective paper and office management descriptive writing set.',
                    preset: 'Kharidar (Paper I)',
                  },
                ].map((challenge, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-semibold text-crimson-700 dark:text-crimson-400 mb-1">
                        {challenge.year}
                      </div>
                      <h4 className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50">
                        {challenge.cadre}
                      </h4>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{challenge.duration}</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {challenge.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                      <ActionButton
                        icon={Play}
                        label="Launch Past Paper"
                        title="Start timed past examination simulation"
                        color="crimson"
                        variant="solid"
                        size="sm"
                        to={`/simulate?preset=${encodeURIComponent(challenge.preset)}&launch=1`}
                        className="w-full justify-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
