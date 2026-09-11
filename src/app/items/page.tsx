import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ItemFilters } from '@/components/items/item-filters'
import { ItemCard } from '@/components/items/item-card'
import { Pagination } from '@/components/items/pagination'

interface ItemsPageProps {
  searchParams: Promise<{ q?: string; type?: string; category?: string; status?: string; page?: string }>
}

const PAGE_SIZE = 12

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('campus_id').eq('id', user.id).single() : { data: null }
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase.from('items').select('id, user_id, campus_id, title, description, category, type, status, location, date_lost_found, image_url, created_at', { count: 'exact' }).eq('campus_id', profile?.campus_id || '').order('created_at', { ascending: false }).range(offset, offset + PAGE_SIZE - 1)

  if (params.q) query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%,location.ilike.%${params.q}%`)
  if (params.type) query = query.eq('type', params.type)
  if (params.category) query = query.eq('category', params.category)
  if (params.status) query = query.eq('status', params.status)

  const { data: items, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="container-wide pt-24 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-h1 mb-2">Browse Items</h1>
          <p className="text-body text-muted-foreground">Search for lost and found items on campus</p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-full px-5">
          <Link href="/items/new"><Plus className="mr-2 w-4 h-4" /> Report Item</Link>
        </Button>
      </div>

      <div className="mb-8"><ItemFilters /></div>

      {items && items.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item, index) => (<ItemCard key={item.id} item={item} index={index} />))}
          </div>
          {totalPages > 1 && (<div className="mt-12"><Pagination currentPage={page} totalPages={totalPages} /></div>)}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-body text-muted-foreground mb-4">No items found matching your criteria.</p>
          <Button asChild variant="outline"><Link href="/items/new">Report an Item</Link></Button>
        </div>
      )}
    </div>
  )
}
