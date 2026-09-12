'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { FadeUp } from '@/lib/motion'

export function ClaimSubmittedCard({
  itemId,
  status,
}: {
  itemId: string
  status?: string
}) {
  return (
    <FadeUp delay={0.1}>
            <div className="rounded-lg border border-status-found/20 bg-status-found/5 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-status-found" />
        <h2 className="text-h3 mb-2">Claim submitted</h2>
        <p className="text-body text-text-muted measure-default mx-auto">
          Your proof has been sent to the finder for review.
        </p>
        {status && (
          <p className="mt-4 text-small text-text-muted">
            Status: <span className="font-medium text-text-primary capitalize">{status}</span>
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/claims"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-small font-medium text-base-950 transition-colors hover:bg-accent/90"
          >
            Track my claims
          </Link>
          <Link
            href={`/items/${itemId}`}
            className="inline-flex items-center justify-center rounded-xl border border-border-subtle px-6 py-3 text-small font-medium transition-colors hover:bg-base-700"
          >
            Back to item
          </Link>
        </div>
      </div>
    </FadeUp>
  )
}
