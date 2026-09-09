/**
 * Matching Engine Public API
 * 
 * Re-exports the main functions for use in Server Components and Actions.
 * This module is decoupled from React/Supabase — it operates on plain data.
 */

export { matchItems, matchItemsDetailed, isEligibleForMatching } from './engine';
export type {
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

export { SCORE_WEIGHTS } from './scoring';