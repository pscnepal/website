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
const CURATED_MATERIAL_COUNTS: Record<string, { likes: number; dislikes: number }> = {
  'nepal-parichaya-13th': { likes: 384, dislikes: 5 },
  'nepal-parichaya-12th': { likes: 216, dislikes: 4 },
  'nepal-parichaya-11th': { likes: 178, dislikes: 3 },
  'constitution-nepal-2072': { likes: 542, dislikes: 7 },
  'civil-service-act-2049': { likes: 295, dislikes: 6 },
  'local-government-operation-act-2074': { likes: 241, dislikes: 4 },
  'good-governance-act-2064': { likes: 189, dislikes: 3 },
  'right-to-information-act-2064': { likes: 204, dislikes: 2 },
  'nepal-geography-digest': { likes: 312, dislikes: 4 },
  'nepal-economic-survey-summary': { likes: 268, dislikes: 5 },
  'nepal-foreign-policy-relations': { likes: 194, dislikes: 3 },
};

/**
 * Returns deterministic base reaction counts for an item
 */
export function getBaseReactionCounts(
  itemId: string,
  itemType: 'question' | 'material' = 'question'
): { likes: number; dislikes: number } {
  if (CURATED_MATERIAL_COUNTS[itemId]) {
    return CURATED_MATERIAL_COUNTS[itemId];
  }

  const hash = stringToHash(itemId);

  if (itemType === 'material') {
    // Materials typically have 60 to 180 likes and 1 to 5 dislikes
    const likes = 65 + (hash % 115);
    const dislikes = 1 + ((hash >> 3) % 5);
    return { likes, dislikes };
  }

  // Questions typically have 28 to 88 likes and 1 to 4 dislikes
  const likes = 28 + (hash % 61);
  const dislikes = 1 + ((hash >> 3) % 4);
  return { likes, dislikes };
}
