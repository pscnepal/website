import type { ReactNode } from 'react';
import type { PscCadreId } from './syllabus';

// ============================================================================
// OBJECTIVE QUIZ DOMAIN
// ============================================================================

export type QuizOptionKey = 'A' | 'B' | 'C' | 'D';
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuizDifficultyFilter = 'All' | QuizDifficulty;

export interface QuizOption {
  key: QuizOptionKey;
  text: string;
  textNe?: string;
}

export interface QuizQuestion {
  id: string;
  level: string;
  service: string;
  group: string;
  post: string;
  paper: string;
  subject: string;
  topicId: string;
  topic: string;
  subtopicId: string;
  subtopic: string;
  question: string;
  questionNe?: string;
  options: QuizOption[];
  correct_options: QuizOptionKey[];
  is_multi_select: boolean;
  explanation: string;
  explanationNe?: string;
  difficulty: QuizDifficulty;
  marks: number;
  sourceTitle?: string;
  sourcePath?: string;
}

export interface QuizDeck {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  questions: QuizQuestion[];
}

export type QuizPlayMode = 'exam' | 'study';
export type QuestionOutcome = 'correct' | 'wrong' | 'skipped';

export interface QuizAttemptRecord {
  id: string;
  deckId: string;
  deckTitle: string;
  mode: QuizPlayMode;
  totalQuestions: number;
  totalMarks?: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  accuracyPercent: number;
  pscNetScore: number;
  durationSeconds: number;
  deadlineSeconds: number;
  timedOut: boolean;
  completedAt: string;
  questionOutcomes?: Record<string, QuestionOutcome>;
}

export interface QuizState {
  preferredMode: QuizPlayMode;
  attempts: QuizAttemptRecord[];
}

export type QuizReviewFilter =
  | 'all'
  | 'incorrect'
  | 'unanswered'
  | 'correct'
  | 'flagged';

// ============================================================================
// WRITTEN EXAMINATION DOMAIN
// ============================================================================

export type WrittenPaperCode =
  | 'Paper II: Governance Systems'
  | 'Paper III: Contemporary Issues & Development'
  | 'Paper IV: Service Delivery & Case Analysis'
  | 'NTC Paper II: Computer Engineering';

export type WrittenQuestionMarks = 5 | 10;

export type WrittenQuestionType =
  | 'Short Analytical'
  | 'Long Analytical'
  | 'Case Study';

export interface BilingualSection {
  heading: string;
  points: string[];
}

export interface LocalizedAnswerContent {
  title: string;
  question: string;
  marksAllocation: string;
  introduction: string;
  sections: BilingualSection[];
  conclusion: string;
}

export interface BilingualRubricPoint {
  en: string;
  ne: string;
}

export interface WrittenQuestion {
  id: string;
  paper: WrittenPaperCode;
  subject: string;
  postTarget: string;
  marks: WrittenQuestionMarks;
  recommendedMinutes: number;
  questionType: WrittenQuestionType;
  sourceTitle: string;
  sourcePath: string;
  en: LocalizedAnswerContent;
  ne: LocalizedAnswerContent;
  rubric: BilingualRubricPoint[];
}

export type WrittenLanguageMode = 'bilingual' | 'en' | 'ne';
export type WrittenMasteryStatus = 'unseen' | 'practicing' | 'mastered';
export type WrittenMarksFilter = 'all' | '5' | '10';
export type WrittenStatusFilter = 'all' | WrittenMasteryStatus;

export interface WrittenQuestionProgress {
  questionId: string;
  status: WrittenMasteryStatus;
  checkedRubricIndices: number[];
  draftAnswer: string;
  timeSpentSeconds: number;
  updatedAt: string;
}

export interface WrittenState {
  preferredLanguage: WrittenLanguageMode;
  records: Record<string, WrittenQuestionProgress>;
}

export interface AnswerBlockProps {
  question: WrittenQuestion;
  languageMode: WrittenLanguageMode;
}

// ============================================================================
// FLASHCARDS & ANSWER EVALUATOR DOMAIN
// ============================================================================

export type LeitnerBoxLevel = 1 | 2 | 3;

export interface FlashcardProgress {
  boxLevel: LeitnerBoxLevel;
  lastReviewedAt: number;
  timesReviewed: number;
  timesCorrect: number;
}

export type FlashcardDeckId =
  | 'constitution-rights'
  | 'constitutional-organs'
  | 'geography-belts'
  | 'history-treaties'
  | 'economy-16th-plan'
  | 'international-affairs';

export interface FlashcardItem {
  id: string;
  deckId: FlashcardDeckId;
  deckNameNe: string;
  deckNameEn: string;
  frontNe: string;
  frontEn: string;
  backNe: string;
  backEn: string;
  mnemonicTipNe?: string;
  examContext: string;
  cadreRelevance: PscCadreId[];
  defaultDifficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardDeck {
  id: FlashcardDeckId;
  nameNe: string;
  nameEn: string;
  descriptionNe: string;
  descriptionEn: string;
  totalCards: number;
  badgeColor: 'blue' | 'emerald' | 'amber' | 'purple' | 'crimson';
}

export type RubricDimensionKey = 'intro' | 'core' | 'statutes' | 'conclusion';

export interface WrittenRubricDimensionConfig {
  id: RubricDimensionKey;
  orderNe: string;
  titleNe: string;
  titleEn: string;
  shortTitleNe: string;
  weightPercentNe: string;
  weightPercent: number;
  descriptionNe: string;
  guideSummaryNe: string;
  max10M: number;
  max5M: number;
  tierLabels: readonly [string, string, string];
}

export interface WrittenMeritTier {
  minPct: number;
  labelNe: string;
  labelEn: string;
  color: 'emerald' | 'blue' | 'amber' | 'crimson';
}

export interface WrittenEvaluationRecord {
  id: string;
  questionId: string;
  questionTitleNe: string;
  questionTitleEn: string;
  marks: WrittenQuestionMarks;
  date: string;
  evaluatedAt?: string;
  scoreIntro: number;
  scoreCore: number;
  scoreStatutes: number;
  scoreConclusion: number;
  totalScore: number;
  timeSpentSeconds: number;
  wordCount: number;
  userDraft: string;
  feedbackNotes: string;
}

export type RubricCredit = 'full' | 'partial' | 'missed';

// ============================================================================
// EXAM HALL SIMULATION DOMAIN
// ============================================================================

export type BookletKey = 'A' | 'B' | 'C' | 'D';

export interface OmrPreset {
  id: string;
  cadreId: PscCadreId;
  cadreLabel: string;
  title: string;
  nepaliTitle: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeRate: number;
  passPercent: number;
  allocatedSeconds: number;
  blueprintSummary: string;
  selectQuestions: () => QuizQuestion[];
}

export interface WrittenHallPreset {
  id: string;
  cadreId: PscCadreId;
  paperCode: string;
  title: string;
  nepaliTitle: string;
  allocatedSeconds: number;
  questionIds: string[];
  description: string;
}

export type SimulationHallType = 'omr-hall' | 'written-hall';
export type SimulatorTab = 'omr-hall' | 'written-hall' | 'merit-lab';
export type OmrReviewFilter =
  | 'all'
  | 'wrong'
  | 'blank'
  | 'correct'
  | 'flagged';
export type MobileOmrPane = 'paper' | 'sheet';

export interface SimulationRunRecord {
  id: string;
  presetId: string;
  presetTitle: string;
  cadreId: PscCadreId;
  simulationType: SimulationHallType;
  fullMarks: number;
  passMarks: number;
  grossMarks: number;
  negativeDeduction: number;
  netMarks: number;
  percentage: number;
  passed: boolean;
  totalItems: number;
  attemptedItems: number;
  correctItems: number;
  wrongItems: number;
  durationSeconds: number;
  allocatedSeconds: number;
  rollNumber: string;
  bookletKey: BookletKey;
  completedAt: string;
}

export interface PscPrepState {
  targetCadreId: PscCadreId;
  completedUnitIds: string[];
  completedTopicIds: string[];
  bookmarkedUnitIds: string[];
  simulationHistory: SimulationRunRecord[];
}

// ============================================================================
// QUIZ, SIMULATION & ASSESSMENT COMPONENT PROPS
// ============================================================================

export type AssessmentWorkspaceTab =
  | 'syllabus'
  | 'quiz'
  | 'written'
  | 'simulate';

export interface AssessmentFormatNavProps {
  active: AssessmentWorkspaceTab;
}

export interface QuizAuthGateProps {
  title: string;
  subtitle?: string;
  metaItems?: string[];
  description?: string;
  benefits?: string[];
  actionLabel?: string;
  onClose: () => void;
}

export interface QuizSessionDialogProps {
  open: boolean;
  deck: QuizDeck | null;
  initialMode: QuizPlayMode;
  onClose: () => void;
}

export interface QuizDialogInnerProps {
  deck: QuizDeck;
  initialMode: QuizPlayMode;
  onClose: () => void;
}

export interface OmrHallDialogInnerProps {
  preset: OmrPreset;
  rollNumber: string;
  bookletKey: BookletKey;
  onBookletKeyChange: (nextKey: BookletKey) => void;
  onClose: () => void;
}

export interface WrittenHallDialogInnerProps {
  preset: WrittenHallPreset;
  rollNumber: string;
  initialLang: WrittenLanguageMode;
  onClose: () => void;
}

export interface ExamSimulationDialogProps {
  open: boolean;
  simulationType: SimulationHallType;
  omrPreset: OmrPreset;
  writtenPreset: WrittenHallPreset;
  rollNumber: string;
  bookletKey: BookletKey;
  onBookletKeyChange: (key: BookletKey) => void;
  initialWrittenLang: WrittenLanguageMode;
  onClose: () => void;
}

export interface RadialCountdownProps {
  ratio: number;
  size?: number;
  strokeWidth?: number;
  urgency: 'normal' | 'low' | 'critical';
  children?: ReactNode;
}

export interface AnimatedScoreGaugeProps {
  percent: number;
  reduceMotion: boolean;
}

export interface HallCountdownRingProps {
  ratio: number;
  urgency: 'normal' | 'low' | 'critical';
}
