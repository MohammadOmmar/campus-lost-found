import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ItemRow } from '@/components/items/item-row'

interface ItemListItem {
  id: string
  type: 'LOST' | 'FOUND'
  title: string
  category: string
  location: string
  date_lost_found: string
  status: string
}

export default async function MyItemsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: items, error } = await supabase
    .from('items')
    .select('id, type, title, category, location, date_lost_found, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const ownedItems: ItemListItem[] = (items ?? []).map((item) => ({
    id: item.id,
    type: item.type as 'LOST' | 'FOUND',
    title: item.title,
    category: item.category,
    location: item.location,
    date_lost_found: item.date_lost_found,
    status: item.status,
  }))

  return (
    <div className="container-tight page-shell">
      <Link href="/dashboard" className="nav-link mb-6 inline-flex items-center gap-2">← Back to dashboard</Link>
      <header className="section-heading mb-10">
        <div><p className="text-caption mb-3">Your reports</p><h1 className="text-h1">My items</h1></div>
      </header>
      {error ? (
        <p role="status" className="text-body py-10">Your items could not be loaded. Please try again shortly.</p>
      ) : ownedItems.length === 0 ? (
        <div className="border-y border-border-default py-8">
          <h2 className="text-h3 mb-2">No reports yet</h2>
          <p className="text-body text-text-muted measure-default mb-6">Reports you submit will appear here.</p>
          <div className="flex flex-wrap gap-3"><Button asChild><Link href="/items/new?type=LOST">Report a lost item</Link></Button><Button asChild variant="outline"><Link href="/items/new?type=FOUND">Report a found item</Link></Button></div>
        </div>
      ) : (
        <ul className="border-t border-border-default">
          {ownedItems.map((item) => <ItemRow key={item.id} item={item} />)}
        </ul>
      )}
    </div>
  )
}

