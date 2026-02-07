'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Futuristic tech background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Deep base */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/18 blur-3xl" />
        <div className="pointer-events-none absolute top-24 left-[-120px] h-[420px] w-[420px] rounded-full bg-accent/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-160px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />

        {/* Subtle “scanline” gradient */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)] [background-size:100%_18px]" />

        {/* Tech grid (thin) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:44px_44px]" />

        {/* Diagonal “circuit” lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:repeating-linear-gradient(135deg,transparent_0px,transparent_18px,rgba(255,255,255,0.10)_19px,transparent_20px)]" />

        {/* Center spotlight + vignette to keep it grounded */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)] opacity-60 dark:opacity-70" />

        {/* Fine noise */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22 viewBox=%220 0 140 140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22140%22 height=%22140%22 filter=%22url(%23n)%22 opacity=%220.32%22/></svg>')]" />
      </div>

      {/* Back button */}
      <div className="absolute left-4 top-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="h-9 gap-2 text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-10">
        {/* Brand */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <div className="text-xl font-bold tracking-tight text-primary">
              Moringa Innovation
            </div>
            <p className="text-xs text-foreground/70">
              Showcase your ideas, connect with talent
            </p>
          </Link>
        </div>

        {/* Auth shell (glass + subtle border glow) */}
        <Card className="relative w-full border-border/60 bg-background/65 p-5 shadow-sm backdrop-blur sm:p-6">
          {/* Border glow ring */}
          <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-primary/15" />
          {children}
        </Card>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-foreground/70">
          <ShieldCheck className="h-4 w-4" />
          Protected by industry-standard security. Your data is encrypted and secure.
        </div>
      </div>
    </div>
  )
}
