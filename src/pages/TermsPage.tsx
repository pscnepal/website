import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { TERMS_OF_SERVICE_CONTENT } from '../data/legalContentData';
import { SITE_CONFIG } from '../data/siteConfig';

export function TermsPage() {
  const { sections, highlights, tableOfContents } = TERMS_OF_SERVICE_CONTENT;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1 min-w-0 w-full">
          <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 min-w-0">
            {/* Header */}
            <header className="space-y-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-8">
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

              <p className="pt-1 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                {TERMS_OF_SERVICE_CONTENT.intro}
              </p>

              {/* Terms Highlights */}
              <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-1"
                  >
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.label}
                    </p>
                    <p className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50">
                      {item.value}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Section Navigation */}
              <nav
                aria-label="Terms of service sections"
                className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs"
              >
                {tableOfContents.map((toc) => (
                  <a
                    key={toc.id}
                    href={`#${toc.id}`}
                    className="font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {toc.label}
                  </a>
                ))}
              </nav>
            </header>

            {/* Terms Sections */}
            <div className="space-y-10 text-fluid-body text-zinc-700 dark:text-zinc-300 min-w-0 break-words">
              <section id="terms-purpose" className="space-y-3 scroll-mt-24">
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

              <section id="terms-accounts" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.accounts.heading}
                </h2>
                <p>{sections.accounts.paragraph1}</p>
                <ul className="space-y-2 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 text-sm">
                  {sections.accounts.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="terms-scoring" className="space-y-3 scroll-mt-24">
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

              <section id="terms-written" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.writtenAndAffairs.heading}
                </h2>
                <p>{sections.writtenAndAffairs.paragraph1}</p>
                <p>{sections.writtenAndAffairs.paragraph2}</p>
              </section>

              <section id="terms-pdfs" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.acceptableUse.heading}
                </h2>
                <p>{sections.acceptableUse.paragraph1}</p>
                <p>{sections.acceptableUse.paragraph2}</p>
              </section>

              <section id="terms-ip" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.intellectualProperty.heading}
                </h2>
                <p>{sections.intellectualProperty.paragraph1}</p>
                <p>{sections.intellectualProperty.paragraph2}</p>
              </section>

              <section id="terms-exports" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.exportsAndCsv.heading}
                </h2>
                <p>{sections.exportsAndCsv.paragraph1}</p>
                <p>{sections.exportsAndCsv.paragraph2}</p>
              </section>

              <section id="terms-errata" className="space-y-3 scroll-mt-24">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {sections.errataAndFeedback.heading}
                </h2>
                <p>{sections.errataAndFeedback.paragraph1}</p>
              </section>

              <section id="terms-availability" className="space-y-3 scroll-mt-24">
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

              <section id="terms-liability" className="space-y-3 scroll-mt-24">
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
                <div className="flex sm:inline-flex max-w-full flex-wrap items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 min-w-0">
                  <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="min-w-0 break-all sm:break-normal">
                    Legal &amp; Errata Correspondence: {SITE_CONFIG.supportEmail}
                  </span>
                </div>
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
                  for details on cloud sync, local storage, and data erasure controls.
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
