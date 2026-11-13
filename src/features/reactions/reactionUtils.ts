import { READING_MATERIAL_CATEGORIES } from '../../data/readingMaterials';

/**
 * Deterministic helper to produce realistic, stable base like & dislike counts
 * for questions and study materials based on their unique ID.
 */

const MATERIAL_ID_SET = new Set<string>(
  READING_MATERIAL_CATEGORIES.flatMap((cat) => cat.items.map((item) => item.id))
);

export function resolveReactionItemType(
  itemId: string,
  knownType?: 'question' | 'material'
): 'question' | 'material' {
  if (knownType === 'material' || knownType === 'question') {
    return knownType;
  }
  return MATERIAL_ID_SET.has(itemId) ? 'material' : 'question';
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
