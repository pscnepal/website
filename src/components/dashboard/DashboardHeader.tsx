import { useRef, type RefObject } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Database,
  Globe,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Search,
  Sparkles,
  Sun,
  UserCheck,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/settings/settingsSlice';
import { useFullscreen } from '../../hooks/useFullscreen';
import type { DashboardTab } from '../../pages/DashboardPage';
import { SharedActionMenu } from '../common/SharedActionMenu';

interface DashboardHeaderProps {
  activeTab?: DashboardTab;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const TAB_TITLES: Record<
  DashboardTab,
  { title: string; subtitle: string; category: string }
> = {
  overview: {
    title: 'Executive Overview',
    subtitle: 'System metrics, preparation KPIs & daily progress',
    category: 'Console',
  },
  'quiz-bank': {
    title: 'Objective Question Bank',
    subtitle: 'Official PSC preliminary MCQs, explanations & references',
    category: 'Question Banks',
  },
  flagged: {
    title: 'Flagged for Review',
    subtitle: 'High-priority questions bookmarked during quiz & exam sittings',
    category: 'Question Banks',
  },
  'written-bank': {
    title: 'Subjective Written Bank',
    subtitle: 'Phase II analytical questions, rubrics & model answers',
    category: 'Question Banks',
  },
  materials: {
    title: 'Study Materials & Parichaya Archives',
    subtitle: '13 editions of Nepal Parichaya, Constitution & core statutes',
    category: 'Official Archives',
  },
  users: {
    title: 'Aspirants Directory',
    subtitle: 'Candidate cohorts, target cadres & preparation profiles',
    category: 'Directory',
  },
  data: {
    title: 'Data, Backup & Export',
    subtitle: 'Manage local browser study progress and offline archives',
    category: 'System',
  },
};

export function DashboardHeader({
  activeTab: propActiveTab,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
  searchQuery = '',
  onSearchChange = () => {},
}: DashboardHeaderProps) {
  const location = useLocation();
  const getSectionFromPath = (path: string): DashboardTab => {
    if (path.includes('/quiz-bank')) return 'quiz-bank';
    if (path.includes('/flagged')) return 'flagged';
    if (path.includes('/written-bank')) return 'written-bank';
    if (path.includes('/materials')) return 'materials';
    if (path.includes('/users') || path.includes('/aspirants')) return 'users';
    if (path.includes('/data') || path.includes('/backup')) return 'data';
    return 'overview';
  };
  const activeTab = propActiveTab ?? getSectionFromPath(location.pathname);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } =
    useFullscreen(containerRef as RefObject<HTMLElement | null>);

  const tabInfo = TAB_TITLES[activeTab] ?? TAB_TITLES.overview;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
      {/* Left zone: Toggle triggers & Current Location */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation sidebar"
          className="p-2 -ml-2 rounded-lg text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'
          }
          title={
            isSidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'
          }
          className="hidden lg:flex p-1.5 -ml-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Breadcrumb & Section Name */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 leading-none">
            <span className="hidden sm:inline">Dashboard</span>
            <span aria-hidden="true" className="hidden sm:inline">
              /
            </span>
            <span className="font-medium text-zinc-600 dark:text-zinc-300 truncate">
              {tabInfo.category}
            </span>
          </div>
          <h1 className="font-serif font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight truncate mt-0.5">
            {tabInfo.title}
          </h1>
        </div>
      </div>

      {/* Center zone: Search Filter Input (only shown on filterable tabs) */}
      {activeTab !== 'overview' && activeTab !== 'data' ? (
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Filter ${tabInfo.title.toLowerCase()}...`}
              aria-label={`Filter ${tabInfo.title}`}
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:block" />
      )}

      {/* Right zone: Actions, Mode Toggle, Public Site Link */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Quick Launch Action Menu */}
        <SharedActionMenu
          label="Quick Actions"
          icon={Sparkles}
          color="blue"
          variant="subtle"
          size="sm"
          width="w-64"
          header="Console Quick Navigation"
          items={[
            {
              id: 'quiz',
              label: 'MCQ Question Bank',
              description: 'Inspect verified preliminary items',
              icon: CheckCircle2,
              color: 'emerald',
              to: '/dashboard/quiz-bank',
            },
            {
              id: 'flagged',
              label: 'Flagged for Review',
              description: 'Saved tricky questions & revision notes',
              icon: Bookmark,
              color: 'amber',
              to: '/dashboard/flagged',
            },
            {
              id: 'written',
              label: 'Written Question Bank',
              description: 'Subjective papers & model rubrics',
              icon: PenLine,
              color: 'crimson',
              to: '/dashboard/written-bank',
            },
            {
              id: 'reader',
              label: 'Materials Inventory',
              description: 'Official reference documents & PDFs',
              icon: BookOpen,
              color: 'blue',
              to: '/dashboard/materials',
            },
            {
              id: 'directory',
              label: 'Aspirants Cohort',
              description: 'Directory & candidate dossiers',
              icon: UserCheck,
              color: 'purple',
              to: '/dashboard/users',
              divider: true,
            },
            {
              id: 'data-backup',
              label: 'Data Backup & Export',
              description: 'Export study state & statistics',
              icon: Database,
              color: 'zinc',
              to: '/dashboard/data',
            },
          ]}
        />

        {/* BS Academic Session Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>२०८१/८२ Session</span>
        </div>

        {/* Fullscreen toggle (if supported) */}
        {isFullscreenSupported && (
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Theme mode toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Exit to Public Portal Button */}
        <Link
          to="/"
          title="Return to public portal homepage"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-750 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Public Site</span>
        </Link>
      </div>
    </header>
  );
}
