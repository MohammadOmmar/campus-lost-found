/**
 * Deterministic Matching Engine
 * 
 * Compares LOST and FOUND items within the same campus.
 * Produces explainable scores based on category, location, date, title, and description.
 * 
 * NOT an AI/ML system. No external APIs, models, or vector databases.
 * All logic is deterministic and unit-tested.
 */

import type {
  MatchableItem,
  MatchCandidate,
  MatchScore,
  MatchResult,
  MatchEngineResult,
  MatchEngineDetailedResult,
  MatchOptions,
  RejectedCandidate,
  RejectionReason,
} from './types';
import {
  stringSimilarity,
  jaccardSimilarity,
  tokenize,
  daysApart,
  areCategoriesCompatible,
  categoryScore,
  toWeightedScore,
  SCORE_WEIGHTS,
} from './scoring';

export const DEFAULT_MIN_SCORE = 30;

/**
 * Check if a candidate is valid for matching against a source item.
 * Returns null if valid, or a rejection reason if invalid.
 */
function checkCandidateValidity(
  source: MatchableItem,
  candidate: MatchCandidate
): RejectionReason | null {
  // Hard rule: only LOST â†" FOUND
  if (source.type === candidate.type) {
    return 'opposite_type_required';
  }

  // Hard rule: same campus
  if (source.campus_id !== candidate.campus_id) {
    return 'same_campus_required';
  }

  // Hard rule: candidate must be OPEN
  if (candidate.status !== 'OPEN') {
    return 'status_not_open';
  }

  // Hard rule: compatible categories
  if (!areCategoriesCompatible(source.category, candidate.category)) {
    return 'incompatible_categories';
  }

    return null;
}

/**
 * Calculate the full match score for a valid candidate.
 */
function calculateScore(source: MatchableItem, candidate: MatchCandidate): MatchScore {
  // Category (25 points max)
  const categoryRaw = categoryScore(source.category, candidate.category);
  const categoryPoints = toWeightedScore(categoryRaw, SCORE_WEIGHTS.category);

  // Location similarity (20 points max)
  const locationRaw = stringSimilarity(source.location, candidate.location);
  const locationPoints = toWeightedScore(locationRaw, SCORE_WEIGHTS.location);

  // Date proximity (20 points max)
  const dateDiff = daysApart(source.date_lost_found, candidate.date_lost_found);
  const dateRaw = Math.max(0, 100 - dateDiff * 10);
  const datePoints = toWeightedScore(dateRaw, SCORE_WEIGHTS.date_proximity);

  // Title similarity (20 points max)
  const sourceTitleTokens = tokenize(source.title);
  const candidateTitleTokens = tokenize(candidate.title);
  const titleRaw = jaccardSimilarity(sourceTitleTokens, candidateTitleTokens);
  const titlePoints = toWeightedScore(titleRaw, SCORE_WEIGHTS.title_similarity);

  // Description overlap (15 points max)
  const sourceDescTokens = tokenize(source.description);
  const candidateDescTokens = tokenize(candidate.description);
  const descRaw = jaccardSimilarity(sourceDescTokens, candidateDescTokens);
  const descPoints = toWeightedScore(descRaw, SCORE_WEIGHTS.description_overlap);

  const total = categoryPoints + locationPoints + datePoints + titlePoints + descPoints;

  const breakdown = {
    category: Math.round(categoryPoints),
    location: Math.round(locationPoints),
    date_proximity: Math.round(datePoints),
    title_similarity: Math.round(titlePoints),
    description_overlap: Math.round(descPoints),
  };

  const isMatch = total >= DEFAULT_MIN_SCORE;
  const explanation = generateExplanation(source, candidate, breakdown, total, dateDiff);

  return {
    total: Math.round(total),
    isMatch,
    breakdown,
    explanation,
  };
}

/**
 * Generate a human-readable explanation for the match.
 */
function generateExplanation(
  source: MatchableItem,
  candidate: MatchCandidate,
  breakdown: MatchScore['breakdown'],
  total: number,
  dateDiff: number
): string {
  const factors = [
    breakdown.category > 0 && `${breakdown.category}pts category`,
    breakdown.location > 0 && `${breakdown.location}pts location`,
    `date ${dateDiff === 0 ? 'same day' : `${dateDiff} day${dateDiff > 1 ? 's' : ''} apart`}`,
    breakdown.title_similarity > 0 && `${breakdown.title_similarity}pts title`,
    breakdown.description_overlap > 0 && `${breakdown.description_overlap}pts description`,
  ].filter(Boolean);

  return `Score ${Math.round(total)}/100 (${factors.join(', ')})`;
}

/**
 * Run the matching engine against a source item and a set of candidates.
 */
export function matchItems(
  source: MatchableItem,
  candidates: MatchCandidate[],
  options?: MatchOptions
): MatchEngineResult {
  const minScore = options?.minScore ?? DEFAULT_MIN_SCORE;

  const allResults: MatchResult[] = [];
  const matches: MatchResult[] = [];

  for (const candidate of candidates) {
    if (candidate.id === source.id) continue;

    const rejection = checkCandidateValidity(source, candidate);
    if (rejection) continue;

    const score = calculateScore(source, candidate);
    const result: MatchResult = { candidate, score };

    allResults.push(result);

    if (score.total >= minScore) {
      matches.push(result);
    }
  }

  matches.sort((a, b) => b.score.total - a.score.total);

  return {
    source,
    allCandidates: allResults,
    matches,
  };
}

/**
 * Extended version that also returns rejected candidates for debugging.
 */
export function matchItemsDetailed(
  source: MatchableItem,
  candidates: MatchCandidate[],
  options?: MatchOptions
): MatchEngineDetailedResult {
  const baseResult = matchItems(source, candidates, options);

  const rejected: RejectedCandidate[] = [];
  const matchedIds = new Set(baseResult.allCandidates.map(r => r.candidate.id));

  for (const candidate of candidates) {
    if (candidate.id === source.id) continue;
    if (matchedIds.has(candidate.id)) continue;

    const rejection = checkCandidateValidity(source, candidate);
    if (rejection) {
      rejected.push({ candidate, reason: rejection });
    }
  }

  return {
    ...baseResult,
    rejected,
  };
}

/**
 * Quick check: can these two items ever be a valid match?
 */
export function isEligibleForMatching(source: MatchableItem, candidate: MatchCandidate): boolean {
  return checkCandidateValidity(source, candidate) === null;
}