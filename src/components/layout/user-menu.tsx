'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'

interface UserMenuProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/40 rounded-2xl shadow-lg py-2 z-50"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-4 py-3 border-b border-border/40">
              <p className="text-small font-medium text-foreground truncate">{displayName}</p>
              <p className="text-caption text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-small text-foreground hover:bg-secondary/60 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                Dashboard
              </Link>
            </div>
            <div className="border-t border-border/40 pt-1 pb-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-small text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
