import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditItemForm } from '@/components/items/edit-item-form'

interface EditItemPageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, type, title, description, category, location, date_lost_found, status, image_url')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  if (item.user_id !== user.id) {
    redirect('/items')
  }

  if (item.status !== 'OPEN') {
    redirect(`/items/${id}`)
  }

  // Owner-only: private note via the restricted view.
  const { data: detail } = await supabase
    .from('item_private_details')
    .select('private_verification')
    .eq('id', id)
    .maybeSingle()

  const itemWithPrivate = {
    ...item,
    private_verification: detail?.private_verification ?? null,
  }

  return (
    <div className="container-tight py-12">
      <div className="mb-12">
        <h1 className="text-h1 mb-3">Edit Item</h1>
        <p className="text-body text-muted-foreground">
          Update the details of your reported item.
        </p>
      </div>

      <EditItemForm item={itemWithPrivate} />
    </div>
  )
}
