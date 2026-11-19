import { useEffect, useState } from 'react';
import { WifiOff, X } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-5.5rem)] flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-950/95 dark:bg-zinc-900/95 text-amber-50 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-sm"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      <span className="truncate">
        Offline Mode — Cached quizzes, study notes &amp; progress active
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline status notice"
        className="p-0.5 rounded text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
