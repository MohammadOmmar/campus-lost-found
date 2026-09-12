import { createClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'

import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { OwnerClaimsList } from '@/components/claims/owner-claims-list'

import { FadeUp } from '@/lib/motion'



export default async function ReceivedClaimsPage() {

  const supabase = await createClient()

  const {

    data: { user },

  } = await supabase.auth.getUser()



  if (!user) {

    redirect('/auth/login')

  }



  // All FOUND items owned by this user, with their claims.

  const { data: myItems } = await supabase

    .from('items')

    .select('id, title, category, type, status, location, date_lost_found')

    .eq('user_id', user.id)

    .eq('type', 'FOUND')

    .order('created_at', { ascending: false })



  const itemIds = (myItems ?? []).map((i) => i.id)

  const { data: claims } =

    itemIds.length > 0

      ? await supabase

          .from('claims')

          .select('id, proof, status, created_at, item_id')

          .in('item_id', itemIds)

          .order('created_at', { ascending: false })

      : { data: [] }



  const claimsByItem = new Map<string, typeof claims>()

  for (const c of claims ?? []) {

    const list = claimsByItem.get(c.item_id) ?? []

    list.push(c)

    claimsByItem.set(c.item_id, list)

  }



  const itemsWithClaims = (myItems ?? []).filter((i) => (claimsByItem.get(i.id) ?? []).length > 0)

  const totalPending = (claims ?? []).filter((c) => c.status === 'pending').length



  return (

    <div className="container-tight py-12">

      <h1 className="text-h1 mb-3">Received claims</h1>

      <p className="text-body text-text-muted mb-10">

        {totalPending > 0

          ? `${totalPending} awaiting your review`

          : 'Claims submitted on your found items'}

      </p>



      {itemsWithClaims.length === 0 ? (

        <div className="rounded-lg border border-dashed border-border-subtle p-12 text-center">

          <p className="text-body text-text-muted">

            No claims yet. When someone believes one of your found items is theirs, it will appear here.

          </p>

        </div>

      ) : (

        <div className="space-y-12">

          {itemsWithClaims.map((item, idx) => (

            <FadeUp key={item.id} delay={Math.min(idx * 0.05, 0.3)}>

              <div className="flex items-baseline justify-between gap-4 mb-4">

                <div className="min-w-0">

                  <p className="text-caption text-text-muted mb-1">

                    {item.category} · {item.location} · {item.status}

                  </p>

                  <Link

                    href={`/items/${item.id}`}

                    className="text-h3 hover:text-primary transition-colors"

                  >

                    {item.title}

                  </Link>

                </div>

                <Link

                  href={`/items/${item.id}`}

                  className="shrink-0 text-small text-text-muted hover:text-text-primary transition-colors"

                >

                  Open report â†'

                </Link>

              </div>

              <OwnerClaimsList claims={claimsByItem.get(item.id) ?? []} />

            </FadeUp>

          ))}

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



