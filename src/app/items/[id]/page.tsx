import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { OwnerClaimsList } from '@/components/claims/owner-claims-list'
import { ReturnActions } from '@/components/claims/return-actions'
import { MapPin, Calendar, Package, ArrowLeft, Edit, Eye, Lock } from 'lucide-react'

interface ItemDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ claim?: string; updated?: string }>
}

export default async function ItemDetailPage({ params, searchParams }: ItemDetailPageProps) {
  const { id } = await params
  const query = await searchParams
  const claimSubmitted = query.claim === 'submitted'
  const justUpdated = query.updated === 'true'
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, title, description, category, type, status, location, date_lost_found, image_url')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  const isOwner = user?.id === item.user_id
  const isLost = item.type === 'LOST'

  // Owner-only private note, fetched through the restricted
  // item_private_details view. Non-owners never touch this path.
  let privateNote: string | null = null
  if (isOwner && item.type === 'FOUND') {
    const { data: detail } = await supabase
      .from('item_private_details')
      .select('private_verification')
      .eq('id', id)
      .maybeSingle()
    privateNote = detail?.private_verification ?? null
  }

  // Claimant's own claim (RLS-scoped; unrelated users see nothing)
  let myClaim: { id: string; status: string } | null = null
  if (user && !isOwner) {
    const { data } = await supabase
      .from('claims')
      .select('id, status')
      .eq('item_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    myClaim = data
  }

  // Owner's claim review list (RLS-scoped to item owner)
  let ownerClaims: { id: string; proof: string; status: string; created_at: string }[] = []
  if (isOwner && item.type === 'FOUND') {
    const { data } = await supabase
      .from('claims')
      .select('id, proof, status, created_at')
      .eq('item_id', id)
      .order('created_at', { ascending: false })
    ownerClaims = data ?? []
  }

  const pendingCount = ownerClaims.filter((c) => c.status === 'pending').length
  const approvedClaim = ownerClaims.find((c) => c.status === 'approved')
  const canClaim = !isOwner && !myClaim && item.type === 'FOUND' && item.status === 'OPEN'

  return (
    <div className="container-tight py-12">
      {/* Back link */}
      <Link
        href="/items"
        className="inline-flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Visual area */}
        <div className="aspect-square bg-secondary/30 rounded-2xl flex items-center justify-center overflow-hidden border border-border/40">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
              <Package className="w-16 h-16" />
              <span className="text-small">No image provided</span>
            </div>
          )}
        </div>

        {/* Information area */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-caption font-medium ${
                  isLost
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}
              >
                {item.type}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-caption font-medium text-muted-foreground">
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            </div>
            <h1 className="text-h1 mb-4">{item.title}</h1>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-body text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-3 text-body text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{formatDate(item.date_lost_found)}</span>
              </div>
            </div>
          </div>

          {claimSubmitted && (
            <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-body font-medium">Claim submitted</p>
              <p className="mt-1 text-small text-muted-foreground">
                Your proof has been sent to the finder for review.
              </p>
            </div>
          )}

          {justUpdated && (
            <div className="mb-8 rounded-2xl border border-border/40 bg-secondary/40 p-5">
              <p className="text-small text-muted-foreground">Your report was updated.</p>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-caption text-muted-foreground mb-3">Description</h3>
            <p className="text-body text-foreground leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Category */}
          <div className="mb-8">
            <h3 className="text-caption text-muted-foreground mb-3">Category</h3>
            <p className="text-body text-foreground">{item.category}</p>
          </div>

          {isOwner && item.type === 'FOUND' && privateNote && (
            <div className="mb-8 rounded-2xl border border-border/40 bg-secondary/30 p-5">
              <p className="text-caption text-muted-foreground mb-2 inline-flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" /> Private verification · only you can see this
              </p>
              <p className="text-body whitespace-pre-wrap">{privateNote}</p>
            </div>
          )}

          {myClaim && (
            <div className="mb-8 rounded-2xl border border-border/40 bg-card p-5">
              <p className="text-small text-muted-foreground">
                Your claim status:{' '}
                <span className="font-medium text-foreground capitalize">{myClaim.status}</span>
              </p>
            </div>
          )}

          {isOwner && item.type === 'FOUND' && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-caption text-muted-foreground">
                  Claims{pendingCount > 0 ? ` · ${pendingCount} awaiting review` : ''}
                </h3>
              </div>
              <OwnerClaimsList claims={ownerClaims} />
            </div>
          )}

          {isOwner && item.type === 'FOUND' && approvedClaim && (
            <div className="mb-8">
              <ReturnActions itemId={item.id} itemStatus={item.status} />
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto pt-6 border-t border-border/40">
            <div className="flex flex-col sm:flex-row gap-3">
              {canClaim && (
                <Button size="lg" className="flex-1" asChild>
                  <Link href={`/items/${item.id}/claim`}>Claim this item</Link>
                </Button>
              )}
              {isOwner && (
                <>
                  <Button variant="outline" size="lg" className="flex-1" asChild>
                    <Link href={`/items/${item.id}/edit`}>
                      <Edit className="mr-2 w-4 h-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1" asChild>
                    <Link href={`/items/${item.id}/matches`}>
                      <Eye className="mr-2 w-4 h-4" />
                      View Matches
                    </Link>
                  </Button>
                </>
              )}
              {!isOwner && !canClaim && item.status !== 'OPEN' && (
                <p className="text-small text-muted-foreground">
                  This item is no longer accepting claims.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
