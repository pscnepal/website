import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MessageSquareText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { OpenChatDetail } from '../../types/workspace';
import { PSC_OPEN_CHAT_EVENT } from './chatEvents';

let chatbotModulePromise: Promise<{
  PscChatbot: typeof import('./PscChatbot').PscChatbot;
}> | null = null;

function loadPscChatbotModule() {
  if (!chatbotModulePromise) {
    chatbotModulePromise = import('./PscChatbot').then((mod) => ({
      PscChatbot: mod.PscChatbot,
    }));
  }
  return chatbotModulePromise;
}

const LazyPscChatbot = lazy(() =>
  loadPscChatbotModule().then((mod) => ({ default: mod.PscChatbot }))
);

export function DeferredPscChatbot() {
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  const autoOpenRef = useRef(false);
  const initialPromptRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isMounted) return;

    const handleOpenEvent = (event: Event) => {
      const custom = event as CustomEvent<OpenChatDetail>;
      autoOpenRef.current = true;
      initialPromptRef.current = custom.detail?.prompt?.trim() || undefined;
      setIsMounted(true);
    };

    window.addEventListener(PSC_OPEN_CHAT_EVENT, handleOpenEvent);

    // Warm the chatbot chunk cleanly during browser idle time without mounting React state
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(
        () => {
          void loadPscChatbotModule();
        },
        { timeout: 3000 }
      );
    } else {
      timeoutId = globalThis.setTimeout(() => {
        void loadPscChatbotModule();
      }, 2500);
    }

    return () => {
      window.removeEventListener(PSC_OPEN_CHAT_EVENT, handleOpenEvent);
      if (idleId !== null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, [isMounted]);

  if (isMounted) {
    return (
      <Suspense fallback={null}>
        <LazyPscChatbot
          defaultOpen={autoOpenRef.current}
          initialPrompt={initialPromptRef.current}
        />
      </Suspense>
    );
  }

  const isReaderRoute = location.pathname.startsWith('/read');

  return (
    <button
      type="button"
      onClick={() => {
        autoOpenRef.current = true;
        setIsMounted(true);
      }}
      onMouseEnter={() => void loadPscChatbotModule()}
      onFocus={() => void loadPscChatbotModule()}
      title="Open PSC Nepal Study Assistant"
      aria-label="Open PSC Nepal Study Assistant"
      className={`fixed right-4 sm:right-6 ${
        isReaderRoute ? 'bottom-20 sm:bottom-6' : 'bottom-4 sm:bottom-6'
      } z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-crimson-700 hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white shadow-lg shadow-zinc-950/20 dark:shadow-black/50 border border-crimson-800/40 dark:border-crimson-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950`}
    >
      <MessageSquareText className="w-5 h-5 shrink-0" />
    </button>
  );
}
