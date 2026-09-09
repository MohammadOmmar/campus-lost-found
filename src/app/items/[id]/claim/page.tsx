import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Calendar, ShieldCheck } from 'lucide-react'
import { ClaimForm } from '@/components/claims/claim-form'
import { ClaimSubmittedCard } from '@/components/claims/claim-submitted-card'
import { FadeUp } from '@/lib/motion'

interface ClaimPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ submitted?: string }>
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ClaimPage({ params, searchParams }: ClaimPageProps) {
  const { id } = await params
  const query = await searchParams
  const justSubmitted = query.submitted === 'true'
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/items/' + id + '/claim')
  }

  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, title, category, type, status, location, date_lost_found, image_url')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  const isOwner = user.id === item.user_id

  const { data: myClaim } = await supabase
    .from('claims')
    .select('id, status, created_at')
    .eq('item_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const eligible =
    !isOwner && item.type === 'FOUND' && item.status === 'OPEN' && !myClaim

  const ineligibleReason = isOwner
    ? 'You cannot claim your own item.'
    : item.type !== 'FOUND'
      ? 'Only found items can be claimed.'
      : 'This item is no longer accepting claims.'

  return (
    <div className="container-narrow py-12 md:py-16">
      <Link
        href={`/items/${item.id}`}
        className="inline-flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to item
      </Link>

      <FadeUp>
        <h1 className="text-h1 mb-4">Think this is yours?</h1>
        <p className="text-body-large text-muted-foreground measure-default mb-10">
          Tell the finder something that helps verify ownership.
        </p>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="flex gap-5 rounded-2xl border border-border/40 bg-card p-5 mb-10">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
            {item.image_url ? (
              <Image src={item.image_url} alt={item.title} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                <ShieldCheck className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-caption text-muted-foreground mb-1">
              {item.type} · {item.category}
            </p>
            <p className="text-body font-medium truncate">{item.title}</p>
            <div className="mt-2 flex flex-col gap-1 text-small text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {item.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(item.date_lost_found)}
              </span>
            </div>
          </div>
        </div>
      </FadeUp>

      {myClaim || justSubmitted ? (
        <ClaimSubmittedCard itemId={item.id} status={myClaim?.status} />
      ) : !eligible ? (
        <FadeUp delay={0.1}>
          <div className="rounded-2xl border border-border/40 bg-card p-8 text-center">
            <p className="text-body text-muted-foreground">{ineligibleReason}</p>
          </div>
        </FadeUp>
      ) : (
        <ClaimForm itemId={item.id} />
      )}
    </div>
  )
}