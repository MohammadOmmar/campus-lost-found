import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, FileText } from 'lucide-react'

export function FinalCTA() {
  return (
        <section className="section-spacing border-t border-border/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow-strong pointer-events-none" />
      <div className="container-narrow text-center relative z-10">
        <h2 className="text-display mb-6">Missing something?</h2>
        <p className="text-body-large text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
          Report it in seconds. Browse found items. Let your campus community help bring it back.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="h-12 rounded-full px-7 text-[14px]" asChild>
            <Link href="/items/new">
              <FileText className="mr-2 w-4 h-4" /> Report Lost
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-[14px]" asChild>
            <Link href="/items">
              <Search className="mr-2 w-4 h-4" /> Browse Found
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
