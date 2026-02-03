'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="text-2xl font-bold text-primary">🚀 Moringa Innovation</div>
            <p className="text-sm text-muted-foreground mt-1">Showcase Your Ideas, Connect with Talent</p>
          </Link>
        </div>

        {/* Auth Content */}
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Protected by industry-standard security. Your data is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
