import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, Search } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-primary">
                Moringa Innovation
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/projects" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
                Projects
              </Link>
              <Link href="/talents" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
                Talents
              </Link>
              <Link href="/shop" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
                Shop
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10 bg-muted border-0"
              />
            </div>
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/submit-project">
              <Button className="bg-primary hover:bg-primary/90">Post Project</Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
