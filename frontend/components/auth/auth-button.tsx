'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function AuthButton() {
  const { status } = useSession()
  const [signingOut, setSigningOut] = useState(false)

  if (status === 'loading') {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (status !== 'authenticated') {
    return (
      <Button asChild variant="outline" className="gap-2">
        <Link href="/auth/signin">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={signingOut}
      onClick={async () => {
        try {
          setSigningOut(true)
          await signOut({ redirect: true, callbackUrl: '/' })
        } finally {
          setSigningOut(false)
        }
      }}
    >
      <LogOut className="h-4 w-4" />
      {signingOut ? 'Signing out…' : 'Sign Out'}
    </Button>
  )
}
