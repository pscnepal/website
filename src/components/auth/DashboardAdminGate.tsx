import { useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Lock,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DASHBOARD_ADMIN_EMAIL,
  useAuth,
} from '../../context/AuthContext';
import { GoogleLogoIcon } from './QuizAuthGate';

export function DashboardAdminGate() {
  const {
    user,
    isAuthReady,
    isSigningIn,
    authError,
    clearAuthError,
    signInWithGoogle,
    signOutUser,
  } = useAuth();

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSwitchAccount = async () => {
    await signOutUser();
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-950/5 dark:shadow-black/50 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-crimson-700 dark:text-crimson-400">
            {user ? (
              <ShieldAlert className="w-4 h-4 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 shrink-0" />
            )}
            <span>
              {user
                ? 'Administrator Authorization Required'
                : 'Restricted Admin Workspace'}
            </span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {!isAuthReady ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-700 dark:text-blue-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Verifying administrator session...
              </p>
            </div>
          ) : !user ? (
            <>
              <div className="space-y-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  PSC Nepal Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The management dashboard is restricted exclusively to the
                  authorized administrator account (
                  <span className="font-mono text-zinc-900 dark:text-zinc-200">
                    {DASHBOARD_ADMIN_EMAIL}
                  </span>
                  ).
                </p>
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
                      : 'Sign in with Google'}
                  </span>
                </button>

                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center min-h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Public Quizzes
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Access Denied
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  You are currently signed in as{' '}
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.email || 'an unverified account'}
                  </span>
                  . Dashboard access is limited strictly to{' '}
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {DASHBOARD_ADMIN_EMAIL}
                  </span>
                  .
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                You can continue using all public study tools, mock exams,
                syllabus guides, written Q&amp;A, and OMR practice rooms with your
                current Google account.
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
                  onClick={() => void handleSwitchAccount()}
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 shrink-0" />
                  )}
                  <span>Switch Google Account</span>
                </button>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center min-h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
