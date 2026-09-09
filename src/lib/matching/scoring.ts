/**
 * Scoring Algorithms
 * 
 * Each function is pure, deterministic, and independently testable.
 * All return a factor score in the 0-100 range (to be scaled later).
 */

/**
 * Levenshtein distance between two strings.
 * Used for location similarity.
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Normalized string similarity using Levenshtein distance.
 * Returns 0-100 where 100 means identical strings.
 */
export function stringSimilarity(a: string, b: string): number {
  const cleanA = a.trim().toLowerCase();
  const cleanB = b.trim().toLowerCase();

  if (cleanA === cleanB) return 100;
  if (cleanA.length === 0 || cleanB.length === 0) return 0;

  const distance = levenshtein(cleanA, cleanB);
  const maxLength = Math.max(cleanA.length, cleanB.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.max(0, Math.round(similarity));
}

/**
 * Tokenize a string into lowercase word tokens.
 * Splits on whitespace and common punctuation.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\-_.,!?;:'"()]+/)
    .filter(token => token.length > 0);
}

/**
 * Jaccard similarity between two token sets.
 * Returns 0-100 where 100 means identical token sets.
 */
export function jaccardSimilarity(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 && tokensB.length === 0) return 100;
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }

  const union = setA.size + setB.size - intersection;

  if (union === 0) return 100;
  return Math.round((intersection / union) * 100);
}

/**
 * Calculate days apart between two dates.
 */
export function daysApart(dateA: string, dateB: string): number {
  const d1 = new Date(dateA);
  const d2 = new Date(dateB);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Category compatibility check.
 * Returns true if the two categories are compatible.
 * 
 * Rules:
 * - Same specific category: compatible
 * - Both "other": compatible
 * - One "other", one specific: do not reject (let scoring handle it)
 * - Different specific categories: incompatible
 */
export function areCategoriesCompatible(catA: string, catB: string): boolean {
  if (catA === catB) return true;
  if (catA === 'other' || catB === 'other') return true;
  return false;
}

/**
 * Calculate the weighted category score.
 * Exact match = full score (100).
 * If "other" is involved, score is reduced but not zero.
 */
export function categoryScore(catA: string, catB: string): number {
  if (catA === catB) return 100;
  // "other" involved but not exact match — partial compatibility
  return 50;
}

/**
 * Convert a 0-100 factor score to weighted points.
 */
export function toWeightedScore(factorScore: number, weight: number): number {
  return (factorScore / 100) * weight;
}

export const SCORE_WEIGHTS = {
  category: 25,
  location: 20,
  date_proximity: 20,
  title_similarity: 20,
  description_overlap: 15,
} as const;