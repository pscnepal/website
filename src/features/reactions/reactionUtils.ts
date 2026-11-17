import { CURRENT_AFFAIRS_ITEMS } from '../../data/currentAffairsData';
import { materialStorageService } from '../../services/materialStorageService';
import type { ReactionItemType } from './reactionsSlice';

/**
 * Resolve item type dynamically against live quiz questions, reading materials, and current affairs.
 */

export function resolveReactionItemType(
  itemId: string,
  knownType?: ReactionItemType
): ReactionItemType {
  if (
    knownType === 'material' ||
    knownType === 'question' ||
    knownType === 'affair'
  ) {
    return knownType;
  }
  if (CURRENT_AFFAIRS_ITEMS.some((a) => a.id === itemId)) {
    return 'affair';
  }
  return materialStorageService.findMaterialById(itemId) ? 'material' : 'question';
}

/**
 * Format view and reaction counts in human readable compact form (e.g. 1.2k, 12k, 1.4M)
 */
export function formatCompactCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(num);
}
