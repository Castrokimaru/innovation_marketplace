'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { Users, Package, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

type BackendProject = {
  id: number
  title: string
  submitted_name: string
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  team_members?: Array<any>
  categories?: Array<{ id: number; name: string }>
}

type AdminUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  created_at: string
}

type ChartPoint = { month: string; projects: number; users: number; sales: number }

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:5555'

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function safeDate(s: string) {
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString(undefined, { month: 'short' })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-700 dark:text-green-400'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    case 'rejected':
      return 'bg-red-500/10 text-red-700 dark:text-red-400'
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }
}

async function fetchProjects(): Promise<BackendProject[]> {
  const res = await fetch(`${BASE}/projects`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`)
  return res.json()
}

async function fetchAdminUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${BASE}/admin/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`Failed to fetch admin users (${res.status}). ${msg}`)
  }

  return res.json()
}

type StatCard = {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  icon: any
  note?: string
}

function LoadingCards() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-8 w-16 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-4 w-full rounded bg-muted animate-pulse" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-5 w-44 rounded bg-muted animate-pulse" />
            <div className="mt-4 h-[300px] rounded bg-muted animate-pulse" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="h-5 w-44 rounded bg-muted animate-pulse" />
        <div className="mt-4 h-40 rounded bg-muted animate-pulse" />
      </Card>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const token: string | undefined = (session as any)?.accessToken

  const [projects, setProjects] = useState<BackendProject[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usersError, setUsersError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        setUsersError(null)

        const p = await fetchProjects()
        setProjects(Array.isArray(p) ? p : [])

        if (token) {
          try {
            const u = await fetchAdminUsers(token)
            setUsers(Array.isArray(u) ? u : [])
          } catch (e: any) {
            setUsers([])
            setUsersError(e?.message ?? 'Could not load admin users')
          }
        } else {
          setUsers([])
          setUsersError('Sign in as admin to load users stats.')
        }
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'loading') return
    run()
  }, [status, token])

  const totalProjects = projects.length
  const totalUsers = users.length

  const approvedCount = useMemo(() => projects.filter((p) => p.status === 'approved').length, [projects])
  const pendingCount = useMemo(() => projects.filter((p) => p.status === 'pending').length, [projects])

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const da = safeDate(a.created_at)?.getTime() ?? 0
        const db = safeDate(b.created_at)?.getTime() ?? 0
        return db - da
      })
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        author: p.submitted_name || '—',
        status: p.status,
        date: (p.created_at ?? '').slice(0, 10) || '—',
      }))
  }, [projects])

  const chartData: ChartPoint[] = useMemo(() => {
    const now = new Date()
    const keys: string[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      keys.push(monthKey(d))
    }

    const projCounts = new Map<string, number>()
    const userCounts = new Map<string, number>()

    for (const p of projects) {
      const d = safeDate(p.created_at)
      if (!d) continue
      const k = monthKey(d)
      projCounts.set(k, (projCounts.get(k) ?? 0) + 1)
    }

    for (const u of users) {
      const d = safeDate(u.created_at)
      if (!d) continue
      const k = monthKey(d)
      userCounts.set(k, (userCounts.get(k) ?? 0) + 1)
    }

    return keys.map((k) => ({
      month: monthLabel(k),
      projects: projCounts.get(k) ?? 0,
      users: userCounts.get(k) ?? 0,
      sales: 0,
    }))
  }, [projects, users])

  const dashboardStats: StatCard[] = useMemo(() => {
    return [
      {
        label: 'Total Projects',
        value: String(totalProjects),
        icon: Package,
        note: `${approvedCount} approved • ${pendingCount} pending`,
      },
      {
        label: 'Total Users',
        value: token ? String(totalUsers) : '—',
        icon: Users,
        note: token ? (usersError ? 'Users endpoint failed' : 'Loaded from /admin/users') : 'Sign in as admin',
      },
      {
        label: 'Merchandise Sales',
        value: '—',
        icon: ShoppingBag,
        note: 'No sales totals endpoint yet',
      },
      {
        label: 'Active Now',
        value: '—',
        icon: TrendingUp,
        note: 'Requires analytics endpoint',
      },
    ]
  }, [totalProjects, approvedCount, pendingCount, totalUsers, token, usersError])

  if (loading || status === 'loading') return <LoadingCards />

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={() => location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownLeft
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600'

          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>

                  {stat.change && stat.trend && (
                    <p className={cn('mt-2 text-sm font-medium', trendColor)}>
                      <TrendIcon className="inline mr-1 h-4 w-4" />
                      {stat.change}
                    </p>
                  )}

                  {stat.note && <p className="mt-2 text-xs text-muted-foreground">{stat.note}</p>}
                </div>

                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Growth Metrics</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="projects" stroke="var(--primary)" name="Projects" />
              <Line type="monotone" dataKey="users" stroke="var(--accent)" name="Users" />
            </LineChart>
          </ResponsiveContainer>

          {usersError && <p className="mt-3 text-xs text-muted-foreground">Users data: {usersError}</p>}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales Performance</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="var(--secondary)" name="Sales" />
            </BarChart>
          </ResponsiveContainer>

          <p className="mt-3 text-xs text-muted-foreground">
            Sales is 0 because your backend doesn’t expose revenue totals yet.
          </p>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/admin/projects')}>
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Title</th>
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Author</th>
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Status</th>
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Date</th>
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Action</th>
              </tr>
            </thead>

            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground">{project.title}</td>
                  <td className="px-4 py-3 text-foreground/70">{project.author}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn('inline-block px-3 py-1 rounded-full text-xs font-medium', getStatusColor(project.status))}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{project.date}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => (window.location.href = `/admin/projects`)}>
                      Review
                    </Button>
                  </td>
                </tr>
              ))}

              {recentProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
