import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';

export function TermsPage() {
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
                Terms of Service
              </span>
            </div>

            <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Terms of Service
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
              <span>Last Updated: November 2026</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans">
                Educational Study &amp; Reader Workspace Terms
              </span>
            </div>

            <p className="pt-2 text-fluid-lead text-zinc-600 dark:text-zinc-400">
              By accessing or using PSC Nepal—including its official syllabus
              tracker, OMR and written exam simulator, PDF flipbook and
              continuous reader, curated statutory digests, timed mock quizzes,
              and study progress dashboard—you agree to the following terms of
              use.
            </p>
          </header>

          {/* Terms Sections */}
          <div className="space-y-10 text-fluid-body text-zinc-700 dark:text-zinc-300">
            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                1. Purpose &amp; Independent Educational Disclaimer
              </h2>
              <p>
                PSC Nepal is an independent competitive examination self-study
                and digital document reading platform. It is{' '}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  not affiliated with, endorsed by, or operated by
                </strong>{' '}
                the Public Service Commission of Nepal (<em>Lok Sewa Aayog</em>),
                the Nepal Law Commission, the National Planning Commission, or
                any federal, provincial, or local government body.
              </p>
              <p>
                Curated summaries, statutory digests, and practice questions are
                prepared strictly for educational revision. Examination
                candidates should always verify statutory amendments, official
                notices, and syllabi against authentic publications in the{' '}
                <em>Nepal Gazette</em> and official commission portals.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                2. Timed Quizzes &amp; Scoring Rules
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
                Mock scores, accuracy percentages, and subject mastery metrics
                displayed on the{' '}
                <Link
                  to="/progress"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  Progress
                </Link>{' '}
                page are self-assessment indicators only and do not represent
                official examination standing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                3. User-Supplied PDFs &amp; Acceptable Use
              </h2>
              <p>
                PSC Nepal allows you to open local PDF files from your device or
                load publicly accessible HTTPS PDF links. You are solely
                responsible for ensuring you have the lawful right or license to
                view any third-party documents you open in the workspace.
              </p>
              <p>
                You agree not to misuse the application, attempt to disrupt
                client-side rendering, or redistribute proprietary content
                without authorization from its respective copyright holder.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                4. Local Browser Persistence
              </h2>
              <p>
                Reading positions, reading-pace statistics, and quiz attempt
                logs are stored locally in your browser&rsquo;s{' '}
                <code className="font-mono text-xs">localStorage</code> and
                summarized on the{' '}
                <Link
                  to="/progress"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  Progress
                </Link>{' '}
                page. Clearing your browser cache, using private/incognito
                browsing windows, or switching devices will not carry over local
                study records.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                5. Warranty Disclaimer &amp; Limitation of Liability
              </h2>
              <p>
                PSC Nepal and all accompanying study materials and question
                banks are provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis without warranties of any kind, express
                or implied. While every effort is made to maintain factual and
                statutory accuracy, typographical or legislative changes may
                occur. If you spot an error in any question or reference PDF,
                please report it via our{' '}
                <Link
                  to="/contact"
                  className="text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  Contact &amp; Errata form
                </Link>
                .
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
                for details on local browser data storage.
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
