import Link from 'next/link'
import { itemCategories } from '@/lib/item-display'
import { Button } from '@/components/ui/button'

export function ServiceGuide() {
  return (
    <>
      <section className="section-spacing border-t border-border-default">
        <div className="container-tight">
          <div className="section-heading"><h2 className="text-h2">Browse by category</h2><p className="text-body">Start with the kind of item you are looking for.</p></div>
          <ul className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-border-default">
            {itemCategories.map((category) => <li key={category.value} className="min-w-0 border-r border-b border-border-default"><Link className="flex h-full items-center justify-between gap-3 p-4 text-sm hover:bg-base-850 transition-colors" href={`/items?category=${category.value}`}><span>{category.label}</span><span aria-hidden="true">↗</span></Link></li>)}
          </ul>
        </div>
      </section>
      <section id="how-it-works" className="section-spacing border-t border-border-default bg-base-900">
        <div className="container-tight">
          <div className="section-heading"><h2 className="text-h2">How it works</h2><p className="text-body">From the first report to a safe return. Keep your report up to date along the way.</p></div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Report', 'Describe the item, where and when it was lost or found. Add a photo if you have one.'],
              ['Discover', 'Browse campus reports and check potential matches for your item.'],
              ['Verify', 'Submit identifying details privately. The finder reviews your claim before approving it.'],
              ['Return', 'After approval, arrange a safe handoff and confirm the return in the report.'],
            ].map(([title, description], index) => <li key={title} className="border-t border-border-strong pt-4"><p className="text-caption text-heritage mb-4">0{index + 1}</p><h3 className="text-h3 mb-2">{title}</h3><p className="text-small">{description}</p></li>)}
          </ol>
        </div>
      </section>
      <section id="privacy" className="section-spacing border-t border-border-default">
        <div className="container-tight">
          <div className="section-heading"><h2 className="text-h2">What you share.<br />What stays private.</h2><p className="text-body">Help others recognise an item without publishing the details needed to verify ownership.</p></div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border-t border-border-strong pt-5"><p className="text-caption mb-3">Public information</p><h3 className="text-h3 mb-3">Visible in campus reports</h3><ul className="divide-y divide-border-subtle text-sm text-text-secondary">{['Item name and category', 'Location and date', 'Description and optional photo'].map(text => <li key={text} className="py-3">{text}</li>)}</ul><p className="text-small mt-4">Keep contact details, ID numbers and sensitive information out of descriptions and photos.</p></div>
            <div className="border-t border-heritage pt-5"><p className="text-caption text-heritage mb-3">Private verification</p><h3 className="text-h3 mb-3">Used to review ownership claims</h3><ul className="divide-y divide-border-subtle text-sm text-text-secondary">{['A unique mark or engraving', 'A serial number or identifying detail', 'Your explanation of ownership'].map(text => <li key={text} className="py-3">{text}</li>)}</ul><p className="text-small mt-4">Use the private verification field for these details. Claim proof is not displayed in the public report.</p></div>
          </div>
        </div>
      </section>
      <section className="border-t border-border-default bg-base-900 py-8">
        <div className="container-tight flex flex-wrap items-center justify-between gap-6"><div><h2 className="text-h2">Missing something?</h2><p className="text-body mt-2">Leave a report so your campus knows what to look for.</p></div><div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/items/new?type=LOST">Report lost item</Link></Button><Button asChild size="lg" variant="outline"><Link href="/items?type=FOUND">Browse found items</Link></Button></div></div>
      </section>
    </>
  )
}
