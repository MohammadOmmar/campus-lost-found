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
    <div className="rounded-2xl border border-border/40 bg-card p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-caption text-muted-foreground">
          Submitted {formatDate(claim.created_at)}
        </p>
        <ClaimStatusBadge status={claim.status} />
      </div>
      <p className="text-caption text-muted-foreground mb-2">Claimant proof</p>
      <p className="text-body whitespace-pre-wrap mb-5">{claim.proof}</p>
      {isPending && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => handle('approve')} disabled={pending !== null} className="flex-1">
            {pending === 'approve' ? 'Approving—¦' : 'Approve'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handle('reject')}
            disabled={pending !== null}
            className="flex-1"
          >
            {pending === 'reject' ? 'Declining—¦' : 'Decline'}
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-small text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function OwnerClaimsList({ claims }: { claims: OwnerClaim[] }) {
  if (claims.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-body text-muted-foreground">
          No claims yet. When someone believes this is theirs, their proof will appear here.
        </p>
      </div>
    )
  }
  const pending = claims.filter((c) => c.status === 'pending')
  const reviewed = claims.filter((c) => c.status !== 'pending')
  return (
    <div className="space-y-4">
      {[...pending, ...reviewed].map((claim) => (
        <ClaimRow key={claim.id} claim={claim} />
      ))}
    </div>
  )
}
