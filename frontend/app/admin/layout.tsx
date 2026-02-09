'use client'

import React, { useState } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'

function AdminGate({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (status === 'loading') return
    if (!session) router.replace('/auth/signin')
    else if ((session.user as any)?.role !== 'admin') router.replace('/')
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-foreground/60">Loading admin session…</p>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'admin') return null

  return <>{children}</>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SessionProvider>
      <AdminGate>
        <div className="flex min-h-screen bg-background">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:w-64">
            <AdminSidebar />
          </div>

          {/* Mobile overlay + drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-background shadow-xl">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <span className="text-sm font-semibold">Admin</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <AdminSidebar />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 lg:ml-64">
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <div className="space-y-0.5">
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-foreground/60">
                    Manage projects, users, and analytics.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </header>

            <main className="min-h-[calc(100vh-4rem)]">
              <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AdminGate>
    </SessionProvider>
  )
}
