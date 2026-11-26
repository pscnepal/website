export function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
    >
      <div className="h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90" />
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6 animate-pulse">
        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-2/3 max-w-md rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full max-w-xl rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          <div className="h-36 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800" />
          <div className="h-36 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800" />
          <div className="h-36 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
