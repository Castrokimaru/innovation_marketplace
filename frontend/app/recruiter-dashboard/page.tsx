'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import Link from 'next/link'
import { Search, RefreshCcw, LogOut, ExternalLink, BriefcaseBusiness } from 'lucide-react'

import { fetchApprovedProjects } from '@/lib/api'
import { ProjectCard } from '@/components/project-card'

type ApprovedProject = {
  id: number
  title: string
  description: string
  technologies?: string[] | string
  submitted_name?: string
  team_members?: Array<{ id: number; name: string }>
}

function normalizeTech(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

function LoadingShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="h-8 w-72 rounded bg-muted animate-pulse" />
        <div className="mt-6 h-10 rounded bg-muted animate-pulse" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function RecruiterDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [projects, setProjects] = useState<ApprovedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [tech, setTech] = useState('All')

  const [signingOut, setSigningOut] = useState(false)
 
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'recruiter') {
      router.replace('/')
    }
  }, [session, status, router])

  const loadApprovedProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApprovedProjects()
      setProjects(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session || session.user.role !== 'recruiter') return

    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchApprovedProjects()
        if (!alive) return
        setProjects(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!alive) return
        setError(e?.message ?? 'Failed to load projects')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [session])

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut({ redirect: false })
      router.replace('/')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  const allTechOptions = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => normalizeTech(p.technologies).forEach((t) => set.add(t)))
    return ['All', ...Array.from(set)]
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return projects.filter((p) => {
      const techs = normalizeTech(p.technologies)
      const team = (p.team_members ?? []).map((m) => m.name).join(' ')

      const haystack = [p.title, p.description, techs.join(' '), p.submitted_name, team]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesQuery = !q || haystack.includes(q)
      const matchesTech = tech === 'All' ? true : techs.includes(tech)

      return matchesQuery && matchesTech
    })
  }, [projects, query, tech])

  if (status === 'loading') return <LoadingShell />
  if (!session || session.user.role !== 'recruiter') return null

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
            <p className="text-foreground/70">
              Welcome, <span className="font-medium text-primary">{session.user.username}</span>. Browse approved projects and hire teams.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/projects">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Public Projects
              </Button>
            </Link>

            <Button variant="outline" className="gap-2" onClick={handleSignOut} disabled={signingOut}>
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-foreground/60">Available projects</p>
            <p className="mt-1 text-2xl font-bold">{projects.length}</p>
            <p className="mt-2 text-sm text-foreground/70">Curated approved projects ready for review.</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-foreground/60">Shortlist</p>
            <p className="mt-1 text-2xl font-bold">—</p>
            <p className="mt-2 text-sm text-foreground/70">Next: saved projects shortlist feature.</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-foreground/60">Hire teams</p>
            <p className="mt-1 text-2xl font-bold">Fast</p>
            <p className="mt-2 text-sm text-foreground/70">Contact developers directly from project pages.</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mt-8 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, tech, student/team member…"
                className="pl-9"
              />
            </div>

            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            >
              {allTechOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-foreground/60">
            <span>
              Showing <span className="font-medium">{filtered.length}</span> of{' '}
              <span className="font-medium">{projects.length}</span>
            </span>

            <Button variant="ghost" size="sm" onClick={loadApprovedProjects} className="gap-2" disabled={loading}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mt-6 p-5 border border-destructive/30">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-destructive">Couldn’t load projects</p>
                <p className="text-sm text-foreground/70">{error}</p>
              </div>
              <Button onClick={loadApprovedProjects}>Try again</Button>
            </div>
          </Card>
        )}

        {/* Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Approved Projects</h2>
            <Badge variant="secondary">{loading ? 'Loading…' : 'Ready'}</Badge>
          </div>

          {loading ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="mt-6 p-10 text-center">
              <p className="text-lg font-semibold">No projects found</p>
              <p className="mt-2 text-sm text-foreground/70">Try changing your search or technology filter.</p>
              <Button className="mt-5" onClick={() => { setQuery(''); setTech('All') }}>
                Clear filters
              </Button>
            </Card>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {filtered.map((p) => {
                const techs = normalizeTech(p.technologies)
                const author = p.submitted_name ?? 'Student'

                return (
                  <div key={p.id} className="space-y-3">
                    <ProjectCard
                      id={p.id}
                      title={p.title}
                      description={p.description}
                      technologies={techs}
                      category="Project"
                      author={author}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/projects/${p.id}`}>
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </Link>

                      <Link href={`/hire/${p.id}`}>
                        <Button className="w-full">
                          <BriefcaseBusiness className="mr-2 h-4 w-4" />
                          Hire Team
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
