'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {   Search,   Filter,   Eye,   Edit,   Trash2,   CheckCircle,   Clock,   XCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

import {
  fetchProjects,
  approveProject,
  rejectProject,
  type ProjectRow,
} from '@/lib/api/admin-projects'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

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

export default function ProjectsManagement() {
      const { data: session, status }:any = useSession()

  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const rows = await fetchProjects()
      setProjects(rows)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })
}, [projects, searchTerm, filterStatus])

  // Needs NextAuth session to include the JWT used by Flask
  const token = (session as any)?.accessToken as string | undefined
  const isAdmin = (session as any)?.user?.role === 'admin'

  async function onApprove(id: number) {
    if (!token) return setError('Missing token (not authenticated)')
    try {
      // optimistic update
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p)))
      await approveProject(id, token)
    } catch (e: any) {
      setError(e?.message ?? 'Approve failed')
      await load() // revert by reloading
    }
  }

  async function onReject(id: number) {
    if (!token) return setError('Missing token (not authenticated)')
    try {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p)))
      await rejectProject(id, token)
    } catch (e: any) {
      setError(e?.message ?? 'Reject failed')
      await load()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
        <p className="mt-2 text-muted-foreground">Approve, review, or manage student projects</p>
            {/* {status === "authenticated" && (<p>Signed in as {session?.user.email}</p>)} */}

      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              All
            </Button>
            {['Approved', 'Pending', 'Rejected'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status.toLowerCase() ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status.toLowerCase())}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Project</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Author</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Views</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Likes</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Submitted</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{project.title}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{project.author}</td>
                  <td className="px-6 py-4 text-foreground/70">{project.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(project.status))}>
                        {project.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-foreground/70">{project.views}</td>
                  <td className="px-6 py-4 text-center text-foreground/70">{project.likes}</td>
                  <td className="px-6 py-4 text-foreground/70">{project.submitted}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
