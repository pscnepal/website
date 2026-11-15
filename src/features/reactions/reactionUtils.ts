import { materialStorageService } from '../../services/materialStorageService';

/**
 * Resolve item type dynamically against live quiz questions and reading materials.
 */

export function resolveReactionItemType(
  itemId: string,
  knownType?: 'question' | 'material'
): 'question' | 'material' {
  if (knownType === 'material' || knownType === 'question') {
    return knownType;
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
