'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ServiceMobileNav } from './service-mobile-nav'
import { UserMenu } from './user-menu'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{
    id: string
    email?: string
    user_metadata?: { full_name?: string }
  } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-base-950">
      <nav aria-label="Main navigation" className="container-wide flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="text-sm font-semibold tracking-tight py-3">Campus Lost &amp; Found</Link>
        <div className="hidden lg:flex items-center gap-7 text-sm">
          <Link href="/items" aria-current={pathname === '/items' ? 'page' : undefined} className={`nav-link ${pathname === '/items' ? 'nav-link-active' : ''}`}>Browse</Link>
          <Link href="/#how-it-works" className="nav-link">How it works</Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="outline"><Link href="/items/new?type=LOST">Report lost</Link></Button>
            <Button asChild><Link href="/items/new?type=FOUND">Report found</Link></Button>
            <Link href={user ? '/dashboard' : '/auth/login'} className="nav-link px-3">{user ? 'Dashboard' : 'Sign in'}</Link>
          </div>
          {user && <UserMenu user={user} />}
          <ServiceMobileNav signedIn={Boolean(user)} />
        </div>
      </nav>
    </header>
  )
}
