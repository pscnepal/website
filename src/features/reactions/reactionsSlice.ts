import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { storageService } from '../../services/storageService';
import { getBaseReactionCounts } from './reactionUtils';

export type ReactionType = 'like' | 'dislike';

export interface ReactionsState {
  /** Map of item ID (question ID or material ID) to current user's reaction */
  userReactions: Record<string, ReactionType>;
  /** Map of item ID to recorded user views */
  itemViews: Record<string, number>;
}

const initialReactions = storageService.loadReactions();

const initialState: ReactionsState = {
  userReactions: initialReactions.userReactions ?? {},
  itemViews: initialReactions.itemViews ?? {},
};

export const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    recordView: (
      state,
      action: PayloadAction<{ itemId: string }>
    ) => {
      const { itemId } = action.payload;
      state.itemViews[itemId] = (state.itemViews[itemId] || 0) + 1;
    },
    toggleLike: (
      state,
      action: PayloadAction<{ itemId: string }>
    ) => {
      const { itemId } = action.payload;
      const current = state.userReactions[itemId];
      if (current === 'like') {
        delete state.userReactions[itemId];
      } else {
        state.userReactions[itemId] = 'like';
      }
    },
    toggleDislike: (
      state,
      action: PayloadAction<{ itemId: string }>
    ) => {
      const { itemId } = action.payload;
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
      }>
    ) => {
      const { itemId, reaction } = action.payload;
      if (!reaction) {
        delete state.userReactions[itemId];
      } else {
        state.userReactions[itemId] = reaction;
      }
    },
    clearAllReactions: (state) => {
      state.userReactions = {};
      state.itemViews = {};
    },
  },
});

export const { recordView, toggleLike, toggleDislike, setReaction, clearAllReactions } =
  reactionsSlice.actions;

export const selectUserReaction = (
  state: RootState,
  itemId: string
): ReactionType | undefined => state.reactions.userReactions[itemId];

export const selectItemReactionData = (
  state: RootState,
  itemId: string,
  itemType: 'question' | 'material' = 'question'
): {
  likes: number;
  dislikes: number;
  views: number;
  userReaction: ReactionType | null;
} => {
  const base = getBaseReactionCounts(itemId, itemType);
  const userReaction = state.reactions.userReactions[itemId] ?? null;
  const userAddedViews = state.reactions.itemViews?.[itemId] ?? 0;

  const likes = base.likes + (userReaction === 'like' ? 1 : 0);
  const dislikes = base.dislikes + (userReaction === 'dislike' ? 1 : 0);
  const views = base.views + userAddedViews;

  return {
    likes,
    dislikes,
    views,
    userReaction,
  };
};

export default reactionsSlice.reducer;
