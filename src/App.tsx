/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { LayoutGroup, MotionConfig, useReducedMotion } from 'motion/react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { GoogleAnalyticsTracker } from './components/analytics/GoogleAnalyticsTracker';
import { DeferredPscChatbot } from './components/chat/DeferredPscChatbot';
import {
  ErrorBoundary,
  GlobalErrorListener,
} from './components/common/ErrorBoundary';
import { RouteFallback } from './components/common/RouteFallback';
import { ToastViewport } from './components/common/ToastViewport';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { SeoManager } from './components/seo/SeoManager';
import { HomePage } from './pages/HomePage';
import { revokeAllLocalPdfFiles } from './services/pdfLocalCacheService';
import type { OptionalParamRouteEntry, RouteEntry } from './types/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyNamed<TModule, K extends keyof TModule>(
  importer: () => Promise<TModule>,
  exportName: K
): LazyExoticComponent<ComponentType<any>> {
  return lazy(() =>
    importer().then((mod) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default: mod[exportName] as ComponentType<any>,
    }))
  );
}

const DashboardLayout = lazyNamed(
  () => import('./components/dashboard/DashboardLayout'),
  'DashboardLayout'
);
const DashboardOverviewPage = lazyNamed(
  () => import('./pages/dashboard/DashboardOverviewPage'),
  'DashboardOverviewPage'
);
const DashboardQuizBankPage = lazyNamed(
  () => import('./pages/dashboard/DashboardQuizBankPage'),
  'DashboardQuizBankPage'
);
const DashboardFlaggedPage = lazyNamed(
  () => import('./pages/dashboard/DashboardFlaggedPage'),
  'DashboardFlaggedPage'
);
const DashboardWrittenBankPage = lazyNamed(
  () => import('./pages/dashboard/DashboardWrittenBankPage'),
  'DashboardWrittenBankPage'
);
const DashboardMaterialsPage = lazyNamed(
  () => import('./pages/dashboard/DashboardMaterialsPage'),
  'DashboardMaterialsPage'
);
const DashboardUsersPage = lazyNamed(
  () => import('./pages/dashboard/DashboardUsersPage'),
  'DashboardUsersPage'
);
const DashboardInquiriesPage = lazyNamed(
  () => import('./pages/dashboard/DashboardInquiriesPage'),
  'DashboardInquiriesPage'
);
const DashboardDataPage = lazyNamed(
  () => import('./pages/dashboard/DashboardDataPage'),
  'DashboardDataPage'
);

const SyllabusPage = lazyNamed(() => import('./pages/SyllabusPage'), 'SyllabusPage');
const MaterialsPage = lazyNamed(() => import('./pages/MaterialsPage'), 'MaterialsPage');
const QuizPage = lazyNamed(() => import('./pages/QuizPage'), 'QuizPage');
const WrittenQuestionsPage = lazyNamed(
  () => import('./pages/WrittenQuestionsPage'),
  'WrittenQuestionsPage'
);
const SimulationPage = lazyNamed(
  () => import('./pages/SimulationPage'),
  'SimulationPage'
);
const WrittenEvaluatorPage = lazyNamed(
  () => import('./pages/WrittenEvaluatorPage'),
  'WrittenEvaluatorPage'
);
const CurrentAffairsPage = lazyNamed(
  () => import('./pages/CurrentAffairsPage'),
  'CurrentAffairsPage'
);
const NoticeCalendarPage = lazyNamed(
  () => import('./pages/NoticeCalendarPage'),
  'NoticeCalendarPage'
);
const PyqArchivePage = lazyNamed(
  () => import('./pages/PyqArchivePage'),
  'PyqArchivePage'
);
const FlashcardsPage = lazyNamed(
  () => import('./pages/FlashcardsPage'),
  'FlashcardsPage'
);
const LeaderboardPage = lazyNamed(
  () => import('./pages/LeaderboardPage'),
  'LeaderboardPage'
);
const ProgressPage = lazyNamed(() => import('./pages/ProgressPage'), 'ProgressPage');
const LibraryPage = lazyNamed(() => import('./pages/LibraryPage'), 'LibraryPage');
const FeaturesPage = lazyNamed(() => import('./pages/FeaturesPage'), 'FeaturesPage');
const ReaderPage = lazyNamed(() => import('./pages/ReaderPage'), 'ReaderPage');
const AboutPage = lazyNamed(() => import('./pages/AboutPage'), 'AboutPage');
const ContactPage = lazyNamed(() => import('./pages/ContactPage'), 'ContactPage');
const PrivacyPolicyPage = lazyNamed(
  () => import('./pages/PrivacyPolicyPage'),
  'PrivacyPolicyPage'
);
const TermsPage = lazyNamed(() => import('./pages/TermsPage'), 'TermsPage');
const NotFoundPage = lazyNamed(() => import('./pages/NotFoundPage'), 'NotFoundPage');

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
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SeoManager />
        <GoogleAnalyticsTracker />
        <ScrollManager />
        <GlobalErrorListener />
        <LayoutGroup>
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
          </ErrorBoundary>
        </LayoutGroup>
        <ScrollToTopButton />
        <OfflineIndicator />
        <DeferredPscChatbot />
        <ToastViewport />
      </BrowserRouter>
    </MotionConfig>
  );
}
