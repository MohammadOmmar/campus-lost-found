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
        className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-base-800 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-6 h-6 rounded-sm bg-base-700 flex items-center justify-center border border-border-subtle">
          <User className="w-3 h-3 text-text-muted" />
        </div>
        <span className="hidden sm:inline max-w-[100px] truncate">{displayName}</span>
        <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-52 bg-base-850 border border-border-default rounded-md py-1.5 z-50"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-3.5 py-2.5 border-b border-border-subtle">
              <p className="text-[13px] font-medium text-text-primary truncate">{displayName}</p>
              <p className="text-[11px] text-text-muted truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-secondary hover:bg-base-700 hover:text-text-primary transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-text-muted" />
                Dashboard
              </Link>
            </div>
            <div className="border-t border-border-subtle pt-1 pb-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] text-text-muted hover:bg-base-700 hover:text-text-primary transition-colors"
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
