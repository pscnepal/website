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
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { SeoManager } from './components/seo/SeoManager';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CurrentAffairsPage } from './pages/CurrentAffairsPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { DashboardQuizBankPage } from './pages/dashboard/DashboardQuizBankPage';
import { DashboardWrittenBankPage } from './pages/dashboard/DashboardWrittenBankPage';
import { DashboardMaterialsPage } from './pages/dashboard/DashboardMaterialsPage';
import { DashboardUsersPage } from './pages/dashboard/DashboardUsersPage';
import { DashboardDataPage } from './pages/dashboard/DashboardDataPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { HomePage } from './pages/HomePage';
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
      <LayoutGroup>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Dedicated Dashboard Section as Separate Pages */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="overview" element={<DashboardOverviewPage />} />
            <Route path="quiz-bank" element={<DashboardQuizBankPage />} />
            <Route path="written-bank" element={<DashboardWrittenBankPage />} />
            <Route path="materials" element={<DashboardMaterialsPage />} />
            <Route path="users" element={<DashboardUsersPage />} />
            <Route path="aspirants" element={<Navigate to="/dashboard/users" replace />} />
            <Route path="data" element={<DashboardDataPage />} />
            <Route path="backup" element={<Navigate to="/dashboard/data" replace />} />
          </Route>
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/syllabus/:cadreId" element={<SyllabusPage />} />
          <Route path="/simulate" element={<SimulationPage />} />
          <Route
            path="/simulation"
            element={<Navigate to="/simulate" replace />}
          />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/materials/:categoryId" element={<MaterialsPage />} />
          <Route path="/ebooks" element={<Navigate to="/materials" replace />} />
          <Route path="/browse" element={<Navigate to="/materials" replace />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:deckId" element={<QuizPage />} />
          <Route path="/written" element={<WrittenQuestionsPage />} />
          <Route path="/written/:questionId" element={<WrittenQuestionsPage />} />
          <Route
            path="/long-questions"
            element={<Navigate to="/written" replace />}
          />
          <Route path="/evaluator" element={<WrittenEvaluatorPage />} />
          <Route
            path="/written-evaluator"
            element={<Navigate to="/evaluator" replace />}
          />
          <Route
            path="/rubric"
            element={<Navigate to="/evaluator" replace />}
          />
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          <Route
            path="/samasamayik"
            element={<Navigate to="/current-affairs" replace />}
          />
          <Route
            path="/affairs"
            element={<Navigate to="/current-affairs" replace />}
          />
          <Route path="/calendar" element={<NoticeCalendarPage />} />
          <Route path="/notices" element={<NoticeCalendarPage />} />
          <Route path="/routine" element={<Navigate to="/calendar" replace />} />
          <Route
            path="/psc-calendar"
            element={<Navigate to="/calendar" replace />}
          />
          <Route path="/pyq" element={<PyqArchivePage />} />
          <Route
            path="/past-questions"
            element={<Navigate to="/pyq" replace />}
          />
          <Route
            path="/previous-questions"
            element={<Navigate to="/pyq" replace />}
          />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/cards" element={<Navigate to="/flashcards" replace />} />
          <Route path="/memorize" element={<Navigate to="/flashcards" replace />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/read" element={<ReaderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route
            path="/privacy-policy"
            element={<Navigate to="/privacy" replace />}
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/terms-of-service"
            element={<Navigate to="/terms" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LayoutGroup>
      <ScrollToTopButton />
      <PscChatbot />
    </BrowserRouter>
  );
}
