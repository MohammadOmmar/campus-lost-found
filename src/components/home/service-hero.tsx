import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ServiceHero() {
  return (
    <section className="border-b border-border-default">
      <div className="container-tight grid gap-8 py-12 md:grid-cols-[1.5fr_1fr] md:gap-16 md:py-16">
        <div>
          <p className="text-caption mb-5">Campus community service</p>
          <h1 className="text-display">Lost something?<br /><span className="text-text-secondary">Found something?</span></h1>
          <p className="text-body-large mt-5 max-w-lg">A central place for students and staff to report, discover, verify and return belongings found across campus.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/items/new?type=LOST">Report lost item</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/items/new?type=FOUND">Report found item</Link></Button>
          </div>
        </div>
        <aside className="border-t border-border-default pt-6 md:border-t-0 md:border-l md:pl-8 md:self-end">
          <p className="text-caption mb-3">Start your search</p>
          <h2 className="text-h3 mb-3">Someone may have already reported it.</h2>
          <p className="text-body mb-4">Check the item, location and date. If you recognise a found item, submit a private ownership claim for the finder to review.</p>
          <Link href="/items?type=FOUND" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Browse found items →</Link>
        </aside>
      </div>
    </section>
  )
}
