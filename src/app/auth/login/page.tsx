'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="bg-base-850 border border-border-subtle rounded-lg p-8">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">Welcome</p>
            <h1 className="text-h3">Log in</h1>
            <p className="text-body text-text-muted mt-2">Enter your email and password to access your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="text-[13px]">
                <Link href="/auth/forgot-password" className="text-text-muted hover:text-text-primary transition-colors">Forgot your password?</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <Button type="submit" className="w-full h-11" size="lg" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
              <p className="text-[13px] text-text-muted text-center">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-text-primary hover:underline font-medium">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
