'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {   Search,   Mail,   Trash2, Shield,   UserCheck,   UserX } from 'lucide-react'

import { fetchAdminUsers, type AdminUser } from '@/lib/api/admin-users'

type UserRow =   {
    id: number
  name: string
  email: string
  type: 'Student' | 'Recruiter' | 'Admin' | 'Other'
  status: 'active' | 'inactive' | string
  projects: number // backend doesn't provide this yet, so show 0
  joined: string
}

const getStatusBadge = (status: string) => {
  return status === 'active'
    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
    : 'bg-red-500/10 text-red-700 dark:text-red-400'
}

const getTypeBadge = (type: string) => {
  return type === 'Student'
    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    : type === 'Recruiter'
      ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
: type === 'Admin'
        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
}

function mapUser(u: AdminUser): UserRow {
  const fullName = `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email

  // Normalize role -> UI "type"
  const role = (u.role ?? '').toLowerCase()
  const type: UserRow['type'] =
    role === 'student' ? 'Student' :
    role === 'recruiter' ? 'Recruiter' :
    role === 'admin' ? 'Admin' :
    'Other'

  const joined = (u.created_at ?? '').slice(0, 10)

  return {
    id: u.id,
    name: fullName,
    email: u.email,
    type,
    status: u.status ?? 'active',
    projects: 0, // not provided by /admin/users currently
    joined,
  }
}

export default function UsersManagement() {
const { data: session, status } = useSession()

  const [rows, setRows] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'Student' | 'Recruiter' | 'Admin'>('all')

  const token = session?.accessToken

  async function load() {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const users = await fetchAdminUsers(token)
      setRows(users.map(mapUser))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!token) {
      setLoading(false)
      setError('Not authenticated (missing access token). Please sign in again.')
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token])

  const filteredUsers = useMemo(() => {
    return rows.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === 'all' || u.type === filterType
    return matchesSearch && matchesFilter
  })
}, [rows, searchTerm, filterType])

  const totalUsers = rows.length
  const activeUsers = rows.filter((u) => u.status === 'active').length
  const studentsCount = rows.filter((u) => u.type === 'Student').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users & Talents</h1>
        <p className="mt-2 text-muted-foreground">Manage student profiles and recruiter accounts</p>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All Users
            </Button>
            <Button 
              variant={filterType === 'Student' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('Student')}
            >
              Students
            </Button>
            <Button 
              variant={filterType === 'Recruiter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('Recruiter')}
            >
              Recruiters
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Projects</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Joined</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{user.name}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', getTypeBadge(user.type))}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusBadge(user.status))}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-foreground">{user.projects}</td>
                  <td className="px-6 py-4 text-foreground/70">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" title="View Profile">
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{users.length}</p>
          <p className="mt-2 text-xs text-muted-foreground">{filteredUsers.length} shown</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {users.filter((u) => u.status === 'active').length}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Currently online or active</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Students</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {users.filter((u) => u.type === 'Student').length}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Showcasing projects</p>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
