/**
 * Matching Engine Types
 * 
 * All types are designed to be decoupled from database schema,
 * allowing the matching engine to be tested independently.
 */

export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'OPEN' | 'CLAIMED' | 'RETURNED' | 'CLOSED';

export interface MatchableItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string;
  date_lost_found: string; // ISO date string
  status: ItemStatus;
  campus_id: string;
}

/** An item that passed hard filters and received a score. */
export type MatchCandidate = MatchableItem

export interface MatchScore {
  /** Total score from 0-100 */
  total: number;
  /** Whether this candidate met the minimum threshold */
  isMatch: boolean;
  /** Breakdown of individual factor scores */
  breakdown: {
    category: number;      // 0-25 points
    location: number;      // 0-20 points
    date_proximity: number; // 0-20 points
    title_similarity: number; // 0-20 points
    description_overlap: number; // 0-15 points
  };
  /** Human-readable explanation of the match */
  explanation: string;
}

export interface MatchResult {
  candidate: MatchCandidate;
  score: MatchScore;
}

export interface MatchOptions {
  /** Minimum score to be considered a potential match (default: 30) */
  minScore?: number;
  /** Whether to include non-matches in results (default: false) */
  includeNonMatches?: boolean;
}

/** Result of attempting to match against a source item */
export interface MatchEngineResult {
  /** The source item that was matched */
  source: MatchableItem;
  /** All candidates that were scored */
  allCandidates: MatchResult[];
  /** Only candidates that passed the threshold */
  matches: MatchResult[];
}

/** Represents a rejected candidate before scoring */
export interface RejectedCandidate {
  candidate: MatchCandidate;
  reason: RejectionReason;
}

export type RejectionReason =
  | 'opposite_type_required'  // LOST vs LOST or FOUND vs FOUND
  | 'same_campus_required'
  | 'status_not_open'
  | 'incompatible_categories';

export interface MatchEngineDetailedResult extends MatchEngineResult {
  /** Candidates that were rejected before scoring (for debugging/transparency) */
  rejected: RejectedCandidate[];
}