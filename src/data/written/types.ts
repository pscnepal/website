import type { WrittenPaperCode } from '../../types/assessment';

export type {
  BilingualRubricPoint,
  BilingualSection,
  LocalizedAnswerContent,
  WrittenPaperCode,
  WrittenQuestion,
  WrittenQuestionMarks,
  WrittenQuestionType,
} from '../../types/assessment';

export const WRITTEN_PAPERS: readonly WrittenPaperCode[] = [
  'Paper II: Governance Systems',
  'Paper III: Contemporary Issues & Development',
  'Paper IV: Service Delivery & Case Analysis',
  'NTC Paper II: Computer Engineering',
] as const;
