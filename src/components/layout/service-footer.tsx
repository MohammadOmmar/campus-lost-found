import Link from 'next/link'

export function ServiceFooter() {
  return (
    <footer className="border-t border-border-default mt-auto">
      <div className="container-wide py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div><p className="font-semibold text-sm">Campus Lost &amp; Found</p><p className="text-small mt-2 max-w-sm">Helping campus communities reconnect people with their belongings.</p></div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {[['/items', 'Browse'], ['/items/new?type=LOST', 'Report lost'], ['/items/new?type=FOUND', 'Report found'], ['/dashboard', 'Dashboard'], ['/#privacy', 'Privacy guidance']].map(([href, label]) => <Link key={href} href={href} className="nav-link">{label}</Link>)}
          </nav>
        </div>
        <p className="border-t border-border-subtle mt-6 pt-5 text-xs text-text-muted">© {new Date().getFullYear()} Campus Lost &amp; Found</p>
      </div>
    </footer>
  )
}
