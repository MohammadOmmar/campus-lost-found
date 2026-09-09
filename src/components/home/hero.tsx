import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search } from 'lucide-react'
import { ProductVisualization } from './product-visualization'

export function Hero() {
  return (
    <section className="section-spacing overflow-hidden">
      <div className="container-tight">
        {/* Headline */}
        <div className="text-center mb-16">
          <h1 className="text-display mb-6">
            Lost something?
            <br />
            Let&apos;s get it back.
          </h1>
          <p className="text-body-large text-muted-foreground max-w-md mx-auto mb-10">
            Report lost and found items, discover potential matches, and securely verify ownership — all within your campus community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/items/new">
                Report an Item <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/items">
                <Search className="mr-2 w-4 h-4" /> Browse Lost & Found
              </Link>
            </Button>
          </div>
        </div>

        {/* Product Visualization */}
        <ProductVisualization />
      </div>
    </section>
  )
}
