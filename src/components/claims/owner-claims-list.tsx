'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { reviewClaim } from '@/actions/claims'
import { Button } from '@/components/ui/button'
import { ClaimStatusBadge } from '@/components/claims/claim-status-badge'

export interface OwnerClaim {
  id: string
  proof: string
  status: string
  created_at: string
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ClaimRow({ claim }: { claim: OwnerClaim }) {
  const router = useRouter()
  const [pending, setPending] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState('')
  const isPending = claim.status === 'pending'

  async function handle(action: 'approve' | 'reject') {
    const label =
      action === 'approve'
        ? 'Approve this claim? The item will move to Claimed and other pending claims will be declined.'
        : 'Decline this claim?'
    if (!window.confirm(label)) return
    setPending(action)
    setError('')
    const result = await reviewClaim(claim.id, action)
    setPending(null)
    if (!result.success) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="border border-border-default rounded-sm bg-base-900 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-small">Submitted {formatDate(claim.created_at)}</p>
        <ClaimStatusBadge status={claim.status} />
      </div>

      <p className="text-caption mt-4 mb-2">Private verification detail</p>
      <p className="text-body whitespace-pre-wrap measure-default">{claim.proof}</p>

      {isPending && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => handle('approve')} disabled={pending !== null} className="sm:w-40">
            {pending === 'approve' ? 'Approving...' : 'Approve claim'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handle('reject')}
            disabled={pending !== null}
            className="sm:w-40"
          >
            {pending === 'reject' ? 'Declining...' : 'Decline claim'}
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-small text-status-lost">
          {error}
        </p>
      )}
    </div>
  )
}

export function OwnerClaimsList({ claims }: { claims: OwnerClaim[] }) {
  if (claims.length === 0) {
    return (
      <p className="border-y border-border-default py-6 text-body">
        No claims yet. When someone believes this item is theirs, their private verification detail
        will appear here for your review.
      </p>
    )
  }

  const pending = claims.filter((claim) => claim.status === 'pending')
  const reviewed = claims.filter((claim) => claim.status !== 'pending')

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <p className="text-small text-text-secondary">
          {pending.length} {pending.length === 1 ? 'claim awaits' : 'claims await'} your review.
        </p>
      )}
      {[...pending, ...reviewed].map((claim) => (
        <ClaimRow key={claim.id} claim={claim} />
      ))}
    </div>
  )
}
