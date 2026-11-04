import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: ReactNode;
  /**
   * Optional sub-view key (e.g. active cadre or question ID) to animate
   * transitions within the same route without unmounting the top navbar.
   */
  transitionKey?: string;
  /**
   * When true, animates opacity only (no vertical translateY) — ideal for
   * canvas/PDF viewports that measure container geometry on mount.
   */
  fadeOnly?: boolean;
  className?: string;
}

const EASE_SETTLE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_EXIT: [number, number, number, number] = [0.4, 0, 1, 1];

function clearRestingTransform(_: unknown, generated: string): string {
  if (
    !generated ||
    generated === 'none' ||
    generated === 'translateY(0px)' ||
    generated === 'translate3d(0px, 0px, 0px)'
  ) {
    return 'none';
  }
  return generated;
}

export function PageTransition({
  children,
  transitionKey,
  fadeOnly = false,
  className = 'flex-1 flex flex-col',
}: PageTransitionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const yOffset = fadeOnly ? 0 : 10;

  if (transitionKey !== undefined) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
          animate={{
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: EASE_SETTLE },
          }}
          exit={
            shouldReduceMotion
              ? { opacity: 1, transition: { duration: 0 } }
              : {
                  opacity: 0,
                  y: fadeOnly ? 0 : -5,
                  transition: { duration: 0.11, ease: EASE_EXIT },
                }
          }
          transformTemplate={clearRestingTransform}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.2, ease: EASE_SETTLE }
      }
      transformTemplate={clearRestingTransform}
      className={className}
    >
      {children}
    </motion.div>
  );
}
