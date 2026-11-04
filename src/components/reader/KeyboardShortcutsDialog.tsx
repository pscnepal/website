import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '←', description: 'Previous page or spread' },
  { key: '→', description: 'Next page or spread' },
  { key: '+ or =', description: 'Zoom in' },
  { key: '-', description: 'Zoom out' },
  { key: '0', description: 'Fit page to screen' },
  { key: 'M', description: 'Switch between Flipbook and Standard PDF' },
  { key: 'F', description: 'Toggle fullscreen reading' },
  { key: 'S', description: 'Toggle page-turning sound' },
  { key: 'I', description: 'Open or close Reading Stats' },
  { key: 'Esc', description: 'Exit fullscreen or close active panel' },
];

export function KeyboardShortcutsDialog({
  open,
  onClose,
}: KeyboardShortcutsDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.16 }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6"
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2
                  id="shortcuts-dialog-title"
                  className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Keyboard Shortcuts
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Active whenever the reader workspace is focused.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close keyboard shortcuts dialog"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {SHORTCUTS.map((item) => (
                <div
                  key={item.key}
                  className="py-2.5 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {item.description}
                  </span>
                  <kbd className="font-mono tabular-nums text-xs font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 whitespace-nowrap shrink-0">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
