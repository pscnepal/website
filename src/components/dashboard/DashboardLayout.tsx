import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardUsersProvider } from '../../context/DashboardUsersContext';
import type { DashboardTab } from '../../pages/DashboardPage';
import { DashboardAdminGate } from '../auth/DashboardAdminGate';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  activeTab?: DashboardTab;
  onSelectTab?: (tab: DashboardTab) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  children?: React.ReactNode;
}

const STORAGE_KEY_SIDEBAR = 'pscnepal_dashboard_sidebar_collapsed';

export function DashboardLayout({
  activeTab: propActiveTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  children,
}: DashboardLayoutProps) {
  const location = useLocation();
  const { isAuthReady, isDashboardAdmin } = useAuth();

  const getActiveTabFromLocation = (pathname: string): DashboardTab => {
    if (pathname.includes('/quiz-bank')) return 'quiz-bank';
    if (pathname.includes('/flagged')) return 'flagged';
    if (pathname.includes('/written-bank')) return 'written-bank';
    if (pathname.includes('/materials')) return 'materials';
    if (pathname.includes('/users') || pathname.includes('/aspirants')) return 'users';
    if (pathname.includes('/data') || pathname.includes('/backup')) return 'data';
    return 'overview';
  };

  const activeTab = propActiveTab ?? getActiveTabFromLocation(location.pathname);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY_SIDEBAR) === 'true';
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist collapsed preference
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_SIDEBAR, String(next));
      } catch {
        // Ignore localStorage restrictions
      }
      return next;
    });
  };

  // Keyboard shortcut (⌘B or Ctrl+B to toggle sidebar, Esc to close mobile)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleCollapse();
      }
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Auto-close mobile drawer when window resizes to desktop
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleMedia = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsMobileOpen(false);
      }
    };
    mql.addEventListener('change', handleMedia);
    return () => mql.removeEventListener('change', handleMedia);
  }, []);

  if (!isAuthReady || !isDashboardAdmin) {
    return <DashboardAdminGate />;
  }

  return (
    <DashboardUsersProvider>
      <div className="h-screen w-full flex overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
        {/* Dedicated Dashboard Sidebar (Collapsible on Desktop, Off-Canvas Drawer on Mobile) */}
        <DashboardSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Dashboard Column */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Dedicated Dashboard Header */}
          <DashboardHeader
            activeTab={activeTab}
            isSidebarCollapsed={isCollapsed}
            onToggleSidebar={toggleCollapse}
            onOpenMobileSidebar={() => setIsMobileOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />

          {/* Scrollable Dashboard Contents Area */}
          <main
            id="dashboard-main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 focus:outline-none"
          >
            <div className="space-y-6">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </DashboardUsersProvider>
  );
}
