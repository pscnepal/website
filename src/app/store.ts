import {
  combineReducers,
  configureStore,
  isAction,
  type Middleware,
} from '@reduxjs/toolkit';
import libraryReducer from '../features/library/librarySlice';
import pscReducer from '../features/psc/pscSlice';
import quizReducer from '../features/quiz/quizSlice';
import reactionsReducer, {
  applyItemSyncAck,
  setCloudItemStats,
  type ReactionItemType,
} from '../features/reactions/reactionsSlice';
import { resolveReactionItemType } from '../features/reactions/reactionUtils';
import readerReducer from '../features/reader/readerSlice';
import settingsReducer from '../features/settings/settingsSlice';
import writtenReducer from '../features/written/writtenSlice';
import { auth } from '../lib/firebase';
import {
  clearUserQuizAttemptsInFirestore,
  clearUserReactionsInFirestore,
  fetchAllCloudItemStats,
  syncReactionAndStatsToFirestore,
} from '../services/cloudSyncService';
import { storageService } from '../services/storageService';

const rootReducer = combineReducers({
  reader: readerReducer,
  library: libraryReducer,
  settings: settingsReducer,
  quiz: quizReducer,
  written: writtenReducer,
  psc: pscReducer,
  reactions: reactionsReducer,
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
    if (key.startsWith(prefix)) {
      clearTimeout(timer);
      viewSyncTimers.delete(key);
    }
  }
}

const cloudSyncMiddleware: Middleware<Record<string, never>, RootState> =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (!isAction(action)) {
      return result;
    }

    if (action.type === 'reactions/resetLocalUserReactions') {
      clearTimersForUser();
      return result;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
      return result;
    }

    const uid = currentUser.uid;

    if (action.type === 'quiz/clearQuizHistory') {
      void clearUserQuizAttemptsInFirestore(uid).catch((err) => {
        console.error('Failed to clear cloud quiz attempts:', err);
      });
      return result;
    }

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
          console.error('Failed to clear cloud reactions:', err);
        });
      return result;
    }

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
            console.error('Cloud reaction sync failed:', err);
          });
      } else if (isViewMutation) {
        const existingTimer = viewSyncTimers.get(timerKey);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
          viewSyncTimers.delete(timerKey);
          const activeUser = auth.currentUser;
          if (!activeUser || activeUser.uid !== uid || !activeUser.emailVerified) {
            return;
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
              console.error('Cloud view sync failed:', err);
            });
        }, 1200);

        viewSyncTimers.set(timerKey, timer);
      }
    }

    return result;
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }).concat(cloudSyncMiddleware),
});

let prevSettings = store.getState().settings;
let prevRecentBooks = store.getState().library.recentBooks;
let prevProgress = store.getState().library.readingProgress;
let prevStats = store.getState().library.readingStats;
let prevQuiz = store.getState().quiz;
let prevWritten = store.getState().written;
let prevPsc = store.getState().psc;
let prevReactions = store.getState().reactions;

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
});

export type AppDispatch = typeof store.dispatch;
