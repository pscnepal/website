import { Component, useEffect, useState, type ErrorInfo } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Home, RotateCcw } from 'lucide-react';
import { toast } from '../../services/toastService';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../../types/common';
import {
  extractRawErrorMessage,
  formatUserFriendlyError,
} from '../../utils/errorHelpers';

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    showDetails: false,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const friendlyMessage = formatUserFriendlyError(
      this.state.error,
      'An unexpected display error interrupted this view.'
    );
    const rawDetail = extractRawErrorMessage(this.state.error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6">
        <div
          role="alert"
          className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-crimson-50 dark:bg-crimson-950/60 border border-crimson-200 dark:border-crimson-900/70 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-crimson-600 dark:text-crimson-400" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h1 className="font-serif text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                Unable to render this section
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {friendlyMessage}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Reload Page</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </button>
          </div>

          {rawDetail && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() =>
                  this.setState((prev) => ({ showDetails: !prev.showDetails }))
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
              >
                {this.state.showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {this.state.showDetails
                    ? 'Hide technical details'
                    : 'Show technical details'}
                </span>
              </button>

              {this.state.showDetails && (
                <pre className="mt-2.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto max-h-40 whitespace-pre-wrap break-words">
                  {rawDetail}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const IGNORED_RUNTIME_ERRORS = [
  'resizeobserver loop',
  'aborterror',
  'the user aborted a request',
  'websocket',
];

export function GlobalErrorListener() {
  const [offlineNotified, setOfflineNotified] = useState(false);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const raw = extractRawErrorMessage(event.reason).toLowerCase();
      if (!raw || IGNORED_RUNTIME_ERRORS.some((pat) => raw.includes(pat))) {
        return;
      }
      toast.error(
        formatUserFriendlyError(
          event.reason,
          'An unexpected background operation failed.'
        ),
        { id: 'global-unhandled-rejection', title: 'Action Failed' }
      );
    };

    const handleOffline = () => {
      setOfflineNotified(true);
      toast.warning(
        'You are currently offline. Local drafts remain saved, and cloud sync will resume once connected.',
        { id: 'network-status', title: 'Offline Mode', duration: 6000 }
      );
    };

    const handleOnline = () => {
      if (offlineNotified) {
        setOfflineNotified(false);
        toast.success('Internet connection restored.', {
          id: 'network-status',
          title: 'Back Online',
          duration: 3500,
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [offlineNotified]);

  return null;
}
