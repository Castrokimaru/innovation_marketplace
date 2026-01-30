'use client'

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
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { useSession } from "next-auth/react"


const dashboardStats = [
  {
    label: 'Total Projects',
    value: '248',
    change: '+12%',
    trend: 'up',
    icon: Package,
  },
  {
    label: 'Total Users',
    value: '1,524',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Merchandise Sales',
    value: '$12,450',
    change: '+23.1%',
    trend: 'up',
    icon: ShoppingBag,
  },
  {
    label: 'Active Now',
    value: '89',
    change: '-4.3%',
    trend: 'down',
    icon: TrendingUp,
  },
]

const chartData = [
  { month: 'Jan', projects: 24, users: 124, sales: 2400 },
  { month: 'Feb', projects: 34, users: 145, sales: 2210 },
  { month: 'Mar', projects: 28, users: 156, sales: 2290 },
  { month: 'Apr', projects: 45, users: 189, sales: 2000 },
  { month: 'May', projects: 52, users: 215, sales: 2181 },
  { month: 'Jun', projects: 48, users: 198, sales: 2500 },
]

const recentProjects = [
  {
    id: 1,
    title: 'AI Chat Application',
    author: 'Sarah Johnson',
    status: 'approved',
    date: '2025-01-28',
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    author: 'Mike Chen',
    status: 'pending',
    date: '2025-01-27',
  },
  {
    id: 3,
    title: 'Mobile Weather App',
    author: 'Alex Kipchoge',
    status: 'approved',
    date: '2025-01-26',
  },
  {
    id: 4,
    title: 'Task Management System',
    author: 'Emma Williams',
    status: 'rejected',
    date: '2025-01-25',
  },
  {
    id: 5,
    title: 'Fitness Tracker App',
    author: 'David Okonkwo',
    status: 'pending',
    date: '2025-01-24',
  },
]

const getStatusColor = (status: string) => {
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

export default function AdminDashboard() {
    const { data: session, status }:any = useSession()

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      {status === "authenticated" && (<p>Signed in as {session?.user.email}</p>)}
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
                  <p className={cn('mt-2 text-sm font-medium', trendColor)}>
                    <TrendIcon className="inline mr-1 h-4 w-4" />
                    {stat.change}
                  </p>
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
        {/* Line Chart */}
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
        </Card>

        {/* Bar Chart */}
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
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
          <Button variant="outline" size="sm">
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
                    <span className={cn('inline-block px-3 py-1 rounded-full text-xs font-medium', getStatusColor(project.status))}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{project.date}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
