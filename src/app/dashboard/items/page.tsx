import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default async function MyItemsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">My Items</h1>
      <p className="text-muted-foreground mb-8">Items you have reported</p>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Your reported items will appear here. Feature coming in Phase 2.</p>
        </CardContent>
      </Card>
    </div>
  )
}
