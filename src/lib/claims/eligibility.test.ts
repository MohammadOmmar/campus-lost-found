// Unit tests for claim eligibility + state-transition rules.
// Pure logic — no Supabase, no network.

import { describe, expect, it } from 'vitest'
import {
  checkClaimEligibility,
  isValidItemTransition,
  isValidProof,
} from './eligibility'

const BASE = {
  itemType: 'FOUND',
  itemStatus: 'OPEN',
  isAuthenticated: true,
  isOwner: false,
  hasExistingClaim: false,
}

describe('checkClaimEligibility', () => {
  it('allows an eligible claim on an OPEN FOUND item', () => {
    expect(checkClaimEligibility(BASE).eligible).toBe(true)
  })

  it('rejects unauthenticated claims', () => {
    const r = checkClaimEligibility({ ...BASE, isAuthenticated: false })
    expect(r.eligible).toBe(false)
  })

  it('rejects own-item claims', () => {
    const r = checkClaimEligibility({ ...BASE, isOwner: true })
    expect(r.eligible).toBe(false)
    expect(r.reason).toMatch(/own item/i)
  })

  it('rejects LOST-item claims', () => {
    const r = checkClaimEligibility({ ...BASE, itemType: 'LOST' })
    expect(r.eligible).toBe(false)
    expect(r.reason).toMatch(/found/i)
  })

  it('rejects RETURNED-item claims', () => {
    const r = checkClaimEligibility({ ...BASE, itemStatus: 'RETURNED' })
    expect(r.eligible).toBe(false)
  })

  it('rejects CLOSED-item claims', () => {
    const r = checkClaimEligibility({ ...BASE, itemStatus: 'CLOSED' })
    expect(r.eligible).toBe(false)
  })

  it('rejects CLAIMED-item claims (no new claims after approval)', () => {
    const r = checkClaimEligibility({ ...BASE, itemStatus: 'CLAIMED' })
    expect(r.eligible).toBe(false)
  })

  it('rejects duplicate claims', () => {
    const r = checkClaimEligibility({ ...BASE, hasExistingClaim: true })
    expect(r.eligible).toBe(false)
    expect(r.reason).toMatch(/already/i)
  })

  it('rejects invalid proof length', () => {
    expect(isValidProof('too short')).toBe(false)
    expect(isValidProof('x'.repeat(19))).toBe(false)
    expect(isValidProof('x'.repeat(501))).toBe(false)
  })

  it('accepts valid proof length', () => {
    expect(isValidProof('x'.repeat(20))).toBe(true)
    expect(isValidProof('x'.repeat(500))).toBe(true)
    expect(
      isValidProof('My initials are scratched under the left earbud case lid.')
    ).toBe(true)
  })
})

describe('isValidItemTransition', () => {
  it('allows OPEN -> CLAIMED', () => {
    expect(isValidItemTransition('OPEN', 'CLAIMED')).toBe(true)
  })

  it('allows OPEN -> CLOSED', () => {
    expect(isValidItemTransition('OPEN', 'CLOSED')).toBe(true)
  })

  it('allows CLAIMED -> RETURNED', () => {
    expect(isValidItemTransition('CLAIMED', 'RETURNED')).toBe(true)
  })

  it('forbids RETURNED -> OPEN and RETURNED -> CLAIMED', () => {
    expect(isValidItemTransition('RETURNED', 'OPEN')).toBe(false)
    expect(isValidItemTransition('RETURNED', 'CLAIMED')).toBe(false)
  })

  it('forbids CLOSED -> CLAIMED and CLOSED -> RETURNED', () => {
    expect(isValidItemTransition('CLOSED', 'CLAIMED')).toBe(false)
    expect(isValidItemTransition('CLOSED', 'RETURNED')).toBe(false)
  })

  it('forbids direct OPEN -> RETURNED', () => {
    expect(isValidItemTransition('OPEN', 'RETURNED')).toBe(false)
  })
})
