'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
//functiom to handle authenticated clicks
export function Footer() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleAuthenticatedClick = (href: string) => (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault()
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(href)}`)
    }
  }
  return (
    <footer className="bg-muted/50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-primary">Moringa Innovation</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Turning student ideas into market realities through innovation and entrepreneurship.
            </p>
            <p className="text-xs text-foreground/50">
              Built by students. Trusted by innovators.
            </p>

          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                 <Link href={session ? "/projects" : "#"} onClick={handleAuthenticatedClick("/projects")} className="text-foreground/60 hover:text-foreground transition">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href={session ? "/talents" : "#"} onClick={handleAuthenticatedClick("/talents")} className="text-foreground/60 hover:text-foreground transition">
                  Find Talents
                </Link>
                
              </li>
              <li>
                 <Link href={session ? "/shop" : "#"} onClick={handleAuthenticatedClick("/shop")} className="text-foreground/60 hover:text-foreground transition">

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

       <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/50">
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
