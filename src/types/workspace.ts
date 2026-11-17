import type {
  FlashcardProgress,
  WrittenEvaluationRecord,
} from './assessment';
import type {
  BookMetadata,
  BookReadingStats,
  ReadingProgressEntry,
  RecentBookEntry,
} from './pdf';
import type {
  PscCadreSyllabus,
  PscSyllabusPaper,
  PscSyllabusTopic,
} from './syllabus';

// ============================================================================
// INQUIRIES & FLAGGED QUESTIONS
// ============================================================================

export type InquiryCategory =
  | 'general'
  | 'quiz-errata'
  | 'material-request'
  | 'reader-support';

export type InquiryStatus = 'open' | 'in-review' | 'resolved';

export interface ContactInquiryRecord {
  id: string;
  userId?: string;
  ticketCode: string;
  name: string;
  email: string;
  category: InquiryCategory;
  reference: string;
  message: string;
  status: InquiryStatus;
  adminReply?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FlaggedQuestionRecord {
  questionId: string;
  flaggedAt: string;
  source?: 'quiz' | 'simulation' | 'dashboard';
  deckTitle?: string;
  cadreId?: string;
  reason?: string;
  note?: string;
}

// ============================================================================
// REACTIONS & ENGAGEMENT
// ============================================================================

export type ReactionType = 'like' | 'dislike';
export type ReactionItemType = 'question' | 'material' | 'affair';

export interface CloudStatsCounts {
  views: number;
  likes: number;
  dislikes: number;
}

export interface ReactionsState {
  /** Map of item ID (question ID or material ID) to current user's reaction */
  userReactions: Record<string, ReactionType>;
  /** Map of item ID to recorded user views */
  itemViews: Record<string, number>;
  /** In-memory map of item IDs to itemType for cloud sync classification */
  itemTypes: Record<string, ReactionItemType>;
  /** Public community counts stored in Firestore itemStats/{itemId} */
  cloudStats: Record<string, CloudStatsCounts>;
  /** Reactions already committed to Firestore for current user (prevents double-counting) */
  syncedUserReactions: Record<string, ReactionType>;
  /** View counts already committed to Firestore for current user (prevents double-counting) */
  syncedItemViews: Record<string, number>;
}

// ============================================================================
// REDUX LIBRARY & STUDY WORKSPACE STATE
// ============================================================================

export interface LibraryState {
  currentBook: BookMetadata | null;
  recentBooks: RecentBookEntry[];
  readingProgress: Record<string, ReadingProgressEntry>;
  readingStats: Record<string, BookReadingStats>;
}

export interface WorkspaceState {
  flashcardProgress: Record<string, FlashcardProgress>;
  pyqBookmarks: Record<string, boolean>;
  affairBookmarks: Record<string, boolean>;
  examChecklist: Record<string, boolean>;
  writtenEvaluations: WrittenEvaluationRecord[];
}

// ============================================================================
// STUDY ASSISTANT CHATBOT
// ============================================================================

export interface ClientStudyContext {
  currentPath?: string;
  targetCadreId?: string;
  completedTopicsCount?: number;
  completedUnitsCount?: number;
  quizAttemptsCount?: number;
  bestQuizAccuracy?: number | null;
  writtenMasteredCount?: number;
  writtenPracticingCount?: number;
  simulationRunsCount?: number;
  recentBooksCount?: number;
}

export interface ChatMessageTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: string;
}

export interface ChatMarkdownProps {
  content: string;
  showCursor?: boolean;
  onNavigateInternal: (path: string) => void;
}

export interface OpenChatDetail {
  prompt?: string;
}

export interface ChatFoundTopic {
  cadre: PscCadreSyllabus;
  paper: PscSyllabusPaper;
  topic: PscSyllabusTopic;
  score: number;
}

// ============================================================================
// PAGE TAB STATES
// ============================================================================

export type PyqPageTab = 'archive' | 'heatmap' | 'challenge';
export type CalendarPageTab = 'calendar' | 'notices' | 'guidelines';
