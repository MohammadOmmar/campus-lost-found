'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'
import { UserMenu } from './user-menu'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{
    id: string
    email?: string
    user_metadata?: { full_name?: string }
  } | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user as typeof user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as typeof user)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/items', label: 'Browse' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/60'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-wide flex h-16 items-center justify-between">
        {/* Left: Wordmark */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground hover:text-muted-foreground transition-colors"
        >
          Campus Lost & Found
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/items/new"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            How It Works
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/items/new">Report an Item</Link>
                </Button>
              </div>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/items/new">Report an Item</Link>
                </Button>
              </div>
            </>
          )}

          {/* Mobile menu */}
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  )
}
