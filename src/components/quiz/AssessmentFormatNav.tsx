import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ALL_SYLLABUS_UNITS } from '../../data/pscSyllabusData';
import { ALL_QUIZ_QUESTIONS } from '../../data/quizData';
import { WRITTEN_QUESTIONS } from '../../data/writtenQuestionsData';

export type AssessmentWorkspaceTab =
  | 'syllabus'
  | 'quiz'
  | 'written'
  | 'simulate';

interface AssessmentFormatNavProps {
  active: AssessmentWorkspaceTab;
}

const ITEMS: ReadonlyArray<{
  id: AssessmentWorkspaceTab;
  to: string;
  label: string;
}> = [
  {
    id: 'syllabus',
    to: '/syllabus',
    label: `Syllabus (${ALL_SYLLABUS_UNITS.length} Units)`,
  },
  {
    id: 'quiz',
    to: '/quiz',
    label: `Paper I · MCQs (${ALL_QUIZ_QUESTIONS.length})`,
  },
  {
    id: 'written',
    to: '/written',
    label: `Papers II–IV · Written (${WRITTEN_QUESTIONS.length} EN/ने)`,
  },
  {
    id: 'simulate',
    to: '/simulate',
    label: 'Exam Simulator',
  },
];

export function AssessmentFormatNav({ active }: AssessmentFormatNavProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <nav
      aria-label="PSC preparation format switcher"
      className="max-w-full overflow-x-auto inline-flex flex-nowrap sm:flex-wrap items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
    >
      {ITEMS.map((item) => {
        const isCurrent = active === item.id;
        return (
          <Link
            key={item.id}
            to={item.to}
            aria-current={isCurrent ? 'page' : undefined}
            className={`relative min-h-9 inline-flex items-center px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isCurrent
                ? 'text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
            }`}
          >
            {isCurrent && (
              <motion.span
                layoutId="assessment-format-active-tab"
                aria-hidden="true"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }
                className="absolute inset-0 rounded-md bg-blue-700 dark:bg-blue-600 shadow-2xs"
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
