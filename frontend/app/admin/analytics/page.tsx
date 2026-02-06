'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, Calendar } from 'lucide-react'

import { fetchProjects, type BackendProject } from '@/lib/api/projects'
import { fetchAdminUsers, type AdminUser } from '@/lib/api/admin-users'

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleString(undefined, { month: 'short' })
}

function safeDate(s: string) {
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

type MonthlyPoint = { month: string; projects: number; users: number; revenue: number }
type CategoryPoint = { name: string; value: number; color: string }

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#64748b', '#22c55e', '#a855f7']

export default function Analytics() {
  const { data: session, status } = useSession()
  const token = session?.accessToken

  const [projects, setProjects] = useState<BackendProject[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const [p, u] = await Promise.all([
          fetchProjects(),
          // admin users require JWT; if not logged in as admin, skip gracefully
          token ? fetchAdminUsers(token) : Promise.resolve([] as AdminUser[]),
        ])

        setProjects(p)
        setUsers(u)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'loading') return
    run()
  }, [status, token])

  // --- Derived analytics from YOUR backend data ---
  const monthlyData: MonthlyPoint[] = useMemo(() => {
    // last 8 months buckets based on current date
    const now = new Date()
    const keys: string[] = []
    for (let i = 7; i >= 0; i--) {
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

    // revenue is not in your backend → keep 0 (or mocked)
    return keys.map((k) => ({
      month: monthLabel(k),
      projects: projCounts.get(k) ?? 0,
      users: userCounts.get(k) ?? 0,
      revenue: 0,
    }))
  }, [projects, users])

  const categoryData: CategoryPoint[] = useMemo(() => {
    const counts = new Map<string, number>()

    for (const p of projects) {
      const cats = p.categories?.length ? p.categories : [{ id: -1, name: 'Other' }]
      for (const c of cats) {
        const name = c?.name ?? 'Other'
        counts.set(name, (counts.get(name) ?? 0) + 1)
      }
    }

    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])

    return sorted.map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length],
    }))
  }, [projects])

  // Top performing projects: backend doesn't have views/engagement/rating/reach.
  // We'll rank by team size (as a proxy) and show "team members" instead.
  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => (b.team_members?.length ?? 0) - (a.team_members?.length ?? 0))
      .slice(0, 5)
      .map((p) => ({
        title: p.title,
        team: p.team_members?.length ?? 0,
        status: p.status,
        submitted: p.created_at?.slice(0, 10) ?? '',
      }))
  }, [projects])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="mt-2 text-muted-foreground">Loading…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="mt-2 text-destructive">{error}</p>
        </div>
        <Button variant="outline" onClick={() => location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="mt-2 text-muted-foreground">
            Derived from backend data (projects + users). Revenue/traffic/conversion need backend support.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Last 8 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => alert('Export not implemented yet')}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Growth Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Growth Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
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
            <Line type="monotone" dataKey="users" stroke="var(--secondary)" name="Users" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue and Category Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart (no backend yet -> 0) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue (needs backend)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
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
              <Bar dataKey="revenue" fill="var(--accent)" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Projects by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  borderRadius: '6px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Conversion/Traffic sections: keep but label as mocked */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Conversion Funnel (mock)</h3>
          <p className="text-sm text-muted-foreground">Not available from backend yet.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Traffic Sources (mock)</h3>
          <p className="text-sm text-muted-foreground">Not available from backend yet.</p>
        </Card>
      </div>

      {/* Top Performing Projects (backend-driven proxy) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Projects (by team size)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Project</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Team</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Status</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Created</th>
              </tr>
            </thead>
            <tbody>
              {topProjects.map((p, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                  <td className="px-4 py-3 text-center text-foreground/70">{p.team}</td>
                  <td className="px-4 py-3 text-center text-foreground/70">{p.status}</td>
                  <td className="px-4 py-3 text-center text-foreground/70">{p.submitted}</td>
                </tr>
              ))}
              {topProjects.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-muted-foreground" colSpan={4}>
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
