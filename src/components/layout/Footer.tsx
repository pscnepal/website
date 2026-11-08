import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/settings/settingsSlice';

export function Footer() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Theme Switcher */}
          <div className="md:col-span-5 space-y-3">
            <Link
              to="/"
              className="inline-block font-serif text-lg font-semibold text-blue-800 dark:text-zinc-100 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors"
            >
              PSC Nepal
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Central Nepal PSC (Lok Sewa) preparation workspace combining
              official curricula, two-page PDF study volumes, timed MCQ drills,
              bilingual written Q&amp;A (EN/नेपाली), and OMR exam hall
              simulations.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                aria-label={`Switch to ${
                  theme === 'dark' ? 'light' : 'dark'
                } theme`}
                className="inline-flex items-center gap-2 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-700/40 dark:hover:border-blue-400/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Study & Reader Links */}
          <div className="md:col-span-4 space-y-2.5">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              PSC Study &amp; Workspace
            </p>
            <nav
              aria-label="Footer study navigation"
              className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs"
            >
              <Link
                to="/dashboard"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Dashboard &amp; Banks
              </Link>
              <Link
                to="/syllabus"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                PSC Syllabus
              </Link>
              <Link
                to="/simulate"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Exam Simulator
              </Link>
              <Link
                to="/materials"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Study Materials
              </Link>
              <Link
                to="/quiz"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Objective Quizzes
              </Link>
              <Link
                to="/written"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Written Q&amp;A (EN/ने)
              </Link>
              <Link
                to="/current-affairs"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                समसामयिक (Affairs)
              </Link>
              <Link
                to="/calendar"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                कार्यतालिका (Calendar)
              </Link>
              <Link
                to="/pyq"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                विगतका प्रश्न (PYQ)
              </Link>
              <Link
                to="/progress"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Progress Tracker
              </Link>
              <Link
                to="/library"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Personal Library
              </Link>
              <Link
                to="/read"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                PDF Reader
              </Link>
            </nav>
          </div>

          {/* Support & Legal Links */}
          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Support &amp; Legal
            </p>
            <nav
              aria-label="Footer legal and support navigation"
              className="flex flex-col gap-2 text-xs"
            >
              <Link
                to="/about"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                About PSC Nepal
              </Link>
              <Link
                to="/contact"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Contact &amp; Errata
              </Link>
              <Link
                to="/privacy"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-zinc-600 dark:text-zinc-400 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            &copy; {new Date().getFullYear()} PSC Nepal. Independent Lok Sewa
            study &amp; exam preparation platform.
          </span>
          <span>
            Zero server uploads · All progress saved in local browser storage.
          </span>
        </div>
      </div>
    </footer>
  );
}
