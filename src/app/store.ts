import {
  combineReducers,
  configureStore,
  isAction,
  type Middleware,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pscApi } from './api/pscApi';
import libraryReducer from '../features/library/librarySlice';
import pscReducer from '../features/psc/pscSlice';
import quizReducer from '../features/quiz/quizSlice';
import reactionsReducer, {
  applyItemSyncAck,
  setCloudItemStats,
} from '../features/reactions/reactionsSlice';
import { resolveReactionItemType } from '../features/reactions/reactionUtils';
import readerReducer from '../features/reader/readerSlice';
import settingsReducer from '../features/settings/settingsSlice';
import workspaceReducer from '../features/workspace/workspaceSlice';
import writtenReducer from '../features/written/writtenSlice';
import { auth } from '../lib/firebase';
import {
  clearUserQuizAttemptsInFirestore,
  clearUserReactionsInFirestore,
  clearUserSimulationRunsInFirestore,
  clearUserWrittenEvaluationsInFirestore,
  clearUserWrittenProgressInFirestore,
  createSimulationRunInFirestore,
  createWrittenEvaluationInFirestore,
  deleteWrittenEvaluationInFirestore,
  fetchAllCloudItemStats,
  syncReactionAndStatsToFirestore,
  updateUserTargetCadreInFirestore,
  upsertLeaderboardEntryInFirestore,
  upsertWorkspaceBookmarksInFirestore,
  upsertWorkspaceFlashcardsInFirestore,
  upsertWorkspaceLibraryInFirestore,
  upsertWorkspacePreferencesInFirestore,
  upsertWorkspaceSyllabusInFirestore,
  upsertWrittenProgressInFirestore,
} from '../services/cloudSyncService';
import { storageService } from '../services/storageService';
import { toast } from '../services/toastService';
import { buildLeaderboardStatsPayload } from '../utils/leaderboardHelpers';
import type {
  ReactionItemType,
  SimulationRunRecord,
  WrittenEvaluationRecord,
} from '../types';
import {
  formatUserFriendlyError,
  isFirestoreOfflineError,
} from '../utils/errorHelpers';

function handleMiddlewareSyncError(
  label: string,
  err: unknown,
  toastId: string,
  fallback: string
) {
  if (isFirestoreOfflineError(err)) {
    console.warn(`${label} (offline):`, err instanceof Error ? err.message : err);
    toast.warning(
      'Cloud database is offline. Changes are saved locally and will sync when reconnected.',
      { id: 'firebase-offline', title: 'Offline Mode' }
    );
    return;
  }
  console.error(`${label}:`, err);
  toast.error(formatUserFriendlyError(err, fallback), { id: toastId });
}

const rootReducer = combineReducers({
  [pscApi.reducerPath]: pscApi.reducer,
  reader: readerReducer,
  library: libraryReducer,
  settings: settingsReducer,
  quiz: quizReducer,
  written: writtenReducer,
  psc: pscReducer,
  reactions: reactionsReducer,
  workspace: workspaceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const viewSyncTimers = new Map<string, ReturnType<typeof setTimeout>>();

function clearTimersForUser(uid?: string): void {
  if (!uid) {
    viewSyncTimers.forEach((timer) => clearTimeout(timer));
    viewSyncTimers.clear();
    return;
  }
  const prefix = `${uid}:`;
  for (const [key, timer] of viewSyncTimers.entries()) {
    if (key.startsWith(prefix) || key.includes(`:${uid}:`)) {
      clearTimeout(timer);
      viewSyncTimers.delete(key);
    }
  }
}

function scheduleDebouncedTask(
  timerKey: string,
  delayMs: number,
  uid: string,
  fn: () => void
): void {
  const existing = viewSyncTimers.get(timerKey);
  if (existing) {
    clearTimeout(existing);
  }
  const timer = setTimeout(() => {
    viewSyncTimers.delete(timerKey);
    const active = auth.currentUser;
    if (!active || active.uid !== uid || !active.emailVerified) {
      return;
    }
    fn();
  }, delayMs);
  viewSyncTimers.set(timerKey, timer);
}

function truthyBookmarkIds(map: Record<string, boolean>): string[] {
  return Object.entries(map)
    .filter(([, active]) => Boolean(active))
    .map(([id]) => id);
}

const cloudSyncMiddleware: Middleware<Record<string, never>, RootState> =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (!isAction(action)) {
      return result;
    }

    if (
      action.type === 'reactions/resetLocalUserReactions' ||
      action.type === 'workspace/resetLocalWorkspaceState'
    ) {
      clearTimersForUser();
      return result;
    }

    // Never push local account-reset/hydration actions back to Firestore
    if (
      action.type.includes('hydrate') ||
      action.type.includes('resetLocal') ||
      action.type.includes('mergeRemote')
    ) {
      return result;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
      return result;
    }

    const uid = currentUser.uid;

    // Schedule public zero-PII leaderboard summary sync for study progress mutations
    if (
      action.type === 'quiz/recordQuizAttempt' ||
      action.type === 'quiz/clearQuizHistory' ||
      action.type === 'psc/recordSimulationRun' ||
      action.type === 'psc/clearSimulationHistory' ||
      action.type === 'psc/setTargetCadre' ||
      action.type === 'library/recordBookOpened' ||
      action.type === 'library/updateReadingProgress' ||
      action.type === 'library/recordReadingTick' ||
      action.type === 'library/recordPageTurnStats' ||
      action.type === 'library/resetBookReadingStats' ||
      action.type === 'library/clearAllReadingData' ||
      action.type === 'written/saveWrittenDraft' ||
      action.type === 'written/toggleWrittenRubricPoint' ||
      action.type === 'written/setWrittenQuestionStatus' ||
      action.type === 'written/addWrittenPracticeSeconds' ||
      action.type === 'written/clearWrittenProgress' ||
      action.type === 'workspace/addWrittenEvaluation' ||
      action.type === 'workspace/deleteWrittenEvaluation' ||
      action.type === 'workspace/clearWrittenEvaluations'
    ) {
      const lbDelayMs =
        action.type === 'library/recordReadingTick' ||
        action.type === 'written/addWrittenPracticeSeconds' ||
        action.type === 'written/saveWrittenDraft'
          ? 5000
          : 1200;

      scheduleDebouncedTask(`leaderboard:${uid}`, lbDelayMs, uid, () => {
        const active = auth.currentUser;
        if (!active || active.uid !== uid || !active.emailVerified) return;
        const st = storeApi.getState();
        const lbPayload = buildLeaderboardStatsPayload({
          userId: uid,
          displayName:
            active.displayName?.trim() ||
            active.email?.split('@')[0] ||
            'PSC Aspirant',
          photoURL: active.photoURL || undefined,
          targetCadre: st.psc.targetCadreId,
          recentBooks: st.library.recentBooks,
          readingProgress: st.library.readingProgress,
          readingStats: st.library.readingStats,
          writtenRecords: st.written.records,
          writtenEvaluations: st.workspace.writtenEvaluations,
          quizAttempts: st.quiz.attempts,
          simulationHistory: st.psc.simulationHistory,
        });
        void upsertLeaderboardEntryInFirestore(uid, lbPayload).catch((err) => {
          if (isFirestoreOfflineError(err)) {
            console.warn(
              'Leaderboard sync deferred while offline:',
              err instanceof Error ? err.message : err
            );
            return;
          }
          console.error('Background leaderboard sync failed:', err);
        });
      });
    }

    // 1. Quiz Attempt History Clear
    if (action.type === 'quiz/clearQuizHistory') {
      void clearUserQuizAttemptsInFirestore(uid).catch((err) => {
        handleMiddlewareSyncError(
          'Failed to clear cloud quiz attempts',
          err,
          'cloud-clear-quiz-err',
          'Cleared locally, but failed to clear cloud quiz history.'
        );
      });
      return result;
    }

    // 2. Clear All Reactions
    if (action.type === 'reactions/clearAllReactions') {
      clearTimersForUser(uid);
      void clearUserReactionsInFirestore(uid)
        .then(() => fetchAllCloudItemStats())
        .then((stats) => {
          if (auth.currentUser?.uid === uid) {
            storeApi.dispatch(setCloudItemStats(stats));
          }
        })
        .catch((err) => {
          handleMiddlewareSyncError(
            'Failed to clear cloud reactions',
            err,
            'cloud-clear-reactions-err',
            'Cleared locally, but failed to clear cloud reactions.'
          );
        });
      return result;
    }

    // 3. Reactions & Item Views (Questions, Reading Materials, Current Affairs)
    const isReactionMutation =
      action.type === 'reactions/toggleLike' ||
      action.type === 'reactions/toggleDislike' ||
      action.type === 'reactions/setReaction';

    const isViewMutation = action.type === 'reactions/recordView';

    if ((isReactionMutation || isViewMutation) && 'payload' in action) {
      const payload = action.payload as {
        itemId?: string;
        itemType?: ReactionItemType;
      };
      const itemId = payload?.itemId;
      if (!itemId) return result;

      const timerKey = `${uid}:${itemId}`;

      if (isReactionMutation) {
        const pendingTimer = viewSyncTimers.get(timerKey);
        if (pendingTimer) {
          clearTimeout(pendingTimer);
          viewSyncTimers.delete(timerKey);
        }

        const state = storeApi.getState();
        const targetReaction = state.reactions.userReactions[itemId] ?? 'none';
        const targetUserViews = state.reactions.itemViews[itemId] ?? 0;
        const itemType = resolveReactionItemType(
          itemId,
          state.reactions.itemTypes[itemId] ?? payload.itemType
        );

        void syncReactionAndStatsToFirestore({
          userId: uid,
          itemId,
          itemType,
          targetReaction,
          targetUserViews,
        })
          .then((ack) => {
            if (auth.currentUser?.uid === uid) {
              storeApi.dispatch(applyItemSyncAck(ack));
            }
          })
          .catch((err) => {
            handleMiddlewareSyncError(
              'Cloud reaction sync failed',
              err,
              'cloud-reaction-sync-err',
              'Your rating was saved locally, but cloud sync failed.'
            );
          });
      } else if (isViewMutation) {
        scheduleDebouncedTask(timerKey, 1200, uid, () => {
          const state = storeApi.getState();
          const targetReaction = state.reactions.userReactions[itemId] ?? 'none';
          const targetUserViews = state.reactions.itemViews[itemId] ?? 0;
          const itemType = resolveReactionItemType(
            itemId,
            state.reactions.itemTypes[itemId] ?? payload.itemType
          );

          void syncReactionAndStatsToFirestore({
            userId: uid,
            itemId,
            itemType,
            targetReaction,
            targetUserViews,
          })
            .then((ack) => {
              if (auth.currentUser?.uid === uid) {
                storeApi.dispatch(applyItemSyncAck(ack));
              }
            })
            .catch((err) => {
              handleMiddlewareSyncError(
                'Cloud view sync failed',
                err,
                'cloud-view-sync-err',
                'Could not sync view count to cloud.'
              );
            });
        });
      }
      return result;
    }

    // 4. Preferences (Theme, Reader Defaults, Quiz Mode, Written Lang, Target Cadre)
    if (
      action.type === 'settings/setTheme' ||
      action.type === 'settings/toggleTheme' ||
      action.type === 'settings/setDefaultReadingMode' ||
      action.type === 'settings/setDefaultSoundEnabled' ||
      action.type === 'quiz/setPreferredQuizMode' ||
      action.type === 'written/setPreferredWrittenLanguage' ||
      action.type === 'psc/setTargetCadre'
    ) {
      scheduleDebouncedTask(`ws-prefs:${uid}`, 450, uid, () => {
        const state = storeApi.getState();
        void upsertWorkspacePreferencesInFirestore(uid, {
          theme: state.settings.theme,
          defaultReadingMode: state.settings.defaultReadingMode,
          defaultSoundEnabled: state.settings.defaultSoundEnabled,
          preferredQuizMode: state.quiz.preferredMode,
          preferredWrittenLanguage: state.written.preferredLanguage,
          targetCadreId: state.psc.targetCadreId,
        }).catch((err) => {
          handleMiddlewareSyncError(
            'Cloud preferences sync failed',
            err,
            'cloud-prefs-sync-err',
            'Preferences saved locally, but cloud sync failed.'
          );
        });
      });

      if (action.type === 'psc/setTargetCadre') {
        scheduleDebouncedTask(`profile-cadre:${uid}`, 450, uid, () => {
          const targetCadre = storeApi.getState().psc.targetCadreId;
          void updateUserTargetCadreInFirestore(uid, targetCadre).catch((err) => {
            handleMiddlewareSyncError(
              'Cloud profile cadre sync failed',
              err,
              'cloud-cadre-sync-err',
              'Target cadre updated locally, but cloud sync failed.'
            );
          });
        });
      }
      return result;
    }

    // 5. Syllabus Mastery & Exam Hall Checklist
    if (
      action.type === 'psc/toggleSyllabusUnitCompleted' ||
      action.type === 'psc/setPaperUnitsCompleted' ||
      action.type === 'psc/toggleSyllabusTopicCompleted' ||
      action.type === 'psc/setSyllabusTopicsCompleted' ||
      action.type === 'psc/toggleSyllabusUnitBookmarked' ||
      action.type === 'psc/clearPscSyllabusProgress' ||
      action.type === 'workspace/toggleExamChecklistItem' ||
      action.type === 'workspace/clearExamChecklist'
    ) {
      scheduleDebouncedTask(`ws-syl:${uid}`, 500, uid, () => {
        const state = storeApi.getState();
        void upsertWorkspaceSyllabusInFirestore(uid, {
          completedUnitIds: state.psc.completedUnitIds,
          completedTopicIds: state.psc.completedTopicIds,
          bookmarkedUnitIds: state.psc.bookmarkedUnitIds,
          examChecklist: state.workspace.examChecklist,
        }).catch((err) => {
          handleMiddlewareSyncError(
            'Cloud syllabus sync failed',
            err,
            'cloud-syllabus-sync-err',
            'Syllabus progress saved locally, but cloud sync failed.'
          );
        });
      });
      return result;
    }

    // 6. PYQ & Current Affairs Bookmarks
    if (
      action.type === 'workspace/togglePyqBookmark' ||
      action.type === 'workspace/clearPyqBookmarks' ||
      action.type === 'workspace/toggleAffairBookmark' ||
      action.type === 'workspace/clearAffairBookmarks'
    ) {
      scheduleDebouncedTask(`ws-bm:${uid}`, 400, uid, () => {
        const state = storeApi.getState();
        void upsertWorkspaceBookmarksInFirestore(uid, {
          pyqIds: truthyBookmarkIds(state.workspace.pyqBookmarks),
          affairIds: truthyBookmarkIds(state.workspace.affairBookmarks),
        }).catch((err) => {
          handleMiddlewareSyncError(
            'Cloud bookmarks sync failed',
            err,
            'cloud-bookmarks-sync-err',
            'Bookmarks saved locally, but cloud sync failed.'
          );
        });
      });
      return result;
    }

    // 7. Leitner Flashcard Progress
    if (
      action.type === 'workspace/scoreFlashcard' ||
      action.type === 'workspace/resetFlashcardDeck' ||
      action.type === 'workspace/clearAllFlashcards'
    ) {
      scheduleDebouncedTask(`ws-fc:${uid}`, 500, uid, () => {
        const state = storeApi.getState();
        void upsertWorkspaceFlashcardsInFirestore(
          uid,
          state.workspace.flashcardProgress
        ).catch((err) => {
          handleMiddlewareSyncError(
            'Cloud flashcards sync failed',
            err,
            'cloud-flashcards-sync-err',
            'Flashcard mastery saved locally, but cloud sync failed.'
          );
        });
      });
      return result;
    }

    // 8. Reader Library History, Reading Progress & Reading Stats
    if (
      action.type === 'library/recordBookOpened' ||
      action.type === 'library/updateReadingProgress' ||
      action.type === 'library/recordReadingTick' ||
      action.type === 'library/recordPageTurnStats' ||
      action.type === 'library/resetBookReadingStats' ||
      action.type === 'library/removeRecentBook' ||
      action.type === 'library/clearRecentBooks' ||
      action.type === 'library/clearAllReadingData'
    ) {
      const delayMs = action.type === 'library/recordReadingTick' ? 4000 : 800;
      scheduleDebouncedTask(`ws-lib:${uid}`, delayMs, uid, () => {
        const state = storeApi.getState();
        void upsertWorkspaceLibraryInFirestore(uid, {
          recentBooks: state.library.recentBooks,
          readingProgress: state.library.readingProgress,
          readingStats: state.library.readingStats,
        }).catch((err) => {
          handleMiddlewareSyncError(
            'Cloud reading library sync failed',
            err,
            'cloud-library-sync-err',
            'Reading progress saved locally, but cloud sync failed.'
          );
        });
      });
      return result;
    }

    // 9. Per-Question Written Study Drafts & Rubric Progress
    if (
      action.type === 'written/saveWrittenDraft' ||
      action.type === 'written/toggleWrittenRubricPoint' ||
      action.type === 'written/setWrittenQuestionStatus' ||
      action.type === 'written/addWrittenPracticeSeconds'
    ) {
      if ('payload' in action && action.payload && typeof action.payload === 'object') {
        const qId = (action.payload as { questionId?: string }).questionId;
        if (qId) {
          const delayMs =
            action.type === 'written/saveWrittenDraft' ||
            action.type === 'written/addWrittenPracticeSeconds'
              ? 1200
              : 400;
          scheduleDebouncedTask(`wr-prog:${uid}:${qId}`, delayMs, uid, () => {
            const record = storeApi.getState().written.records[qId];
            if (!record) return;
            void upsertWrittenProgressInFirestore(uid, record).catch((err) => {
              handleMiddlewareSyncError(
                'Cloud written draft sync failed',
                err,
                'cloud-written-prog-err',
                'Written draft saved locally, but cloud sync failed.'
              );
            });
          });
        }
      }
      return result;
    }

    if (action.type === 'written/clearWrittenProgress') {
      const prefix = `wr-prog:${uid}:`;
      for (const [key, timer] of viewSyncTimers.entries()) {
        if (key.startsWith(prefix)) {
          clearTimeout(timer);
          viewSyncTimers.delete(key);
        }
      }
      void clearUserWrittenProgressInFirestore(uid).catch((err) => {
        handleMiddlewareSyncError(
          'Failed to clear cloud written progress',
          err,
          'cloud-clear-written-err',
          'Cleared locally, but failed to clear cloud written progress.'
        );
      });
      return result;
    }

    // 10. Written Evaluator Scorecards
    if (action.type === 'workspace/addWrittenEvaluation' && 'payload' in action) {
      const record = action.payload as WrittenEvaluationRecord;
      void createWrittenEvaluationInFirestore(uid, record).catch((err) => {
        handleMiddlewareSyncError(
          'Cloud written evaluation sync failed',
          err,
          'cloud-written-eval-err',
          'Evaluation scorecard saved locally, but cloud sync failed.'
        );
      });
      return result;
    }

    if (action.type === 'workspace/deleteWrittenEvaluation' && 'payload' in action) {
      const evalId = action.payload as string;
      void deleteWrittenEvaluationInFirestore(uid, evalId).catch((err) => {
        handleMiddlewareSyncError(
          'Cloud written evaluation delete failed',
          err,
          'cloud-written-eval-del-err',
          'Deleted locally, but failed to remove cloud scorecard.'
        );
      });
      return result;
    }

    if (action.type === 'workspace/clearWrittenEvaluations') {
      void clearUserWrittenEvaluationsInFirestore(uid).catch((err) => {
        handleMiddlewareSyncError(
          'Failed to clear cloud written evaluations',
          err,
          'cloud-written-eval-clear-err',
          'Cleared locally, but failed to clear cloud scorecards.'
        );
      });
      return result;
    }

    // 11. Exam Hall Simulation Runs
    if (action.type === 'psc/recordSimulationRun' && 'payload' in action) {
      const run = action.payload as SimulationRunRecord;
      void createSimulationRunInFirestore(uid, run).catch((err) => {
        handleMiddlewareSyncError(
          'Cloud simulation run sync failed',
          err,
          'cloud-sim-run-err',
          'Simulation result saved locally, but cloud sync failed.'
        );
      });
      return result;
    }

    if (action.type === 'psc/clearSimulationHistory') {
      void clearUserSimulationRunsInFirestore(uid).catch((err) => {
        handleMiddlewareSyncError(
          'Failed to clear cloud simulation history',
          err,
          'cloud-sim-clear-err',
          'Cleared locally, but failed to clear cloud simulation history.'
        );
      });
      return result;
    }

    return result;
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [pscApi.reducerPath],
        ignoredActions: [
          `${pscApi.reducerPath}/executeQuery/fulfilled`,
          `${pscApi.reducerPath}/executeQuery/rejected`,
          `${pscApi.reducerPath}/executeMutation/fulfilled`,
          `${pscApi.reducerPath}/executeMutation/rejected`,
        ],
      },
    }).concat(cloudSyncMiddleware, pscApi.middleware),
});

setupListeners(store.dispatch);

let prevSettings = store.getState().settings;
let prevRecentBooks = store.getState().library.recentBooks;
let prevProgress = store.getState().library.readingProgress;
let prevStats = store.getState().library.readingStats;
let prevQuiz = store.getState().quiz;
let prevWritten = store.getState().written;
let prevPsc = store.getState().psc;
let prevReactions = store.getState().reactions;
let prevWorkspace = store.getState().workspace;

store.subscribe(() => {
  const state = store.getState();

  if (state.settings !== prevSettings) {
    prevSettings = state.settings;
    storageService.saveSettings(state.settings);
  }

  if (state.library.recentBooks !== prevRecentBooks) {
    prevRecentBooks = state.library.recentBooks;
    storageService.saveRecentBooks(state.library.recentBooks);
  }

  if (state.library.readingProgress !== prevProgress) {
    prevProgress = state.library.readingProgress;
    storageService.saveReadingProgress(state.library.readingProgress);
  }

  if (state.library.readingStats !== prevStats) {
    prevStats = state.library.readingStats;
    storageService.saveReadingStats(state.library.readingStats);
  }

  if (state.quiz !== prevQuiz) {
    prevQuiz = state.quiz;
    storageService.saveQuizState(state.quiz);
  }

  if (state.written !== prevWritten) {
    prevWritten = state.written;
    storageService.saveWrittenState(state.written);
  }

  if (state.psc !== prevPsc) {
    prevPsc = state.psc;
    storageService.savePscPrepState(state.psc);
  }

  if (state.reactions !== prevReactions) {
    const reactionsChanged =
      state.reactions.userReactions !== prevReactions.userReactions ||
      state.reactions.itemViews !== prevReactions.itemViews;
    prevReactions = state.reactions;
    if (reactionsChanged) {
      storageService.saveReactions({
        userReactions: state.reactions.userReactions,
        itemViews: state.reactions.itemViews,
      });
    }
  }

  if (state.workspace !== prevWorkspace) {
    const ws = state.workspace;
    if (ws.flashcardProgress !== prevWorkspace.flashcardProgress) {
      storageService.saveFlashcardProgress(ws.flashcardProgress);
    }
    if (ws.pyqBookmarks !== prevWorkspace.pyqBookmarks) {
      storageService.savePyqBookmarks(ws.pyqBookmarks);
    }
    if (ws.affairBookmarks !== prevWorkspace.affairBookmarks) {
      storageService.saveAffairBookmarks(ws.affairBookmarks);
    }
    if (ws.examChecklist !== prevWorkspace.examChecklist) {
      storageService.saveExamChecklist(ws.examChecklist);
    }
    if (ws.writtenEvaluations !== prevWorkspace.writtenEvaluations) {
      storageService.saveWrittenEvaluations(ws.writtenEvaluations);
    }
    prevWorkspace = ws;
  }
});

export type AppDispatch = typeof store.dispatch;
