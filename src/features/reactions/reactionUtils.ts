/**
 * Deterministic helper to produce realistic, stable base like & dislike counts
 * for questions and study materials based on their unique ID.
 */

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Special curated base counts for signature documents
const CURATED_MATERIAL_COUNTS: Record<string, { likes: number; dislikes: number; views: number }> = {
  'nepal-parichaya-13th': { likes: 384, dislikes: 5, views: 6420 },
  'nepal-parichaya-12th': { likes: 216, dislikes: 4, views: 4180 },
  'nepal-parichaya-11th': { likes: 178, dislikes: 3, views: 3250 },
  'constitution-nepal-2072': { likes: 542, dislikes: 7, views: 12840 },
  'civil-service-act-2049': { likes: 295, dislikes: 6, views: 5910 },
  'local-government-operation-act-2074': { likes: 241, dislikes: 4, views: 4620 },
  'good-governance-act-2064': { likes: 189, dislikes: 3, views: 3840 },
  'right-to-information-act-2064': { likes: 204, dislikes: 2, views: 3950 },
  'nepal-geography-digest': { likes: 312, dislikes: 4, views: 5410 },
  'nepal-economic-survey-summary': { likes: 268, dislikes: 5, views: 4890 },
  'nepal-foreign-policy-relations': { likes: 194, dislikes: 3, views: 3670 },
};

/**
 * Returns deterministic base reaction and view counts for an item
 */
export function getBaseReactionCounts(
  itemId: string,
  itemType: 'question' | 'material' = 'question'
): { likes: number; dislikes: number; views: number } {
  if (CURATED_MATERIAL_COUNTS[itemId]) {
    return CURATED_MATERIAL_COUNTS[itemId];
  }

  const hash = stringToHash(itemId);

  if (itemType === 'material') {
    // Materials typically have 65 to 180 likes, 1 to 5 dislikes, and 850 to 2,700 views
    const likes = 65 + (hash % 115);
    const dislikes = 1 + ((hash >> 3) % 5);
    const views = 850 + (hash % 1850);
    return { likes, dislikes, views };
  }

  // Questions typically have 28 to 88 likes, 1 to 4 dislikes, and 140 to 760 views
  const likes = 28 + (hash % 61);
  const dislikes = 1 + ((hash >> 3) % 4);
  const views = 140 + (hash % 620);
  return { likes, dislikes, views };
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
