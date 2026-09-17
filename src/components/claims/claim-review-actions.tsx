'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { reviewClaim } from '@/actions/claims'
import { Button } from '@/components/ui/button'

export function ClaimReviewActions({ claimId }: { claimId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState('')

  async function handle(action: 'approve' | 'reject') {
    const label =
      action === 'approve'
        ? 'Approve this claim? The item will move to Claimed and other pending claims will be declined.'
        : 'Decline this claim? The claimant will see it as not approved.'
    if (!window.confirm(label)) return

    setPending(action)
    setError('')
    const result = await reviewClaim(claimId, action)
    setPending(null)

    if (!result.success) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
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
      {error && (
        <p role="alert" className="text-small text-status-lost">
          {error}
        </p>
      )}
    </div>
  )
}
