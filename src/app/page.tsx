import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { UserScenarios } from '@/components/home/user-scenarios'
import { RecentItems } from '@/components/home/recent-items'
import { PrivacyVerification } from '@/components/home/privacy-verification'
import { FinalCTA } from '@/components/home/final-cta'

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <div className="section-surface-deep">
        <HowItWorks />
      </div>
      <div className="section-surface-raised">
        <UserScenarios />
      </div>
      <div className="section-surface-deep">
        <RecentItems />
      </div>
      <PrivacyVerification />
      <FinalCTA />
    </div>
  )
}
