import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { storageService } from '../../services/storageService';

export type ReactionType = 'like' | 'dislike';
export type ReactionItemType = 'question' | 'material';

export interface CloudStatsCounts {
  views: number;
  likes: number;
  dislikes: number;
}

export interface ReactionsState {
  /** Map of item ID (question ID or material ID) to current user's reaction */
  userReactions: Record<string, ReactionType>;
  /** Map of item ID to recorded user views */
  itemViews: Record<string, number>;
  /** In-memory map of item IDs to itemType for cloud sync classification */
  itemTypes: Record<string, ReactionItemType>;
  /** Public community counts stored in Firestore itemStats/{itemId} */
  cloudStats: Record<string, CloudStatsCounts>;
  /** Reactions already committed to Firestore for current user (prevents double-counting) */
  syncedUserReactions: Record<string, ReactionType>;
  /** View counts already committed to Firestore for current user (prevents double-counting) */
  syncedItemViews: Record<string, number>;
}

const initialReactions = storageService.loadReactions();

const initialState: ReactionsState = {
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
    recordView: (
      state,
      action: PayloadAction<{ itemId: string; itemType?: ReactionItemType }>
    ) => {
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
  },
});

export const {
  recordView,
  toggleLike,
  toggleDislike,
  setReaction,
  setCloudItemStats,
  hydrateUserCloudReactions,
  applyItemSyncAck,
  resetCloudReactionSyncState,
  resetLocalUserReactions,
  clearAllReactions,
} = reactionsSlice.actions;

export const selectUserReaction = (
  state: RootState,
  itemId: string
): ReactionType | undefined => state.reactions.userReactions[itemId];

export const selectItemReactionData = (
  state: RootState,
  itemId: string,
  _itemType: 'question' | 'material' = 'question'
): {
  likes: number;
  dislikes: number;
  views: number;
  userReaction: ReactionType | null;
} => {
  const userReaction = state.reactions.userReactions[itemId] ?? null;
  const userAddedViews = state.reactions.itemViews?.[itemId] ?? 0;

  const cloud = state.reactions.cloudStats?.[itemId];
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
