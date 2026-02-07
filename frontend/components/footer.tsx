'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function Footer() {
  const { data: session } = useSession()
  const router = useRouter()

  const requireAuth = (href: string) => (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault()
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(href)}`)
    }
  }

  return (
    <footer className="relative border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary font-display">
              Moringa Innovation
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Turning student ideas into market realities through innovation and entrepreneurship.
            </p>
            <p className="text-xs text-foreground/50">
              Built by students. Trusted by innovators.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-foreground/60 hover:text-foreground transition"
                >
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link
                  href={session ? '/talents' : '/auth/signin'}
                  onClick={requireAuth('/talents')}
                  className="text-foreground/60 hover:text-foreground transition"
                >
                  Find Talents
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-foreground/60 hover:text-foreground transition"
                >
                  Shop Merch
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-4 py-6 text-xs text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Moringa Innovation Marketplace</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
