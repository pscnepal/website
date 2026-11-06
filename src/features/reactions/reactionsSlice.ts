import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { storageService } from '../../services/storageService';
import { getBaseReactionCounts } from './reactionUtils';

export type ReactionType = 'like' | 'dislike';

export interface ReactionsState {
  /** Map of item ID (question ID or material ID) to current user's reaction */
  userReactions: Record<string, ReactionType>;
}

const initialReactions = storageService.loadReactions();

const initialState: ReactionsState = {
  userReactions: initialReactions.userReactions ?? {},
};

export const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
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
    },
  },
});

export const { toggleLike, toggleDislike, setReaction, clearAllReactions } =
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
  userReaction: ReactionType | null;
} => {
  const base = getBaseReactionCounts(itemId, itemType);
  const userReaction = state.reactions.userReactions[itemId] ?? null;

  const likes = base.likes + (userReaction === 'like' ? 1 : 0);
  const dislikes = base.dislikes + (userReaction === 'dislike' ? 1 : 0);

  return {
    likes,
    dislikes,
    userReaction,
  };
};

export default reactionsSlice.reducer;
