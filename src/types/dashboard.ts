import type { ReactNode } from 'react';
import type { QuizQuestion, WrittenQuestion } from './assessment';
import type {
  CloudUserDirectoryEntry,
  CloudUserFlaggedQuestionSummary,
  CloudUserStatus,
} from './cloud';
import type { SearchSelectOption } from './common';
import type { ReadingMaterialItem } from './materials';

// ============================================================================
// DASHBOARD NAVIGATION & CONFIG (Unified DashboardTab / SiteDashboardTab)
// ============================================================================

export type DashboardTab =
  | 'overview'
  | 'quiz-bank'
  | 'flagged'
  | 'written-bank'
  | 'materials'
  | 'users'
  | 'inquiries'
  | 'data';

export type SiteDashboardTab = DashboardTab;

export interface SiteNavLinkItem {
  to: string;
  label: string;
  end?: boolean;
}

export type DashboardAccentColor =
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'crimson'
  | 'purple'
  | 'zinc';

export interface DashboardModuleConfig {
  id: DashboardTab;
  path: string;
  label: string;
  quickActionLabel: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  quickDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoBreadcrumb: string;
  color: DashboardAccentColor;
  dividerBefore?: boolean;
}

// ============================================================================
// DASHBOARD LAYOUT, HEADER, SIDEBAR & TAB PROPS
// ============================================================================

export interface DashboardSearchContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface DashboardLayoutProps {
  activeTab?: DashboardTab;
  onSelectTab?: (tab: DashboardTab) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  children?: ReactNode;
}

export interface DashboardHeaderProps {
  activeTab?: DashboardTab;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export interface DashboardSidebarProps {
  activeTab?: DashboardTab;
  onSelectTab?: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export interface DashboardOverviewTabProps {
  onSwitchTab?: (tab: DashboardTab) => void;
}

// ============================================================================
// DASHBOARD MODALS & TABLE ROW VIEW MODELS
// ============================================================================

export interface MaterialFormSavePayload {
  categoryId: string;
  categoryName?: string;
  categorySubtitle?: string;
  categoryDescription?: string;
  item: ReadingMaterialItem;
}

export interface MaterialFormModalProps {
  isOpen: boolean;
  materialToEdit?: (ReadingMaterialItem & { categoryId: string }) | null;
  onClose: () => void;
  onSave: (payload: MaterialFormSavePayload) => void;
}

export interface QuizQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: QuizQuestion | null;
  onClose: () => void;
  onSave: (question: QuizQuestion) => void;
}

export interface WrittenQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: WrittenQuestion | null;
  onClose: () => void;
  onSave: (question: WrittenQuestion) => void;
}

export interface SelectOrCustomFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  customPlaceholder?: string;
  searchPlaceholder?: string;
  customOptionLabel?: string;
  focusRingClass?: string;
}

export type MaterialTableRow = ReadingMaterialItem & {
  categoryName: string;
  categoryId: string;
};

export interface UserSubmittedFlagReport {
  reportId: string;
  user: CloudUserDirectoryEntry;
  flagMeta: CloudUserFlaggedQuestionSummary;
  question: QuizQuestion | null;
}

export interface FlagInspectContext {
  question: QuizQuestion;
  reason?: string;
  note?: string;
  flaggedAt?: string;
  source?: string;
  reporterName?: string;
  reporterEmail?: string;
  totalFlagsForQuestion: number;
}

export interface UserStatusActionState {
  user: CloudUserDirectoryEntry;
  targetStatus: CloudUserStatus;
}

// ============================================================================
// DAILY QUIZ WIDGET TYPES
// ============================================================================

export type DailyQuizLanguageMode = 'bilingual' | 'en' | 'ne';

export interface DailyQuizPersistedState {
  dateKey: string;
  rotationOffset: number;
  selectedAnswers: Record<string, string[]>;
  revealedIds: Record<string, boolean>;
  savedRotations: Record<string, boolean>;
}

export interface DailyQuizWidgetProps {
  maxQuestions?: number;
}

// ============================================================================
// QUESTION BANK CSV IMPORT / EXPORT TYPES
// ============================================================================

export interface CsvImportRowError {
  rowNumber: number;
  questionId?: string;
  message: string;
}

export interface CsvImportParseResult<T> {
  validItems: T[];
  errors: CsvImportRowError[];
  totalRows: number;
  newCount: number;
  updateCount: number;
}

export interface BulkImportSummary {
  created: number;
  updated: number;
  cloudSynced: number;
  cloudFailed: number;
  cloudSkipped?: boolean;
}

export interface QuestionCsvImportModalProps<T extends { id: string }> {
  isOpen: boolean;
  kind: 'quiz' | 'written';
  existingIds: Set<string>;
  onClose: () => void;
  onDownloadTemplate: () => void;
  onParseCsv: (
    csvText: string,
    existingIds: Set<string>
  ) => CsvImportParseResult<T>;
  onConfirmImport: (items: T[]) => Promise<BulkImportSummary>;
}

