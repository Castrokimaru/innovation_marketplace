'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    // SessionProvider must live in a client component so client hooks like `useSession` work
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
