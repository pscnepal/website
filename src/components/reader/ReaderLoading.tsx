interface ReaderLoadingProps {
  title?: string;
  progressPercent: number | null;
}

export function ReaderLoading({ title, progressPercent }: ReaderLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex-1 flex flex-col items-center justify-center p-8 select-none"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Book skeleton silhouette */}
        <div className="w-44 h-60 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col justify-between animate-pulse">
          <div className="space-y-2.5">
            <div className="w-12 h-1.5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-3/4 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-1/2 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-2 rounded bg-zinc-100 dark:bg-zinc-800/80" />
            <div className="w-full h-2 rounded bg-zinc-100 dark:bg-zinc-800/80" />
            <div className="w-5/6 h-2 rounded bg-zinc-100 dark:bg-zinc-800/80" />
            <div className="w-2/3 h-2 rounded bg-zinc-100 dark:bg-zinc-800/80" />
          </div>
          <div className="w-10 h-1.5 mx-auto rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <h2 className="mt-6 font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
          {title || 'Opening Document'}
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
          {progressPercent !== null
            ? `Rendering pages · ${progressPercent}%`
            : 'Preparing PDF engine...'}
        </p>

        <div className="mt-4 w-48 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-transform duration-200 origin-left"
            style={{
              transform: `scaleX(${
                progressPercent !== null ? Math.max(0.08, progressPercent / 100) : 0.35
              })`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
