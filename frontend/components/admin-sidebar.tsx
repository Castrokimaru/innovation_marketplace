'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Projects', icon: Package, href: '/admin/projects' },
  { label: 'Users & Talents', icon: Users, href: '/admin/users' },
  { label: 'Merchandise', icon: ShoppingBag, href: '/admin/merchandise' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
]

type SessionUser = {
  username?: string
  email?: string
  role?: string
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const user = (session?.user ?? {}) as SessionUser
  const initials = (user.username?.[0] ?? user.email?.[0] ?? 'A').toUpperCase()

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-background lg:w-64">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="font-bold text-lg text-primary">
          Admin Panel
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon

          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:bg-muted hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / profile */}
      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {status === 'authenticated' ? user.username ?? 'Admin' : 'Admin'}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {status === 'authenticated' ? user.email ?? '' : 'Not signed in'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 bg-transparent"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
