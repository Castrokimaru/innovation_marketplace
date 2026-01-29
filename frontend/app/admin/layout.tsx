import React from "react"
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard | Moringa Innovation Marketplace',
  description: 'Manage projects, users, merchandise, and analytics',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
