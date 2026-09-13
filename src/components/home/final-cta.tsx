import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, FileText } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="section-spacing border-t border-border-subtle relative overflow-hidden bg-base-900/20">
      <div className="container-narrow text-center relative z-10">
        <h2 className="text-display-statement text-text-primary mb-6 leading-tight">
          Missing something?
        </h2>
        <p className="text-body-large max-w-sm mx-auto mb-10 leading-relaxed text-text-secondary">
          Report it in seconds. Let your campus community help bring it back.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="h-12 px-8 text-[14px]" asChild>
            <Link href="/items/new">
              <FileText className="mr-2 w-4 h-4" /> Report Lost
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-[14px]" asChild>
            <Link href="/items">
              <Search className="mr-2 w-4 h-4" /> Browse Found
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
