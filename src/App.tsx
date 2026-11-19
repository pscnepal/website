/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { LayoutGroup, useReducedMotion } from 'motion/react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { PscChatbot } from './components/chat/PscChatbot';
import {
  ErrorBoundary,
  GlobalErrorListener,
} from './components/common/ErrorBoundary';
import { ToastViewport } from './components/common/ToastViewport';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { SeoManager } from './components/seo/SeoManager';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CurrentAffairsPage } from './pages/CurrentAffairsPage';
import { DashboardDataPage } from './pages/dashboard/DashboardDataPage';
import { DashboardFlaggedPage } from './pages/dashboard/DashboardFlaggedPage';
import { DashboardInquiriesPage } from './pages/dashboard/DashboardInquiriesPage';
import { DashboardMaterialsPage } from './pages/dashboard/DashboardMaterialsPage';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { DashboardQuizBankPage } from './pages/dashboard/DashboardQuizBankPage';
import { DashboardUsersPage } from './pages/dashboard/DashboardUsersPage';
import { DashboardWrittenBankPage } from './pages/dashboard/DashboardWrittenBankPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { NoticeCalendarPage } from './pages/NoticeCalendarPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProgressPage } from './pages/ProgressPage';
import { PyqArchivePage } from './pages/PyqArchivePage';
import { QuizPage } from './pages/QuizPage';
import { ReaderPage } from './pages/ReaderPage';
import { SimulationPage } from './pages/SimulationPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { TermsPage } from './pages/TermsPage';
import { WrittenEvaluatorPage } from './pages/WrittenEvaluatorPage';
import { WrittenQuestionsPage } from './pages/WrittenQuestionsPage';
import { revokeAllLocalPdfFiles } from './services/pdfService';
import type { OptionalParamRouteEntry, RouteEntry } from './types/common';

const DASHBOARD_CHILD_ROUTES: ReadonlyArray<RouteEntry> = [
  { path: 'quiz-bank', element: <DashboardQuizBankPage /> },
  { path: 'flagged', element: <DashboardFlaggedPage /> },
  { path: 'written-bank', element: <DashboardWrittenBankPage /> },
  { path: 'materials', element: <DashboardMaterialsPage /> },
  { path: 'users', element: <DashboardUsersPage /> },
  { path: 'inquiries', element: <DashboardInquiriesPage /> },
  { path: 'data', element: <DashboardDataPage /> },
];

const DASHBOARD_REDIRECTS: ReadonlyArray<readonly [from: string, to: string]> = [
  ['overview', '/dashboard'],
  ['aspirants', '/dashboard/users'],
  ['backup', '/dashboard/data'],
];

const OPTIONAL_PARAM_ROUTES: ReadonlyArray<OptionalParamRouteEntry> = [
  { basePath: '/syllabus', param: 'cadreId', element: <SyllabusPage /> },
  { basePath: '/materials', param: 'categoryId', element: <MaterialsPage /> },
  { basePath: '/quiz', param: 'deckId', element: <QuizPage /> },
  { basePath: '/written', param: 'questionId', element: <WrittenQuestionsPage /> },
];

const PUBLIC_PAGE_ROUTES: ReadonlyArray<RouteEntry> = [
  { path: '/', element: <HomePage /> },
  { path: '/simulate', element: <SimulationPage /> },
  { path: '/evaluator', element: <WrittenEvaluatorPage /> },
  { path: '/current-affairs', element: <CurrentAffairsPage /> },
  { path: '/calendar', element: <NoticeCalendarPage /> },
  { path: '/notices', element: <NoticeCalendarPage /> },
  { path: '/pyq', element: <PyqArchivePage /> },
  { path: '/flashcards', element: <FlashcardsPage /> },
  { path: '/leaderboard', element: <LeaderboardPage /> },
  { path: '/progress', element: <ProgressPage /> },
  { path: '/library', element: <LibraryPage /> },
  { path: '/features', element: <FeaturesPage /> },
  { path: '/read', element: <ReaderPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/privacy', element: <PrivacyPolicyPage /> },
  { path: '/terms', element: <TermsPage /> },
];

const LEGACY_REDIRECT_ROUTES: ReadonlyArray<readonly [from: string, to: string]> = [
  ['/admin', '/dashboard'],
  ['/simulation', '/simulate'],
  ['/ebooks', '/materials'],
  ['/browse', '/materials'],
  ['/long-questions', '/written'],
  ['/written-evaluator', '/evaluator'],
  ['/rubric', '/evaluator'],
  ['/samasamayik', '/current-affairs'],
  ['/affairs', '/current-affairs'],
  ['/routine', '/calendar'],
  ['/psc-calendar', '/calendar'],
  ['/past-questions', '/pyq'],
  ['/previous-questions', '/pyq'],
  ['/cards', '/flashcards'],
  ['/memorize', '/flashcards'],
  ['/rankings', '/leaderboard'],
  ['/privacy-policy', '/privacy'],
  ['/terms-of-service', '/terms'],
];

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const prevPathnameRef = useRef(pathname);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    const behavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';

    // Handle hash-anchor deep links smoothly once target section mounts
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      const rafId = window.requestAnimationFrame(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior, block: 'start' });
        }
      });
      prevPathnameRef.current = pathname;
      isFirstMountRef.current = false;
      return () => window.cancelAnimationFrame(rafId);
    }

    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Preserve scroll position when opening/closing modal dialogs on /quiz or /simulate
    const isQuizDialogToggle =
      prev.startsWith('/quiz') && pathname.startsWith('/quiz');
    const isSimulateDialogToggle =
      prev.startsWith('/simulate') && pathname.startsWith('/simulate');

    if (!isQuizDialogToggle && !isSimulateDialogToggle) {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, [pathname, hash, shouldReduceMotion]);

  return null;
}

export default function App() {
  const theme = useAppSelector((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleUnload = () => {
      revokeAllLocalPdfFiles();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      <SeoManager />
      <ScrollManager />
      <GlobalErrorListener />
      <LayoutGroup>
        <ErrorBoundary>
          <Routes>
            {/* Dedicated Dashboard Section */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverviewPage />} />
              {DASHBOARD_CHILD_ROUTES.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              {DASHBOARD_REDIRECTS.map(([from, to]) => (
                <Route
                  key={from}
                  path={from}
                  element={<Navigate to={to} replace />}
                />
              ))}
            </Route>

            {/* Primary Public & Study Routes */}
            {PUBLIC_PAGE_ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Parameterized Study Routes */}
            {OPTIONAL_PARAM_ROUTES.flatMap(({ basePath, param, element }) => [
              <Route key={basePath} path={basePath} element={element} />,
              <Route
                key={`${basePath}/:${param}`}
                path={`${basePath}/:${param}`}
                element={element}
              />,
            ])}

            {/* Legacy & Alias Redirects */}
            {LEGACY_REDIRECT_ROUTES.map(([from, to]) => (
              <Route
                key={from}
                path={from}
                element={<Navigate to={to} replace />}
              />
            ))}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </LayoutGroup>
      <ScrollToTopButton />
      <OfflineIndicator />
      <PscChatbot />
      <ToastViewport />
    </BrowserRouter>
  );
}
