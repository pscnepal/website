import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { PageTransitionProps } from '../../types/common';

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
