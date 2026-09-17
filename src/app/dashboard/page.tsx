import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const [reportCountResult, myClaimsResult, receivedClaimsResult, lostResult, foundResult, returnedResult] = await Promise.all([
    supabase.from('items').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('claims').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending'),
    supabase.from('claims').select('*, items!inner(*)', { count: 'exact', head: true }).eq('items.user_id', user.id).eq('claims.status', 'pending'),
    supabase.from('items').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('type', 'LOST'),
    supabase.from('items').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('type', 'FOUND'),
    supabase.from('items').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'RETURNED'),
  ])

  const reportCount = reportCountResult.count ?? 0
  const myClaims = myClaimsResult.count ?? 0
  const receivedClaims = receivedClaimsResult.count ?? 0

  const stats = [
    { label: 'Lost reports', value: lostResult.count ?? 0 },
    { label: 'Found reports', value: foundResult.count ?? 0 },
    { label: 'Pending claims', value: myClaims },
    { label: 'Returned', value: returnedResult.count ?? 0 },
  ]

  const sections = [
    { title: 'My items', description: 'View and manage your reported items', href: '/dashboard/items' },
    { title: 'My claims', description: 'Track claims you have submitted', href: '/dashboard/claims' },
    { title: 'Received claims', description: `${receivedClaims} pending claim${receivedClaims === 1 ? '' : 's'} on your found items`, href: '/dashboard/received' },
    { title: 'Browse reports', description: `${reportCount} reports on your campus`, href: '/items' },
  ]

  return (
    <div className="container-tight page-shell">
      <div className="section-heading">
        <div>
          <p className="text-caption mb-3">Your activity</p>
          <h1 className="text-h1">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}.</h1>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Button asChild><Link href="/items/new?type=LOST">Report lost</Link></Button>
          <Button asChild variant="outline"><Link href="/items/new?type=FOUND">Report found</Link></Button>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 border-y border-border-default divide-y sm:divide-y-0 sm:divide-x divide-border-default mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="py-5 sm:px-5 first:pl-0">
            <dt className="text-sm text-text-secondary">{stat.label}</dt>
            <dd className="text-3xl tabular-nums mt-2">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="dashboard-actions">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 id="dashboard-actions" className="text-h3">Manage your activity</h2>
          <Link href="/items" className="nav-link text-sm">Browse campus reports →</Link>
        </div>
        <ul className="border-t border-border-default">
          {sections.map((section) => (
            <li key={section.href} className="border-b border-border-default">
              <Link href={section.href} className="flex items-center justify-between gap-4 py-5 px-3 hover:bg-base-900 transition-colors">
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-small mt-1">{section.description}</p>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
