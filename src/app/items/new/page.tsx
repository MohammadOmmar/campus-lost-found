import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ItemForm } from '@/components/items/item-form'

export default async function NewItemPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  const initialType = type === 'FOUND' ? 'FOUND' : 'LOST'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectedFrom=/items/new')

  return (
    <div className="container-narrow page-shell">
      <div className="mb-10">
        <h1 className="text-h1 mb-3">Report a {initialType === 'FOUND' ? 'found' : 'lost'} item</h1>
        <p className="text-body text-text-muted">Provide details about the lost or found item to help reunite it with its owner.</p>
      </div>
      <ItemForm initialType={initialType} />
    </div>
  )
}
