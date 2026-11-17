import { PAPER_2_QUESTIONS } from './written/paper2Questions';
import { PAPER_3_QUESTIONS } from './written/paper3Questions';
import { PAPER_4_QUESTIONS } from './written/paper4Questions';
import { WRITTEN_PAPERS, type WrittenQuestion } from './written/types';

export type {
  WrittenPaperCode,
  WrittenQuestionMarks,
  WrittenQuestionType,
  BilingualSection,
  LocalizedAnswerContent,
  BilingualRubricPoint,
  WrittenQuestion,
} from './written/types';

export { WRITTEN_PAPERS };

export const WRITTEN_QUESTIONS: WrittenQuestion[] = [
  ...PAPER_2_QUESTIONS,
  ...PAPER_3_QUESTIONS,
  ...PAPER_4_QUESTIONS,
];

export function getWrittenQuestionById(
  questionId: string
): WrittenQuestion | undefined {
  return WRITTEN_QUESTIONS.find((q) => q.id === questionId);
}
