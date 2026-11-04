import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const DESKTOP_NAV_ITEMS = [
  { to: '/syllabus', label: 'Syllabus', end: false },
  { to: '/materials', label: 'Materials', end: false },
  { to: '/quiz', label: 'Quiz', end: false },
  { to: '/written', label: 'Written', end: false },
  { to: '/progress', label: 'Progress', end: false },
];

const MOBILE_NAV_ITEMS = [
  { to: '/syllabus', label: 'PSC Syllabus', end: false },
  { to: '/materials', label: 'Study Materials', end: false },
  { to: '/quiz', label: 'Objective Quiz', end: false },
  { to: '/written', label: 'Written Q&A (EN/ने)', end: false },
  { to: '/progress', label: 'Study Progress', end: false },
  { to: '/library', label: 'Personal Library', end: false },
  { to: '/read', label: 'PDF Flipbook Reader', end: false },
  { to: '/about', label: 'About PSC Nepal', end: false },
];

export function Navbar() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const routeKey = `${location.pathname}${location.search}${location.hash}`;
  const [openRouteKey, setOpenRouteKey] = useState<string | null>(null);
  const isMobileMenuOpen = openRouteKey === routeKey;

  const closeMobileMenu = () => setOpenRouteKey(null);
  const toggleMobileMenu = () => {
    setOpenRouteKey((prev) => (prev === routeKey ? null : routeKey));
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenRouteKey(null);
        menuButtonRef.current?.focus();
      }
    };

    const desktopMedia = window.matchMedia('(min-width: 768px)');
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpenRouteKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    desktopMedia.addEventListener('change', handleViewportChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      desktopMedia.removeEventListener('change', handleViewportChange);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/92 dark:bg-zinc-950/92 backdrop-blur-md">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-crimson-700 via-crimson-600 to-blue-700"
        />
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            aria-label="PSC Nepal — Home"
            className="font-serif text-xl font-semibold tracking-tight text-blue-800 dark:text-zinc-50 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            PSC Nepal
          </Link>

          {/* Zone 2: 5 concise single-line React Router navigation links (desktop/tablet >= 768px) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center md:gap-5 lg:gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            {DESKTOP_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative py-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded ${
                    isActive
                      ? 'text-zinc-950 dark:text-zinc-50'
                      : 'hover:text-blue-700 dark:hover:text-blue-300 hover:underline underline-offset-8 decoration-blue-700/50 dark:decoration-blue-400/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="primary-nav-underline"
                        aria-hidden="true"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                        }
                        className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-crimson-700 dark:bg-crimson-400"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Primary Exam Simulator action on desktop/tablet + touch menu toggle on mobile */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/simulate"
              className="hidden md:inline-flex items-center justify-center h-9 px-4 text-xs font-medium rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 shadow-2xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Exam Simulator
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleMobileMenu}
              aria-label={
                isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-primary-nav"
              className="md:hidden -mr-2 inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation backdrop & dropdown panel (< 768px) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
              onClick={closeMobileMenu}
              aria-hidden="true"
              className="fixed inset-0 top-16 z-30 bg-zinc-950/30 dark:bg-black/60 backdrop-blur-[2px] md:hidden"
            />

            <motion.nav
              key="mobile-nav-panel"
              id="mobile-primary-nav"
              aria-label="Mobile primary navigation"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed top-16 inset-x-0 z-40 md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-zinc-200 dark:border-zinc-800 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-md shadow-xl shadow-zinc-950/10 dark:shadow-black/40"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
                {MOBILE_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `min-h-11 px-3.5 rounded-xl flex items-center justify-between gap-3 text-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive
                              ? 'text-crimson-700 dark:text-crimson-400 translate-x-0.5'
                              : 'text-zinc-400 dark:text-zinc-600'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="mt-2 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
                  <Link
                    to="/simulate"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center justify-center w-full min-h-11 px-4 text-sm font-medium rounded-xl bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    Exam Simulator
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer matching fixed header height so content flows cleanly beneath it */}
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
}
