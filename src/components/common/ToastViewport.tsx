import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  toast,
  type ToastItem,
  type ToastVariant,
} from '../../services/toastService';

const VARIANT_STYLES: Record<
  ToastVariant,
  {
    container: string;
    iconWrap: string;
    title: string;
    message: string;
    closeBtn: string;
    actionBtn: string;
    Icon: typeof CheckCircle2;
    defaultLabel: string;
  }
> = {
  success: {
    container:
      'bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-800/80 shadow-lg shadow-zinc-950/5 dark:shadow-black/40',
    iconWrap: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-zinc-950 dark:text-zinc-50',
    message: 'text-zinc-600 dark:text-zinc-300',
    closeBtn:
      'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    actionBtn:
      'text-emerald-700 dark:text-emerald-400 hover:underline underline-offset-4',
    Icon: CheckCircle2,
    defaultLabel: 'Success',
  },
  error: {
    container:
      'bg-white dark:bg-zinc-900 border-crimson-200 dark:border-crimson-800/80 shadow-lg shadow-zinc-950/5 dark:shadow-black/40',
    iconWrap: 'text-crimson-600 dark:text-crimson-400',
    title: 'text-zinc-950 dark:text-zinc-50',
    message: 'text-zinc-600 dark:text-zinc-300',
    closeBtn:
      'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    actionBtn:
      'text-crimson-700 dark:text-crimson-400 hover:underline underline-offset-4',
    Icon: AlertCircle,
    defaultLabel: 'Error',
  },
  warning: {
    container:
      'bg-white dark:bg-zinc-900 border-amber-200 dark:border-amber-800/80 shadow-lg shadow-zinc-950/5 dark:shadow-black/40',
    iconWrap: 'text-amber-600 dark:text-amber-400',
    title: 'text-zinc-950 dark:text-zinc-50',
    message: 'text-zinc-600 dark:text-zinc-300',
    closeBtn:
      'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    actionBtn:
      'text-amber-700 dark:text-amber-400 hover:underline underline-offset-4',
    Icon: AlertTriangle,
    defaultLabel: 'Warning',
  },
  info: {
    container:
      'bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800/80 shadow-lg shadow-zinc-950/5 dark:shadow-black/40',
    iconWrap: 'text-blue-600 dark:text-blue-400',
    title: 'text-zinc-950 dark:text-zinc-50',
    message: 'text-zinc-600 dark:text-zinc-300',
    closeBtn:
      'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    actionBtn:
      'text-blue-700 dark:text-blue-400 hover:underline underline-offset-4',
    Icon: Info,
    defaultLabel: 'Notice',
  },
};

function ToastCard({
  item,
  shouldReduceMotion,
}: {
  item: ToastItem;
  shouldReduceMotion: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(item.duration);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    remainingRef.current = item.duration;
  }, [item.createdAt, item.duration]);

  useEffect(() => {
    if (item.duration <= 0 || isPaused) return;

    startedAtRef.current = Date.now();
    const timer = window.setTimeout(() => {
      toast.dismiss(item.id);
    }, remainingRef.current);

    return () => {
      window.clearTimeout(timer);
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [item.id, item.duration, item.createdAt, isPaused]);

  const style = VARIANT_STYLES[item.variant];
  const IconComponent = style.Icon;
  const isUrgent = item.variant === 'error' || item.variant === 'warning';

  return (
    <motion.div
      layout
      initial={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.1 }
          : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
      }
      role={isUrgent ? 'alert' : 'status'}
      aria-live={isUrgent ? 'assertive' : 'polite'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={`pointer-events-auto w-full rounded-xl border p-3.5 flex items-start gap-3 ${style.container}`}
    >
      <IconComponent
        className={`w-4 h-4 shrink-0 mt-0.5 ${style.iconWrap}`}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0 space-y-1">
        {item.title && (
          <p className={`text-xs font-semibold leading-snug ${style.title}`}>
            {item.title}
          </p>
        )}
        <p className={`text-xs leading-relaxed break-words ${style.message}`}>
          {item.message}
        </p>
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              toast.dismiss(item.id);
            }}
            className={`mt-1 text-xs font-semibold cursor-pointer whitespace-nowrap ${style.actionBtn}`}
          >
            {item.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss(item.id)}
        aria-label={`Dismiss ${style.defaultLabel.toLowerCase()} notification`}
        className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${style.closeBtn}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const shouldReduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    return toast.subscribe(setItems);
  }, []);

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] pointer-events-none flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <ToastCard
            key={item.id}
            item={item}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
