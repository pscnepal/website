import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { storageService } from '../../services/storageService';
import type {
  CloudStatsCounts,
  ReactionItemType,
  ReactionsState,
  ReactionType,
} from '../../types';

export type {
  CloudStatsCounts,
  ReactionItemType,
  ReactionsState,
  ReactionType,
};

const initialReactions = storageService.loadReactions();

const initialState: ReactionsState = {
  isCloudSyncActive: false,
  userReactions: initialReactions.userReactions ?? {},
  itemViews: initialReactions.itemViews ?? {},
  itemTypes: {},
  cloudStats: {},
  syncedUserReactions: {},
  syncedItemViews: {},
};

export const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    setCloudReactionSyncActive: (state, action: PayloadAction<boolean>) => {
      state.isCloudSyncActive = action.payload;
    },
    recordView: (
      state,
      action: PayloadAction<{ itemId: string; itemType?: ReactionItemType }>
    ) => {
      if (!state.isCloudSyncActive) return;
      const { itemId, itemType } = action.payload;
      if (itemType) {
        state.itemTypes[itemId] = itemType;
      }
      state.itemViews[itemId] = (state.itemViews[itemId] || 0) + 1;
    },
    toggleLike: (
      state,
      action: PayloadAction<{ itemId: string; itemType?: ReactionItemType }>
    ) => {
      if (!state.isCloudSyncActive) return;
      const { itemId, itemType } = action.payload;
      if (itemType) {
        state.itemTypes[itemId] = itemType;
      }
      const current = state.userReactions[itemId];
      if (current === 'like') {
        delete state.userReactions[itemId];
      } else {
        state.userReactions[itemId] = 'like';
      }
    },
    toggleDislike: (
      state,
      action: PayloadAction<{ itemId: string; itemType?: ReactionItemType }>
    ) => {
      if (!state.isCloudSyncActive) return;
      const { itemId, itemType } = action.payload;
      if (itemType) {
        state.itemTypes[itemId] = itemType;
      }
      const current = state.userReactions[itemId];
      if (current === 'dislike') {
        delete state.userReactions[itemId];
      } else {
        state.userReactions[itemId] = 'dislike';
      }
    },
    setReaction: (
      state,
      action: PayloadAction<{
        itemId: string;
        reaction: ReactionType | null;
        itemType?: ReactionItemType;
      }>
    ) => {
      if (!state.isCloudSyncActive) return;
      const { itemId, reaction, itemType } = action.payload;
      if (itemType) {
        state.itemTypes[itemId] = itemType;
      }
      if (!reaction) {
        delete state.userReactions[itemId];
      } else {
        state.userReactions[itemId] = reaction;
      }
    },
    setCloudItemStats: (
      state,
      action: PayloadAction<Record<string, CloudStatsCounts>>
    ) => {
      state.cloudStats = action.payload;
    },
    hydrateUserCloudReactions: (
      state,
      action: PayloadAction<{
        userReactions: Record<string, ReactionType>;
        itemViews: Record<string, number>;
      }>
    ) => {
      const { userReactions, itemViews } = action.payload;
      state.syncedUserReactions = { ...userReactions };
      state.syncedItemViews = { ...itemViews };

      // Preserve any local offline reactions while filling in cloud reactions missing locally
      for (const [id, remoteReaction] of Object.entries(userReactions)) {
        if (!state.userReactions[id]) {
          state.userReactions[id] = remoteReaction;
        }
      }

      // Reconcile view counts using max to remain idempotent across reloads
      for (const [id, remoteViews] of Object.entries(itemViews)) {
        const currentLocal = state.itemViews[id] ?? 0;
        if (remoteViews > currentLocal) {
          state.itemViews[id] = remoteViews;
        }
      }
    },
    reconcileUserCloudReactions: (
      state,
      action: PayloadAction<{
        userReactions: Record<string, ReactionType>;
        itemViews: Record<string, number>;
      }>
    ) => {
      const { userReactions, itemViews } = action.payload;
      state.userReactions = { ...userReactions };
      state.itemViews = { ...itemViews };
      state.syncedUserReactions = { ...userReactions };
      state.syncedItemViews = { ...itemViews };
    },
    applyItemSyncAck: (
      state,
      action: PayloadAction<{
        itemId: string;
        syncedReaction: ReactionType | null;
        syncedViews: number;
        stats: CloudStatsCounts;
      }>
    ) => {
      const { itemId, syncedReaction, syncedViews, stats } = action.payload;
      state.cloudStats[itemId] = stats;
      if (syncedReaction) {
        state.syncedUserReactions[itemId] = syncedReaction;
      } else {
        delete state.syncedUserReactions[itemId];
      }
      state.syncedItemViews[itemId] = syncedViews;
      if ((state.itemViews[itemId] ?? 0) < syncedViews) {
        state.itemViews[itemId] = syncedViews;
      }
    },
    resetCloudReactionSyncState: (state) => {
      state.syncedUserReactions = {};
      state.syncedItemViews = {};
    },
    resetLocalUserReactions: (state) => {
      state.userReactions = {};
      state.itemViews = {};
      state.syncedUserReactions = {};
      state.syncedItemViews = {};
    },
    clearAllReactions: (state) => {
      state.userReactions = {};
      state.itemViews = {};
      state.syncedUserReactions = {};
      state.syncedItemViews = {};
    },
    hydrateLocalReactions: (
      state,
      action: PayloadAction<{
        userReactions?: Record<string, ReactionType>;
        itemViews?: Record<string, number>;
      }>
    ) => {
      if (action.payload.userReactions) {
        for (const [id, val] of Object.entries(action.payload.userReactions)) {
          if (!state.userReactions[id]) {
            state.userReactions[id] = val;
          }
        }
      }
      if (action.payload.itemViews) {
        for (const [id, views] of Object.entries(action.payload.itemViews)) {
          if ((state.itemViews[id] ?? 0) < views) {
            state.itemViews[id] = views;
          }
        }
      }
    },
  },
});

export const {
  setCloudReactionSyncActive,
  recordView,
  toggleLike,
  toggleDislike,
  setReaction,
  setCloudItemStats,
  hydrateUserCloudReactions,
  reconcileUserCloudReactions,
  applyItemSyncAck,
  resetCloudReactionSyncState,
  resetLocalUserReactions,
  clearAllReactions,
  hydrateLocalReactions,
} = reactionsSlice.actions;

export const selectItemReactionData = (
  state: RootState,
  itemId: string,
  _itemType: ReactionItemType = 'question'
): {
  likes: number;
  dislikes: number;
  views: number;
  userReaction: ReactionType | null;
} => {
  const cloud = state.reactions.cloudStats?.[itemId];

  if (!state.reactions.isCloudSyncActive) {
    return {
      likes: Math.max(0, cloud?.likes ?? 0),
      dislikes: Math.max(0, cloud?.dislikes ?? 0),
      views: Math.max(0, cloud?.views ?? 0),
      userReaction: null,
    };
  }

  const userReaction = state.reactions.userReactions[itemId] ?? null;
  const userAddedViews = state.reactions.itemViews?.[itemId] ?? 0;

  const syncedReaction = state.reactions.syncedUserReactions?.[itemId] ?? null;
  const syncedViews = state.reactions.syncedItemViews?.[itemId] ?? 0;

  const pendingLikeDelta =
    (userReaction === 'like' ? 1 : 0) - (syncedReaction === 'like' ? 1 : 0);
  const pendingDislikeDelta =
    (userReaction === 'dislike' ? 1 : 0) -
    (syncedReaction === 'dislike' ? 1 : 0);
  const pendingViewDelta = Math.max(0, userAddedViews - syncedViews);

  const likes = Math.max(0, (cloud?.likes ?? 0) + pendingLikeDelta);
  const dislikes = Math.max(0, (cloud?.dislikes ?? 0) + pendingDislikeDelta);
  const views = Math.max(0, (cloud?.views ?? 0) + pendingViewDelta);

  return {
    likes,
    dislikes,
    views,
    userReaction,
  };
};

export default reactionsSlice.reducer;
