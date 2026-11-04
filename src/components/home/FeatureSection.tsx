import {
  BarChart3,
  BookOpen,
  Columns2,
  Keyboard,
  Maximize2,
  Sliders,
  Volume2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    index: '01.',
    title: 'Realistic Two-Page Flipbook',
    description:
      'Turn actual PDF pages with tactile corner folding, natural spine shading, two-page desktop spreads, and single-page portrait framing on mobile.',
    icon: BookOpen,
  },
  {
    index: '02.',
    title: 'Precision Document Viewer',
    description:
      'Switch effortlessly to continuous vertical scrolling or single-page inspection with HiDPI canvas clarity, fit-to-width, and fit-to-page scaling.',
    icon: Columns2,
  },
  {
    index: '03.',
    title: 'Gentle Paper Acoustics',
    description:
      'Experience a delicate, feather-light paper-turn sound effect in flipbook mode that can be toggled on or muted anytime from the toolbar.',
    icon: Volume2,
  },
  {
    index: '04.',
    title: 'Spatial Page Thumbnails',
    description:
      'Scan visual silhouettes of long statutes and official PSC syllabi in a collapsible thumbnail rail with lazy low-resolution previews and instant page jumps.',
    icon: Sliders,
  },
  {
    index: '05.',
    title: 'Per-Book Reading Analytics',
    description:
      'Track active reading duration, unique pages covered, and live pages-per-minute pace stored individually for every PDF document.',
    icon: BarChart3,
  },
  {
    index: '06.',
    title: 'Distraction-Free Fullscreen & Themes',
    description:
      'Expand any book across your entire display in balanced light or dark reading themes while automatically saving your last-read page.',
    icon: Maximize2,
  },
];

const SHORTCUT_ITEMS = [
  { keys: '← / →', action: 'Previous or next page' },
  { keys: 'PgUp / PgDn', action: 'Step backward or forward' },
  { keys: '+ / -', action: 'Zoom in or zoom out' },
  { keys: '0', action: 'Fit page to viewport' },
  { keys: 'M', action: 'Switch Standard / Flipbook' },
  { keys: 'F', action: 'Toggle fullscreen reading' },
  { keys: 'S', action: 'Toggle page-turn sound' },
  { keys: 'I', action: 'Open Reading Stats panel' },
  { keys: 'Esc', action: 'Close active dialog or panel' },
];

export function FeatureSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Capabilities Section */}
      <section>
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
            <Link
              to="/"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">
              Features &amp; Shortcuts
            </span>
          </div>

          <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
            Built for unhurried reading and technical inspection alike.
          </h1>
          <p className="mt-3 text-fluid-lead text-zinc-600 dark:text-zinc-400">
            PSC Nepal combines the quiet poise of a printed statute volume with the responsive precision of PDF.js vector rendering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100">
                  <Icon className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  <h2 className="text-base font-semibold">
                    <span className="font-mono text-xs font-semibold text-crimson-700 dark:text-crimson-400 mr-1.5">
                      {feature.index}
                    </span>
                    {feature.title}
                  </h2>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Keyboard Shortcuts Section */}
      <section className="pt-14 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Keyboard className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
              <h2 className="font-serif text-fluid-h2 font-semibold">
                Keyboard Shortcuts Reference
              </h2>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every core reader action responds to single-key shortcuts whenever you are inside the reading workspace without touching the mouse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 flex-1">
            {SHORTCUT_ITEMS.map((item) => (
              <div key={item.keys} className="flex items-center gap-3">
                <kbd className="font-mono tabular-nums text-xs font-medium px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 whitespace-nowrap shrink-0">
                  {item.keys}
                </kbd>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiet Workspace Callout */}
      <section className="pt-12 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-900 dark:text-zinc-100">
            Ready to start reading?
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Open one of the curated reading materials or paste any direct PDF URL on the home screen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/materials"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            Browse Books &amp; Materials
          </Link>
          <Link
            to="/read"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            Open Reader Workspace
          </Link>
        </div>
      </section>
    </div>
  );
}
