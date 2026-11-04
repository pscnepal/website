import { useState, type FormEvent } from 'react';
import { AlertTriangle, ArrowLeft, Lock, RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PdfErrorInfo } from '../../types/pdf';
import { PdfUpload } from '../home/PdfUpload';
import { Button } from '../ui/Button';

interface ReaderErrorProps {
  error: PdfErrorInfo;
  onRetry: () => void;
  onSubmitPassword?: (password: string) => void;
}

export function ReaderError({
  error,
  onRetry,
  onSubmitPassword,
}: ReaderErrorProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const isPasswordPrompt =
    error.code === 'PASSWORD_REQUIRED' || error.code === 'PASSWORD_INCORRECT';

  const handlePasswordForm = (e: FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || !onSubmitPassword) return;
    onSubmitPassword(passwordInput);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            {isPasswordPrompt ? (
              <Lock className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {error.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {error.message}
            </p>
            {error.hint && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {error.hint}
              </p>
            )}
          </div>
        </div>

        {isPasswordPrompt && onSubmitPassword ? (
          <form onSubmit={handlePasswordForm} className="mt-6 flex gap-2.5">
            <label htmlFor="pdf-password" className="sr-only">
              PDF Password
            </label>
            <input
              id="pdf-password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter document password"
              className="flex-1 h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300"
              autoFocus
            />
            <Button type="submit" variant="primary" size="md">
              Unlock PDF
            </Button>
          </form>
        ) : (
          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <PdfUpload compact />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          {!isPasswordPrompt && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Loading</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
