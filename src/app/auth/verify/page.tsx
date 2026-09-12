import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md text-center" size="lg">
        <CardHeader>
          <div className="mx-auto w-14 h-14 rounded-lg bg-base-700 flex items-center justify-center mb-6">
            <Mail className="w-6 h-6 text-text-primary" />
          </div>
          <CardTitle className="text-h3">Check your email</CardTitle>
          <CardDescription className="text-body">
            We&apos;ve sent you a confirmation link. Please check your email and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
