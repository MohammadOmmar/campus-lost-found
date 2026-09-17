'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function ServiceMobileNav({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" />}><Menu /></DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto p-6">
        <DialogTitle>Campus Lost &amp; Found</DialogTitle>
        <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-border-default mt-3">
          {[
            ['/items', 'Browse reports'], ['/#how-it-works', 'How it works'],
            ['/items/new?type=LOST', 'Report lost item'], ['/items/new?type=FOUND', 'Report found item'],
            ...(signedIn ? [['/dashboard', 'Dashboard'], ['/dashboard/items', 'My items'], ['/dashboard/claims', 'My claims'], ['/dashboard/received', 'Received claims']] : [['/auth/login', 'Sign in'], ['/auth/register', 'Create account']]),
          ].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="py-3 text-sm hover:text-text-secondary">{label}</Link>)}
        </nav>
        {signedIn && <Button variant="outline" onClick={async () => { await createClient().auth.signOut(); setOpen(false); router.push('/'); router.refresh() }}>Sign out</Button>}
      </DialogContent>
    </Dialog>
  )
}
