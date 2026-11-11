import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
  AlertCircle,
  ArrowDown,
  BookOpen,
  Maximize2,
  MessageSquareText,
  Minimize2,
  RotateCcw,
  Send,
  Square,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ChatMarkdown } from './ChatMarkdown';
import { PSC_OPEN_CHAT_EVENT, type OpenChatDetail } from './chatEvents';
import { generatePscChatResponse } from '../../services/pscChatEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: string;
}

const CHAT_STORAGE_KEY = 'psc_nepal_study_assistant_v1';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-psc-assistant',
  role: 'assistant',
  content:
    'Namaste! I am the **PSC Nepal Study Assistant** (लोक सेवा तयारी सहायक). Ask me anything in **English** or **नेपाली** about:\n\n- **Official Syllabi**: Section Officer, Nayab Subba & Kharidar phases, papers, chapters, topics, marks & `-20%` negative marking\n- **Questions & Answers**: Objective MCQs, verified answers, explanations & bilingual (`EN` / `नेपाली`) 5M/10M written model answers\n- **Mock Exams & Simulator**: Phase I OMR Screening Hall, Phase II Timed Written Hall & Merit Strategy Lab\n- **Materials & Contact**: Authentic `psc.gov.np` PDFs, 3D Flipbook Reader shortcuts & editorial support (`info.pscnepal@gmail.com`)',
};

const STARTER_PROMPTS: Array<{ label: string; prompt: string }> = [
  {
    label: 'Syllabus & -20% Rules',
    prompt:
      'Compare the Section Officer, Nayab Subba, and Kharidar exam schemes, pass marks, and -20% negative marking rules.',
  },
  {
    label: 'Practice 3 PSC MCQs',
    prompt:
      'Give me 3 PSC Constitution & Public Law MCQs from the question bank along with their verified answers and explanations.',
  },
  {
    label: 'Bilingual 10M Answer',
    prompt:
      'Show the structured bilingual (English and नेपाली) 10-mark written model answer and rubric for PSC-WR-201.',
  },
  {
    label: 'Mock Exams & Simulator',
    prompt:
      'Which OMR Screening Hall and Written Paper Hall mock simulations can I launch right now, and how are they scored?',
  },
  {
    label: 'PDFs & Contact Info',
    prompt:
      'List the official PSC syllabus PDFs available in the flipbook reader and explain how to contact PSC Nepal support.',
  },
];

function loadSavedMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE];
  try {
    const raw = window.sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [WELCOME_MESSAGE];
    }
    const valid = parsed.filter(
      (item): item is ChatMessage =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string'
    );
    return valid.length > 0 ? valid.slice(-24) : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

export function PscChatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Live candidate study state for personalized context
  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);
  const completedTopicsCount = useAppSelector(
    (state) => state.psc.completedTopicIds.length
  );
  const completedUnitsCount = useAppSelector(
    (state) => state.psc.completedUnitIds.length
  );
  const simulationRunsCount = useAppSelector(
    (state) => state.psc.simulationHistory.length
  );
  const quizAttempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const recentBooksCount = useAppSelector(
    (state) => state.library.recentBooks.length
  );

  const clientContext = useMemo(() => {
    const bestQuizAccuracy =
      quizAttempts.length > 0
        ? Math.max(...quizAttempts.map((a) => a.accuracyPercent))
        : null;
    const writtenList = Object.values(writtenRecords);
    const writtenMasteredCount = writtenList.filter(
      (r) => r.status === 'mastered'
    ).length;
    const writtenPracticingCount = writtenList.filter(
      (r) => r.status === 'practicing'
    ).length;

    return {
      currentPath: `${location.pathname}${location.search}`,
      targetCadreId,
      completedTopicsCount,
      completedUnitsCount,
      quizAttemptsCount: quizAttempts.length,
      bestQuizAccuracy,
      writtenMasteredCount,
      writtenPracticingCount,
      simulationRunsCount,
      recentBooksCount,
    };
  }, [
    location.pathname,
    location.search,
    targetCadreId,
    completedTopicsCount,
    completedUnitsCount,
    quizAttempts,
    writtenRecords,
    simulationRunsCount,
    recentBooksCount,
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadSavedMessages);
  const [inputValue, setInputValue] = useState('');
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);
  const [isNetworkStreaming, setIsNetworkStreaming] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter streaming buffers (code-point safe for Devanagari & symbols)
  const fullCodePointsRef = useRef<string[]>([]);
  const displayedCodePointCountRef = useRef<number>(0);
  const networkDoneRef = useRef<boolean>(true);
  const typingIntervalRef = useRef<number | null>(null);

  const isGenerating = activeTypingId !== null || isNetworkStreaming;

  // Persist conversation in sessionStorage when idle or updated
  useEffect(() => {
    if (typeof window === 'undefined' || activeTypingId !== null) return;
    try {
      window.sessionStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages.slice(-24))
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [messages, activeTypingId]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Auto-scroll while typing unless user scrolled upward to read
  useEffect(() => {
    if (!isOpen || userScrolledUp) return;
    scrollToBottom('auto');
  }, [messages, isOpen, userScrolledUp, scrollToBottom]);

  // Focus textarea when chat opens on desktop
  useEffect(() => {
    if (!isOpen) return;
    const isDesktop = window.matchMedia('(min-width: 640px)').matches;
    if (isDesktop) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  // Lock background scroll on mobile full-screen sheet
  useEffect(() => {
    if (!isOpen) return;
    const mobileMedia = window.matchMedia('(max-width: 639px)');
    if (!mobileMedia.matches) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const clearTypingTimer = useCallback(() => {
    if (typingIntervalRef.current !== null) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTypingTimer();
    };
  }, [clearTypingTimer]);

  const stopGeneration = useCallback(() => {
    networkDoneRef.current = true;
    clearTypingTimer();
    if (activeTypingId && fullCodePointsRef.current.length > 0) {
      const fullText = fullCodePointsRef.current.join('');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === activeTypingId ? { ...m, content: fullText } : m
        )
      );
    }
    setIsNetworkStreaming(false);
    setActiveTypingId(null);
  }, [clearTypingTimer, activeTypingId]);

  const sendPrompt = useCallback(
    (rawPrompt: string) => {
      const trimmed = rawPrompt.trim();
      if (!trimmed || isGenerating) return;

      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };
      const assistantId = `ast-${Date.now() + 1}`;
      const placeholderAssistant: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
      };

      setInputValue('');
      setUserScrolledUp(false);
      setMessages((prev) => [...prev, userMsg, placeholderAssistant]);
      setActiveTypingId(assistantId);
      setIsNetworkStreaming(false);

      // Generate the authoritative answer from PSC Nepal website content
      const generatedAnswer = generatePscChatResponse(trimmed, clientContext);
      fullCodePointsRef.current = Array.from(generatedAnswer);
      displayedCodePointCountRef.current = 0;
      networkDoneRef.current = true;
      clearTypingTimer();

      // Smooth adaptive character/code-point typewriter pacer (16ms tick)
      typingIntervalRef.current = window.setInterval(() => {
        const total = fullCodePointsRef.current.length;
        const shown = displayedCodePointCountRef.current;

        if (shown < total) {
          const backlog = total - shown;
          let step = 2;
          if (backlog > 200) {
            step = Math.ceil(backlog / 10);
          } else if (backlog > 80) {
            step = 6;
          } else if (backlog > 30) {
            step = 4;
          }

          const nextCount = Math.min(total, shown + step);
          displayedCodePointCountRef.current = nextCount;
          const nextSlice = fullCodePointsRef.current
            .slice(0, nextCount)
            .join('');

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: nextSlice } : m
            )
          );
        } else {
          clearTypingTimer();
          setActiveTypingId(null);
        }
      }, 16);
    },
    [clientContext, clearTypingTimer, isGenerating]
  );

  // Listen for global open-chat custom events (e.g. Navbar button) and Escape key
  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const custom = event as CustomEvent<OpenChatDetail>;
      setIsOpen(true);
      const maybePrompt = custom.detail?.prompt?.trim();
      if (maybePrompt) {
        window.setTimeout(() => {
          void sendPrompt(maybePrompt);
        }, 60);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener(PSC_OPEN_CHAT_EVENT, handleOpenEvent);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener(PSC_OPEN_CHAT_EVENT, handleOpenEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, sendPrompt]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendPrompt(inputValue);
  };

  const handleTextareaKeyDown = (
    event: ReactKeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendPrompt(inputValue);
    }
  };

  const handleResetChat = () => {
    stopGeneration();
    setMessages([WELCOME_MESSAGE]);
    setUserScrolledUp(false);
    try {
      window.sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setUserScrolledUp(distanceFromBottom > 90);
  };

  const handleNavigateInternal = useCallback(
    (path: string) => {
      navigate(path);
      if (window.matchMedia('(max-width: 639px)').matches || path.includes('launch=1')) {
        setIsOpen(false);
      }
    },
    [navigate]
  );

  const isReaderRoute = location.pathname.startsWith('/read');

  return (
    <>
      {/* Floating Study Assistant Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Open PSC Nepal Study Assistant"
          aria-label="Open PSC Nepal Study Assistant"
          className={`fixed right-4 sm:right-6 ${
            isReaderRoute ? 'bottom-20 sm:bottom-6' : 'bottom-4 sm:bottom-6'
          } z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-crimson-700 hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white shadow-lg shadow-zinc-950/20 dark:shadow-black/50 border border-crimson-800/40 dark:border-crimson-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950`}
        >
          <MessageSquareText className="w-5 h-5 shrink-0" />
        </button>
      )}

      {/* Responsive Chat Drawer / Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile / Expanded Subtle Backdrop */}
            <motion.div
              key="psc-chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-50 bg-zinc-950/35 dark:bg-black/60 backdrop-blur-[1px] sm:hidden"
            />

            <motion.section
              key="psc-chat-panel"
              role="dialog"
              aria-modal="true"
              aria-label="PSC Nepal Study Assistant"
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 14,
                scale: shouldReduceMotion ? 1 : 0.985,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 12,
                scale: shouldReduceMotion ? 1 : 0.985,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`fixed z-50 flex flex-col overflow-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl shadow-zinc-950/25 dark:shadow-black/70 inset-0 h-dvh w-full sm:inset-auto sm:bottom-5 sm:right-5 sm:rounded-2xl sm:border sm:border-zinc-200 dark:sm:border-zinc-800 ${
                isExpanded
                  ? 'sm:w-[min(720px,calc(100vw-2.5rem))] sm:h-[min(780px,calc(100dvh-2.5rem))]'
                  : 'sm:w-[min(450px,calc(100vw-2.5rem))] sm:h-[min(660px,calc(100dvh-2.5rem))]'
              }`}
            >
              {/* Nepal-Flag Civic Accent Hairline */}
              <div
                aria-hidden="true"
                className="h-[3px] w-full shrink-0 bg-gradient-to-r from-crimson-700 via-crimson-600 to-blue-700"
              />

              {/* Header */}
              <header className="shrink-0 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 dark:bg-blue-900/80 text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-sm sm:text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 truncate">
                      PSC Nepal Study Assistant
                    </h2>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      Syllabus · MCQ &amp; Written Q&amp;A · Mock Hall · EN / नेपाली
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetChat}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                    className="inline-flex items-center justify-center min-h-9 min-w-9 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    title={isExpanded ? 'Compact view' : 'Expand reading width'}
                    aria-label={
                      isExpanded ? 'Compact view' : 'Expand reading width'
                    }
                    className="hidden sm:inline-flex items-center justify-center min-h-9 min-w-9 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Close assistant"
                    aria-label="Close assistant"
                    className="inline-flex items-center justify-center min-h-10 min-w-10 sm:min-h-9 sm:min-w-9 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Message Thread */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40"
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const isTypingThis = activeTypingId === msg.id;
                  const isWaitingForFirstToken =
                    isTypingThis && msg.content.length === 0 && !msg.error;

                  if (isUser) {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div className="max-w-[86%] rounded-xl rounded-br-sm bg-blue-800 dark:bg-blue-700 text-white px-3.5 py-2.5 text-xs sm:text-[13.5px] leading-relaxed shadow-2xs whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div className="w-full max-w-[96%] rounded-xl rounded-bl-sm bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 px-3.5 py-3 text-xs sm:text-[13.5px] text-zinc-800 dark:text-zinc-200 shadow-2xs">
                        {isWaitingForFirstToken ? (
                          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 py-0.5">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-crimson-700 dark:bg-crimson-400 animate-bounce [animation-delay:-0.2s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-crimson-700 dark:bg-crimson-400 animate-bounce [animation-delay:-0.1s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400 animate-bounce" />
                            </span>
                            <span>Consulting PSC syllabus &amp; question bank…</span>
                          </div>
                        ) : (
                          <>
                            {msg.content && (
                              <ChatMarkdown
                                content={msg.content}
                                showCursor={isTypingThis}
                                onNavigateInternal={handleNavigateInternal}
                              />
                            )}
                            {msg.error && (
                              <div
                                role="alert"
                                className="mt-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-950/40 px-3 py-2 text-xs text-red-800 dark:text-red-300 flex items-start gap-2"
                              >
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                                <span className="leading-relaxed">
                                  {msg.error}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Starter Prompts when thread only has welcome message */}
                {messages.length === 1 && !isGenerating && (
                  <div className="pt-1 space-y-2">
                    <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      Suggested PSC study queries
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {STARTER_PROMPTS.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => void sendPrompt(item.prompt)}
                          className="text-left px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-600/50 dark:hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors cursor-pointer group"
                        >
                          <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                            {item.label}
                          </span>
                          <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {item.prompt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Jump to bottom button if user scrolled up during long response */}
              {userScrolledUp && (
                <div className="absolute bottom-[88px] right-5 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setUserScrolledUp(false);
                      scrollToBottom('smooth');
                    }}
                    aria-label="Scroll to latest response"
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 text-xs font-medium text-zinc-700 dark:text-zinc-200 shadow-md cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Latest</span>
                  </button>
                </div>
              )}

              {/* Composer Footer */}
              <form
                onSubmit={handleFormSubmit}
                className="shrink-0 p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Ask syllabus, MCQs, written Q&A, mock tests…"
                    aria-label="Ask the PSC Nepal Study Assistant"
                    className="flex-1 min-h-11 max-h-28 resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm placeholder:text-xs sm:placeholder:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />

                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={stopGeneration}
                      aria-label="Stop response generation"
                      title="Stop generating"
                      className="inline-flex items-center justify-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-colors shrink-0 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-current text-crimson-700 dark:text-crimson-400" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={inputValue.trim().length === 0}
                      aria-label="Send message"
                      className="inline-flex items-center justify-center min-h-11 min-w-11 px-3.5 rounded-xl bg-crimson-700 hover:bg-crimson-800 disabled:opacity-45 disabled:pointer-events-none dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
