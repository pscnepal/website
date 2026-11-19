import { useState } from 'react';
import { Download, PlusSquare, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'mobile' | 'footer';
}

export function PWAInstallButton({
  variant = 'navbar',
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      void install();
      return;
    }
    if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'mobile' ? (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 text-sm font-medium rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer whitespace-nowrap"
        >
          {isInstallable ? (
            <Download className="w-4 h-4 shrink-0" />
          ) : (
            <Smartphone className="w-4 h-4 shrink-0" />
          )}
          <span>{isInstallable ? 'Install PSC Nepal App' : 'Install on iOS'}</span>
        </button>
      ) : variant === 'footer' ? (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-lg border border-blue-200 dark:border-blue-800/70 bg-blue-50/70 dark:bg-blue-950/40 text-xs font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isInstallable ? (
            <Download className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{isInstallable ? 'Install App' : 'Add to Home Screen'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          title={
            isInstallable
              ? 'Install PSC Nepal for offline access'
              : 'Install PSC Nepal on iPhone / iPad'
          }
          className="hidden md:inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-medium text-blue-800 dark:text-blue-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {isInstallable ? (
            <Download className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="hidden lg:inline">Install App</span>
          <span className="lg:hidden">Install</span>
        </button>
      )}

      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-pwa-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 dark:bg-black/70 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="ios-pwa-install-title"
                  className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50"
                >
                  Install on iPhone / iPad
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Keep PSC Nepal study PDFs &amp; quizzes one tap away offline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close installation guide"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="leading-relaxed">
                  Tap the{' '}
                  <span className="inline-flex items-center gap-1 font-semibold text-zinc-950 dark:text-zinc-100">
                    <Share className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Share
                  </span>{' '}
                  button in Safari&apos;s toolbar.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="leading-relaxed">
                  Scroll down and choose{' '}
                  <span className="inline-flex items-center gap-1 font-semibold text-zinc-950 dark:text-zinc-100">
                    <PlusSquare className="w-3.5 h-3.5 text-crimson-700 dark:text-crimson-400" />
                    Add to Home Screen
                  </span>
                  .
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
