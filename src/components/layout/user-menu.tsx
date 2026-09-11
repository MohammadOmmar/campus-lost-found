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
    user_metadata?: { full_name?: string }
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
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-3 h-3 text-muted-foreground" />
        </div>
        <span className="hidden sm:inline max-w-[100px] truncate">{displayName}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-52 bg-card border border-border/50 rounded-xl shadow-lg shadow-black/[0.08] py-1.5 z-50"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-3.5 py-2.5 border-b border-border/30">
              <p className="text-[13px] font-medium text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-foreground hover:bg-secondary/50 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
                Dashboard
              </Link>
            </div>
            <div className="border-t border-border/30 pt-1 pb-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
