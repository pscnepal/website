import { useEffect } from 'react';
import { Lock, Loader2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export function GoogleLogoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

interface QuizAuthGateProps {
  title: string;
  subtitle?: string;
  metaItems?: string[];
  onClose: () => void;
}

export function QuizAuthGate({
  title,
  subtitle,
  metaItems = [],
  onClose,
}: QuizAuthGateProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const { isAuthReady, isSigningIn, authError, clearAuthError, signInWithGoogle } =
    useAuth();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
        className="fixed inset-0 bg-zinc-950/60 dark:bg-black/75 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, scale: 0.965, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.975, y: 8 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }
        }
        className="relative z-10 w-full sm:max-w-lg rounded-none sm:rounded-2xl bg-white dark:bg-zinc-900 border-0 sm:border border-zinc-200/90 dark:border-zinc-800 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)] dark:shadow-[0_28px_80px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-crimson-700 dark:text-crimson-400">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Candidate Sign-In Required</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign-in dialog"
            className="min-h-9 min-w-9 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {!isAuthReady ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-700 dark:text-blue-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Checking your sign-in session...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {metaItems.length > 0 && (
                  <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {metaItems.join(' · ')}
                  </p>
                )}
                <h2
                  id="quiz-dialog-title"
                  className="font-serif text-fluid-h2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  All study materials, syllabus guides, and quiz decks are free
                  to browse publicly. Sign in with Google to start taking this
                  timed quiz.
                </p>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Reverse countdown begins only after you sign in</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Tracks PSC net scores &amp; attempt history to your account</span>
                  </li>
                </ul>
              </div>

              {authError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => void signInWithGoogle()}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 min-h-11 px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <GoogleLogoIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {isSigningIn
                      ? 'Opening Google Sign-In...'
                      : 'Continue with Google to Start'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center min-h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
