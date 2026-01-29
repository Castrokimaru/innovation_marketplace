'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Moringa Innovation</h3>
            <p className="text-sm text-foreground/60">
              Turning student ideas into market realities through innovation and entrepreneurship.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-foreground/60 hover:text-foreground transition">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href="/talents" className="text-foreground/60 hover:text-foreground transition">
                  Find Talents
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-foreground/60 hover:text-foreground transition">
                  Shop Merch
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Company</h4>
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

          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
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

        <Separator className="my-8" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
          <p>&copy; 2024 Moringa School Innovation Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition">
              Twitter
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              LinkedIn
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
