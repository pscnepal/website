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
import { ContactPage } from './pages/ContactPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizPage } from './pages/QuizPage';
import { ReaderPage } from './pages/ReaderPage';
import { SimulationPage } from './pages/SimulationPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { TermsPage } from './pages/TermsPage';
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
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/read" element={<ReaderPage />} />
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
