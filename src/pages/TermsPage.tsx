import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { TERMS_OF_SERVICE_CONTENT } from '../data/legalContentData';

export function TermsPage() {
  const { sections } = TERMS_OF_SERVICE_CONTENT;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
          {/* Header */}
          <header className="space-y-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link
                to="/"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                {TERMS_OF_SERVICE_CONTENT.breadcrumbLabel}
              </span>
            </div>

            <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {TERMS_OF_SERVICE_CONTENT.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
              <span>{TERMS_OF_SERVICE_CONTENT.lastUpdatedLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans">
                {TERMS_OF_SERVICE_CONTENT.subtitle}
              </span>
            </div>

            <p className="pt-2 text-fluid-lead text-zinc-600 dark:text-zinc-400">
              {TERMS_OF_SERVICE_CONTENT.intro}
            </p>
          </header>

          {/* Terms Sections */}
          <div className="space-y-10 text-fluid-body text-zinc-700 dark:text-zinc-300">
            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {sections.purpose.heading}
              </h2>
              <p>
                {sections.purpose.paragraph1Lead}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {sections.purpose.paragraph1Strong}
                </strong>
                {sections.purpose.paragraph1Mid}
                <em>{sections.purpose.paragraph1Em}</em>
                {sections.purpose.paragraph1Trail}
              </p>
              <p>
                {sections.purpose.paragraph2Lead}
                <em>{sections.purpose.paragraph2Em}</em>
                {sections.purpose.paragraph2Trail}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {sections.scoring.heading}
              </h2>
              <p>
                Practice quizzes and OMR simulations on PSC Nepal model
                objective competitive examination conditions, including a strict{' '}
                <span className="font-mono tabular-nums">1 minute</span> per
                question reverse countdown timer, auto-submission at{' '}
                <span className="font-mono tabular-nums">00:00</span>, and a{' '}
                <span className="font-mono tabular-nums">-20%</span> negative
                marking calculation on incorrect responses.
              </p>
              <p>
                {sections.scoring.paragraph2Lead}
                <Link
                  to="/progress"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  {sections.scoring.paragraph2LinkLabel}
                </Link>
                {sections.scoring.paragraph2Trail}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {sections.acceptableUse.heading}
              </h2>
              <p>{sections.acceptableUse.paragraph1}</p>
              <p>{sections.acceptableUse.paragraph2}</p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {sections.persistence.heading}
              </h2>
              <p>
                {sections.persistence.lead}
                <Link
                  to="/progress"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  {sections.persistence.linkLabel}
                </Link>
                {sections.persistence.trail}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                {sections.disclaimer.heading}
              </h2>
              <p>
                {sections.disclaimer.lead}
                <Link
                  to="/contact"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  {sections.disclaimer.linkLabel}
                </Link>
                {sections.disclaimer.trail}
              </p>
            </section>

            <section className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <span>
                Also review our{' '}
                <Link
                  to="/privacy"
                  className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>{' '}
                for details on privacy and data controls.
              </span>
              <Link
                to="/contact"
                className="font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                Contact Editorial Desk →
              </Link>
            </section>
          </div>
        </article>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
