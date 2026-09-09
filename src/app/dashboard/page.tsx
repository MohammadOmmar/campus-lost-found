import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, FileText, Inbox } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: activeItems } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['OPEN', 'CLAIMED'])

  const { count: myClaims } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending')

  const { count: receivedClaims } = await supabase
    .from('claims')
    .select('*, items!inner(*)', { count: 'exact', head: true })
    .eq('items.user_id', user.id)
    .eq('claims.status', 'pending')

  return (
    <div className="container-tight py-12">
      <div className="mb-12">
        <h1 className="text-h1">Dashboard</h1>
        <p className="text-body text-muted-foreground mt-3">Welcome back, {profile?.full_name || 'User'}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">Active Items</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-display text-2xl font-semibold">{activeItems || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">My Claims</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-display text-2xl font-semibold">{myClaims || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">Received Claims</CardTitle>
            <Inbox className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-display text-2xl font-semibold">{receivedClaims || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <Button asChild size="xl" className="h-auto py-5">
          <Link href="/items/new">Report an Item</Link>
        </Button>
        <Button asChild size="xl" variant="outline" className="h-auto py-5">
          <Link href="/items">Browse Items</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>My Items</CardTitle>
            <CardDescription>View and manage your reported items</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/items">View All</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Claims</CardTitle>
            <CardDescription>Track claims you&apos;ve submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/claims">View All</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Received Claims</CardTitle>
            <CardDescription>Review claims on your found items</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/received">View All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
