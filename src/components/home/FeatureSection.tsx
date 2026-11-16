import { Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  FEATURES_CALLOUT_CONTENT,
  FEATURES_PAGE_HEADER,
  READER_FEATURE_ITEMS,
  READER_SHORTCUT_ITEMS,
  READER_SHORTCUTS_INTRO,
} from '../../data/featuresContentData';

export function FeatureSection() {
  const guideShortcuts = READER_SHORTCUT_ITEMS.filter((item) => item.showInGuide);

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
              {FEATURES_PAGE_HEADER.breadcrumbLabel}
            </span>
          </div>

          <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
            {FEATURES_PAGE_HEADER.headline}
          </h1>
          <p className="mt-3 text-fluid-lead text-zinc-600 dark:text-zinc-400">
            {FEATURES_PAGE_HEADER.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {READER_FEATURE_ITEMS.map((feature) => {
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
                {READER_SHORTCUTS_INTRO.title}
              </h2>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {READER_SHORTCUTS_INTRO.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 flex-1">
            {guideShortcuts.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
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
            {FEATURES_CALLOUT_CONTENT.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {FEATURES_CALLOUT_CONTENT.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to={FEATURES_CALLOUT_CONTENT.primaryCtaTo}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            {FEATURES_CALLOUT_CONTENT.primaryCtaLabel}
          </Link>
          <Link
            to={FEATURES_CALLOUT_CONTENT.secondaryCtaTo}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            {FEATURES_CALLOUT_CONTENT.secondaryCtaLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
