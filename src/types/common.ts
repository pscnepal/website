import type { LucideIcon } from 'lucide-react';
import type {
  ButtonHTMLAttributes,
  ComponentType,
  MouseEvent,
  ReactNode,
} from 'react';
import type { ReactionItemType } from './workspace';

// ============================================================================
// ACTION BUTTONS & PRIMITIVES
// ============================================================================

export type ActionButtonColor =
  | 'blue'
  | 'crimson'
  | 'emerald'
  | 'amber'
  | 'zinc'
  | 'purple'
  | 'red';

export type ActionButtonVariant = 'solid' | 'outline' | 'subtle' | 'ghost';
export type ActionButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ActionButtonProps {
  /** Text label displayed inside button (can be omitted for icon-only buttons) */
  label?: ReactNode;
  /** Mandatory title / tooltip explaining the action for accessibility & user guidance */
  title: string;
  /** Primary semantic color theme */
  color?: ActionButtonColor;
  /** Visual button style */
  variant?: ActionButtonVariant;
  /** Button dimensions */
  size?: ActionButtonSize;
  /** Optional icon component */
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  /** Position of icon relative to label */
  iconPosition?: 'left' | 'right';
  /** Click event handler */
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** If provided, renders as an internal React Router Link */
  to?: string;
  /** If provided, renders as an external HTML anchor tag */
  href?: string;
  /** Download attribute when href is provided */
  download?: boolean | string;
  /** Open in new tab when href is provided */
  target?: string;
  rel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom accessible label */
  ariaLabel?: string;
  /** Custom styling classes */
  className?: string;
  /** Active toggle state (for pressed toggles) */
  active?: boolean;
  /** Hide text label on small screens (< sm) so only the icon renders */
  hideLabelOnMobile?: boolean;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
}

export type ButtonVariant = 'primary' | 'secondary' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

export interface TooltipProps {
  content: string;
  shortcut?: string;
  position?: 'bottom' | 'top';
  children: ReactNode;
}

export interface DropdownProps {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
}

// ============================================================================
// ACTION MENU & SEARCHABLE SELECT
// ============================================================================

export interface ActionMenuItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label */
  label: ReactNode;
  /** Optional secondary subtitle or hint */
  description?: string;
  /** Icon displayed next to label */
  icon: LucideIcon | ComponentType<{ className?: string }>;
  /** Semantic color theme for icon and item focus/hover tint */
  color?: ActionButtonColor;
  /** Optional status or count badge */
  badge?: ReactNode;
  /** Click handler */
  onClick?: (e: MouseEvent) => void;
  /** Internal React Router navigation target */
  to?: string;
  /** External navigation link */
  href?: string;
  /** Download attribute if href is provided */
  download?: boolean | string;
  /** External target (e.g. '_blank') */
  target?: string;
  /** Open in new tab safe rel */
  rel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Highlight as danger / destructive action */
  danger?: boolean;
  /** Render a separator line before this item */
  divider?: boolean;
}

export interface SharedActionMenuProps {
  /** List of action items to render in menu */
  items: ActionMenuItem[];
  /** Optional label on the trigger button (omitted for icon-only button) */
  label?: ReactNode;
  /** Custom trigger icon (defaults to MoreHorizontal, or ChevronDown if label is set) */
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  /** Position of icon relative to label */
  iconPosition?: 'left' | 'right';
  /** Accessible title & tooltip for trigger button */
  title?: string;
  /** Trigger button visual color */
  color?: ActionButtonColor;
  /** Trigger button visual variant */
  variant?: ActionButtonVariant;
  /** Trigger button size */
  size?: ActionButtonSize;
  /** Horizontal alignment of dropdown menu */
  align?: 'left' | 'right';
  /** Dropdown menu width class (e.g. 'w-48', 'w-56') */
  width?: string;
  /** Optional title / header displayed at top of the open menu */
  header?: ReactNode;
  /** Disabled state for the entire menu trigger */
  disabled?: boolean;
  /** Custom container class */
  className?: string;
  /** Custom trigger button class */
  triggerClassName?: string;
  /** Custom menu dropdown class */
  menuClassName?: string;
  /** Hide trigger label on small screens (< sm) so only the icon renders */
  hideLabelOnMobile?: boolean;
}

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
  icon?: ComponentType<{ className?: string }>;
}

export type SearchSelectSize = 'xs' | 'sm' | 'md';

export interface SharedSearchSelectProps {
  /** Selected value */
  value: string;
  /** Value change callback */
  onChange: (value: string) => void;
  /** Available options */
  options: (SearchSelectOption | { label: string; value: string })[];
  /** Placeholder when no option is selected */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Optional field label above trigger */
  label?: string;
  /** Optional accessible aria label */
  ariaLabel?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Enable search filter input (defaults to true if options count > 3) */
  enableSearch?: boolean;
  /** Whether a clear 'X' button is shown when a value is selected */
  clearable?: boolean;
  /** Value to set when cleared (defaults to 'all' or empty string) */
  clearValue?: string;
  /** Control dimensions */
  size?: SearchSelectSize;
  /** Popover horizontal alignment */
  align?: 'left' | 'right';
  /** Popover min-width (e.g. 'w-48', 'w-64', 'min-w-[200px]') */
  popoverWidth?: string;
  /** Custom wrapper class */
  className?: string;
  /** Custom trigger button class */
  triggerClassName?: string;
  /** Custom popover class */
  popoverClassName?: string;
  /** Optional HTML id */
  id?: string;
  /** Optional HTML name */
  name?: string;
}

// ============================================================================
// TABLES & DATA TABLES (Unified ColumnDef<T>)
// ============================================================================

export interface ColumnDef<T> {
  /** Unique key for the column */
  id: string;
  /** Header title or component */
  header: ReactNode;
  /** Property on item to display directly if no custom render is given */
  accessorKey?: keyof T;
  /** Custom render function */
  render?: (item: T, index: number) => ReactNode;
  /** Alignment of column text */
  align?: 'left' | 'center' | 'right';
  /** Width class or inline width */
  width?: string;
  /** Additional classes applied to td cells */
  className?: string;
  /** Additional classes applied to th header */
  headerClassName?: string;
  /** If true, column is hidden on mobile screens (< 768px) */
  hideOnMobile?: boolean;
  /** If true, column is hidden on tablets (< 1024px) */
  hideOnTablet?: boolean;
  /** Whether the column can be sorted */
  sortable?: boolean;
  /** Optional custom sorting accessor function */
  sortKey?: (item: T) => string | number | boolean | null | undefined;
}

export interface SharedTableProps<T> {
  /** Array of row items */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Unique key extractor for each row */
  keyExtractor: (item: T, index: number) => string | number;
  /** Message displayed when data is empty */
  emptyMessage?: string;
  /** Sub-description displayed when empty */
  emptyDescription?: string;
  /** Action button or element rendered in empty state */
  emptyAction?: ReactNode;
  /** Accessible table caption */
  caption?: string;
  /** Table wrapper class name */
  className?: string;
  /** Whether rows should alternate background colors */
  striped?: boolean;
  /** Optional row click handler */
  onRowClick?: (item: T) => void;
  /** Highlight on hover */
  hoverable?: boolean;
  /** Enable built-in pagination (defaults to true if data length > defaultPageSize) */
  pagination?: boolean;
  /** Initial rows per page (default: 15) */
  defaultPageSize?: number;
  /** Available page size choices */
  pageSizeOptions?: number[];
  /** Optional row selection support */
  selectable?: boolean;
  /** Set of selected keys */
  selectedKeys?: Set<string | number>;
  /** Callback when selected rows change */
  onSelectionChange?: (selected: Set<string | number>) => void;
  /** Optional custom class per table row */
  rowClassName?: (item: T, index: number) => string;
  /** Hide the table header row for key-value summary tables */
  hideHeader?: boolean;
  /** Use compact cell padding (suitable for chat & embedded summaries) */
  compact?: boolean;
}

export interface TableFilterOption {
  label: string;
  value: string;
}

export interface TableFilterDef {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: TableFilterOption[];
  ariaLabel?: string;
  width?: string;
}

export interface SharedDataTableProps<T> {
  /** Array of data records */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Unique key extractor */
  keyExtractor: (item: T, index: number) => string | number;
  /** Optional table title */
  title?: string;
  /** Optional description */
  subtitle?: string;
  /** Total count before filters (for displaying "Showing X of Y") */
  totalCount?: number;
  /** Search state & handler */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  /** Filter definitions rendered in toolbar */
  filters?: TableFilterDef[];
  /** Custom extra filter buttons/controls */
  customFilters?: ReactNode;
  /** Function to reset all filters */
  onResetFilters?: () => void;
  /** Whether filters are currently non-default */
  isFiltered?: boolean;
  /** Header action buttons (e.g. Export, Add New, etc.) */
  actions?: ReactNode;
  /** Enable built-in CSV export button */
  enableCsvExport?: boolean;
  csvFilename?: string;
  /** Empty state message and description */
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  /** Row click handler */
  onRowClick?: (item: T) => void;
  /** Whether rows are hoverable */
  hoverable?: boolean;
  /** Alternating row striping */
  striped?: boolean;
  /** Enable pagination */
  pagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** Row selection */
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  /** View mode for rendering: 'table' or 'cards' */
  viewMode?: 'table' | 'cards';
  /** Custom card renderer when viewMode is 'cards' */
  renderCard?: (item: T, index: number) => ReactNode;
  /** Custom grid classes for card layout */
  gridClassName?: string;
  /** Wrapper className */
  className?: string;
}

// ============================================================================
// DIALOGS, REACTIONS, TOASTS & ERROR BOUNDARY
// ============================================================================

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: ActionButtonColor;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export interface FlagReasonTargetQuestion {
  id: string;
  question: string;
  questionNe?: string;
  subject?: string;
}

export interface FlagReasonModalProps {
  open: boolean;
  question: FlagReasonTargetQuestion | null;
  initialReason?: string;
  title?: string;
  submitLabel?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export interface ReactionButtonsProps {
  itemId: string;
  itemType?: ReactionItemType;
  baseCounts?: { views?: number; likes?: number; dislikes?: number };
  size?: 'xs' | 'sm' | 'md';
  showLabels?: boolean;
  showViews?: boolean;
  readOnly?: boolean;
  className?: string;
}

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Optional stable ID to deduplicate/update existing toasts of the same category */
  id?: string;
  /** Optional concise bold title above the message */
  title?: string;
  /** Auto-dismiss delay in ms. Pass 0 for a persistent toast until dismissed. */
  duration?: number;
  /** Optional single-click recovery/navigation button */
  action?: ToastAction;
}

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration: number;
  action?: ToastAction;
  createdAt: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

// ============================================================================
// LAYOUT, VECTORS, ROUTING, SEO & UTILITIES
// ============================================================================

export interface PageTransitionProps {
  children: ReactNode;
  transitionKey?: string;
  fadeOnly?: boolean;
  className?: string;
}

export interface HimalayanLandscapeVectorProps {
  className?: string;
  variant?: 'subtle' | 'vibrant';
}

export interface BookCoverVectorProps {
  title: string;
  codeOrEdition: string;
  themeColor?: 'crimson' | 'navy' | 'emerald' | 'amber';
  className?: string;
  aspectRatio?: 'standard' | 'compact';
}

export interface ParsedFirestoreError {
  error: string;
  operationType?: string;
  path?: string | null;
}

export interface UrlValidationResult {
  valid: boolean;
  normalizedUrl: string;
  errorMessage?: string;
}

export interface ResolvedSeoPayload {
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  ogType: 'website' | 'article';
  jsonLd: Record<string, unknown>;
}

export interface RouteEntry {
  path: string;
  element: ReactNode;
}

export interface OptionalParamRouteEntry {
  basePath: string;
  param: string;
  element: ReactNode;
}
