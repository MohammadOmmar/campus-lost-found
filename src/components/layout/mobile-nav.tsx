'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'

interface MobileNavProps {
  user: {
    id: string
    email?: string
    user_metadata?: { full_name?: string }
  } | null
}

const easeOut = [0.4, 0, 0.2, 1] as const

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/items', label: 'Browse' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 -mr-2 text-foreground hover:text-muted-foreground transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-[72px] z-50 bg-background md:hidden overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <div className="container-wide py-6 pb-10">
              <nav className="flex flex-col gap-1 mb-8" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: easeOut }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3 px-4 rounded-xl text-[15px] transition-colors ${
                        pathname === link.href
                          ? 'bg-secondary text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: easeOut }}
                >
                  <Link
                    href="/items/new"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 rounded-xl text-[15px] text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                </motion.div>
              </nav>

              <motion.div
                className="border-t border-border/40 pt-6 flex flex-col gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease: easeOut }}
              >
                {user ? (
                  <>
                    <Button asChild variant="outline" className="w-full h-11" size="lg">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="mr-2 w-4 h-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button asChild className="w-full h-11" size="lg">
                      <Link href="/items/new" onClick={() => setIsOpen(false)}>
                        Report an Item
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-11 text-muted-foreground"
                      size="lg"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full h-11" size="lg">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full h-11" size="lg">
                      <Link href="/items/new" onClick={() => setIsOpen(false)}>
                        Report an Item
                      </Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
