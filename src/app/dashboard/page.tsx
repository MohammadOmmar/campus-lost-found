import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, FileText, Inbox } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { count: activeItems } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['OPEN', 'CLAIMED'])
  const { count: myClaims } = await supabase.from('claims').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending')
  const { count: receivedClaims } = await supabase.from('claims').select('*, items!inner(*)', { count: 'exact', head: true }).eq('items.user_id', user.id).eq('claims.status', 'pending')

  const stats = [
    { label: 'Active Items', value: activeItems || 0, icon: Package },
    { label: 'My Claims', value: myClaims || 0, icon: FileText },
    { label: 'Received Claims', value: receivedClaims || 0, icon: Inbox },
  ]

  const sections = [
    { title: 'My Items', description: 'View and manage your reported items', href: '/dashboard/items' },
    { title: 'My Claims', description: "Track claims you've submitted", href: '/dashboard/claims' },
    { title: 'Received Claims', description: 'Review claims on your found items', href: '/dashboard/received' },
  ]

  return (
    <div className="container-tight pt-24 pb-12">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">Dashboard</p>
        <h1 className="text-h1">Welcome back</h1>
        <p className="text-body text-text-muted mt-2">{profile?.full_name || 'User'}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-base-850 border border-border-subtle rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-text-muted">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-text-muted/60" />
            </div>
            <div className="text-2xl font-semibold text-text-primary">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        <Button asChild size="xl" className="h-auto py-4">
          <Link href="/items/new">Report an Item</Link>
        </Button>
        <Button asChild size="xl" variant="outline" className="h-auto py-4">
          <Link href="/items">Browse Items</Link>
        </Button>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-text-muted mb-4">Quick Access</p>
        <div className="grid md:grid-cols-3 gap-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group bg-base-850 border border-border-subtle rounded-lg p-5 transition-all duration-200 hover:border-border-default hover:-translate-y-0.5"
            >
              <h3 className="text-[14px] font-medium text-text-primary mb-1 group-hover:text-accent transition-colors">{section.title}</h3>
              <p className="text-[12px] text-text-muted">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
