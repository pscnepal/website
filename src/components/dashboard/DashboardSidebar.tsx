import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Database,
  HelpCircle,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Shield,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { DashboardTab } from '../../pages/DashboardPage';
import { INITIAL_CANDIDATE_USERS } from '../../data/candidateUsersData';
import { READING_MATERIAL_CATEGORIES } from '../../data/readingMaterials';
import { storageService } from '../../services/storageService';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../../services/questionStorageService';

interface DashboardSidebarProps {
  activeTab?: DashboardTab;
  onSelectTab?: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function DashboardSidebar({
  activeTab: propActiveTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const location = useLocation();
  const [flaggedCount, setFlaggedCount] = useState<number>(() => {
    return Object.keys(storageService.loadFlaggedQuestions()).length;
  });
  const [quizCount, setQuizCount] = useState<number>(() => {
    return questionStorageService.loadQuizQuestions().length;
  });
  const [writtenCount, setWrittenCount] = useState<number>(() => {
    return questionStorageService.loadWrittenQuestions().length;
  });

  useEffect(() => {
    const handleSync = () => {
      setFlaggedCount(Object.keys(storageService.loadFlaggedQuestions()).length);
    };
    const handleSyncQuiz = () => {
      setQuizCount(questionStorageService.loadQuizQuestions().length);
    };
    const handleSyncWritten = () => {
      setWrittenCount(questionStorageService.loadWrittenQuestions().length);
    };

    window.addEventListener('psc_flagged_questions_changed', handleSync);
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleSyncQuiz);
    window.addEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, handleSyncWritten);
    window.addEventListener('storage', handleSync);
    window.addEventListener('storage', handleSyncQuiz);
    window.addEventListener('storage', handleSyncWritten);

    return () => {
      window.removeEventListener('psc_flagged_questions_changed', handleSync);
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleSyncQuiz);
      window.removeEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, handleSyncWritten);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('storage', handleSyncQuiz);
      window.removeEventListener('storage', handleSyncWritten);
    };
  }, []);

  const totalMaterialsCount = READING_MATERIAL_CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  const coreNavItems: {
    id: DashboardTab;
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    description: string;
  }[] = [
    {
      id: 'overview',
      path: '/dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      description: 'KPI summary, progress tracker & analytics',
    },
    {
      id: 'quiz-bank',
      path: '/dashboard/quiz-bank',
      label: 'MCQ Question Bank',
      icon: HelpCircle,
      count: quizCount,
      description: 'Stage I Objective questions database',
    },
    {
      id: 'flagged',
      path: '/dashboard/flagged',
      label: 'Flagged for Review',
      icon: Bookmark,
      count: flaggedCount,
      description: 'Questions flagged during quiz & simulation runs',
    },
    {
      id: 'written-bank',
      path: '/dashboard/written-bank',
      label: 'Written Question Bank',
      icon: PenLine,
      count: writtenCount,
      description: 'Stage II Subjective cases & model solutions',
    },
    {
      id: 'materials',
      path: '/dashboard/materials',
      label: 'Materials Inventory',
      icon: BookOpen,
      count: totalMaterialsCount,
      description: 'Parichaya editions, Constitution & statutes',
    },
    {
      id: 'users',
      path: '/dashboard/users',
      label: 'Aspirants Cohort',
      icon: Users,
      count: INITIAL_CANDIDATE_USERS.length,
      description: 'Candidate directory & peer cohort profiles',
    },
    {
      id: 'data',
      path: '/dashboard/data',
      label: 'Data & Backup',
      icon: Database,
      description: 'Export, import & reset browser progress',
    },
  ];

  const isItemActive = (item: (typeof coreNavItems)[number]) => {
    if (propActiveTab) {
      return propActiveTab === item.id;
    }
    if (item.id === 'overview') {
      return (
        location.pathname === '/dashboard' ||
        location.pathname === '/dashboard/' ||
        location.pathname === '/dashboard/overview'
      );
    }
    return location.pathname.startsWith(item.path);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto scrollbar-none select-none">
      {/* Top Brand / Insignia */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-crimson-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="min-w-0">
              <span className="font-serif font-bold text-sm tracking-tight text-zinc-950 dark:text-zinc-50 block truncate">
                PSC Nepal
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-400 block truncate">
                Command Dashboard
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        {isMobileOpen ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          /* Desktop Collapse Button */
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Main Navigation Items as Real Links to Separate Pages */}
      <div className="flex-1 py-4 px-3 space-y-6">
        {/* Core Console Section */}
        <div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
              Command Modules
            </div>
          )}
          <nav aria-label="Dashboard navigation" className="space-y-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    onSelectTab?.(item.id);
                    onCloseMobile();
                  }}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}
                  {(!isCollapsed || isMobileOpen) && item.count !== undefined && (
                    <span
                      className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                        active
                          ? 'bg-blue-100/80 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {/* Subtle active vertical left-rail accent */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 inset-y-1.5 w-1 rounded-r-full bg-blue-700 dark:bg-blue-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Return to Public Portal */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/50">
        {/* Candidate Aspirant Card */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-blue-500/20">
              KO
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  Aspirant Officer
                </span>
                <span
                  title="Session Connected"
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                />
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                Target: Gazetted Class III (Admin)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              title="Aspirant Officer · Target: Gazetted Class III"
              className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs ring-1 ring-blue-500/20 cursor-default"
            >
              KO
            </div>
          </div>
        )}

        {/* Back to Public Website Link */}
        <Link
          to="/"
          title="Return to Public Website Homepage"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors ${
            isCollapsed && !isMobileOpen ? 'justify-center' : ''
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="truncate">Exit to Public Website</span>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-[width] duration-200 ease-in-out z-30 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard mobile navigation drawer"
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-zinc-900 shadow-2xl border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
