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
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    label: 'Projects',
    icon: Package,
    href: '/admin/projects',
  },
  {
    label: 'Users & Talents',
    icon: Users,
    href: '/admin/users',
  },
  {
    label: 'Merchandise',
    icon: ShoppingBag,
    href: '/admin/merchandise',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
    const { data: session, status }:any = useSession()

    // console.log(session.user)

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-background">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="font-bold text-lg text-primary">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
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
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="h-8 w-8 rounded-full bg-primary/20" />
          <div className="flex-1 min-w-0">
                        

            <p className="text-sm font-medium text-foreground truncate">
              {status === "authenticated" && (<span>{session?.user.username}</span>)}
            </p>
            <p className="text-xs text-muted-foreground">{status === "authenticated" && (<span>{session?.user.email}</span>)}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent" onClick={()=> signOut({ callbackUrl: '/' })}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
