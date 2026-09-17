import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ServiceFilters as ItemFilters } from '@/components/items/service-filters'
import { RecordCard as ItemCard } from '@/components/items/record-card'
import { Pagination } from '@/components/items/pagination'

interface ItemsPageProps {
  searchParams: Promise<{ q?: string; type?: string; category?: string; status?: string; page?: string; location?: string; date?: string; sort?: string }>
}

const PAGE_SIZE = 12

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('campus_id').eq('id', user.id).single() : { data: null }
  const page = Math.max(1, Number.parseInt(params.page || '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase.from('items').select('id, user_id, campus_id, title, description, category, type, status, location, date_lost_found, image_url, created_at', { count: 'exact' }).eq('campus_id', profile?.campus_id || '').order(params.sort === 'updated' ? 'updated_at' : 'created_at', { ascending: params.sort === 'oldest' }).range(offset, offset + PAGE_SIZE - 1)

  if (params.q) query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%,location.ilike.%${params.q}%`)
  if (params.type) query = query.eq('type', params.type)
  if (params.category) query = query.eq('category', params.category)
  if (params.status) query = query.eq('status', params.status)

  if (params.location) query = query.ilike('location', `%${params.location}%`)
  if (params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)) query = query.gte('date_lost_found', params.date)

  const { data: items, count, error } = await query
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="container-wide page-shell">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-h1 mb-2">Browse lost &amp; found</h1>
          <p className="text-body text-text-muted">Search for lost and found items on campus</p>
        </div>
        <Button asChild size="lg" className="h-10 px-5">
          <Link href="/items/new"><Plus className="mr-2 w-4 h-4" /> Report Item</Link>
        </Button>
      </div>

      <div className="mb-8"><ItemFilters /></div>

      <p role="status" className="text-sm text-text-secondary mb-4">{error ? 'Reports unavailable. Please try again.' : `${count ?? 0} ${(count ?? 0) === 1 ? 'report' : 'reports'} found`}</p>
      {items && items.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (<ItemCard key={item.id} item={item} index={index} />))}
          </div>
          {totalPages > 1 && (<div className="mt-12"><Pagination currentPage={page} totalPages={totalPages} /></div>)}
        </>
      ) : (
        <div className="border-y border-border-default py-10">
          <h2 className="text-h3 mb-2">{error ? 'Unable to load reports' : 'No matches found'}</h2>
          <p className="text-body mb-6 measure-default">{error ? 'Your reports could not be loaded. Try again shortly.' : 'Try a different item name, description or campus location, or clear your filters.'}</p>
          <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/items">Clear filters</Link></Button><Button asChild variant="outline"><Link href="/items/new">Report an item</Link></Button></div>
        </div>
      )}
    </div>
  )
}
