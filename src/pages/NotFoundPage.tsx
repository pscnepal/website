import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { NOT_FOUND_CONTENT } from '../data/legalContentData';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20">
          <div className="max-w-md text-center">
            <p className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
              {NOT_FOUND_CONTENT.code}
            </p>
            <h1 className="mt-2 font-serif text-fluid-h1 font-semibold text-zinc-900 dark:text-zinc-100">
              {NOT_FOUND_CONTENT.title}
            </h1>
            <p className="mt-3 text-fluid-body text-zinc-600 dark:text-zinc-400">
              {NOT_FOUND_CONTENT.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={NOT_FOUND_CONTENT.primaryCtaTo}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{NOT_FOUND_CONTENT.primaryCtaLabel}</span>
              </Link>
              <Link
                to={NOT_FOUND_CONTENT.secondaryCtaTo}
                className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
              >
                {NOT_FOUND_CONTENT.secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
