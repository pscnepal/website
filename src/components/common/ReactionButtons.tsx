import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectItemReactionData,
  toggleDislike,
  toggleLike,
} from '../../features/reactions/reactionsSlice';

export interface ReactionButtonsProps {
  itemId: string;
  itemType?: 'question' | 'material';
  size?: 'xs' | 'sm' | 'md';
  showLabels?: boolean;
  className?: string;
}

export function ReactionButtons({
  itemId,
  itemType = 'question',
  size = 'sm',
  showLabels = false,
  className = '',
}: ReactionButtonsProps) {
  const dispatch = useAppDispatch();
  const shouldReduceMotion = useReducedMotion();

  const { likes, dislikes, userReaction } = useAppSelector((state) =>
    selectItemReactionData(state, itemId, itemType)
  );

  const isLiked = userReaction === 'like';
  const isDisliked = userReaction === 'dislike';

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleLike({ itemId }));
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleDislike({ itemId }));
  };

  const iconSizeClass =
    size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const textSizeClass =
    size === 'xs' ? 'text-[10.5px]' : size === 'md' ? 'text-xs sm:text-sm' : 'text-xs';
  const paddingClass =
    size === 'xs'
      ? 'h-6 px-1.5'
      : size === 'md'
        ? 'h-8 px-2.5 sm:px-3'
        : 'h-7 px-2';

  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 450, damping: 25 };

  return (
    <div
      role="group"
      aria-label={`${itemType === 'material' ? 'Study material' : 'Question'} community ratings and feedback`}
      className={`inline-flex items-center gap-1 shrink-0 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Like Button */}
      <motion.button
        type="button"
        onClick={handleLike}
        aria-pressed={isLiked}
        aria-label={`Helpful / Like ${itemType} (${likes} likes)`}
        title={isLiked ? 'Unlike this item' : `Mark as helpful (${likes} likes)`}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
        transition={motionTransition}
        className={`inline-flex items-center gap-1.5 rounded-lg border transition-all cursor-pointer select-none font-medium ${paddingClass} ${textSizeClass} ${
          isLiked
            ? 'border-emerald-300 dark:border-emerald-700/80 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs'
            : 'border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
      >
        <ThumbsUp
          className={`${iconSizeClass} transition-transform ${
            isLiked
              ? 'fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        />
        <span className="font-mono tabular-nums leading-none">{likes}</span>
        {showLabels && <span className="hidden sm:inline font-sans font-normal">Like</span>}
      </motion.button>

      {/* Dislike Button */}
      <motion.button
        type="button"
        onClick={handleDislike}
        aria-pressed={isDisliked}
        aria-label={`Unhelpful / Dislike ${itemType} (${dislikes} dislikes)`}
        title={isDisliked ? 'Remove dislike' : `Report or mark unhelpful (${dislikes} dislikes)`}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
        transition={motionTransition}
        className={`inline-flex items-center gap-1.5 rounded-lg border transition-all cursor-pointer select-none font-medium ${paddingClass} ${textSizeClass} ${
          isDisliked
            ? 'border-rose-300 dark:border-rose-700/80 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold shadow-2xs'
            : 'border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
      >
        <ThumbsDown
          className={`${iconSizeClass} transition-transform ${
            isDisliked
              ? 'fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        />
        <span className="font-mono tabular-nums leading-none">{dislikes}</span>
        {showLabels && <span className="hidden sm:inline font-sans font-normal">Dislike</span>}
      </motion.button>
    </div>
  );
}
