import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { CURRENT_AFFAIRS_ITEMS } from '../data/currentAffairsData';
import { hydrateLibraryState } from '../features/library/librarySlice';
import { hydratePscPrepState } from '../features/psc/pscSlice';
import { hydrateQuizState } from '../features/quiz/quizSlice';
import { hydrateLocalReactions } from '../features/reactions/reactionsSlice';
import { hydrateSettings } from '../features/settings/settingsSlice';
import {
  hydrateBookmarks,
  hydrateExamChecklist,
  hydrateFlashcards,
  hydrateWrittenEvaluations,
} from '../features/workspace/workspaceSlice';
import { hydrateWrittenState } from '../features/written/writtenSlice';
import type {
  BookReadingStats,
  FlashcardProgress,
  PscPrepState,
  QuizQuestion,
  QuizState,
  ReactionType,
  ReadingMaterialCategory,
  ReadingProgressEntry,
  RecentBookEntry,
  SettingsState,
  WrittenEvaluationRecord,
  WrittenQuestion,
  WrittenState,
} from '../types';
import { materialStorageService } from './materialStorageService';
import { offlineDbService } from './offlineDbService';
import { questionStorageService } from './questionStorageService';
import { STORAGE_KEYS, storageService } from './storageService';

let hydrationStarted = false;

function hasLocalStorageKey(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export async function initializeOfflineStorageHydration(
  reduxStore: Store<RootState>
): Promise<void> {
  if (hydrationStarted || typeof window === 'undefined') return;
  hydrationStarted = true;

  if (!offlineDbService.isSupported()) return;

  try {
    // 1. Hydrate or seed Study Banks (MCQs, Written Q&A, Materials Catalog, Current Affairs)
    const [storedQuizBank, storedWrittenBank, storedMaterialsBank, storedAffairs] =
      await Promise.all([
        offlineDbService.getStudyBank<QuizQuestion[]>('quiz_questions'),
        offlineDbService.getStudyBank<WrittenQuestion[]>('written_questions'),
        offlineDbService.getStudyBank<ReadingMaterialCategory[]>(
          'material_categories'
        ),
        offlineDbService.getStudyBank<typeof CURRENT_AFFAIRS_ITEMS>(
          'current_affairs'
        ),
      ]);

    if (
      !questionStorageService.hasCustomQuizQuestions() &&
      storedQuizBank?.items &&
      Array.isArray(storedQuizBank.items) &&
      storedQuizBank.items.length > 0
    ) {
      questionStorageService.saveQuizQuestions(storedQuizBank.items);
    } else if (!storedQuizBank) {
      void offlineDbService.putStudyBank(
        'quiz_questions',
        questionStorageService.loadQuizQuestions()
      );
    }

    if (
      !questionStorageService.hasCustomWrittenQuestions() &&
      storedWrittenBank?.items &&
      Array.isArray(storedWrittenBank.items) &&
      storedWrittenBank.items.length > 0
    ) {
      questionStorageService.saveWrittenQuestions(storedWrittenBank.items);
    } else if (!storedWrittenBank) {
      void offlineDbService.putStudyBank(
        'written_questions',
        questionStorageService.loadWrittenQuestions()
      );
    }

    if (
      !materialStorageService.hasCustomMaterials() &&
      storedMaterialsBank?.items &&
      Array.isArray(storedMaterialsBank.items) &&
      storedMaterialsBank.items.length > 0
    ) {
      materialStorageService.saveMaterialCategories(storedMaterialsBank.items);
    } else if (!storedMaterialsBank) {
      void offlineDbService.putStudyBank(
        'material_categories',
        materialStorageService.loadMaterialCategories()
      );
    }

    if (!storedAffairs) {
      void offlineDbService.putStudyBank('current_affairs', CURRENT_AFFAIRS_ITEMS);
    }

    // 2. Reconcile User Progress Snapshot between localStorage and IndexedDB
    const idbProgress = await offlineDbService.getAllProgressRecords();
    const state = reduxStore.getState();

    // Settings
    if (!hasLocalStorageKey(STORAGE_KEYS.SETTINGS) && idbProgress.settings) {
      const recovered = idbProgress.settings as SettingsState;
      reduxStore.dispatch(hydrateSettings(recovered));
      storageService.saveSettings(recovered);
    } else {
      void offlineDbService.putProgressRecord('settings', state.settings);
    }

    // Library (Recent Books, Reading Progress, Reading Stats)
    const missingLibraryLocal =
      !hasLocalStorageKey(STORAGE_KEYS.RECENT_BOOKS) &&
      !hasLocalStorageKey(STORAGE_KEYS.READING_PROGRESS) &&
      !hasLocalStorageKey(STORAGE_KEYS.READING_STATS);

    if (
      missingLibraryLocal &&
      (idbProgress.recent_books ||
        idbProgress.reading_progress ||
        idbProgress.reading_stats)
    ) {
      const recentBooks = Array.isArray(idbProgress.recent_books)
        ? (idbProgress.recent_books as RecentBookEntry[])
        : state.library.recentBooks;
      const readingProgress =
        idbProgress.reading_progress &&
        typeof idbProgress.reading_progress === 'object'
          ? (idbProgress.reading_progress as Record<string, ReadingProgressEntry>)
          : state.library.readingProgress;
      const readingStats =
        idbProgress.reading_stats &&
        typeof idbProgress.reading_stats === 'object'
          ? (idbProgress.reading_stats as Record<string, BookReadingStats>)
          : state.library.readingStats;

      reduxStore.dispatch(
        hydrateLibraryState({
          recentBooks,
          readingProgress,
          readingStats,
        })
      );
      storageService.saveRecentBooks(recentBooks);
      storageService.saveReadingProgress(readingProgress);
      storageService.saveReadingStats(readingStats);
    } else {
      void offlineDbService.putProgressRecord(
        'recent_books',
        state.library.recentBooks
      );
      void offlineDbService.putProgressRecord(
        'reading_progress',
        state.library.readingProgress
      );
      void offlineDbService.putProgressRecord(
        'reading_stats',
        state.library.readingStats
      );
    }

    // Quiz State
    if (!hasLocalStorageKey(STORAGE_KEYS.QUIZ_STATE) && idbProgress.quiz_state) {
      const recoveredQuiz = idbProgress.quiz_state as QuizState;
      if (recoveredQuiz && Array.isArray(recoveredQuiz.attempts)) {
        reduxStore.dispatch(hydrateQuizState(recoveredQuiz));
        storageService.saveQuizState(recoveredQuiz);
      }
    } else {
      void offlineDbService.putProgressRecord('quiz_state', state.quiz);
    }

    // Written State
    if (
      !hasLocalStorageKey(STORAGE_KEYS.WRITTEN_STATE) &&
      idbProgress.written_state
    ) {
      const recoveredWritten = idbProgress.written_state as WrittenState;
      if (recoveredWritten && typeof recoveredWritten === 'object') {
        reduxStore.dispatch(hydrateWrittenState(recoveredWritten));
        storageService.saveWrittenState(recoveredWritten);
      }
    } else {
      void offlineDbService.putProgressRecord('written_state', state.written);
    }

    // PSC Prep State (Syllabus & Simulations)
    if (
      !hasLocalStorageKey(STORAGE_KEYS.PSC_PREP_STATE) &&
      idbProgress.psc_prep_state
    ) {
      const recoveredPsc = idbProgress.psc_prep_state as PscPrepState;
      if (recoveredPsc && typeof recoveredPsc === 'object') {
        reduxStore.dispatch(hydratePscPrepState(recoveredPsc));
        storageService.savePscPrepState(recoveredPsc);
      }
    } else {
      void offlineDbService.putProgressRecord('psc_prep_state', state.psc);
    }

    // Workspace (Flashcards, Bookmarks, Checklist, Evaluations)
    if (
      !hasLocalStorageKey(STORAGE_KEYS.FLASHCARD_PROGRESS) &&
      idbProgress.flashcard_progress
    ) {
      const recovered = idbProgress.flashcard_progress as Record<
        string,
        FlashcardProgress
      >;
      reduxStore.dispatch(hydrateFlashcards(recovered));
      storageService.saveFlashcardProgress(recovered);
    } else {
      void offlineDbService.putProgressRecord(
        'flashcard_progress',
        state.workspace.flashcardProgress
      );
    }

    const missingBookmarks =
      !hasLocalStorageKey(STORAGE_KEYS.PYQ_BOOKMARKS) &&
      !hasLocalStorageKey(STORAGE_KEYS.AFFAIR_BOOKMARKS);
    if (
      missingBookmarks &&
      (idbProgress.pyq_bookmarks || idbProgress.affair_bookmarks)
    ) {
      const pyqBookmarks =
        (idbProgress.pyq_bookmarks as Record<string, boolean>) ?? {};
      const affairBookmarks =
        (idbProgress.affair_bookmarks as Record<string, boolean>) ?? {};
      reduxStore.dispatch(hydrateBookmarks({ pyqBookmarks, affairBookmarks }));
      storageService.savePyqBookmarks(pyqBookmarks);
      storageService.saveAffairBookmarks(affairBookmarks);
    } else {
      void offlineDbService.putProgressRecord(
        'pyq_bookmarks',
        state.workspace.pyqBookmarks
      );
      void offlineDbService.putProgressRecord(
        'affair_bookmarks',
        state.workspace.affairBookmarks
      );
    }

    if (
      !hasLocalStorageKey(STORAGE_KEYS.EXAM_CHECKLIST) &&
      idbProgress.exam_checklist
    ) {
      const recovered = idbProgress.exam_checklist as Record<string, boolean>;
      reduxStore.dispatch(hydrateExamChecklist(recovered));
      storageService.saveExamChecklist(recovered);
    } else {
      void offlineDbService.putProgressRecord(
        'exam_checklist',
        state.workspace.examChecklist
      );
    }

    if (
      !hasLocalStorageKey(STORAGE_KEYS.WRITTEN_EVALUATIONS) &&
      idbProgress.written_evaluations
    ) {
      const recovered =
        idbProgress.written_evaluations as WrittenEvaluationRecord[];
      if (Array.isArray(recovered)) {
        reduxStore.dispatch(hydrateWrittenEvaluations(recovered));
        storageService.saveWrittenEvaluations(recovered);
      }
    } else {
      void offlineDbService.putProgressRecord(
        'written_evaluations',
        state.workspace.writtenEvaluations
      );
    }

    // Reactions
    if (!hasLocalStorageKey(STORAGE_KEYS.REACTIONS) && idbProgress.reactions) {
      const recovered = idbProgress.reactions as {
        userReactions?: Record<string, ReactionType>;
        itemViews?: Record<string, number>;
      };
      reduxStore.dispatch(hydrateLocalReactions(recovered));
      storageService.saveReactions({
        userReactions: recovered.userReactions ?? {},
        itemViews: recovered.itemViews ?? {},
      });
    } else {
      void offlineDbService.putProgressRecord('reactions', {
        userReactions: state.reactions.userReactions,
        itemViews: state.reactions.itemViews,
      });
    }

    // Flagged Questions
    if (
      !hasLocalStorageKey(STORAGE_KEYS.FLAGGED_QUESTIONS) &&
      idbProgress.flagged_questions
    ) {
      const recoveredFlags = idbProgress.flagged_questions;
      if (recoveredFlags && typeof recoveredFlags === 'object') {
        storageService.saveFlaggedQuestions(
          recoveredFlags as ReturnType<typeof storageService.loadFlaggedQuestions>
        );
      }
    } else {
      void offlineDbService.putProgressRecord(
        'flagged_questions',
        storageService.loadFlaggedQuestions()
      );
    }
  } catch {
    // Never break app startup if browser blocks IndexedDB (e.g. strict private browsing)
  }
}
