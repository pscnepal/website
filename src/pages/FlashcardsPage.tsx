import { useEffect, useId, useMemo, useState } from 'react';
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  List,
  RotateCw,
  Search,
  Shuffle,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionButton } from '../components/common/ActionButton';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  FLASHCARD_DECKS,
  FLASHCARD_ITEMS,
  type FlashcardDeckId,
  type FlashcardItem,
} from '../data/flashcardsData';

// Leitner Box level: 1 = Learning (New / Needs practice), 2 = Review, 3 = Mastered
export type LeitnerBoxLevel = 1 | 2 | 3;

interface FlashcardProgress {
  boxLevel: LeitnerBoxLevel;
  lastReviewedAt: number;
  timesReviewed: number;
  timesCorrect: number;
}

const STORAGE_KEY_PROGRESS = 'psc_flashcards_progress_v2';

export function FlashcardsPage() {
  const searchInputId = useId();

  // Selected deck & view mode
  const [selectedDeckId, setSelectedDeckId] = useState<FlashcardDeckId | 'all'>('all');
  const [viewMode, setViewMode] = useState<'study' | 'browse'>('study');
  const [filterBoxLevel, setFilterBoxLevel] = useState<'all' | LeitnerBoxLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Study session state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Progress state from localStorage
  const [progressMap, setProgressMap] = useState<Record<string, FlashcardProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveProgress = (cardId: string, level: LeitnerBoxLevel) => {
    setProgressMap((prev) => {
      const current = prev[cardId] || {
        boxLevel: 1,
        lastReviewedAt: 0,
        timesReviewed: 0,
        timesCorrect: 0,
      };

      const updated: FlashcardProgress = {
        boxLevel: level,
        lastReviewedAt: Date.now(),
        timesReviewed: current.timesReviewed + 1,
        timesCorrect: level > 1 ? current.timesCorrect + 1 : current.timesCorrect,
      };

      const next = { ...prev, [cardId]: updated };
      try {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered deck items
  const activeDeckCards = useMemo(() => {
    let cards = FLASHCARD_ITEMS;
    if (selectedDeckId !== 'all') {
      cards = cards.filter((c) => c.deckId === selectedDeckId);
    }
    if (filterBoxLevel !== 'all') {
      cards = cards.filter((c) => {
        const p = progressMap[c.id];
        const level = p ? p.boxLevel : 1;
        return level === filterBoxLevel;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter((c) => {
        return (
          c.frontNe.toLowerCase().includes(q) ||
          c.frontEn.toLowerCase().includes(q) ||
          c.backNe.toLowerCase().includes(q) ||
          c.backEn.toLowerCase().includes(q) ||
          c.examContext.toLowerCase().includes(q)
        );
      });
    }
    return cards;
  }, [selectedDeckId, filterBoxLevel, searchQuery, progressMap]);

  // Active current card
  const activeCard: FlashcardItem | undefined = activeDeckCards[currentCardIndex];

  // Reset index when deck/filter changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedDeckId, filterBoxLevel, searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight' && isFlipped && activeCard) {
        e.preventDefault();
        handleScoreCard(3); // Easy / Mastered
      } else if (e.code === 'ArrowDown' && isFlipped && activeCard) {
        e.preventDefault();
        handleScoreCard(2); // Good
      } else if (e.code === 'ArrowLeft' && isFlipped && activeCard) {
        e.preventDefault();
        handleScoreCard(1); // Hard
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, activeCard]);

  const handleScoreCard = (level: LeitnerBoxLevel) => {
    if (!activeCard) return;

    saveProgress(activeCard.id, level);
    setIsFlipped(false);

    // Advance to next card
    if (currentCardIndex < activeDeckCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Finished deck
      setCurrentCardIndex(0);
    }
  };

  const handleShuffle = () => {
    setCurrentCardIndex(Math.floor(Math.random() * Math.max(1, activeDeckCards.length)));
    setIsFlipped(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('के तपाईं यस डेकको स्मरण प्रगति रिसेट गर्न चाहनुहुन्छ? (Reset Leitner progress for this deck?)')) {
      setProgressMap((prev) => {
        const next = { ...prev };
        activeDeckCards.forEach((c) => {
          delete next[c.id];
        });
        try {
          localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(next));
        } catch {}
        return next;
      });
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  // Stats calculation
  const totalCardsCount = FLASHCARD_ITEMS.length;
  const masteredCount = Object.values(progressMap).filter((p) => p.boxLevel === 3).length;
  const learningCount = Object.values(progressMap).filter((p) => p.boxLevel === 2).length;
  const newOrHardCount = totalCardsCount - masteredCount - learningCount;
  const overallMasteryPct = Math.round((masteredCount / totalCardsCount) * 100);

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
                Flashcard Studio (स्मरण कार्ड - Leitner System)
              </li>
            </ol>
          </nav>

          {/* Hero Banner with Leitner Box Progress */}
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 mb-8 overflow-hidden border border-indigo-900/40 shadow-xl">
            <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-28 -top-16 w-64 h-64 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-medium mb-3">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Leitner Spaced Repetition (स्मरण विधि)</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  लोक सेवा स्मरण कार्ड स्टुडियो (Flashcards)
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  Rapidly memorize constitutional articles, geographic coordinates, historic treaty dates,
                  and 16th Plan targets using the scientifically proven Leitner Spaced Repetition System.
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
                <ActionButton
                  icon={viewMode === 'study' ? List : Brain}
                  label={viewMode === 'study' ? 'Browse All Cards' : 'Interactive Flashcard Mode'}
                  title="Toggle between single card study and table browsing"
                  color="blue"
                  variant="solid"
                  size="md"
                  onClick={() => setViewMode((prev) => (prev === 'study' ? 'browse' : 'study'))}
                  className="w-full justify-center"
                />
                <ActionButton
                  icon={Shuffle}
                  label="Shuffle Deck"
                  title="Randomize flashcard order"
                  color="zinc"
                  variant="outline"
                  size="md"
                  onClick={handleShuffle}
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Leitner Box 3-Tier Retention Bar */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Box 1: Needs Practice</div>
                <div className="text-base sm:text-lg font-bold text-crimson-400 mt-0.5">{newOrHardCount} Cards</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Box 2: In Review</div>
                <div className="text-base sm:text-lg font-bold text-amber-400 mt-0.5">{learningCount} Cards</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Box 3: Mastered (कण्ठ)</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">{masteredCount} Cards</div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-medium">Mastery Rate</div>
                <div className="text-base sm:text-lg font-bold text-blue-400 mt-0.5">{overallMasteryPct}% Retained</div>
              </div>
            </div>
          </div>

          {/* Deck Selector Pills */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs mb-8 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider">Select Deck:</span>
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-xs text-zinc-500 hover:text-crimson-600 dark:hover:text-crimson-400 flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                Reset Deck Progress
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedDeckId('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDeckId === 'all'
                    ? 'bg-blue-700 text-white dark:bg-blue-600'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                All Decks ({FLASHCARD_ITEMS.length})
              </button>
              {FLASHCARD_DECKS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDeckId(d.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedDeckId === d.id
                      ? 'bg-blue-700 text-white dark:bg-blue-600'
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {d.nameNe} ({d.totalCards})
                </button>
              ))}
            </div>

            {/* Filter by Box Level & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-zinc-500 mr-1">Filter Retention:</span>
                {[
                  { id: 'all', label: 'All Cards' },
                  { id: 1, label: 'Box 1: Hard / New' },
                  { id: 2, label: 'Box 2: Review' },
                  { id: 3, label: 'Box 3: Mastered' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFilterBoxLevel(lvl.id as any)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      filterBoxLevel === lvl.id
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor={searchInputId} className="sr-only">
                  Search Flashcards
                </label>
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards..."
                  className="w-full pl-8 pr-7 py-1 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: Interactive Flashcard Study Studio */}
          {viewMode === 'study' && (
            <div className="space-y-6">
              {activeDeckCards.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
                  <Brain className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">
                    No flashcards found in this filter
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                    All cards in this tier may be mastered or no search results matched. Try resetting filters.
                  </p>
                  <ActionButton
                    label="Reset Filters"
                    title="Show all cards in deck"
                    color="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDeckId('all');
                      setFilterBoxLevel('all');
                      setSearchQuery('');
                    }}
                  />
                </div>
              ) : activeCard ? (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Card Navigation & Counter Header */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Card {currentCardIndex + 1} of {activeDeckCards.length}
                      </span>
                      <span>·</span>
                      <span className="text-blue-700 dark:text-blue-400 font-medium">
                        {activeCard.deckNameNe}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {progressMap[activeCard.id]?.boxLevel === 3
                          ? 'Box 3: Mastered'
                          : progressMap[activeCard.id]?.boxLevel === 2
                            ? 'Box 2: In Review'
                            : 'Box 1: Learning'}
                      </span>
                    </div>
                  </div>

                  {/* 3D Interactive Flip Card */}
                  <div
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="min-h-[300px] sm:min-h-[340px] rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/60 dark:hover:border-blue-400/60 shadow-lg cursor-pointer transition-all flex flex-col justify-between select-none relative group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Flashcard: ${isFlipped ? 'Back side showing' : 'Front side showing'}. Click to flip.`}
                  >
                    {/* Top pill inside card */}
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        {isFlipped ? 'Answer / समाधान खण्ड' : 'Question / प्रश्न खण्ड'}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                        Click or Space to flip
                      </span>
                    </div>

                    {/* Card Content: Front vs Back */}
                    <div className="py-6 sm:py-8 text-center space-y-4">
                      {!isFlipped ? (
                        <>
                          <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                            {activeCard.frontNe}
                          </h2>
                          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic max-w-lg mx-auto">
                            {activeCard.frontEn}
                          </p>
                        </>
                      ) : (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                          <h2 className="font-serif text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-300 leading-snug">
                            {activeCard.backNe}
                          </h2>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg mx-auto">
                            {activeCard.backEn}
                          </p>

                          {activeCard.mnemonicTipNe && (
                            <div className="mt-4 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-left max-w-md mx-auto">
                              <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                सम्झने सुत्र (Mnemonic Trick):
                              </div>
                              <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                                {activeCard.mnemonicTipNe}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom exam context tag */}
                    <div className="text-[11px] text-zinc-400 text-center">
                      <span>{activeCard.examContext}</span>
                    </div>
                  </div>

                  {/* Leitner Feedback Buttons (Visible when flipped) */}
                  {isFlipped ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      <div className="text-xs text-center font-medium text-zinc-500">
                        Rate your recall for this flashcard:
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => handleScoreCard(1)}
                          className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-crimson-50 hover:bg-crimson-100 dark:bg-crimson-950/60 dark:hover:bg-crimson-900/60 text-crimson-800 dark:text-crimson-300 border border-crimson-200 dark:border-crimson-800/80 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-bold">Hard / Again</span>
                          <span className="text-[11px] text-crimson-600 dark:text-crimson-400">फेरि अभ्यास (Box 1)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleScoreCard(2)}
                          className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-bold">Good</span>
                          <span className="text-[11px] text-amber-600 dark:text-amber-400">ठिकै छ (Box 2)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleScoreCard(3)}
                          className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-bold">Easy / Mastered</span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">कण्ठस्थ (Box 3)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <ActionButton
                        icon={RotateCw}
                        label="Flip to Reveal Answer (Space)"
                        title="Reveal answer and memory mnemonic"
                        color="blue"
                        variant="solid"
                        size="md"
                        onClick={() => setIsFlipped(true)}
                        className="px-6"
                      />
                    </div>
                  )}

                  {/* Previous / Next Navigation Row */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <ActionButton
                      icon={ChevronLeft}
                      label="Previous"
                      title="Go to previous card"
                      color="zinc"
                      variant="outline"
                      size="sm"
                      disabled={currentCardIndex === 0}
                      onClick={() => {
                        setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                        setIsFlipped(false);
                      }}
                    />

                    <div className="text-zinc-400 text-xs font-mono">
                      Keyboard: [Space] Flip · [←] Hard · [↓] Good · [→] Easy
                    </div>

                    <ActionButton
                      icon={ChevronRight}
                      iconPosition="right"
                      label="Next"
                      title="Go to next card"
                      color="zinc"
                      variant="outline"
                      size="sm"
                      disabled={currentCardIndex >= activeDeckCards.length - 1}
                      onClick={() => {
                        setCurrentCardIndex((prev) => Math.min(activeDeckCards.length - 1, prev + 1));
                        setIsFlipped(false);
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* VIEW MODE 2: Browse All Cards in Deck */}
          {viewMode === 'browse' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Total {activeDeckCards.length} cards matching filter</span>
                <ActionButton
                  icon={Brain}
                  label="Switch to Interactive Flashcard Mode"
                  title="Practice one card at a time"
                  color="blue"
                  variant="solid"
                  size="xs"
                  onClick={() => setViewMode('study')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDeckCards.map((card, idx) => {
                  const level = progressMap[card.id]?.boxLevel || 1;

                  return (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          #{idx + 1} · {card.deckNameNe}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                            level === 3
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : level === 2
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          Box {level} ({level === 3 ? 'Mastered' : level === 2 ? 'Review' : 'Learning'})
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50 mb-1">
                          {card.frontNe}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">{card.frontEn}</p>
                      </div>

                      <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                        <strong className="text-blue-900 dark:text-blue-300 block">{card.backNe}</strong>
                        <p className="text-zinc-600 dark:text-zinc-300">{card.backEn}</p>
                      </div>

                      {card.mnemonicTipNe && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>{card.mnemonicTipNe}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
