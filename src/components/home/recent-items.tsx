import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { categoryLabel, reportDate } from '@/lib/item-display'

export async function RecentItems() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  let message = 'Sign in to see reports from your campus community.'
  let failed = Boolean(authError && user)
  let reports: {
    id: string; title: string; type: string; status: string;
    category: string; location: string; date_lost_found: string;
  }[] = []

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles').select('campus_id').eq('id', user.id).single()

    if (profileError || !profile?.campus_id) {
      failed = true
    } else {
      // Use the same campus boundary as Browse. Never select private verification details.
      const { data, error } = await supabase
        .from('items')
        .select('id, title, type, status, category, location, date_lost_found')
        .eq('campus_id', profile.campus_id)
        .order('created_at', { ascending: false })
        .limit(6)
      failed = Boolean(error)
      reports = data ?? []
      message = 'No reports yet. Report a lost or found item to start your campus activity board.'
    }
  }

  if (failed) message = 'Campus reports are unavailable right now. Please try again shortly.'

  return (
    <section className="section-spacing border-t border-border-default" aria-labelledby="recent-reports-heading">
      <div className="container-tight">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-caption mb-2">Campus activity board</p>
            <h2 id="recent-reports-heading" className="text-h2">Recent reports</h2>
          </div>
          <Link href="/items" className="inline-flex min-h-11 items-center text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary">
            Browse all reports →
          </Link>
        </div>

        {reports.length > 0 && !failed ? (
          <ul className="border-t border-border-default">
            {reports.map((item) => (
              <li key={item.id} className="border-b border-border-default">
                <Link href={`/items/${item.id}`} className="group grid gap-3 py-4 px-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center hover:bg-base-900 transition-colors">
                  <span className="text-xs font-medium text-text-secondary">
                    {item.status === 'RETURNED' ? 'RETURNED' : item.type}
                    {item.status !== 'OPEN' && item.status !== 'RETURNED' && (
                      <span className="block mt-1 text-text-muted">{item.status}</span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium break-words group-hover:underline underline-offset-4">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary break-words">{categoryLabel(item.category)} · {item.location}</p>
                  </div>
                  <div className="text-sm text-text-secondary sm:text-right">
                    <time dateTime={item.date_lost_found}>{reportDate(item.date_lost_found)}</time>
                    <span className="block mt-1 text-text-primary">View report →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border-y border-border-default py-8">
            <p role={failed ? 'status' : undefined} className="text-body">{message}</p>
            <Link
              href={user ? '/items/new' : '/auth/login?redirectedFrom=/'}
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
            >
              {user ? 'Report an item' : 'Sign in to your campus'} →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
