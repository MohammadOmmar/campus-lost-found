import { Suspense } from 'react'
import { ServiceHero } from '@/components/home/service-hero'
import { ServiceGuide } from '@/components/home/service-guide'
import { RecentItems } from '@/components/home/recent-items'

export default function Home() {
  return (
    <>
      <ServiceHero />
      <Suspense fallback={<div className="container-tight py-8" role="status">Loading campus reports...</div>}>
        <RecentItems />
      </Suspense>
      <ServiceGuide />
    </>
  )
}
