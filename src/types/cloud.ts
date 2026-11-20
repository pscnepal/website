import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { User } from 'firebase/auth';
import type {
  FlashcardProgress,
  QuizPlayMode,
  QuizQuestion,
  WrittenLanguageMode,
  WrittenQuestion,
} from './assessment';
import type { ReadingMaterialItem } from './materials';
import type {
  BookReadingStats,
  ReadingProgressEntry,
  RecentBookEntry,
} from './pdf';
import type { SettingsState } from './reader';
import type { PscCadreId } from './syllabus';
import type { CloudStatsCounts, ReactionItemType } from './workspace';

// ============================================================================
// FIREBASE & RTK QUERY BASE TYPES
// ============================================================================

export type FirestoreOperationType =
  | 'create'
  | 'update'
  | 'delete'
  | 'list'
  | 'get'
  | 'write';

export interface FirestoreErrorInfo {
  error: string;
  operationType: FirestoreOperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface FirestoreQueryArgs<T = unknown> {
  kind: 'firestore';
  operation: string;
  run: () => Promise<T>;
}

export type AppBaseQueryArgs = string | FetchArgs | FirestoreQueryArgs;

export type AppBaseQueryError =
  | FetchBaseQueryError
  | {
      status: 'CUSTOM_ERROR';
      error: string;
      data?: string;
    };

// ============================================================================
// CLOUD REACTIONS, DIRECTORY & WORKSPACE SYNC TYPES
// ============================================================================

export type CloudItemType = ReactionItemType;
export type CloudReactionValue = 'like' | 'dislike' | 'none';
export type CloudItemStatsEntry = CloudStatsCounts;

export type CloudUserStatus = 'active' | 'disabled' | 'banned';
export type CloudUserTargetCadre = PscCadreId;

export interface CloudUserQuizAttemptSummary {
  id: string;
  deckTitle: string;
  mode: QuizPlayMode;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercent: number;
  pscNetScore: number;
  durationSeconds: number;
  completedAt: string;
}

export interface CloudUserFlaggedQuestionSummary {
  questionId: string;
  flaggedAt: string;
  source: 'quiz' | 'simulation' | 'dashboard';
  deckTitle: string;
  cadreId: string;
  reason: string;
  note: string;
}

export interface CloudUserDirectoryEntry {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'admin' | 'aspirant';
  status: CloudUserStatus;
  statusReason: string;
  targetCadre: CloudUserTargetCadre | '';
  phone: string;
  adminNotes: string;
  statusUpdatedAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  lastLoginAt: string | null;
  quizAttemptsCount: number;
  questionsAnswered: number;
  averageAccuracy: number | null;
  bestAccuracy: number | null;
  flaggedCount: number;
  reactionsCount: number;
  viewsCount: number;
  recentAttempts: CloudUserQuizAttemptSummary[];
  flaggedQuestions: CloudUserFlaggedQuestionSummary[];
}

export interface UpdateAdminUserDetailsInput {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  role: 'admin' | 'aspirant';
  status?: CloudUserStatus;
  statusReason?: string;
  targetCadre?: CloudUserTargetCadre | '';
  phone?: string;
  adminNotes?: string;
  statusChanged?: boolean;
}

export interface CloudQuizQuestionOverride {
  question: QuizQuestion;
  isDeleted: boolean;
  updatedAtMs: number;
}

export interface CloudWrittenQuestionOverride {
  question: WrittenQuestion;
  isDeleted: boolean;
  updatedAtMs: number;
}

export interface CloudMaterialOverride {
  material: ReadingMaterialItem;
  categoryId: string;
  categoryName?: string;
  categorySubtitle?: string;
  categoryDescription?: string;
  isDeleted: boolean;
  updatedAtMs: number;
}

export interface UpsertMaterialPayload {
  item: ReadingMaterialItem;
  categoryId: string;
  categoryName?: string;
  categorySubtitle?: string;
  categoryDescription?: string;
}

export interface WorkspacePreferencesPayload extends SettingsState {
  preferredQuizMode: QuizPlayMode;
  preferredWrittenLanguage: WrittenLanguageMode;
  targetCadreId: PscCadreId;
}

export interface WorkspaceSyllabusPayload {
  completedUnitIds: string[];
  completedTopicIds: string[];
  bookmarkedUnitIds: string[];
  examChecklist: Record<string, boolean>;
}

export interface WorkspaceBookmarksPayload {
  pyqIds: string[];
  affairIds: string[];
}

export interface WorkspaceLibraryPayload {
  recentBooks: RecentBookEntry[];
  readingProgress: Record<string, ReadingProgressEntry>;
  readingStats: Record<string, BookReadingStats>;
}

export interface CloudUserWorkspaceBundle {
  preferences: WorkspacePreferencesPayload | null;
  syllabus: WorkspaceSyllabusPayload | null;
  bookmarks: WorkspaceBookmarksPayload | null;
  flashcards: Record<string, FlashcardProgress> | null;
  library: WorkspaceLibraryPayload | null;
}

// ============================================================================
// CONTEXT PROVIDER INTERFACES
// ============================================================================

export interface AuthContextValue {
  user: User | null;
  isDashboardAdmin: boolean;
  isAuthReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
}

export interface DashboardUsersContextValue {
  users: CloudUserDirectoryEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastSyncedAt: string | null;
  refreshUsers: () => Promise<void>;
  updateUserStatus: (params: {
    uid: string;
    status: CloudUserStatus;
    reason?: string;
  }) => Promise<void>;
  updateUserDetails: (params: UpdateAdminUserDetailsInput) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateOwnPassword: (newPassword: string) => Promise<'updated' | 'linked'>;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  targetCadre: PscCadreId;
  isPublic: boolean;
  booksReadCount: number;
  totalPagesRead: number;
  readingMinutes: number;
  writtenPracticedCount: number;
  writtenMasteredCount: number;
  writtenEvaluationsCount: number;
  writtenWordsCount: number;
  quizAttemptsCount: number;
  omrSimulationsCount: number;
  quizQuestionsSolved: number;
  quizAvgAccuracy: number;
  quizTotalNetScore: number;
  totalScore: number;
  updatedAt: string | null;
  createdAt: string | null;
}

export type LeaderboardCategory = 'overall' | 'reading' | 'written' | 'quiz';
