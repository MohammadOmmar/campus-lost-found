// Pure, testable claim eligibility + state-transition rules.
// No Supabase / React imports —" deterministic logic only.

export type ClaimableItemType = 'LOST' | 'FOUND'
export type ClaimableItemStatus = 'OPEN' | 'CLAIMED' | 'RETURNED' | 'CLOSED'

export interface ClaimEligibilityInput {
  itemType: string
  itemStatus: string
  isAuthenticated: boolean
  isOwner: boolean
  hasExistingClaim: boolean
}

export interface EligibilityResult {
  eligible: boolean
  reason?: string
}

/**
 * Mirrors the server-side eligibility checks in submitClaim.
 * UI uses this for messaging; Server Actions re-enforce every rule.
 */
export function checkClaimEligibility(input: ClaimEligibilityInput): EligibilityResult {
  if (!input.isAuthenticated) {
    return { eligible: false, reason: 'You must be logged in to submit a claim.' }
  }
  if (input.isOwner) {
    return { eligible: false, reason: 'You cannot claim your own item.' }
  }
  if (input.itemType !== 'FOUND') {
    return { eligible: false, reason: 'Only found items can be claimed.' }
  }
  if (input.itemStatus === 'RETURNED' || input.itemStatus === 'CLOSED') {
    return { eligible: false, reason: 'This item is no longer accepting claims.' }
  }
  if (input.itemStatus !== 'OPEN') {
    return { eligible: false, reason: 'This item is not currently accepting claims.' }
  }
  if (input.hasExistingClaim) {
    return { eligible: false, reason: 'You have already submitted a claim for this item.' }
  }
  return { eligible: true }
}

const ALLOWED_TRANSITIONS: Record<ClaimableItemStatus, ClaimableItemStatus[]> = {
  OPEN: ['CLAIMED', 'CLOSED'],
  CLAIMED: ['RETURNED'],
  RETURNED: [],
  CLOSED: [],
}

/** Returns true when moving from `from` to `to` is a legal item transition. */
export function isValidItemTransition(
  from: ClaimableItemStatus,
  to: ClaimableItemStatus
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false
}

/** Proof length rules: 20—"500 characters after trimming. */
export function isValidProof(proof: string): boolean {
  const len = proof.trim().length
  return len >= 20 && len <= 500
}
