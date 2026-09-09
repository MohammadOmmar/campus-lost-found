import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import { ItemCard } from '@/components/items/item-card'
import { FadeUp } from '@/lib/motion'

interface ItemListItem {
  id: string
  type: 'LOST' | 'FOUND'
  title: string
  category: string
  location: string
  date_lost_found: string
  image_url: string | null
  status: string
}

export default async function MyItemsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: items, error } = await supabase
    .from('items')
    .select('id,type,title,category,location,date_lost_found,image_url,status,private_verification')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="container-tight py-14">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <h2 className="text-h3 mb-2">Could not load your items</h2>
          <p className="text-body text-muted-foreground">
            We encountered an error. Please try again in a moment.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-small font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const ownedItems: ItemListItem[] = (items ?? []).map((item) => ({
    id: item.id,
    type: item.type as 'LOST' | 'FOUND',
    title: item.title,
    category: item.category,
    location: item.location,
    date_lost_found: item.date_lost_found,
    image_url: item.image_url,
    status: item.status,
  }))

  return (
    <div className="container-tight py-14">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-area-regular">Back to dashboard</span>
      </Link>

      <FadeUp>
        <div className="mb-12 flex flex-col gap-3">
          <h1 className="text-h1">My items</h1>
          <p className="text-body-large text-muted-foreground measure-default">
            The lost and found reports you have submitted.
          </p>
        </div>
      </FadeUp>

      {ownedItems.length === 0 ? (
        <EmptyItemsState />
      ) : (
        <ItemList items={ownedItems} />
      )}
    </div>
  )
}

function EmptyItemsState() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-10 text-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-h3 mb-2">You haven&apos;t reported anything yet</h2>
      <p className="text-body text-muted-foreground measure-default mb-6">
        Start by reporting a lost or found item — it takes less than a minute.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/items/new?type=LOST"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-small font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Report a lost item
        </Link>
        <Link
          href="/items/new?type=FOUND"
          className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 text-small font-medium transition-colors hover:bg-secondary"
        >
          Report a found item
        </Link>
      </div>
    </div>
  )
}

function ItemList({ items }: { items: ItemListItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}


