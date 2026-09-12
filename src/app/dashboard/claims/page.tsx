import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ArrowLeft } from 'lucide-react'
import { ClaimStatusBadge } from '@/components/claims/claim-status-badge'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function MyClaimsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Own claims only —" RLS further restricts to the caller's rows.
  const { data: claims } = await supabase
    .from('claims')
    .select('id, status, proof, created_at, item_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const itemIds = [...new Set((claims ?? []).map((c) => c.item_id))]
  const { data: items } =
    itemIds.length > 0
      ? await supabase
          .from('items')
          .select('id, title, category, type, status, location, date_lost_found, image_url')
          .in('id', itemIds)
      : { data: [] }
  const itemMap = new Map((items ?? []).map((i) => [i.id, i]))

  return (
    <div className="container-tight py-12">
      <h1 className="text-h1 mb-3">My Claims</h1>
      <p className="text-body text-text-muted mb-10">Claims you have submitted</p>

      {!claims || claims.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-subtle p-12 text-center">
          <p className="text-body text-text-muted mb-4">
            You have not submitted any claims yet.
          </p>
          <Link
            href="/items?type=FOUND&status=OPEN"
            className="inline-flex items-center justify-center rounded-md border border-border-subtle px-6 py-3 text-small font-medium transition-colors hover:bg-base-700"
          >
            Browse found items
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const item = itemMap.get(claim.item_id)
            return (
              <Link
                key={claim.id}
                href={`/items/${claim.item_id}`}
                className="flex gap-5 rounded-lg border border-border-subtle bg-base-850 p-5 transition-all hover:-translate-y-0.5 hover:border-border-subtle"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-base-700/40">
                  {item?.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-muted/40">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-body font-medium truncate">{item?.title ?? 'Item'}</p>
                    <ClaimStatusBadge status={claim.status} />
                  </div>
                  <p className="text-small text-text-muted">
                    {item?.location} · {item?.date_lost_found ? formatDate(item.date_lost_found) : ''} ·
                    Submitted {formatDate(claim.created_at)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <Link
        href="/dashboard"
        className="mt-10 inline-flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>
    </div>
  )
}
