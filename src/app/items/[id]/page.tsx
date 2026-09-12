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

  const { data: { user } } = await supabase.auth.getUser()

  const { data: item } = await supabase.from('items').select('id, user_id, title, description, category, type, status, location, date_lost_found, image_url').eq('id', id).single()
  if (!item) notFound()

  const isOwner = user?.id === item.user_id
  const isLost = item.type === 'LOST'

  let privateNote: string | null = null
  if (isOwner && item.type === 'FOUND') {
    const { data: detail } = await supabase.from('item_private_details').select('private_verification').eq('id', id).maybeSingle()
    privateNote = detail?.private_verification ?? null
  }

  let myClaim: { id: string; status: string } | null = null
  if (user && !isOwner) {
    const { data } = await supabase.from('claims').select('id, status').eq('item_id', id).eq('user_id', user.id).maybeSingle()
    myClaim = data
  }

  let ownerClaims: { id: string; proof: string; status: string; created_at: string }[] = []
  if (isOwner && item.type === 'FOUND') {
    const { data } = await supabase.from('claims').select('id, proof, status, created_at').eq('item_id', id).order('created_at', { ascending: false })
    ownerClaims = data ?? []
  }

  const pendingCount = ownerClaims.filter((c) => c.status === 'pending').length
  const approvedClaim = ownerClaims.find((c) => c.status === 'approved')
  const canClaim = !isOwner && !myClaim && item.type === 'FOUND' && item.status === 'OPEN'

  return (
    <div className="container-tight pt-24 pb-12">
      <Link href="/items" className="inline-flex items-center gap-2 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-8">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Browse
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-base-700/30 rounded-lg flex items-center justify-center overflow-hidden border border-border-subtle">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          ) : (
            <Package className="w-16 h-16 text-text-muted/20" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${isLost ? 'bg-status-lost/10 text-status-lost' : 'bg-status-found/10 text-status-found'}`}>
              {item.type}
            </span>
                        {item.status !== 'OPEN' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-base-700/30 text-[11px] font-medium text-text-muted">
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            )}
          </div>

          <h1 className="text-h1 mb-4">{item.title}</h1>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 text-[14px] text-text-muted"><MapPin className="w-4 h-4" /><span>{item.location}</span></div>
            <div className="flex items-center gap-2 text-[14px] text-text-muted"><Calendar className="w-4 h-4" /><span>{formatDate(item.date_lost_found)}</span></div>
          </div>

          <div className="mb-8">
            <h3 className="text-[12px] text-text-muted uppercase tracking-wide mb-3">Description</h3>
            <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-[12px] text-text-muted uppercase tracking-wide mb-3">Category</h3>
            <p className="text-[14px] text-text-primary">{item.category}</p>
          </div>
          {isOwner && item.type === 'FOUND' && privateNote && (
            <div className="mb-8 rounded-lg border border-border-subtle bg-base-700/20 p-5">
              <p className="text-[12px] text-text-muted mb-2 inline-flex items-center gap-2"><Lock className="h-3 w-3" /> Private verification · only you can see this</p>
              <p className="text-[14px] whitespace-pre-wrap">{privateNote}</p>
            </div>
          )}

          {myClaim && (
            <div className="mb-8 rounded-lg border border-border-subtle bg-base-850 p-5">
              <p className="text-[13px] text-text-muted">Your claim status: <span className="font-medium text-text-primary capitalize">{myClaim.status}</span></p>
            </div>
          )}

          {isOwner && item.type === 'FOUND' && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] text-text-muted uppercase tracking-wide">Claims{pendingCount > 0 ? ` · ${pendingCount} awaiting review` : ''}</h3>
              </div>
              <OwnerClaimsList claims={ownerClaims} />
            </div>
          )}

          {isOwner && item.type === 'FOUND' && approvedClaim && (
            <div className="mb-8"><ReturnActions itemId={item.id} itemStatus={item.status} /></div>
          )}

          <div className="mt-auto pt-6 border-t border-border-subtle">
            <div className="flex flex-col sm:flex-row gap-3">
              {canClaim && (<Button size="lg" className="flex-1 h-11" asChild><Link href={`/items/${item.id}/claim`}>Claim this item</Link></Button>)}
              {isOwner && (
                <>
                  <Button variant="outline" size="lg" className="flex-1 h-11" asChild><Link href={`/items/${item.id}/edit`}><Edit className="mr-2 w-4 h-4" /> Edit</Link></Button>
                  <Button variant="outline" size="lg" className="flex-1 h-11" asChild><Link href={`/items/${item.id}/matches`}><Eye className="mr-2 w-4 h-4" /> View Matches</Link></Button>
                </>
              )}
              {!isOwner && !canClaim && item.status !== 'OPEN' && (<p className="text-[13px] text-text-muted">This item is no longer accepting claims.</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
