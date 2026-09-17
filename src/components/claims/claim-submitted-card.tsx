'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FadeUp } from '@/lib/motion'
import { ClaimTimeline } from '@/components/claims/claim-timeline'

export function ClaimSubmittedCard({
  itemId,
  status,
}: {
  itemId: string
  status?: string
}) {
  return (
    <FadeUp delay={0.1}>
      <div className="border border-border-default rounded-sm bg-base-900 p-6 sm:p-8">
        <p className="text-caption mb-3">Claim submitted</p>
        <h2 className="text-h3 mb-3">Sent to the finder for review</h2>
        <p className="text-body measure-default">
          Your ownership details were sent to the finder. They are not shown publicly on the report.
        </p>
        <div className="mt-6">
          <ClaimTimeline status={status ?? 'pending'} />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg"><Link href="/dashboard/claims">Track my claims</Link></Button>
          <Button asChild variant="outline" size="lg"><Link href={`/items/${itemId}`}>Back to report</Link></Button>
        </div>
      </div>
    </FadeUp>
  )
}
