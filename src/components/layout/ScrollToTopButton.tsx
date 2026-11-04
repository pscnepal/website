import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';

const SHOW_AFTER_SCROLL_PX = 420;

export function ScrollToTopButton() {
  const { pathname } = useLocation();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [visible, setVisible] = useState(false);

  const isReaderRoute = pathname.startsWith('/read');

  useEffect(() => {
    if (isReaderRoute) {
      setVisible(false);
      return;
    }

    let rafId = 0;
    const updateVisibility = () => {
      rafId = 0;
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReaderRoute, pathname]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && !isReaderRoute && (
        <motion.button
          key="scroll-to-top-btn"
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll smoothly to top of page"
          title="Back to top"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
          }
          className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-30 inline-flex items-center justify-center min-h-11 min-w-11 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/92 dark:bg-zinc-900/92 text-zinc-700 dark:text-zinc-200 hover:border-blue-700/50 dark:hover:border-blue-400/50 hover:text-blue-700 dark:hover:text-blue-300 shadow-md shadow-zinc-950/10 dark:shadow-black/40 backdrop-blur-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          <ArrowUp className="w-4 h-4 shrink-0" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
