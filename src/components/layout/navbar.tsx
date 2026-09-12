'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as typeof user)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/items', label: 'Browse' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
      <motion.nav
        className={`
          mx-auto max-w-5xl rounded-lg border transition-all duration-300
          ${scrolled
            ? 'border-border-default bg-base-950/80 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
          }
        `}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex h-11 items-center justify-between px-5">
          {/* Wordmark */}
          <Link
            href="/"
            className="text-[14px] font-medium tracking-tight text-text-primary hover:text-accent transition-colors duration-200 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
            Campus Lost & Found
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/items/new"
              className="text-[13px] font-medium text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              Report
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="h-8 text-[13px]">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button asChild size="sm" className="h-8 text-[13px]">
                    <Link href="/items/new">Report Item</Link>
                  </Button>
                </div>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="h-8 text-[13px]">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="h-8 text-[13px]">
                    <Link href="/items/new">Report Item</Link>
                  </Button>
                </div>
              </>
            )}
            <MobileNav user={user} />
          </div>
        </div>
      </motion.nav>
    </header>
  )
}
