import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ArrowRight, Search } from 'lucide-react'

import { ProductVisualization } from './product-visualization'



export function Hero() {

  return (

    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">

      {/* Background treatment */}

      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="absolute inset-0 bg-grid-fine opacity-[0.03] pointer-events-none" />



      <div className="container-tight relative z-10">

        {/* Headline */}

        <div className="text-center mb-14">

          <h1 className="text-display mb-6 tracking-tight">

            Lost something?

            <br />

            Let&apos;s get it back.

          </h1>

          <p className="text-body-large text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">

            Report lost and found items, discover potential matches, and securely verify ownership — all within your campus community.

          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Button size="lg" className="h-12 rounded-full px-7 text-[14px]" asChild>

              <Link href="/items/new">

                Report an Item <ArrowRight className="ml-2 w-4 h-4" />

              </Link>

            </Button>

            <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-[14px]" asChild>

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

