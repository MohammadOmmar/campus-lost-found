import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ItemForm } from '@/components/items/item-form'

export default async function NewItemPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectedFrom=/items/new')

  return (
    <div className="container-tight pt-24 pb-12">
      <div className="mb-10">
        <h1 className="text-h1 mb-3">Report an Item</h1>
        <p className="text-body text-muted-foreground">Provide details about the lost or found item to help reunite it with its owner.</p>
      </div>
      <ItemForm />
    </div>
  )
}
