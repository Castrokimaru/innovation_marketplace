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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="mt-2 text-muted-foreground">Platform performance and user insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
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
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue</h3>
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

      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {conversionData.map((stage, index) => {
            const percentage = (stage.count / conversionData[0].count) * 100
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{stage.stage}</p>
                  <p className="text-sm text-muted-foreground">{stage.count.toLocaleString()} ({percentage.toFixed(0)}%)</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Traffic Sources & Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{source.source}</p>
                  <p className="text-sm text-muted-foreground">{source.users.toLocaleString()} users ({source.percentage}%)</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Categories</h3>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{category.name}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{category.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Projects */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-foreground/70">Project</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Views</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Engagement</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Rating</th>
                <th className="px-4 py-3 text-center font-medium text-foreground/70">Reach</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'AI Chat Application', views: 2450, engagement: '42%', rating: '4.8', reach: '12.5K' },
                { title: 'Social Network Platform', views: 2100, engagement: '38%', rating: '4.6', reach: '11.2K' },
                { title: 'Mobile Weather App', views: 1890, engagement: '35%', rating: '4.7', reach: '9.8K' },
                { title: 'E-commerce Platform', views: 1456, engagement: '28%', rating: '4.5', reach: '7.6K' },
                { title: 'Task Management System', views: 892, engagement: '22%', rating: '4.3', reach: '5.1K' },
              ].map((project, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{project.title}</td>
                  <td className="px-4 py-3 text-center text-foreground/70">{project.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-foreground/70">{project.engagement}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                      {project.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-foreground/70">{project.reach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
